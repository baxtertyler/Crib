import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GroupCodeForm from "../components/GroupCodeForm";
import GroupNameForm from "../components/GroupNameForm.js";
import { useNavigate } from 'react-router-dom';
import "./group.css";


const Group = () => {
  const connection_URL = "http://localhost:8000";
  const navigate = useNavigate();
  const[isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() =>{
    checkLogin();
  }, []);

  async function checkLogin(){
    fetch(`${connection_URL}/isLoggedIn`, {
        method: 'GET',
        credentials: 'include',
    })
    .then((response) => {
        if(response.status === 200){
            setIsLoggedIn(true);
        }else{
            navigate('/account/');
        }
    });
}

  async function handleGroupCodeSubmit(groupCode) {
    try {

      fetch(`${connection_URL}/join-group`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: groupCode,
        }),
      }).then((response) =>{
        if(response.status === 201){
            navigate('/home');
        }
      }).catch((error) => {
        console.error(error);
      });
    } 
    catch (error) {
      console.error("Error joining group:", error);
    }
  }

function handleGroupNameSubmit(groupName) {
      fetch(`${connection_URL}/group`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: groupName,
        }),
      }).then((e) => {
        console.log("wait");
        if (e.status === 201) {
            console.log("Group created");
            navigate('/home');
          } 
          else {
            const errorMessage = e.text();
            console.error(`Error creating group: ${errorMessage}`);
          }
      });

  }


  return (
      <div className="join-household">
          <div className="group-wrapper">
              <div className="group">
                  <div className="create-household">
                      <div className="create-text">CREATE A HOUSEHOLD</div>
                      <div className="div">NEW HOUSEHOLD NAME</div>
                      <GroupNameForm handleSubmit={handleGroupNameSubmit} />  
                  </div>
                  <div className="div-3">
                      <div className="join-text">JOIN A HOUSEHOLD</div>
                      <div className="code-text">HOUSEHOLD CODE</div>
                      <GroupCodeForm handleSubmit={handleGroupCodeSubmit} />
                  </div>
              </div>
          </div>
      </div>
  );
};

  

export default Group;
