import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Account from "./pages/account";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Post from "./pages/post";
import Backlog from "./pages/backlog";
import Group from "./pages/group";

function MyApp() {
    // State to hold tasks
    const [tasks, setTasks] = useState([]);

    // Function to handle task submission from Post component
    const handlePostSubmit = (newTask) => {
        setTasks([...tasks, newTask]);
    };

    return (
        <Router>
            <Navbar />
            <Routes>
                {/* pass tasks state and handlePostSubmit to relevant components */}
                {/* <Route path="/" element={<Home tasks={tasks} setTasks={setTasks} />} /> */}
                <Route path="/" element={<Navigate to="/home" />} />
                <Route
                    path="/post"
                    element={<Post handleSubmit={handlePostSubmit} />}
                />
                <Route path="/home" element={<Home tasks={tasks} />} />
                <Route path="/group" element={<Group />} />
                <Route path="/account" element={<Account />} />
                <Route path="/account/signup" element={<Signup />} />
                <Route path="/account/login" element={<Login />} />
                <Route path="/history" element={<Backlog />} />
            </Routes>
        </Router>
    );
}

export default MyApp;
