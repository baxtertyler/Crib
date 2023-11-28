import mongoose from "mongoose";
import backlogModel from "./backlog.js";

import dotenv from "dotenv";

mongoose.set("debug", true);
dotenv.config();

mongoose
    .connect(
        process.env.MONGO_URL,
        // "mongodb://localhost:27017/users",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    .catch((error) => console.log(error));

function findTask(id) {
    return backlogModel.findById(id)
        .exec() // Add .exec() to return a promise
        .then((task) => {
            if (!task) {
                // Task not found
                return null;
            }
            return task; // Return the found task
        })
        .catch((error) => {
            console.error("Error finding task:", error);
            throw error; // Rethrow the error for proper handling
        });
}

function getTasks() {
    let promise = backlogModel.find();
    return promise;
}

async function addTask(username, task) {
    try {
        let currentdate = new Date();
        let datetime =
            (currentdate.getMonth() + 1) + "/" +
            currentdate.getDate() + "/" +
            currentdate.getFullYear() + " " + 
            currentdate.getHours() + ":" +
            currentdate.getMinutes() + ":" +
            currentdate.getSeconds();
        
        const taskToAdd = new backlogModel({
            completionDate: datetime,
            completedBy: username,
            task: task.task
        });
        
        await taskToAdd.save();
    } catch (error) {
        throw new Error('Failed to add the task to the backlog');
    }
}


async function deleteTask(id) {
    const promise = backlogModel.findByIdAndRemove(id).catch((err) => {
        if(err) {
            return undefined;
        }
    });
    return promise;
}

export default {
    findTask,
    getTasks,
    addTask,
    deleteTask,
};