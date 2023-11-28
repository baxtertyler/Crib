import React, { useState, useEffect } from 'react';
import "./home.css";
import { useNavigate } from 'react-router-dom';

function Home() {
  const [tasks, setTasks] = useState([]);
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

//   const connection_URL = "https://crib-app.azurewebsites.net";
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
    listTasks()
      .then(res => res.json())
      .then(json => setTasks(json["task_list"]))
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    listPolls()
      .then(res => res.json())
      .then(json => setPolls(json["poll_list"]))
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

  function completeTask(taskId) {
    deleteTaskFromBackend(taskId)
      .then(() => {
        //keep all tasks that don't match task id
        const updatedTasks = tasks.filter(task => task._id !== taskId);
        setTasks(updatedTasks);
      })
      .catch(error => console.error('Error deleting task:', error));
  }

    function completePoll(pollId) {
    deletePollFromBackend(pollId)
      .then(() => {
        //keep all tasks that don't match task id
        const updatedPolls = polls.filter(poll => poll._id !== pollId);
        setPolls(updatedPolls);
      })
      .catch(error => console.error('Error deleting poll:', error));
  }
  
  function removeTask(taskId) {
    deleteTaskFromBackend(taskId)
      .then(() => {
        //keep all tasks that don't match task id
        const updatedTasks = tasks.filter(task => task._id !== taskId);
        setTasks(updatedTasks);
      })
      .catch(error => console.error('Error deleting task:', error));
  }

  function removePoll(pollId) {
    deleteTaskFromBackend(pollId)
      .then(() => {
        //keep all polls that don't match polls id
        const updatedPolls = polls.filter(poll => poll._id !== pollId);
        setPolls(updatedPolls);
      })
      .catch(error => console.error('Error deleting poll:', error));
  }
  
  async function deleteTaskFromBackend(taskId) {
    const response = await fetch(`${connection_URL}/tasks/${taskId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    console.log(`Task with ID ${taskId} deleted successfully`);
  }

  async function deletePollFromBackend(pollId) {
    const response = await fetch(`${connection_URL}/polls/${pollId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    console.log(`Poll with ID ${pollId} deleted successfully`);
  }

  async function voteForOption(pollId, option) {
    const response = await fetch(`${connection_URL}/polls/${pollId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ option }),
    });
    if (!response.ok) {
      throw new Error('Error recording vote');
    }

    setPolls((prevPolls) => {
      const updatedPolls = prevPolls.map((poll) => {
        if (poll._id === pollId) {
          // Update the optionVotes based on the voted option
          return {
            ...poll,
            option1Votes: option === 'option1' ? poll.option1Votes + 1 : poll.option1Votes,
            option2Votes: option === 'option2' ? poll.option2Votes + 1 : poll.option2Votes,
          };
        }
        return poll;
      });
      return updatedPolls;
    });

    console.log(`Vote for ${option} in poll with ID ${pollId} recorded successfully`);
  }
  
  
    // merged tasklisthead component
    function TaskListHead() {
        return (
            <thead>
                <tr>
                    <th>LIST OF CHORES:</th>
                </tr>
            </thead>
        );
    }

  // merged tasklist component
  function TaskList() {
    const boxes = tasks.map((box) => {
      return (
        <div className='chore-box' key = {box._id} >
          <div className='chore-name'>TASK: {box.task}</div>
          <div className='chore-date'>DEADLINE: {box.dueDate}</div>
          <div className = 'chore-assignee'> ASSIGNED TO: {box.assignee}</div>
          <div className='button-container'>
            <div className='claim-button'>
              <button onClick={() => removeTask(box._id)}>
                Claim
              </button>
            </div>
            <div className='complete-button'>
              <button onClick={() => completeTask(box._id)}>
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
      return (
        <div className='poll-box' key = {box._id} >
          <div className='poll-title'>POLL: {box.title}</div>
          <div className='poll-option1'>DEADLINE: {box.option1}</div>
          
          <div className='button-container'>
            <div className='remove-button'>
              <button onClick={() => removeTask(box._id)}> 
                Remove
              </button>
            </div>
            <div className='vote-button'>
              <button onClick={() => completeTask(box._id)}>
          {/* onClick NEEDS TO CHANGE TO TRACK VOTES */}
                Vote
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
        return (
          <div className='chore-box' key = {box._id} >
            <div className='poll-title'>POLL: {box.title}</div>
            {/* <div className='chore-id'>{box._id}</div> */}
            <div className='button-container'>
              <div className='poll-option1'>
              <button onClick={() => voteForOption(box._id, 'option1')}>
                  {box.option1}<br></br>
                  {box.option1Votes}
                </button>
              </div>
              <div className='poll-option2'>
                <button onClick={() => voteForOption(box._id, 'option2')}>
                  {box.option2}<br></br>
                  {box.option2Votes}
                </button>
              </div>
            </div>
            <div className='complete-button'>
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
                        removeTask={removeTask} 
                        completeTask={completeTask}
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
                    <div className="overlap-group">
                        <img className="vector" alt="Vector" src="vector.svg" />
                    </div>
                </div>
                <div className="rectangle-tasks">
                    <Stack 
                        pollData={polls}
                        removePoll={removePoll}
                        completePoll={completePoll}
                        taskData={tasks} 
                        removeTask={removeTask} 
                        completeTask={completeTask} 
                    />
                </div>
                <div className="overlap-group-wrapper">
                    <div className="div-wrapper">
                        <div className="text-wrapper">HISTORY</div>
                    </div>
                </div>
                <div className="text-wrapper-2">HOME</div>
            </div>
        </div>
    );
}

export default Home;
