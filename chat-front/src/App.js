import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const connection = io("http://localhost:4000")

function App() {
  const [messageArr, setMessages] = useState([]);
  const [user, setUser] = useState({id: connection.id, name: ''});
  const [usersList, setUsersList] = useState([]);
  const [msgDes, setMsgDes] = useState({name: 'everyone', id: ''});
  const messageInput = useRef(null);
  const username = useRef(null);

  const checkUsername = (e) => {
    if(username.current.value === ''){
       e.preventDefault();
    }
    return;
  };

  const setUserInfo = () => {
    setUser({id: user.id, name: username.current.value});
    connection.emit("user", {id: connection.id, name: username.current.value})
  }

  const sendMsg =()=>{
    connection.emit("message", { name: user.name, message: messageInput.current.value, sendTo: msgDes, time: new Date().toLocaleString().slice(11, 17) });
    if(msgDes.name !== 'everyone') {
      setMessages([...messageArr, { name: user.name, message: messageInput.current.value, sendTo: msgDes, time: new Date().toLocaleString().slice(10, 16) }])
    }
    messageInput.current.value = '';
  }

  connection.on("messageBack", (message) => {
    setMessages([...messageArr, message])
  });

  connection.on("userUpdate", (updatedUsersList)=>{
    setUsersList(updatedUsersList);
  })

  /*useEffect(()=>{
    
    connection.on("messageBack", (message) => {
      setMessages([...messageArr, message])
    });

    connection.on("userUpdate", (updatedUsersList)=>{
      setUsersList(updatedUsersList);
    })

  },[messageArr ,usersList])
*/  return (
    <Router>
    <div>
      <Routes>
        <Route path='/' element={
          <div style={logStyle}>
            <input style={inputStyle} type={'text'} placeholder="user name" ref={username}></input>
            <button style={buttonStyle} onClick={setUserInfo}><Link style={linkStyle} onClick={checkUsername} to={'/chat'}>log in</Link></button>
          </div>
        }/>

        <Route path={'/chat'} element={
          <div style={chatStyle}>
            <ul style={msgListStyle}>
        {messageArr.map((message)=>{
          return <li style={msgStyle}><span style={senderStyle}>{message.name}:</span><br /><span>{message.message}</span><label style={timeStyle}>{message.time}</label></li>
        })}
      </ul>
            <ul style={usersListStyle}>
              {usersList.map((user)=>{
                return <li style={{cursor: 'pointer'}} onClick={()=>{setMsgDes({name: user.name, id: user.id})}} key={user.id}>{user.name}</li>
              })}
            </ul>
      <input style={inputStyle} ref={messageInput} type={'text'} placeholder="your message"></input>
      <button style={buttonStyle} onClick={sendMsg}>send</button>
      <div style={{fontSize: '30px'}}>send to: {msgDes.name}</div>
      <button style={buttonStyle} onClick={()=>{setMsgDes({name: 'everyone', id: msgDes.id})}}>to everyone</button>
          </div>
        }/>
      
      </Routes></div></Router>
  );
}

const msgListStyle = {
  listStyleType: "none",
  fontSize: "20px",
  width: "700px",
  height: "330px",
  display: "inline-block",
  overflow: "hidden",
  overflowY:"scroll",
  overflowAnchor: "none",
  marginRight: "90px",
}

const msgStyle = {
  border: "2px solid blue",
  borderRadius: "10px",
  width: "450px",
  padding: "5px",
  marginTop: "10px",
  textAlign: "left",
  overflow: "auto",
  backgroundColor: "white"
}

const senderStyle = {
  color: "blue",
  fontSize: "25px"
}

const timeStyle = {
  color: "darkgrey",
  fontSize: "8px"
}

const linkStyle = {
  textDecoration: "none",
  color: "blue"
}

const chatStyle = {
  textAlign: "center",    
  fontSize: "45px",
  color: "LightSkyBlue",
  overflowAnchor: "none"
}

const inputStyle = {
  height: "30px",
  width: "350px",
  border: "6px outset LightGray",
  borderRadius: "100px",
  fontSize: "25px",
  marginRight: "25px",
  color: "MediumSlateBlue"
}

const buttonStyle = {
  height: "35px",
  width: "100px",
  border: "3px groove LightSkyBlue",
  backgroundColor: "LightSkyBlue",
  borderRadius: "10px",
  fontSize: "15px",
  color: "blue",
  cursor: "pointer",
  marginRight: "25px"
}

const usersListStyle = {
  width: "100px",
  color: "green",
  border: "5px solid green",
  height: "330px",
  marginLeft: "30px",
  display: "inline-block",
  overflow: "hidden",
  overflowY:"scroll",
  fontSize: "30px"
}

//////


const logStyle = {
  textAlign: "center",
  paddingTop: "50px",
  fontSize: "45px",
  color: "LightSkyBlue"
}

export default App;
