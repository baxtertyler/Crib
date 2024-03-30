import mongoose from "mongoose";
import Backlog from "./backlog.js";
import Task from "./task.js";
import mut from "./backlog-services.js";

describe("findTask", () => {
    // formatting functions to setup database for each test
    beforeAll(async () => {
        await mongoose.disconnect();
        await mongoose.connect(
            "mongodb://localhost:27017/test-backlog-database",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
    });
    afterAll(async () => {
        await mongoose.disconnect();
    });
    beforeEach(async () => {
        await Backlog.create({
            task: "Test Task",
            completionDate: "2023-12-31",
            completedBy: "John Doe",
        });
    });
    afterEach(async () => {
        await Backlog.deleteMany({});
    });

    // tests
    it("should find a task by ID", async () => {
        const testTask = await Backlog.findOne({ task: "Test Task" });
        const taskId = testTask._id.toString();

        const result = await mut.findTask(taskId);

        expect(result).not.toBeNull();
        expect(result.task).toBe("Test Task");
        expect(result.completionDate).toBe("2023-12-31");
        expect(result.completedBy).toBe("John Doe");
    });
    it("should return null for non-existent task ID", async () => {
        const result = await mut.findTask("656e68c43437b8649d0e62db");

        expect(result).toBeNull();
    });
    it("should handle errors and throw an error", async () => {
        await expect(mut.findTask("invalid-id")).rejects.toThrow();
    });
});

describe("getTasks", () => {
    beforeAll(async () => {
        await mongoose.disconnect();
        await mongoose.connect("mongodb://localhost:27017/test-task-database", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });
    afterAll(async () => {
        await mongoose.disconnect();
    });
    beforeEach(async () => {
        await Backlog.create({
            task: "Test Task",
            completionDate: "2023-12-31",
            completedBy: "John Doe",
        });
    });
    afterEach(async () => {
        await Backlog.deleteMany({});
    });

    it("should return the current tasks", async () => {
        const tasks = mut.getTasks();
        expect(tasks).not.toBeNull();
    });
});

describe("addTask", () => {
    beforeAll(async () => {
        await mongoose.disconnect();
        await mongoose.connect("mongodb://localhost:27017/test-task-database", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });
    afterAll(async () => {
        await mongoose.disconnect();
    });
    afterEach(async () => {
        await Backlog.deleteMany({});
        await Task.deleteMany({});
    });
    beforeEach(async () => {
        await Task.create({
            task: "Test Task",
            dueDate: "2023-12-31",
            weight: 5,
            assignee: "John Doe",
            groupId: new mongoose.Types.ObjectId(),
        });
    });

    it("should add the task", async () => {
        const task = await Task.findOne({ task: "Test Task" });
        const result = await mut.addTask("John Doe", task);
        expect(result).not.toBeNull;
    });
    it("should throw an error", async () => {
        const task1 = await Task.findOne({ task: "Test Task" });
        const task2 = {
            task: "Test Task 2",
        };
        const result = await mut.addTask("John Doe", task2);
        expect(result).not.toBeNull;
        expect(result).tobeNull;
    });
});

describe("deleteTask", () => {
    beforeAll(async () => {
        await mongoose.disconnect();
        await mongoose.connect("mongodb://localhost:27017/test-task-database", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });
    afterAll(async () => {
        await mongoose.disconnect();
    });
    beforeEach(async () => {
        await Backlog.create({
            task: "Test Task",
            completionDate: "2023-12-31",
            completedBy: "John Doe",
        });
    });
    afterEach(async () => {
        await Backlog.deleteMany({});
    });

    it("should delete the task", async () => {
        const testTask = await Backlog.findOne({ task: "Test Task" });
        const taskId = testTask._id.toString();

        await mut.deleteTask(taskId);

        const deletedTask = await Backlog.findById(taskId);
        expect(deletedTask).toBeNull();
    });
    it("should throw an error", async () => {
        await expect(mut.deleteTask("invalid-id")).rejects.toThrow();
    });
});
