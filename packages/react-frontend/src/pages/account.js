import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
 
const Account = () => {
    const connection_URL = "http://localhost:8000"
    const[isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() =>{
        checkLogin();
    });

    async function checkLogin(){
        fetch(`${connection_URL}/isLoggedIn`, {
            method: 'GET',
            credentials: 'include',
        })
        .then((response) => {
            if(response.status === 200){
                setIsLoggedIn(true);
            }
        });
    }

    async function logout(){
        const promise = fetch(`${connection_URL}/logout`, {
            method: 'GET',
            credentials: 'include',
        }).then(setIsLoggedIn(false));
        return promise;
    }
    

    return (
        <div className="container">
            {isLoggedIn ? <h1>Account</h1> : <h1>
                Welcome to Crib! Please login or signup!
            </h1>}
            <nav className="col">
                <ul class='nav'>
                {isLoggedIn ? <li><button onClick={logout}>Log Out</button></li> : <div><Link to='/account/login'><li>Login</li></Link> 
                <Link to='/account/signup'><li>Signup</li></Link> </div> }
                </ul>
            </nav>
        </div>
    );
};
 
export default Account;