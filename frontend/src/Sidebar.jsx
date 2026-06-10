import "./Sidebar.css";
import {useContext} from "react";
import {MyContext} from "./MyContext.jsx";
import { useEffect } from "react";
import {v4 as uuidv4} from "uuid";

function Sidebar() {
  const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);

  const getAllThreads = async ()=>{

    try{
      const response = await fetch("http://localhost:8080/api/thread");
      const res = await response.json();
      const filteredData = res.map(thread => ({threadId : thread.threadId, title: thread.title}))
      // console.log(filteredData);
      setAllThreads(filteredData);
    }catch(err) {
      console.log(err)
    }
  };

  useEffect(()=>{
    getAllThreads();
  },[])

  const createNewChat = () =>{
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv4());
    setPrevChats([]);
  }

  const changeThread = async (newThreadId) =>{
    setCurrThreadId(newThreadId);

    try{
      const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
      const res = await response.json();
      console.log(res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);

    }catch(err) {
      console.log(err);
    }
  }



  return ( 
    <section className="sidebar">
    {/* new chat button */}
    <button onClick={createNewChat}>
      <img src="src/assets/logo.png" alt="Forge" className="logo" />
      <span><i className="fa-solid fa-pen-to-square "></i></span>
    </button>

    

    {/* history */}
    <ul className="history">
      {
        allThreads?.map((thread, idx) =>(
          <li 
          key={idx}
          onClick={(e)=> changeThread(thread.threadId) }
          >{thread.title}</li>
        ))
      }

    </ul>
    

    {/* sign */}
    <div className="sign">
      <p>By Forge &hearts;</p>
    </div>
    </section>
   );
}

export default Sidebar;