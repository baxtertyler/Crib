import mongoose from "mongoose";
import taskModel from "./task.js";
import dotenv from "dotenv";

mongoose.set("debug", true);
dotenv.config();

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB in task-services"));
//.catch((error) => console.error("MongoDB Connection Error:", error));

function findTask(id) {
    return taskModel
        .findById(id)
        .exec()
        .then((task) => {
            if (!task) {
                return null;
            }
            return task;
        })
        .catch((error) => {
            throw error;
        });
}

async function cliamTask(taskId, username) {
    try {
        const task = await taskModel.findById(taskId);

        /*if (!task) {
            return {
                success: false,
                message: "Task not found",
            };
        }*/

        task.assignee = username;

        // Save the updated poll document
        await task.save();

        return {
            success: true,
            message: `${username} now assigned to task`,
        };
    } catch (error) {
        return {
            success: false,
            message: `Error assigning task`,
        };
    }
}

async function getGroup(id) {
    return taskModel.findById(id).then((task) => {
        if (!task) {
            return null;
        }
        return task.groupId;
    });
}

function getTasksInGroup(groupId) {
    let promise = taskModel.find({ groupId: groupId });
    return promise;
}

function getTasks() {
    let promise = taskModel.find();
    return promise;
}

function addTask(task) {
    const taskToAdd = new taskModel(task);
    const promise = taskToAdd.save().catch((e) => {
        return 500;
    });
    return promise;
}

async function deleteTask(id) {
    const promise = taskModel
        .findByIdAndDelete(id)
        .exec()
        .catch((err) => {
            throw err;
        });
    return promise;
}

export default {
    cliamTask,
    findTask,
    getTasks,
    getTasksInGroup,
    getGroup,
    addTask,
    deleteTask,
};
