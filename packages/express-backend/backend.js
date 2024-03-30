// backend.js
import express from "express";
// import session from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userServices from "./user-services.js";
import User from "./user.js";
import { createRequire } from "module";
import taskServices from "./task-services.js";
import backlogServices from "./backlog-services.js";
import pollServices from "./poll-services.js";
import groupServices from "./group-services.js";
import { ObjectId } from "mongodb";

const require = createRequire(import.meta.url);

const session = require("express-session");

const app = express();
const port = 8000;

app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            // sameSite: 'none',
        },
    })
);

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

// Group endpoints

//Creates a new group
app.post("/group", async (req, res) => {
    if (req.session.username) {
        const user = await userServices.findUserByUsername(
            req.session.username
        );

        if (!user) {
            return res.status(404).send("User not found");
        }
        if (user.group) {
            return res.status(401).send("user already in group");
        }
        let group = req.body;
        let members = Array(1).fill(user);
        group.owner = user;
        group.members = members;
        groupServices.addGroup(group).then((e) => {
            if (e == 500) {
                return res.status(500).send("Unable to create group");
            } else {
                userServices
                    .addToGroup(req.session.username, e._id)
                    .then((error) => {
                        if (error == 500) {
                            return res.status(500).send("Unable to add user");
                        }
                        return res.status(201).send("Created group");
                    });
            }
        });
    } else {
        return res.status(401).send();
    }
});

