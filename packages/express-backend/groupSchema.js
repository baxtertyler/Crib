import mongoose from "mongoose";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 10 });

const GroupSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.ObjectId, ref: "User",
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
            default: () => uid.randomUUID(),
        },
        members: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "User",
            }
        ]
    }, { collection: "group_list" }
);

const Group = mongoose.model("Group", GroupSchema);

export default Group;