import mongoose from "mongoose";
import pollModel from "./pollSchema.js";
import dotenv from "dotenv";

mongoose.set("debug", true);
dotenv.config();

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB in poll-services"));
//.catch((error) => console.error("MongoDB Connection Error:", error));

async function findPoll(id) {
    return pollModel
        .findById(id)
        .exec()
        .then((poll) => {
            return poll;
        })
        .catch((error) => {
            throw error;
        });
}

async function getGroup(id) {
    return pollModel.findById(id).then((poll) => {
        if (!poll) {
            return null;
        }
        return poll.groupId;
    });
}

function getPollsInGroup(groupId) {
    let promise = pollModel.find({ groupId: groupId });
    return promise;
}

function getPolls() {
    let promise = pollModel.find();
    return promise;
}

function addPoll(poll) {
    const pollToAdd = new pollModel(poll);
    const promise = pollToAdd.save().catch((e) => {
        return 500;
    });
    return promise;
}

async function deletePoll(id) {
    const promise = pollModel
        .findByIdAndDelete(id)
        .exec()
        .catch((err) => {
            return undefined;
        });
    return promise;
}

async function voteForOption(pollId, option) {
    try {
        const poll = await pollModel.findById(pollId);

        // Increment the vote count for the selected option
        poll[`${option}Votes`] += 1;

        // Save the updated poll document
        await poll.save();

        return {
            success: true,
            message: `Vote for ${option} recorded successfully`,
        };
    } catch (error) {
        return {
            success: false,
            message: `Error recording vote: ${error.message}`,
        };
    }
}

export default {
    findPoll,
    getPolls,
    getPollsInGroup,
    getGroup,
    addPoll,
    deletePoll,
    voteForOption,
};
