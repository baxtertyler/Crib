import mongoose from "mongoose";
import Task from "./task.js";
import mut from "./task-services.js";

describe("findTask", () => {
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
        await Task.create({
            task: "Test Task777",
            dueDate: "2023-12-31",
            weight: 5,
            assignee: "John Doe",
            groupId: new mongoose.Types.ObjectId(),
        });
    });
    afterEach(async () => {
        await Task.deleteMany({});
    });

    it("should find a task by ID", async () => {
        const testTask = await Task.findOne({ task: "Test Task777" });
        const taskId = testTask._id.toString();

        const result = await mut.findTask(taskId);

        expect(result).not.toBeNull();
        expect(result.task).toBe("Test Task777");
        expect(result.dueDate).toBe("2023-12-31");
        expect(result.weight).toBe(5);
        expect(result.assignee).toBe("John Doe");
    });
    it("should return null for non-existent task ID", async () => {
        const result = await mut.findTask("656e68c43437b8649d0e62db");

        expect(result).toBeNull();
    });
    it("should handle errors and throw an error", async () => {
        await expect(mut.findTask("invalid-id444")).rejects.toThrow();
    });
});

describe("claimTask", () => {
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
        await Task.create({
            task: "Test Task777",
            dueDate: "2023-12-31",
            weight: 5,
            assignee: "John Doe",
            groupId: new mongoose.Types.ObjectId(),
        });
    });

    afterEach(async () => {
        await Task.deleteMany({});
    });

    it("should claim a task by updating assignee", async () => {
        const testTask = await Task.findOne({ task: "Test Task777" });
        const taskId = testTask._id.toString();
        const newAssignee = "Jane Doe";

        const result = await mut.cliamTask(taskId, newAssignee);

        expect(result.success).toBe(true);
        expect(result.message).toBe(`${newAssignee} now assigned to task`);

        // Check if the task in the database has been updated
        const updatedTask = await Task.findById(taskId);
        expect(updatedTask.assignee).toBe(newAssignee);
    });

    it("should return error for non-existent task ID", async () => {
        const result = await mut.cliamTask("invalid-id444", "Jane Doe");
        expect(result.success).toBe(false);
        expect(result.message).toBe("Error assigning task");
    });

    it("should handle errors and return error message", async () => {
        // Trigger an error by providing an invalid task ID
        const result = await mut.cliamTask("invalid-id444", "Jane Doe");
        expect(result.success).toBe(false);
        expect(result.message).toContain("Error assigning task");
    });
});

describe("getGroup", () => {
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
        await Task.create({
            task: "Test Task777",
            dueDate: "2023-12-31",
            weight: 5,
            assignee: "John Doe",
            groupId: new mongoose.Types.ObjectId(),
        });
    });

    afterEach(async () => {
        await Task.deleteMany({});
    });

    it("should return the group ID for an existing task", async () => {
        const testTask = await Task.findOne({ task: "Test Task777" });
        const taskId = testTask._id.toString();

        const result = await mut.getGroup(taskId);
        console.log(result);
        console.log(testTask.groupId.toString());

        expect(result).not.toBeNull();
        expect(result.toString()).toEqual(testTask.groupId.toString());
    });

    it("should return null for non-existent task ID", async () => {
        const result = await mut.getGroup(new mongoose.Types.ObjectId());

        expect(result).toBeNull();
    });
});

describe("getTasksInGroup", () => {
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
        await Task.create([
            {
                task: "Test Task1",
                dueDate: "2023-12-31",
                weight: 5,
                assignee: "John Doe",
                groupId: new mongoose.Types.ObjectId(),
            },
            {
                task: "Test Task2",
                dueDate: "2023-12-31",
                weight: 7,
                assignee: "Jane Doe",
                groupId: new mongoose.Types.ObjectId(),
            },
            {
                task: "Test Task3",
                dueDate: "2023-12-31",
                weight: 3,
                assignee: "Jim Doe",
                groupId: new mongoose.Types.ObjectId(),
            },
        ]);
    });

    afterEach(async () => {
        await Task.deleteMany({});
    });

    it("should return an array of tasks for an existing group ID", async () => {
        const testGroup = await Task.findOne({ task: "Test Task1" });
        const groupId = testGroup.groupId.toString();

        const result = await mut.getTasksInGroup(groupId);

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].groupId.toString()).toBe(groupId);
    });

    it("should return an empty array for non-existent group ID", async () => {
        const result = await mut.getTasksInGroup(new mongoose.Types.ObjectId());

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(0);
    });

    it("should handle errors and reject the promise", async () => {
        await expect(mut.getTasksInGroup("invalid-group-id")).rejects.toThrow();
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
        await Task.create({
            task: "Test Task90",
            dueDate: "2023-12-31",
            weight: 5,
            assignee: "John Doe",
            groupId: new mongoose.Types.ObjectId(),
        });
    });
    afterEach(async () => {
        await Task.deleteMany({});
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
        await Task.deleteMany({});
    });

    it("should add the task", async () => {
        const task2 = {
            task: "Test Task12",
            dueDate: "2023-12-31",
            weight: 5,
            assignee: "John Doe",
            groupId: new mongoose.Types.ObjectId(),
        };
        const result = await mut.addTask(task2);
        expect(result).not.toBeNull;
    });
    it("should throw an error", async () => {
        const task = {
            user: "John",
        };
        const result = await mut.addTask(task);
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
        await Task.create({
            task: "Test Task55",
            dueDate: "2023-12-31",
            weight: 5,
            assignee: "John Doe",
            groupId: new mongoose.Types.ObjectId(),
        });
    });
    afterEach(async () => {
        await Task.deleteMany({});
    });

    it("should delete the task", async () => {
        const testTask = await Task.findOne({ task: "Test Task55" });
        const taskId = testTask._id.toString();

        await mut.deleteTask(taskId);

        const deletedTask = await Task.findById(taskId);
        expect(deletedTask).toBeNull();
    });
    it("should throw an error", async () => {
        await expect(mut.deleteTask("invalid-id")).rejects.toThrow();
    });
});
