import React, {useState} from 'react';

function Form(props) {
  const [chore, setChore] = useState(
     {
        task: "",
        dueDate: "",
        assignee: "",
        weight: ""
     }
  );

  function submitForm() {
    props.handleSubmit(chore);
    setChore({task: '', dueDate: '', assignee: '', weight: ''});

        if (props.handleSubmit) {
            props.handleSubmit(chore);
        }

        setChore({ task: '', dueDate: '', assignee: '', weight: ''});
    }
  
  
    function handleChange(event) {
        const { name, value } = event.target;
        if (name === "date")
          setChore(
             {task: chore['task'], dueDate: value, assignee: chore['assignee'], weight: chore['weight']}
          );
        else if (name === "task")
           setChore(
             {task: value, dueDate: chore['dueDate'], assignee: chore['assignee'], weight: chore['weight']}   
           );
        else if (name === "weight")
            setChore(
              {task: chore['task'], dueDate: chore['dueDate'], assignee: chore['assignee'], weight: value}
            );
        else if (name === "assignee")
            setChore(
              {task: chore['task'], dueDate: chore['dueDate'], assignee: value, weight: chore['weight']}
            )
      }
    return (
        <form onSubmit={submitForm}>
            <input
                type="text"
                name="task"
                value={chore.task}
                onChange={handleChange}
                className="task-field"
            />
            <input
                type="date"
                name="date"
                value={chore.dueDate}
                onChange={handleChange}
                className="duedate-field"
            />
            <input
                type="number"
                name="weight"
                id="weight"
                value={chore.weight}
                onChange={handleChange}
                className = "weight-field"
            />
            <input
                type="text"
                name="assignee"
                value={chore.assignee}
                onChange={handleChange}
                className = "assignee-field"
            />
            <input type="submit" className="task-submit" value="Post" />
        </form>
        
    );

}

export default Form;