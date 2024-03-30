import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        task: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        dueDate: {
            type: String,
            required: true,
            trim: true,
        },
        weight: {
            type: Number,
            required: false,
            trim: true,
        },
        assignee: {
            type: String,
            required: false,
            default: "none",
            trim: true,
        },
        groupId: {
            type: mongoose.Schema.ObjectId,
            ref: "Group",
            required: true,
        },
    },
    { collection: "task_list" }
);

const Task = mongoose.model("Task", TaskSchema);

export default Task;
