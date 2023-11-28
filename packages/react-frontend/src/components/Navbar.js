import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import "./navbar.css";
import HomeIcon from "./homebutton.svg";
import PostIcon from "./postbutton.svg";
import ProfileIcon from "./profilebutton.svg";

const Navbar = () => {
    const location = useLocation();

    const checkActive = (path) => {
        return location.pathname === path ? 'active-button' : '';
    };

    const includedPaths = ['/post', '/', '/home', '/account'];

    if (!includedPaths.includes(location.pathname)) {
        return null; 
    }

    return (
        <div className="box">
            <div className="group">
                <div className={`post-button ${checkActive('/post')}`}>
                    <NavLink to="/post">
                        <img src={PostIcon} alt="Post" />
                    </NavLink>
                </div>

                <div className={`home-button ${checkActive('/home')}`}>
                    <NavLink to="/home">
                        <img src={HomeIcon} alt="Home" />
                    </NavLink>
                </div>

                <div className={`profile-button ${checkActive('/account')}`}>
                    <NavLink to="/account">
                        <img src={ProfileIcon} alt="Profile" />
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
