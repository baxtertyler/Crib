import mongoose from "mongoose";
import userModel from "./user.js";

import dotenv from "dotenv";

mongoose.set("debug", true);
dotenv.config();

mongoose
    .connect(
        process.env.MONGO_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log("Connected to MongoDB in user-services"))
        .catch((error) => console.error("MongoDB Connection Error:", error));

async function findUserByUsername(username) {
    return await userModel.findOne({ username: username }).catch((err) => {
        if(err) {
            return undefined;
        }
    });
}

async function findUserByEmail(email) {
    return await userModel.findOne({ email: email }).catch((err) => {
        if(err) {
            return undefined;
        }
    });
}

function getUsers(username, email, name) {
    let promise;
    if (username) {
        promise = findUserByUsername(username)
    } else if (email) {
        promise = findUserByEmail(email);
    } else if (name) {
        promise = findUserByName(name)
    } else {
        promise = userModel.find();
    }
    return promise;
}

async function randomUser() {
    let promise = await userModel.aggregate([{ $sample: { size: 1 } }]);
    return promise;
}

function addUser(user) {
    const userToAdd = new userModel(user);
    const promise = userToAdd.save().catch((e) =>{
        if(e){
            console.log(e);
            return 500;
        }
    });
    return promise;
}

function addTask(username, newTask) {
    const promise = userModel.findOneAndUpdate(
        { username: username }, 
        { $push: { tasks: newTask } }, 
        { new: true }
    ).catch((error) => {
        console.error("Error adding task:", error);
        return Promise.reject(error);
    });

    return promise;
}

function removeTask(username, taskId) {
    const promise = userModel.findOneAndUpdate(
        { username: username }, 
        { $pull: { tasks: taskId } }, 
        { new: true }
    ).catch((error) => {
        console.error("Error removing task:", error);
        return Promise.reject(error);
    });

    return promise;
}

async function deleteUser(id) {
    const promise = userModel.findByIdAndRemove(id).catch((err) => {
        if(err) {
            return undefined;
        }
    });
    return promise;
}

export default {
    addUser,
    addTask,
    removeTask,
    randomUser,
    getUsers,
    deleteUser,
    findUserByUsername,
    findUserByEmail,
};