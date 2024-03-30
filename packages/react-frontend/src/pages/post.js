import React, {useEffect, useState} from 'react';
import "./post.css";
import Form from '../components/Form'; 
import PollForm from '../components/PollForm';
import { useNavigate } from 'react-router-dom';


export const Post = (props) => {

    // const connection_URL = "https://crib-app.azurewebsites.net";
    const connection_URL = "http://localhost:8000";
    const navigate = useNavigate();

    const[isLoggedIn, setIsLoggedIn] = useState(false);

    async function checkLogin(){
        try {
        fetch(`${connection_URL}/isLoggedIn`, {
            method: 'GET',
            credentials: 'include',
        })
        .then((response) => {
            if(response.status !== 200){
                navigate('/account/');
            }else{
                setIsLoggedIn(true);
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
    }
    
    useEffect(() => {
        checkLogin();
    }, []);

    function handleTaskSubmit(task) {
        console.log(task.task)
        
        fetch(`${connection_URL}/tasks`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Task submitted:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    function handlePollSubmit(poll){
        console.log(poll.poll)
        
        fetch(`${connection_URL}/polls`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(poll),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Poll posted:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    function drawIt(){
        if(isLoggedIn){
            return (
                <div className="post-something">
                    <div className="div">
                        <div className="task-box">
                            <div className="group">
                                <div className="div-wrapper">
                                    <Form handleSubmit = {handleTaskSubmit} />
                                </div>
                            </div>
                            <div className="task-text">TASK</div>
                            <div className="due-date-text">DUE DATE</div>
                            <div className="weight-text">PRIORITY</div>
                            <div className = "assignee-text"> ASSIGNEE</div>
                        </div>
                        <div className="poll-box ">
                        <div className="group">
                                <div className="div-wrapper">
                                    <PollForm handleSubmit = {handlePollSubmit} />
                                </div>
                            </div>
                            <div className="title2-text">TITLE</div>
                            <div className="option1-text ">OPTION 1</div>
                            <div className="option2-text ">OPTION 2</div>
                        </div>
                        <div className="top-rect">
                            <div className="task-header">TASK</div>
                            <div className="rectangle-7" />
                            <div className="logo-group-wrapper">
                                <img className="logo-group" alt="Logo group" src="logo-group.png" />
                            </div>
                            <div className="overlap-group-wrapper">
                                <div className="overlap-group-2">
                                    <div className="POST-SOMETHING">
                                        POST <br />
                                        SOMETHING
                                    </div>
                                    <div className="explanationpoint">!</div>
                                </div>
                            </div>
                        </div>
                        <div className="poll-text">POLL</div>
                    </div>
                </div>
            );
        } else{
            return (
            <div> <header>how</header></div>);
        }
    }

    return drawIt();
};

 
export default Post;
