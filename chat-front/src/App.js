import { useDispatch, useSelector } from "react-redux";
import { addItem } from "./action";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { useEffect, useRef } from "react";
import io from "socket.io-client";
import { getMassage } from "./action";

function App() {
  const messages = useSelector(state=>state.messages);
  const user = useSelector(state=>state.user);
  const dispatch = useDispatch();
  const socketRef = useRef();
  const messageInput = useRef(null);

  const onMessageSubmit = (e) => {
    e.preventDefault();
    
  };

  useEffect(()=>{
    socketRef.current = io.connect("http://localhost:4000");

    socketRef.current.on("messageBack", ({ name, message }) => {
      dispatch(getMassage({name, message}))
    })
  })
  return (
    <div>
      <ul>
        {messages.map((message)=>{
          return <li>{message.name}: {message.message}</li>
        })}
      </ul>
      <input ref={messageInput} type={'text'} placeholder="your message"></input>
      <button onClick={()=>{socketRef.current.emit("message", { name: user, message: messageInput.current.value });}}></button>
    </div>
  );
}

export default App;
