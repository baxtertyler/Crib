import mongoose from "mongoose";


const PollSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        option1: {
            type: String,
            required: true,
            trim: true,
        },
        option2: {
            type: String,
            required: true,
            trim: true,
        },
        option1Votes: {
            type: Number,
            default: 0, // Default to zero votes
        },
        option2Votes: {
            type: Number,
            default: 0, // Default to zero votes
        }
    }, { collection: "poll_list" }
);

const Poll = mongoose.model("Poll", PollSchema);

export default Poll;