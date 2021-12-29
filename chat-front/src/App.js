import { useDispatch, useSelector } from "react-redux";
import { addItem } from "./action";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
//import { getMassage, setUser } from "./action";

function App() {
  //const messages = useSelector(state=>state.messages);
  //const user = useSelector(state=>state.user);
  //const dispatch = useDispatch();
  const [messageArr, setMessages] = useState([]);
  const [user, setUser] = useState('');
  const socketRef = useRef();
  const messageInput = useRef(null);
  const username = useRef(null);

  const checkUsername = (e) => {
    if(username.current.value === ''){
       e.preventDefault();
    }
    return;
  };

  useEffect(()=>{
    socketRef.current = io.connect("http://localhost:4000");

    socketRef.current.on("messageBack", (message) => {
     // dispatch(getMassage({name: message.name , message: message.message}))
      setMessages([...messageArr, message])
    })
  })
  return (
    <Router>
    <div>
      <Routes>
        <Route path='/' element={
          <div>
            <input type={'text'} placeholder="user name" ref={username}></input>
            <button onClick={()=>{setUser(username.current.value)}}><Link onClick={checkUsername} to={'/chat'}>log in</Link></button>
          </div>
        }/>

        <Route path={'/chat'} element={
          <div>
            <ul>
        {messageArr.map((message)=>{
          return <li>{message.name}: {message.message}</li>
        })}
      </ul>
      <input ref={messageInput} type={'text'} placeholder="your message"></input>
      <button onClick={()=>{socketRef.current.emit("message", { name: user, message: messageInput.current.value });}}></button>
          </div>
        }/>
      
      </Routes></div></Router>
  );
}

export default App;