//add user to group
app.post("/join-group", async (req, res) => {
    try {
        const user = await userServices.findUserByUsername(
            req.session.username
        );

        if (!user) {
            return res.status(404).send("User not found");
        }
        if (user.group) {
            return res.status(401).send("user already in group");
        }

        groupServices.addUserToGroup(req.body.code, user._id).then((e) => {
            if (e == 500 || e == 404 || !e) {
                return res.status(500).send("Unable to add user");
            }

            userServices.addToGroup(user.username, e._id).then((error) => {
                if (error == 500) {
                    return res.status(500).send("Unable to add user");
                } else {
                    return res.status(201).send("added user");
                }
            });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
    }
});

//Users Endpoints

// Login and create new user
app.post("/login", async (req, res) => {
    try {
        userServices.findUserByEmail(req.body.email).then((user) => {
            if (!user) {
                return res.status(404).send("User not found");
            }

            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch) {
                    req.session.username = user.username;
                    // console.log(req.session.username);
                    console.log(user.username);
                    let isInGroup = true;

                    if (user.group == null || user.group == "") {
                        isInGroup = false;
                    }
                    return res.status(200).send({ isInGroup: isInGroup });
                } else {
                    return res.status(401).send("cannot login");
                }
            });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
    }
});

app.get("/isLoggedIn", (req, res) => {
    // console.log('Session in /isLoggedIn:', req.session.username);
    if (req.session.username) {
        return res.status(200).send("Logged in");
    } else {
        return res.status(401).send("Not logged in");
    }
});

// logout of current user session
app.get("/logout", (req, res) => {
    res.clearCookie("connect.sid");
    req.session.destroy();
    return res.status(200).send();
});

// create new user
app.post("/signup", async (req, res) => {
    userServices.addUser(req.body).then((error) => {
        // change error code to reason unable to signup
        if (error == 500) {
            return res.status(500).send("Unable to sign up");
        } else {
            req.session.username = req.body.username;
            return res.status(201).send("Successful signup");
        }
    });
});

// homescreen
app.get("/", (req, res) => {
    return res.status(200).send("logged in");
});

app.put("/users/rassign/:id", (req, res) => {
    const id = req.params.id;
    return userServices.randomUser().then((randuser) => {
        const username = randuser[0].username;
        taskServices
            .findTask(id)
            .then((task) => {
                if (task && task.assignee === "none") {
                    return userServices
                        .addTask(username, task)
                        .then(async (user) => {
                            task.assignee = username;
                            await task.save();
                            res.status(200).json({
                                message: "Task assigned successfully",
                                user,
                                randuser,
                            });
                        });
                } else if (task && task.assignee !== "none") {
                    throw new Error("Task is already assigned");
                } else {
                    throw new Error("Task not found");
                }
            })
            .catch((error) => {
                res.status(404).json({ error: error.message });
            });
    });
});

// give user a task that is already in task list given it has not been assigned already
app.put("/users/:username/assign/:id", (req, res) => {
    const username = req.params.username;
    const id = req.params.id;

    taskServices
        .findTask(id)
        .then(async (task) => {
            if (task && task.assignee === "none") {
                const user = await userServices.addTask(username, task);
                // Update the task's "assigned" field to true
                task.assignee = username;
                await task.save();
                return user;
            } else if (task && task.assignee !== "none") {
                throw new Error("Task is already assigned");
            } else {
                throw new Error("Task not found");
            }
        })
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((error) => {
            res.status(404).json({ error: error.message });
        });
});

//complete a task -> remove it from list
app.put("/task", async (req, res) => {
    const username = req.body.username;
    const taskId = req.body.id;

    try {
        const user = await userServices.findUserByUsername(username);

        // remove task from user's list
        await userServices.removeTask(username, taskId);

        // add task to backlog
        taskServices.findTask(taskId).then((task) => {
            backlogServices.addTask(username, task).then((e) => {
                taskServices.deleteTask(taskId);
            });
        });

        // If both operations are successful, send a success response
        res.status(202).json({ message: "Task completed successfully" });
    } catch (error) {
        // Handle errors appropriately
        res.status(500).json({ error: "Failed to delete task" });
    }
});

// get users, either by url field or just entire user list
app.get("/users", (req, res) => {
    const username = req.query.username;
    const email = req.query.email;
    if (username && email) {
        userServices
            .findUserByUsernameAndEmail(username, email)
            .then((user) => {
                res.status(200).json(user);
            })
            .catch(() => {
                res.status(404).json({ error: "User not found" });
            });
    } else if (username) {
        userServices
            .findUserByUsername(username)
            .then((user) => {
                res.status(200).json(user);
            })
            .catch(() => {
                res.status(404).json({ error: "User not found" });
            });
    } else if (email) {
        userServices
            .findUserByEmail(email)
            .then((user) => {
                res.status(200).json(user);
            })
            .catch(() => {
                res.status(404).json({ error: "User not found" });
            });
    } else {
        userServices
            .getUsers()
            .then((users) => {
                res.status(200).json({ user_list: users });
            })
            .catch((error) => {
                res.status(500).json({ error });
            });
    }
});

// remove a user from the user list
app.delete("/users/:id", async (req, res) => {
    const id = req.params.id;
    await userServices
        .deleteUser(id)
        .then(() => {
            res.json("User deleted successfully");
        })
        .catch(() => {
            res.status(404).json("Server error");
        });
});

// tasks

/* when does response get sent? */
// get tasks field
app.get("/tasks", (req, res) => {
    // console.log('Session in /tasks:', req.session.username);
    if (req.session.username) {
        // console.log(req.session.username);
        userServices.findUserByUsername(req.session.username).then((user) => {
            if (user.group == null || user.group == "") {
                res.status(401).json({ isInGroup: false });
            } else {
                taskServices
                    .getTasksInGroup(user.group)
                    .then((tasks) => {
                        res.status(200).json({ task_list: tasks });
                    })
                    .catch((error) => {
                        res.status(500).json({ error });
                    });
            }
        });
    } else {
        return res.status(401).send();
    }
});

app.get("/groupInfo", async (req, res) => {
    if (req.session.username) {
        userServices.getGroup(req.session.username).then((group) => {
            if(group == "" || group == null){
                return res.status(404).send("not in group");
            }else{
                let groupObjectId = new ObjectId(group);
                groupServices.findGroup(groupObjectId).then((groupInfo) => {
                    let names = [];
                    let members = groupInfo[0].members;
                    let isOwner = false;
                    for (let i = 0; i < members.length; i++) {
                        names.push({
                            name: groupInfo[0].members[i].name,
                            username: groupInfo[0].members[i].username,
                        });
                    }
                    //check if user who is calling this is the owner or not
                    if (req.session.username === groupInfo[0].owner.username) {
                        isOwner = true;
                    }
                    console.log(groupInfo);
                    return res.status(200).send({
                        code: groupInfo[0].code,
                        name: groupInfo[0].name,
                        members: names,
                        isOwner: isOwner,
                    });
                });
            }
        });
    } else {
        return res.status(401).send("not logged in");
    }
});

app.delete("/group", async (req, res) => {
    //remove the user's group
    if (req.session.username) {
        try {
            const user = await userServices.findUserByUsername(
                req.body.username
            );
            const group = await userServices.getGroup(req.session.username);

            if (group === "") {
                throw new Error("not in group");
            }

            const groupObjectId = new ObjectId(group);
            const groupInfo = await groupServices.findGroup(groupObjectId);

            // checks if either the user is an admin or the user is trying to remove themselves
            if (
                req.session.username != groupInfo[0].owner.username &&
                req.session.username != req.body.username
            ) {
                console.log("not working");
                throw new Error("Not admin of the group");
            }

            // remove the user from the list of members
            await groupServices.removeUserFromGroup(
                groupInfo[0].code,
                user._id
            );

            // remove group from user
            await userServices.removeGroup(user.username);

            return res.status(202).json("Removed from group");
        } catch (error) {
            return res.status(404).json("Could not remove group");
        }
    } else {
        return res.status(401).send("not logged in");
    }
});

//remove user from group, check if user who is calling is the owner of the group or not

app.get("/group", async (req, res) => {
    if (req.session.username) {
        userServices.getGroup(req.session.username).then((group) => {
            let groupObjectId = new ObjectId(group);
            groupServices.findGroup(groupObjectId).then((groupInfo) => {
                let groupSize = groupInfo[0].members.length;
                return res.status(200).send({ groupSize: groupSize });
            });
        });
    } else {
        return res.status(401).send("cannot login");
    }
});

// add new task to task list, will be marked with assigned=false
app.post("/tasks", (req, res) => {
    if (!req.session.username) {
        return res.status(401).send();
    }
    const newTask = req.body;
    if (newTask === undefined) {
        res.status(404).send("newTask not found");
    } else {
        userServices.getGroup(req.session.username).then((groupId) => {
            newTask.groupId = groupId;
            taskServices.addTask(newTask).then((error) => {
                if (error == 500) {
                    return res.status(500).send("Could not add task");
                } else {
                    return res.status(201).send("Added task");
                }
            });
        });
    }
});

app.post("/tasks/:id", async (req, res) => {
    if (!req.session.username) {
        return res.status(401).send();
    }

    const id = req.params.id;
    await taskServices
        .cliamTask(id, req.session.username)
        .then(() => {
            res.json("Task deleted successfully");
        })
        .catch(() => {
            res.status(404).json("Could not delete task");
        });
});

// remove a task from the task list
app.delete("/tasks/:id", async (req, res) => {
    if (!req.session.username) {
        return res.status(401).send();
    }

    const id = req.params.id;
    await taskServices
        .deleteTask(id)
        .then(() => {
            res.json("Task deleted successfully");
        })
        .catch(() => {
            res.status(404).json("Could not delete task");
        });
});

//get poll
app.get("/polls", (req, res) => {
    if (!req.session.username) {
        return res.status(401).send();
    } else {
        // get user's group id

        userServices
            .findUserByUsername(req.session.username)
            .then((user) => {
                if (user.group == null || user.group == "") {
                    res.status(401).json({ isInGroup: false });
                } else {
                    pollServices.getPollsInGroup(user.group).then((polls) => {
                        for (let i = 0; i < polls.length; i++) {
                            let whoVoted = polls[i].whoVoted;
                            let hasVoted = whoVoted.includes(user.email);
                            polls[i].whoVoted = [hasVoted];
                        }
                        res.status(200).json({ poll_list: polls });
                    });
                }
            })
            .catch((error) => {
                res.status(500).json({ error });
            });
    }
});

app.delete("/polls/:id", async (req, res) => {
    if (!req.session.username) {
        return res.status(401).send();
    }

    const id = req.params.id;
    // console.log(id);
    await pollServices
        .deletePoll(id)
        .then(() => {
            res.json("Poll deleted successfully");
        })
        .catch(() => {
            res.status(404).json("could not delete poll");
        });
});

// post poll
app.post("/polls", function(req, res) {
    if (!req.session.username) {
        return res.status(401).send();
    }

    const newPoll = req.body;
    if (newPoll === undefined) {
        res.status(404).send("newTask not found");
    }
    userServices
        .getGroup(req.session.username)
        .then((groupId) => {
            newPoll.groupId = groupId;
            pollServices
                .addPoll(newPoll)
                .then(() => {
                    res.status(201).json({
                        message: "poll added successfully",
                    });
                })
                .catch((err) => {
                    res.status(500).json({ err: "could not add poll" });
                });
        })
        .catch((err) => {
            res.status(500).json({ err: "could not add poll" });
        });
});

app.post("/polls/:pollId", (req, res) => {
    const { pollId } = req.params;
    const { option } = req.body;

    pollServices
        .findPoll(pollId)
        .then((poll) => {
            if (!poll) {
                return res.status(404).json({ message: "Poll not found" });
            }

            // Check if the option is valid
            if (option !== "option1" && option !== "option2") {
                return res.status(400).json({ message: "Invalid option" });
            }
            console.log(req.session);
            userServices
                .findUserByUsername(req.session.username)
                .then((user) => {
                    // console.log(req.session.username);

                    if (!user) {
                        return res
                            .status(404)
                            .json({ message: "User not found" });
                    }

                    if (poll.whoVoted.includes(user.email)) {
                        res.status(400).json({
                            message: `User ${req.session.username} already voted`,
                        });
                    } else {
                        poll.whoVoted.push(user.email);
                        // Increment the vote count for the selected option
                        // console.log(user.email);
                        poll[`${option}Votes`] += 1;

                        // Save the updated poll document
                        poll.save()
                            .then(() => {
                                res.status(200).json({
                                    message: `Vote for ${option} recorded successfully`,
                                });
                            })
                            .catch((error) => {
                                console.error("Error saving poll:", error);
                                res.status(500).json({
                                    error: "Internal Server Error",
                                });
                            });
                    }
                })
                .catch((error) => {
                    console.error("Error finding user:", error);
                    res.status(500).json({ error: "Internal Server Error" });
                });
        })
        .catch((error) => {
            console.error("Error finding poll:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

app.get("/backlog", async (req, res) => {
    const username = req.session.username;
    userServices
        .findUserByUsername(username)
        .then((user) => {
            backlogServices
                .getGroupTasks(user.group)
                .then((tasks) => {
                    userServices
                        .findUserByUsername(username)
                        .then((user) => {});
                    res.status(200).json({ backlog: tasks });
                })
                .catch((error) => {
                    res.status(500).json({ error });
                });
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
});

app.delete("/backlog/:id", async (req, res) => {
    const id = req.params.id;
    await backlogServices
        .deleteTask(id)
        .then(() => {
            res.json("Task deleted successfully");
        })
        .catch(() => {
            res.status(404).json("Could not delete task");
        });
});

app.listen(process.env.PORT || port, () => {
    console.log(`rest api is listening`);
    console.log("mongo: ", process.env.MONGO_URL);
});
