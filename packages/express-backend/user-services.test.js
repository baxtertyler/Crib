import mongoose from "mongoose";
import bcrypt from "bcrypt";
import mut from "./user-services.js";
import User from "./user.js";
import Group from "./groupSchema.js";
import Task from "./task.js";

describe("userServices", () => {
    beforeAll(async () => {
        await mongoose.disconnect();
        await mongoose.connect("mongodb://localhost:27017/test-user-database", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    describe("addToGroup", () => {
        it("should add a user to a group", async () => {
            const testUser = await User.create({
                username: "JohnDoe",
                email: "john.doe@example.com",
                name: "John Doe",
                password: "securepassword",
                tasks: [
                    new mongoose.Types.ObjectId(),
                    new mongoose.Types.ObjectId(),
                ],
            });

            const testGroup = await Group.create({
                owner: new mongoose.Types.ObjectId(),
                name: "Test Group again",
                members: [],
            });

            const result = await mut.addToGroup(testUser.username, testGroup);

            const updatedUser = await User.findOne({
                username: "JohnDoe",
            }).populate("group");

            expect(result).not.toBeNull();
            expect(result).not.toBe(500);
            expect(updatedUser.group.name).toBe("Test Group again");
        });

        it("should handle errors and return null for non-existent user", async () => {
            const testGroup = await Group.create({
                owner: new mongoose.Types.ObjectId(),
                name: "Test Group",
                members: [],
            });

            const result = await mut.addToGroup("NonExistentUser", testGroup);

            expect(result).toBeNull();
        });

        it("should handle errors and return 500 for non-existent group", async () => {
            const testUser = await User.create({
                username: "JohnDoe",
                email: "john.doe@example.com",
                name: "John Doe",
                password: "securepassword",
            });

            const result = await mut.addToGroup(
                testUser.username,
                "NonExistentGroup"
            );

            expect(result).toBe(500);
        });
    });

    describe("getGroup", () => {
        afterEach(async () => {
            await User.deleteMany({});
        });

        it("should return the group for an existing username", async () => {
            const g = await User.create({
                name: "name",
                username: "JohnDoe",
                password: "password",
                email: "testemail@email.com",
                group: new mongoose.Types.ObjectId(),
            });

            const result = await mut.getGroup("JohnDoe");

            expect(result).toBeDefined();
            expect(result).toEqual(g.group._id);
        });

        it("should return null for non-existent username", async () => {
            const result = await mut.getGroup("NonExistentUser");

            expect(result).toBeNull();
        });
    });

    describe("findUserByUsername", () => {
        it("should find a user by username", async () => {
            const testUser = await User.create({
                username: "JohnDoe",
                email: "john.doe@example.com",
                name: "John Doe",
                password: "securepassword",
            });

            const result = await mut.findUserByUsername("JohnDoe");

            expect(result).not.toBeNull();
            expect(result.username).toBe("JohnDoe");
        });

        it("should return undefined for non-existent username", async () => {
            const result = await mut.findUserByUsername("NonExistentUser");

            expect(result).toBeNull();
        });

        it("should handle errors and return undefined", async () => {
            const result = await mut.findUserByUsername("invalid-username");

            expect(result).toBeNull();
        });
    });

    describe("findUserByEmail", () => {
        it("should find a user by username", async () => {
            const testUser = await User.create({
                username: "JohnDoe",
                email: "john.doe@example.com",
                name: "John Doe",
                password: "securepassword",
            });

            const result = await mut.findUserByEmail("john.doe@example.com");

            expect(result).not.toBeNull();
            expect(result.username).toBe("JohnDoe");
        });

        it("should return undefined for non-existent username", async () => {
            const result = await mut.findUserByUsername("NonExistentUser");

            expect(result).toBeNull();
        });

        it("should handle errors and return undefined", async () => {
            // Intentionally create an error by passing an invalid username
            const result = await mut.findUserByUsername("invalid-username");

            expect(result).toBeNull();
        });
    });

    describe("getUsers", () => {
        it("should find users by username", async () => {
            const testUser = {
                username: "JohnDoe",
                email: "john.doe@example.com",
                name: "John Doe",
                password: "password",
            };
            await User.create(testUser);

            const result = await mut.getUsers("JohnDoe", null, null);

            expect(result.email).toBe("john.doe@example.com");
        });

        it("should find users by email", async () => {
            const testUser = {
                username: "JohnDoe",
                email: "john.doe@example.com",
                name: "John Doe",
                password: "password",
            };
            await User.create(testUser);

            const result = await mut.getUsers(
                null,
                "john.doe@example.com",
                null
            );

            expect(result.email).toBe("john.doe@example.com");
        });

        it("should return all users when no filter is provided", async () => {
            const testUser = {
                username: "User1",
                email: "user1@example.com",
                name: "User One",
                password: "password1",
            };

            await User.create([testUser]);

            const result = await mut.getUsers(null, null, null);

            expect(result).toHaveLength(1);
        });

        it("should handle errors and return undefined", async () => {
            const result = await mut.getUsers("nonexistent", null, null);

            expect(result).toBeNull();
        });
    });

    describe("randomUser", () => {
        it("should return a random user", async () => {
            const testUsers = [
                {
                    username: "User1",
                    email: "user1@example.com",
                    name: "User One",
                    password: "password1",
                    group: new mongoose.Types.ObjectId(),
                },
                {
                    username: "User2",
                    email: "user2@example.com",
                    name: "User Two",
                    password: "password2",
                    group: new mongoose.Types.ObjectId(),
                },
            ];

            await User.create(testUsers);

            const result = await mut.randomUser();

            expect(result).not.toBeNull();
        });
    });

    describe("addUser", () => {
        it("should add a user with hashed password", async () => {
            const userToAdd = {
                username: "JohnDoe",
                email: "john.doe@example.com",
                name: "John Doe",
                password: "testpassword",
            };

            const result = await mut.addUser(userToAdd);

            expect(result).not.toBeNull();
            expect(result.username).toBe("JohnDoe");

            const storedUser = await User.findOne({ username: "JohnDoe" });
            expect(storedUser).not.toBeNull();
            expect(
                bcrypt.compareSync("testpassword", storedUser.password)
            ).toBe(true);
        });

        it("should handle errors and return 500", async () => {
            const userToAdd = {
                // missing 'password' property
                username: "JohnDoe",
                email: "john.doe@example.com",
                name: "John Doe",
            };

            const result = await mut.addUser(userToAdd);

            expect(result).toBe(500);
        });
    });

    describe("addTask", () => {
        let testUser;

        beforeAll(async () => {
            testUser = {
                username: "TestUser",
                email: "testuser@example.com",
                name: "Test User",
                password: "password",
                tasks: [],
            };
            await User.create(testUser);
            await Task.deleteMany({});
        });

        afterAll(async () => {
            await User.deleteOne({ username: testUser.username });
        });

        afterEach(async () => {
            await Task.deleteMany({});
        });

        it("should add a task to a user", async () => {
            const newTask = await Task.create({
                task: "Test Task 26543",
                dueDate: "2023-12-31",
                weight: 5,
                groupId: new mongoose.Types.ObjectId(),
            });

            await mut.addTask(testUser.username, newTask);

            const updatedUser = await User.findOne({
                username: testUser.username,
            });

            const addedTask = updatedUser.tasks.find(
                (task) => task.task === newTask.task
            );
            expect(addedTask).not.toBeNull();
        });
    });

    describe("removeTask", () => {
        let testUser;
        let testTaskId;

        beforeAll(async () => {
            // Create a test user without tasks initially
            testUser = {
                username: "TestUser",
                email: "testuser@example.com",
                name: "Test User",
                password: "password",
            };
            const createdUser = await User.create(testUser);

            // Add a task to the user
            const createdTask = await Task.create({
                task: "Test Task",
                dueDate: "2023-12-31",
                weight: 5,
                assignee: createdUser.username,
                groupId: new mongoose.Types.ObjectId(),
            });
            testTaskId = createdTask._id;

            await User.findOneAndUpdate(
                { username: testUser.username },
                { $push: { tasks: createdTask._id } }
            );
        });

        it("should remove a task from a user", async () => {
            // Call the removeTask function
            await mut.removeTask(testUser.username, testTaskId);

            // Retrieve the updated user
            const updatedUser = await User.findOne({
                username: testUser.username,
            });

            // Check if the task has been removed
            const removedTask = updatedUser.tasks.find(
                (task) => task.toString() === testTaskId.toString()
            );
            expect(removedTask).toBeUndefined();
        });

        afterAll(async () => {
            // Clean up: remove the test user and task
            await User.deleteOne({ username: testUser.username });
            await Task.deleteOne({ _id: testTaskId });
        });
    });

    describe("deleteUser", () => {
        let testUserId;

        beforeAll(async () => {
            // Create a test user
            const testUser = {
                username: "ToDelete",
                email: "todelete@example.com",
                name: "To Delete",
                password: "password",
            };
            const createdUser = await User.create(testUser);
            testUserId = createdUser._id;
        });

        it("should delete a user", async () => {
            // Call the deleteUser function
            await mut.deleteUser(testUserId);

            // Attempt to find the deleted user
            const deletedUser = await User.findById(testUserId);

            // Expect the deleted user to be null
            expect(deletedUser).toBeNull();
        });

        it("should handle errors and return undefined for non-existent user", async () => {
            // Attempt to delete a non-existent user
            const result = await mut.deleteUser("nonexistentid");

            // Expect the result to be undefined
            expect(result).toBeUndefined();
        });

        afterAll(async () => {
            // Clean up: remove the test user (if not already deleted)
            await User.findByIdAndDelete(testUserId).exec();
        });
    });

    describe("User Authentication", () => {
        beforeAll(async () => {
            await mongoose.disconnect();
            await mongoose.connect(
                "mongodb://localhost:27017/test-user-database",
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                }
            );
        });

        afterAll(async () => {
            await mongoose.disconnect();
        });

        afterEach(async () => {
            await User.deleteMany({});
        });

        it("should hash the password during user registration", async () => {
            const testUser = await User.create({
                username: "JohnDoe",
                email: "john.doe@example.com",
                name: "John Doe",
                password: "securepassword",
            });

            // Retrieve the user from the database to check the hashed password
            const savedUser = await User.findOne({ username: "JohnDoe" });

            expect(savedUser).toBeDefined();
            expect(savedUser.password).not.toEqual("securepassword");
            expect(
                bcrypt.compareSync("securepassword", savedUser.password)
            ).toBe(true);
        });

        it("should compare passwords correctly during login", async () => {
            const testUser = await User.create({
                username: "JohnDoe",
                email: "john.doe@example.com",
                name: "John Doe",
                password: "securepassword",
            });

            // Compare the correct password
            testUser.comparePassword("securepassword", (err, isMatch) => {
                expect(err).toBeNull();
                expect(isMatch).toBe(true);
            });

            // Compare an incorrect password
            testUser.comparePassword("wrongpassword", (err, isMatch) => {
                expect(err).toBeNull();
                expect(isMatch).toBe(false);
            });
        });

        it("should not rehash the password if it has not been modified", async () => {
            const testUser = await User.create({
                username: "JohnDoe",
                email: "john.doe@example.com",
                name: "John Doe",
                password: "securepassword",
            });

            // Save the user without modifying the password
            await testUser.save();

            // Retrieve the user from the database to check the password remains unchanged
            const unchangedUser = await User.findOne({ username: "JohnDoe" });

            expect(unchangedUser).toBeDefined();
            expect(unchangedUser.password).toEqual(testUser.password);
        });
    });
});
