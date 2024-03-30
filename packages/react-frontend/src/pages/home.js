import React, { useState, useEffect } from 'react';
import "./home.css";
import { useNavigate } from 'react-router-dom';

function Home() {
  const [tasks, setTasks] = useState([]);
  const [polls, setPolls] = useState([]);
  const[group, setGroupInfo] = useState([]);
  const[members, setMembers] = useState([]);



  const [votedPolls, setVotedPolls] = useState([]);
  const navigate = useNavigate();

  // const connection_URL = "https://crib-app.azurewebsites.net";
  const connection_URL = "http://localhost:8000"

    async function checkLogin(){
        fetch(`${connection_URL}/isLoggedIn`, {
            method: 'GET',
            credentials: 'include',
        })
        .then((response) => {
            if(response.status !== 200){
                navigate('/account/');
            }
        });
        
    }

    useEffect(() => {
        checkLogin();
        getGroup();
        PollList();
        TaskList();
        listPolls()
          .then(res => {
            if (res.status === 401) {
              navigate('/group');
            }
            return res.json();
          })
          .then(json => setPolls(json["poll_list"]))
          .catch(error => console.log(error));
        listTasks()
          .then(res => {
            if (res.status === 401) {
              navigate('/group');
            }
            return res.json();
          })
          .then(json => setTasks(json["task_list"]))
          .catch(error => console.log(error));
      }, []);
        

function listTasks(){
    const promise = fetch(`${connection_URL}/tasks`, {
        method: 'GET',
        credentials: 'include',
    });
    return promise;
}

function listPolls(){
    const promise = fetch(`${connection_URL}/polls`, {
        method: 'GET',
        credentials: 'include',
    });
    return promise;
}

//   function completeTask(taskId) {
//     deleteTaskFromBackend(taskId)
//       .then(() => {
//         //keep all tasks that don't match task id
//         const updatedTasks = tasks.filter(task => task._id !== taskId);
//         setTasks(updatedTasks);
//       })
//       .catch(error => console.error('Error deleting task:', error));
//   }

    function completePoll(pollId) {
    deletePollFromBackend(pollId)
      .then(() => {
        //keep all tasks that don't match task id
        const updatedPolls = polls.filter(poll => poll._id !== pollId);
        setPolls(updatedPolls);
      })
      .catch(error => console.error('Error deleting poll:', error));
  }
  
  function claimTask(taskId) {
    fetch(`${connection_URL}/tasks/${taskId}`, {
        method: 'POST',
        credentials: 'include',
      }).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          console.log(`Task with ID ${taskId} deleted successfully`);
      });
  }

  function removePoll(pollId) {
    deletePollFromBackend(pollId)
      .then(() => {
        //keep all polls that don't match polls id
        const updatedPolls = polls.filter(poll => poll._id !== pollId);
        setPolls(updatedPolls);
      })
      .catch(error => console.error('Error deleting poll:', error));
  }
  async function completeTaskInBackend(username, taskId){
    const response = await fetch(`${connection_URL}/task/`,{
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, id: taskId }),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }else{
        if(response.status === 202){
            const index = tasks.findIndex((task) => task._id === taskId);
            console.log(index)
            if (index > -1) {
              const updatedTasks = [...tasks.slice(0, index), ...tasks.slice(index + 1)];
              setTasks(updatedTasks);
            }
        }
    }
    console.log(`Task with ID ${taskId} completed successfully`);
  }
  
  async function  deleteTaskFromBackend(taskId) {
    const response = await fetch(`${connection_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    console.log(`Task with ID ${taskId} deleted successfully`);
  }

  async function deletePollFromBackend(pollId) {
    const response = await fetch(`${connection_URL}/polls/${pollId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    console.log(`Poll with ID ${pollId} deleted successfully`);
  }
  
  async function voteForOption(pollId, option) {

    if (votedPolls.indexOf(pollId) !== -1) {
        // User has already voted for this poll
        console.log(`User already voted for poll with ID ${pollId}`);
        return;
    }

    await fetch(`${connection_URL}/polls/${pollId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ option }),
    }).then((response) => {
        if(response.status === 400){

        }
    });

    setVotedPolls((prevVotedPolls) => [...prevVotedPolls, pollId]);

    setPolls((prevPolls) => {
      const updatedPolls = prevPolls.map((poll) => {
        if (poll._id === pollId) {
          
          // Update the optionVotes based on the voted option
          return {
            
            ...poll,
            option1Votes: option === 'option1' ? poll.option1Votes + 1 : poll.option1Votes,
            option2Votes: option === 'option2' ? poll.option2Votes + 1 : poll.option2Votes,
            whoVoted: ["true"]
          };
        }
        
        
        return poll;
      });
      return updatedPolls;
    });
    console.log(`Vote for ${option} in poll with ID ${pollId} recorded successfully`);
  }

async function getGroup(){
  fetch(`${connection_URL}/groupInfo`, {
      method: 'GET',
      credentials: 'include',
  })
  .then((response) => {
      if(response.status === 200){
          
          response.json().then((data) =>{
              setGroupInfo(data);
              setMembers(data.members);
          })
      }else{
          // setIsLoggedIn(false);
      }
  });
}


  // merged tasklist component
  function TaskList() {
    const sortedTasks = tasks.slice().sort((a, b) => b.weight - a.weight);
    const boxes = sortedTasks
    .map((box) => {
      return (
        <div className='chore-box' key = {box._id} >
          <div className='chore-name'>TASK: {box.task}</div>
          <div className='chore-date'>DEADLINE: {box.dueDate}</div>
          <div className = 'chore-assignee'> ASSIGNED TO: {box.assignee}</div>
          <div className='button-container'>
            <div className='claim-button'>
              <button onClick={() => claimTask(box._id)}>
                Claim
              </button>
            </div>
            <div className='complete-button'>
              <button onClick={() => completeTaskInBackend(box.assignee, box._id)}>
                Complete
              </button>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div>
        {boxes}
      </div>
    );
  }

    // merged polllist component
    function PollList() {
      
      const boxes = polls.map((box) => {
        // console.log("Group Size: ", getGroupSize())
        return (
          <div className='chore-box' key = {box._id} >
            <div className='poll-title'>POLL: {box.title}</div>
            {/* <div className='chore-id'>{box._id}</div> */}
            {box.whoVoted[0] === "false" && (
            <div className='button-container'>
                {votedPolls.indexOf(box._id) !== -1 && (<p>Already voted</p>)}
              <div className='poll-option1'>
              <button onClick={() => voteForOption(box._id, 'option1')}
              disabled={votedPolls.indexOf(box._id) !== -1}>
                  {box.option1}
                </button>
              </div>
              <div className='poll-option2'>
                <button onClick={() => voteForOption(box._id, 'option2')}
                disabled={votedPolls.indexOf(box._id) !== -1}>
                  {box.option2}
                </button>
              </div>
            </div>)}
            {box.whoVoted[0] === "true" && box.option1Votes + box.option2Votes !== members.length &&
            <div className='vote-recorded'>
              <p>Vote Recorded!</p>
              <div className='button-container'>
                <div className='poll-option1'>
                {box.option1}<br></br>
                {box.option1Votes}
                </div>
                <div className='poll-option2'>
                {box.option2}<br></br>
                {box.option2Votes}
                </div>
              </div>
            </div>
            }
            {box.option1Votes + box.option2Votes === members.length &&
            <div className='poll-complete'>
              <div>
              </div>
              {box.option1Votes > box.option2Votes && <div>Winner: {box.option1}</div>}
              {box.option2Votes > box.option1Votes && <div>Winner: {box.option2}</div>}
              {box.option1Votes === box.option2Votes && <div>Tie! <br/>{box.option1} & {box.option2}</div>}
            </div>
            }
            <div className='poll-delete'>
              <button onClick={() => completePoll(box._id)}>
                Delete Poll
              </button>
            </div>
          </div>
        );
      });
    return (
      <div>
        {boxes}
      </div>
    );
    }
  
  
    function Stack(props) {
        return (
            <div className='scroll-container'>
                <div className='box-container'>
                    <PollList 
                      pollData={polls}
                      removePoll={removePoll}
                      completePoll={completePoll}
                    />
                    
                    <TaskList 
                        taskData={tasks} 
                        claimTask={claimTask} 
                        completeTask={completeTaskInBackend}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="home-page">
            <div className="div">
                <div className="overlap">
                    <div className="group">
                        <img className="logo-group" alt="Logo group" src="logo-group.png" />
                    </div>
                </div>
                <div className="rectangle-tasks">
                    <Stack 
                        pollData={polls}
                        removePoll={removePoll}
                        completePoll={completePoll}
                        taskData={tasks} 
                        claimTask={claimTask} 
                        completeTask={completeTaskInBackend} 
                    />
                </div>
                <div className="overlap-group-wrapper">
                    <div className="div-wrapper">
                      <div className="text-wrapper" onClick={() => navigate('/history')}>HISTORY</div>
                    </div>
                </div>
                <div className="home-text">HOME</div>
            </div>
        </div>
    );
}

export default Home;