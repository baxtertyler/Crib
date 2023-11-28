import React, {useEffect, useState} from 'react';
import "./backlog.css";
import { useNavigate } from 'react-router-dom';

export const Backlog = (props) => {

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

    async function getTasks() {
        let promise;
        try {
            fetch(`${connection_URL}/backlog`, {
                method: 'GET',
            })
            .then((response) => {
                promise = response;
            })
        } catch (error){
            console.error('Error:', error);
        }
        return promise;
    }

    useEffect(() => {
        checkLogin();
    }, []);

    
    function drawIt(){
        if(isLoggedIn){
            const tasks = getTasks();
            return (
                <div>

                </div>
            );
        }
    }

    return drawIt();
};

 
export default Backlog;
