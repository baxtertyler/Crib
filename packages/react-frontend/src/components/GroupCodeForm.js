import React, {useState} from 'react';
import Arrow from "./arrow.svg";
function GroupCodeForm(props) {
  const [group, setGroup] = useState("");

  function submitGroupCodeForm(event) {
    event.preventDefault();
    props.handleSubmit(group);
  }

  function handleChange(event) {
    const { value } = event.target;
      setGroup(value);
    }


    return (
      <form> 
          <input
              type="text"
              name="groupCode"
              id="groupCode"
              value={group.groupCode}
              onChange={handleChange} 
              className="house-code-field"
          />
          <button type="submit" className="vector-arrow" onClick={submitGroupCodeForm}> 
            <img className="vector" alt="Vector" src={Arrow} />
          </button>

      </form>
  );

}

export default GroupCodeForm;