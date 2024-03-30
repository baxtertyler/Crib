import React, {useState} from 'react';
import Arrow from "./arrow.svg";

function GroupNameForm(props) {
  const [group, setGroupName] = useState("");

  function submitGroupNameForm(event) {
    event.preventDefault();
    console.log("wokring");
    props.handleSubmit(group);
  }


  function handleChange(event) {
    const { value } = event.target;
      setGroupName(value);
    }


  return (
        <form>
        <input
            type="text"
            name="groupName"
            id="groupName"
            value={group.groupName}
            onChange={handleChange} 
            className="house-name-field"
            />
            
          <button type="submit" className="vector-arrow2" onClick={submitGroupNameForm}>
            <img className="vector" alt="Vector" src={Arrow} />
          </button>
          
        </form>
    );

}

export default GroupNameForm;