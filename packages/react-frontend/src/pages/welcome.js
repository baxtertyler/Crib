import React from "react";
import "./welcome.css";
import Logo from "../../public/logo-group.png"
 
export const Welcome = () => {
    return (
        <div className="welcome">
            <div className="div">
                <div className="overlap">
                    <div className="rectangle" />
                    <div className="ellipse" />
                    <img className="logo-group" alt={Logo} src="logo-group.png" />
                </div>
                <div className="overlap-group">
                    <div className="overlap-2">
                        <div className="rectangle-2" />
                        <div className="group">
                            <div className="overlap-group-wrapper">
                                <div className="div-wrapper">
                                    <div className="text-wrapper">LOGIN</div>
                                </div>
                            </div>
                            <div className="overlap-wrapper">
                                <div className="overlap-3">
                                    <div className="text-wrapper-2">SIGN UP</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="WELCOME-TO-CRIB">
                        WELCOME TO
                        <br />
                        CRIB
                    </div>
                </div>
            </div>
        </div>
    );
};
