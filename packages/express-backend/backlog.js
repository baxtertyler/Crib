import mongoose from "mongoose";

const BacklogSchema = new mongoose.Schema(
    {
        task: {
            type: String,
            required: true,
            trim: true,
        },
        completionDate: {
            type: String,
            required: true,
            trim: true,
        },
        completedBy: {
            type: String,
            required: true,
            trim: true,
        },
        groupId: {
            type: mongoose.Schema.ObjectId,
            ref: "Group",
            required: true,
        },
    },
    { collection: "backlog" }
);

const Backlog = mongoose.model("Backlog", BacklogSchema);

export default Backlog;
