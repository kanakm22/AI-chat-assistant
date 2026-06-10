import "./Chat.css";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState("");

  useEffect(() => {
  if (reply === null) {
    setLatestReply(null); // loading prev reply 
    return;
  }

  const content = reply.split(" ");
  let idx = 0;

  const interval = setInterval(() => {
    setLatestReply(content.slice(0, idx + 1).join(" "));
    idx++;
    if (idx >= content.length) clearInterval(interval);
  }, 40);

  return () => clearInterval(interval);
}, [reply]);

  return (
    <>
      <div className="chats">
        {newChat && <h1>Start a new Chat!</h1>}

        {prevChats?.slice(0, -1).map((chat, idx) => (
          <div className={chat.role === "user" ? "userDiv" : "assistantDiv"} key={idx}>
            {chat.role === "user" ? (
              <p className="userMsg">{chat.content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {chat.content}
              </ReactMarkdown>
            )}
          </div>
        ))}

        {prevChats && prevChats.length > 0 && prevChats[prevChats.length - 1].role === "user" && (
          <div className="userDiv">
            <p className="userMsg">{prevChats[prevChats.length - 1].content}</p>
          </div>
        )}

        {prevChats && prevChats.length > 0 && prevChats[prevChats.length - 1].role === "assistant" && (
          <div className="assistantDiv">
            <p className="assistantMsg">{prevChats[prevChats.length - 1].content}</p>
          </div>
        )}

        {latestReply && (
          <div className="assistantDiv">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {latestReply}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </>
  );
}

export default Chat;