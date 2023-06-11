import React, { useState , useEffect } from "react";
import axios from "axios";
import Header from "./Header"
import "./index.css";

import send from "./assets/send.svg";
import user from "./assets/user.png";
import loadinggg from "./assets/loadinggg.svg";
import bot from "./assets/bot.png";

function App() {
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    document.querySelector(".layout").scrollTop =
        document.querySelector(".layout").scrollHeight;
}, [posts]);

const fetchBotResponse = async () => {
  const {data} = await axios.post("https://my-chatgpt-eg65.onrender.com", {input} ,{
    headers : {
      "Content-Type": "application/json",
    },
  }
  );
  return data;
};

  const onSubmit = () => {
   if(input.trim() === "") return;
   updateposts(input);
   updateposts("Loading....." , false , true);
   setInput("")
   fetchBotResponse().then((res) => {
    console.log(res)
    updateposts(res.bot.trim() , true);
   });
  };

  const autoTypingBotResponse = (text) => {
    let index = 0;
    let interval = setInterval(() => {
      if(index < text.length){
        setPosts((prevState) => {
          let lastItem =prevState.pop();
          if(lastItem.type !== "bot"){
            prevState.push({
              type : "bot",
              post: text.charAt(index-1)
            })
          } else {
            prevState.push({ 
              type : "bot",
              post : lastItem.post + text.charAt(index-1)
            });
          }
          return[...prevState];
        });
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);
  };

  const updateposts = (post, isBot , isLoading) => {
    if (isBot) {
      autoTypingBotResponse(post);
    } else {
      setPosts((prevState) => {
        return [...prevState , {type : isLoading ? "loading" : "user" , post}];
      }); 
    }

  };


  const onKeyUp = (e) => {
    if(e.key === "Enter" || e.which === 13){
      onSubmit();
    }
  }

  return (
    <>
    <Header/>
      <main className="chatGPT-app">
        <section className="chat-container">
          <div className="layout">
            {posts.map((post, index) => (
              <div
              key= {index}
                className={`chat-bubble ${
                  post.type === "bot" || post.type === "loading" ? "bot" : ""
                }`}
              >
                <div className="avatar">
                  <img
                    src={
                      post.type === "bot" || post.type === "loading"
                        ? bot
                        : user
                    }
                    alt="image of user icon"
                  />
                </div>
                {post.type === "loading" ? (
                  <div className="loader">
                    <img src={loadinggg} />
                  </div>
                ) : (
                  <div className="post"> {post.post} </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <footer>
          <input
            value = {input}
            type="text"
            autoFocus
            className="composebar"
            placeholder="Ask your queries"
            onChange={(e) => setInput(e.target.value) }
            onKeyUp={onKeyUp}
          />
          <div className="send-button" onClick={onSubmit}>
            <img src={send} alt="image of arrow send icon" />
          </div>
        </footer>
      </main>
    </>
  );
}

export default App;
