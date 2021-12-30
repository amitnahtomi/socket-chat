import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

function App() {
  const [messageArr, setMessages] = useState([]);
  const [user, setUser] = useState({id: null, name: ''});
  const [usersList, setUsersList] = useState([]);
  const socketRef = useRef();
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
    socketRef.current.emit("user", {id: user.id, name: username.current.value})
  }

  useEffect(()=>{
    socketRef.current = io.connect("http://localhost:4000");
    setTimeout(()=>{
      setUser({id: socketRef.current.id, name: user.name});
     console.log(user.id);
    },80)

    socketRef.current.on("messageBack", (message) => {
      setMessages([...messageArr, message])
    });

    socketRef.current.on("userUpdate", (updatedUsersList)=>{
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
                return <li>{user.name}</li>
              })}
            </ul>
            <div>----------------</div>
            <ul>
        {messageArr.map((message)=>{
          return <li>{message.name}: {message.message}</li>
        })}
      </ul>
      <input ref={messageInput} type={'text'} placeholder="your message"></input>
      <button onClick={()=>{socketRef.current.emit("message", { name: user.name, message: messageInput.current.value });}}></button>
          </div>
        }/>
      
      </Routes></div></Router>
  );
}

export default App;
