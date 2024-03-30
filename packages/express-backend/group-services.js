import mongoose from "mongoose";
import groupModel from "./groupSchema.js";

import dotenv from "dotenv";

mongoose.set("debug", true);
dotenv.config();

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB in user-services"));
//.catch((error) => console.error("MongoDB Connection Error:", error));

async function findGroup(groupId){
    return await groupModel.find({_id: groupId})
    .populate('owner')
    .populate('members').
    exec()
    .catch((err) => {
        if(err){
            return undefined;
        }
    });
}
async function findGroupByName(name) {
    return groupModel.findOne({ name: name }).then((group) => {
        return group;
    });
}

function addGroup(group) {
    const groupToAdd = new groupModel(group);
    const promise = groupToAdd.save().catch((e) => {
        return 500;
    });
    return promise;
}

async function addUserToGroup(code, userId) {
    const promise = groupModel.findOneAndUpdate(
        { code: code },
        { $push: { members: userId } },
        { new: true }
    );
    return promise;
}

async function removeUserFromGroup(code, userId){
    const promise = groupModel.findOneAndUpdate(
        { code: code },
        { $pull: { members: userId } },
        { new: true }
    );
    return promise;
}

export default {
    findGroup,
    findGroupByName,
    addGroup,
    addUserToGroup,
    removeUserFromGroup
};
