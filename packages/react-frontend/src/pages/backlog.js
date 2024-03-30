import React, { useEffect, useState } from "react";
import "./backlog.css";
import { useNavigate } from "react-router-dom";

const Backlog = (props) => {
    const connection_URL = "http://localhost:8000";
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [tasks, setTasks] = useState([]);

    async function checkLogin() {
        try {
            const response = await fetch(`${connection_URL}/isLoggedIn`, {
                method: "GET",
                credentials: "include",
            });
            if (response.status !== 200) {
                navigate("/account/");
            } else {
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function getTasks() {
        try {
            const response = await fetch(`${connection_URL}/backlog`, {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        checkLogin();
        getTasks()
            .then((json) => setTasks(json["backlog"]))
            .catch((error) => console.log(error));
    }, []);

    function TaskList() {
        const boxes = tasks.map((box) => {
            return (
                <div className="chore-box" key={box._id}>
                    <div className="chore-name">TASK: {box.task}</div>
                    <div className="chore-name">
                        COMPLETOR: {box.completedBy}
                    </div>
                    <div className="chore-date">
                        DATE COMPLETED: {box.completionDate}
                    </div>
                </div>
            );
        });
        return <div>{boxes}</div>;
    }

    function drawIt() {
        if (isLoggedIn) {
            return (
                <div className="backlog-page">
                    <div className="div">
                        <div className="overlap">
                            <div className="group">
                                <img
                                    className="logo-group"
                                    alt="Logo group"
                                    src="logo-group.png"
                                />
                            </div>
                        </div>
                        <div className="rectangle-tasks">
                            <div className="box-container">
                                <TaskList taskData={tasks} />
                            </div>
                        </div>
                        <div className="overlap-group-wrapper">
                            <div className="div-wrapper">
                                <div
                                    className="text-wrapper"
                                    onClick={() => navigate("/home")}
                                >
                                    RETURN
                                </div>
                            </div>
                        </div>
                        <div className="text-wrapper-2">TASK LOG</div>
                    </div>
                </div>
            );
        }
        return null;
    }

    return drawIt();
};

export default Backlog;
