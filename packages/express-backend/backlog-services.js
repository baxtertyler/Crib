import mongoose from "mongoose";
import backlogModel from "./backlog.js";

import dotenv from "dotenv";

mongoose.set("debug", true);
dotenv.config();

mongoose.connect(
    process.env.MONGO_URL,
    // "mongodb://localhost:27017/users",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);
//.catch((error) => console.log(error));

function findTask(id) {
    return backlogModel
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

function getTasks() {
    let promise = backlogModel.find();
    return promise;
}

function getGroupTasks(groupId) {
    let promise = backlogModel.find({
        groupId: new mongoose.Types.ObjectId(groupId),
    });
    return promise;
}

async function addTask(username, task) {
    let currentdate = new Date();
    let datetime =
        currentdate.getMonth() +
        1 +
        "/" +
        currentdate.getDate() +
        "/" +
        currentdate.getFullYear() +
        " " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();

    const backlogToAdd = new backlogModel({
        task: task.task,
        completionDate: datetime,
        completedBy: username,
        groupId: task.groupId,
    });

    const promise = backlogToAdd.save().catch((e) => {
        return 500;
    });

    return promise;
}

async function deleteTask(id) {
    const promise = backlogModel
        .findByIdAndDelete(id)
        .exec()
        .catch((err) => {
            throw err;
        });
    return promise;
}

export default {
    findTask,
    getTasks,
    getGroupTasks,
    addTask,
    deleteTask,
};
