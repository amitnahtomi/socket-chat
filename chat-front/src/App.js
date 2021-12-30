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
  const [msgDes, setMsgDes] = useState('everyone');
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
    connection.emit("message", { name: user.name, message: messageInput.current.value, sendTo: msgDes });
    setMessages([...messageArr, { name: user.name, message: messageInput.current.value, sendTo: msgDes }])
    messageInput.current.value = '';
  }

  useEffect(()=>{
    
    connection.on("messageBack", (message) => {
      setMessages([...messageArr, message])
    });

    connection.on("userUpdate", (updatedUsersList)=>{
      setUsersList(updatedUsersList);
    })

  },[messageArr ,usersList])
  return (
    <Router>
    <div>
      <Routes>
        <Route path='/' element={
          <div>
            <input type={'text'} placeholder="user name" ref={username}></input>
            <button onClick={setUserInfo}><Link onClick={checkUsername} to={'/chat'}>log in</Link></button>
          </div>
        }/>

        <Route path={'/chat'} element={
          <div>
            <ul>
              {usersList.map((user)=>{
                return <li onClick={()=>{setMsgDes(user.id)}} key={user.id}>{user.name}</li>
              })}
            </ul>
            <div>----------------</div>
            <ul>
        {messageArr.map((message)=>{
          return <li>{message.name}: {message.message}</li>
        })}
      </ul>
      <input ref={messageInput} type={'text'} placeholder="your message"></input>
      <button onClick={sendMsg}>send</button>
      <div>send to: {msgDes}</div>
          </div>
        }/>
      
      </Routes></div></Router>
  );
}

export default App;
