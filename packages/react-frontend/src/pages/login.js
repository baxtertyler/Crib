import React, { useEffect, useState } from "react";
import UserForm from "../components/UserForm";
import "./login.css";
import Logo from "../logo-group.png"
import Arrow from "./arrow.svg"
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
 
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
        .then(async (response) => {
            if (response.status === 200) {
                console.log('User logged in');
                response.json().then((data) => {
                    if(data.isInGroup){
                        navigate('/'); 
                    }else{
                        navigate('/group')
                    }
                });
                return response.status;
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
                <div className="rectangle" />
                <div className="sign-in">
                    <div className="overlap-group">
                        
                        <div className="group">
                            <img className="logo-group" alt="Logo group" src={Logo}/>
                        </div>
                    </div>
                    <div className="welcomeback-container">
                        <div className="welcomeback-text">WELCOME</div>
                        <div className="welcomeback-text">BACK!</div>
                    </div>
                </div>

                <div className="email-region">
                    <div className="email-text">ENTER EMAIL</div>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="email-field"
                    />
                </div>
                <div className="password-region">
                    <div className="rectangle2" />
                    <div className="password-text">ENTER PASSWORD</div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="password-field"
                        />
                    <p className="link">
                        <Link to="/account/signup">don't have an account?  sign up here!</Link>
                    </p>
                    <button type="submit" className="ellipse" onClick={handleSubmit}>
                        <img className="vector" alt="Vector" src={Arrow} />
                    </button>
                </div>
            </form>
        </div>
  );
};

export default Login;