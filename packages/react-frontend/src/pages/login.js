import React, { useEffect, useState } from "react";
import UserForm from "../components/UserForm";
import "./login.css";
import Logo from "../logo-group.png"
import Arrow from "./arrow.svg"
import { useNavigate } from 'react-router-dom';
 
const Login = () => {

    const connection_URL = "http://localhost:8000"
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });


    function handleChange(e) {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
    };

    async function handleSubmit(e){
        e.preventDefault();
        setFormData({email: '', password:''});
        fetch(`${connection_URL}/login`, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            credentials: 'include'
        })
        .then((response) => {
            if (response.status === 200) {
                console.log('User logged in');
                navigate('/');
                return response.json();
            } else if (response.status === 500) {
                console.log('Could not login');
                throw new Error('Could not login');
            } else {
                throw new Error('Login not successful');
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }
    
    return (
        <div className="login">
            <form >
                <div className="overlap">
                    <div className="overlap-group">
                        <div className="rectangle" />
                        <div className="group">
                            <img className="logo-group" alt="Logo group" src={Logo}/>
                        </div>
                    </div>
                    <div className="text-wrapper">SIGN IN</div>
                </div>

                <div className="email-region">
                    <div className="text-wrapper-3">ENTER EMAIL</div>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="email-field"
                    />
                </div>

                <div className="password-region">
                    <div className="rectangle" />
                    <div className="text-wrapper-2">ENTER PASSWORD</div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="password-field"
                        />
                    <p className="p">dont have an account? sign up here!</p>
                    <button type="submit" className="ellipse" onClick={handleSubmit}>
                        <img className="vector" alt="Vector" src={Arrow} />
                    </button>
                </div>
            </form>
        </div>
  );
};

export default Login;