import mongoose from "mongoose";
import mut from "./poll-services.js";
import Poll from "./pollSchema.js";

describe("pollServices", () => {
    beforeAll(async () => {
        await mongoose.disconnect();
        await mongoose.connect("mongodb://localhost:27017/test-poll-database", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    afterEach(async () => {
        await Poll.deleteMany({});
    });

    describe("findPoll", () => {
        it("should find a poll by title", async () => {
            const testPoll = new Poll({
                title: "Test Poll",
                option1: "Option A",
                option2: "Option B",
                groupId: new mongoose.Types.ObjectId(),
            });
            await testPoll.save();

            const result = await mut.findPoll(testPoll._id.toString());

            expect(result).not.toBeNull();
            expect(result.title).toBe("Test Poll");
            expect(result.option1).toBe("Option A");
            expect(result.option2).toBe("Option B");
        });

        it("should handle errors and throw an error", async () => {
            await expect(mut.findPoll("invalid-id")).rejects.toThrow();
        });
    });

    describe("getGroup", () => {
        it("should return the group ID for an existing poll", async () => {
            const groupId = new mongoose.Types.ObjectId();
            const poll = await Poll.create({
                title: "Test Poll 1",
                option1: "Option A",
                option2: "Option B",
                groupId: groupId,
            });

            const result = await mut.getGroup(poll._id);

            expect(result).toEqual(groupId);
        });

        it("should return null for a non-existent poll", async () => {
            const result = await mut.getGroup(new mongoose.Types.ObjectId());

            expect(result).toBeNull();
        });
    });

    describe("getPollsInGroup", () => {
        it("should return polls in the specified group", async () => {
            const groupId = new mongoose.Types.ObjectId();
            const poll1 = await Poll.create({
                title: "Test Poll 1",
                option1: "Option A",
                option2: "Option B",
                groupId: groupId,
            });

            const poll2 = await Poll.create({
                title: "Test Poll 2",
                option1: "Option C",
                option2: "Option D",
                groupId: groupId,
            });

            const result = await mut.getPollsInGroup(groupId);

            expect(result).toHaveLength(2);
            expect(result[0].title).toBe("Test Poll 1");
            expect(result[1].title).toBe("Test Poll 2");
        });

        it("should return an empty array for a group with no polls", async () => {
            const groupId = new mongoose.Types.ObjectId();
            const result = await mut.getPollsInGroup(groupId);

            expect(result).toHaveLength(0);
        });
    });

    describe("getPolls", () => {
        it("should return an array of polls", async () => {
            await Poll.create({
                title: "Test Poll 1",
                option1: "Option A",
                option2: "Option B",
                groupId: new mongoose.Types.ObjectId(),
            });

            await Poll.create({
                title: "Test Poll 2",
                option1: "Option X",
                option2: "Option Y",
                groupId: new mongoose.Types.ObjectId(),
            });

            const polls = await mut.getPolls();

            expect(polls).toHaveLength(2);
        });
    });

    describe("addPoll", () => {
        it("should add a poll", async () => {
            const testPoll = {
                title: "New Test Poll",
                option1: "Option A",
                option2: "Option B",
                groupId: new mongoose.Types.ObjectId(),
            };
            const result = await mut.addPoll(testPoll);

            expect(result).not.toBeNull();
            expect(result.title).toBe("New Test Poll");
            expect(result.option1).toBe("Option A");
            expect(result.option2).toBe("Option B");
        });

        it("should handle errors and return 500", async () => {
            const testPoll = {
                option1: "Option A",
                option2: "Option B",
                groupId: new mongoose.Types.ObjectId(),
            };
            const result = await mut.addPoll(testPoll);

            expect(result).toBe(500);
        });
    });

    describe("deletePoll", () => {
        it("should delete a poll", async () => {
            const testPoll = new Poll({
                title: "Test Poll",
                option1: "Option A",
                option2: "Option B",
                groupId: new mongoose.Types.ObjectId(),
            });
            await testPoll.save();

            await mut.deletePoll(testPoll._id.toString());

            const deletedPoll = await Poll.findById(testPoll._id);
            expect(deletedPoll).toBeNull();
        });

        it("should return undefined for non-existent poll ID", async () => {
            const result = await mut.deletePoll("non-existent-id");

            expect(result).toBeUndefined();
        });
    });

    describe("voteForOption", () => {
        it("should record a vote for an option", async () => {
            const testPoll = new Poll({
                title: "Test Poll",
                option1: "Option A",
                option2: "Option B",
                groupId: new mongoose.Types.ObjectId(),
            });
            await testPoll.save();

            const result = await mut.voteForOption(
                testPoll._id.toString(),
                "Option A"
            );

            expect(result.success).toBe(true);
            expect(result.message).toBe(
                "Vote for Option A recorded successfully"
            );
        });

        it("should handle non-existent poll and return false", async () => {
            const result = await mut.voteForOption(
                "non-existent-id",
                "Option A"
            );

            expect(result.success).toBe(false);
        });

        it("should handle errors and return false", async () => {
            const result = await mut.voteForOption("invalid-id", "Option A");

            expect(result.success).toBe(false);
            expect(result.message).toContain("Error recording vote");
        });
    });
});
