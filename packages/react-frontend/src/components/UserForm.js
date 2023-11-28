import React, {useState} from 'react';
function UserForm(props) {
  const [user, setUser] = useState(
     {
        username: "",
        password: "",
        email: ""
     }
  );

  function submitForm() {
    props.handleSubmit(user);
    setUser({username: '', password: '', email: ''});
  }

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "password")
      setUser(
         {username: user['username'], password: value, email: user['email']}
      );
    else if (name === "username")    
       setUser(
         {username: value, password: user['password'], email: user['email']}   
       );
    else if (name === "email")
        setUser(
            {username: user['username'], password: user['password'], email: value}
        );
  }

  return (
        <form>
        <input
            type="text"
            name="username"
            id="username"
            value={user.username}
            onChange={handleChange} 
            className = "username-field"
            />
        <input
            type="text"
            name="password"
            id="password"
            value={user.password}
            onChange={handleChange} 
            className = "password-field"
            />
        <input
            type="text"
            name="email"
            id="email"
            value={user.email}
            onChange={handleChange} 
            className = "email-field"
            />
        <button type="button" className="arrowbutton" onClick={submitForm}></button>
        </form>
    );

}

export default UserForm;
