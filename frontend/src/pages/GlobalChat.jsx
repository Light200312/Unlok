import React, { useEffect, useState, useRef } from "react";
import { useChatStore } from "../store/Chatstore";
import { UserAuth } from "../store/userAuthStore";
import { Link } from "react-router-dom";
import {
  Home,
  Search,
  Compass,
  Clapperboard,OctagonAlert ,
  Heart,Crown ,
  MessageCircle, Telescope ,
  Send,
  Bookmark,
  MoreHorizontal,
  SquarePlus,
  User,Sword,Swords ,Trophy 
} from "lucide-react";

const GlobalChat = () => {
  const [QuestOpen, setQuestOpen] = useState(false);
  const { authUser } = UserAuth();
  const {
    globalMessages,
    isMessagesLoading,
    getUsers,
    getGlobalMessage,
    subscribeToGlobal,
    unsubscribeFromGlobal,
    sendGlobalMessage,
  } = useChatStore();

  // -----------------------------
  // Instagram-style Post Card
  // -----------------------------
  function PostCard() {
    return (
      <div className="w-full sm:w-[450px] md:w-[500px] lg:w-[550px] bg-black text-white rounded-2xl border border-neutral-800 overflow-hidden my-6 shadow-md hover:shadow-lg transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <img
              src="/profile.jpg"
              alt="user"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-semibold text-sm">username</span>
          </div>
          <MoreHorizontal className="text-neutral-400 cursor-pointer" />
        </div>

        {/* Post content */}
        <div className="w-full">
          <img
            src="/panelbg.jpg"
            alt="post"
            className="w-full object-cover max-h-[500px] transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between px-4 py-3">
          <div className="flex gap-5">
            <Heart className="hover:text-red-500 cursor-pointer transition-colors" />
            <MessageCircle className="hover:text-neutral-300 cursor-pointer transition-colors" />
            <Send className="hover:text-neutral-300 cursor-pointer transition-colors" />
          </div>
          <Bookmark className="hover:text-neutral-300 cursor-pointer transition-colors" />
        </div>

        {/* Likes */}
        <div className="px-4 text-sm font-semibold">1,024 likes</div>

        {/* Caption */}
        <div className="px-4 pb-3 text-sm">
          <span className="font-semibold">username </span>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. 💫
        </div>

        {/* Comments */}
        <div className="px-4 pb-3 text-sm text-neutral-400">
          View all 42 comments
        </div>

        {/* Add comment input */}
        <div className="border-t border-neutral-800 px-4 py-3 flex items-center">
          <input
            type="text"
            placeholder="Add a comment..."
            className="bg-transparent outline-none text-sm flex-1 placeholder-neutral-500"
          />
          <button className="text-emerald-500 text-sm font-semibold">Post</button>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Sidebar Nav Items
  // -----------------------------
  function NavItem({ icon, label, badge ,PageLink}) {
    return (
      <Link to={PageLink} className="relative flex items-center gap-4 px-4 py-2 hover:bg-neutral-800 rounded-xl cursor-pointer transition-all w-fit sm:w-full">
        <div className="relative">
          {icon}
          {badge && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-xs font-bold rounded-full px-1.5">
              {badge}
            </span>
          )}
        </div>
        <span className="hidden sm:inline">{label}</span>
      </Link>
    );
  }

  // -----------------------------
  // Chat controls (untouched)
  // -----------------------------
  const [messageData, setMessageData] = useState({
    text: "",
    image: "",
    userId: authUser?._id,
  });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [globalMessages]);

  useEffect(() => {
    if (authUser?._id) {
      getUsers(authUser._id);
      getGlobalMessage();
      subscribeToGlobal();
    }
    return () => unsubscribeFromGlobal();
  }, [authUser?._id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setMessageData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageData.text.trim() && !messageData.image) return;
    sendGlobalMessage(messageData);
    setMessageData({ text: "", image: "", userId: authUser._id });
  };

  // -----------------------------
  // Layout
  // -----------------------------
  return (
    <div className="flex w-full bg-black text-white min-h-screen">
      {/* Left Sidebar */}
      <aside className="h-screen w-16 sm:w-56 bg-black flex flex-col items-center sm:items-start py-6 fixed border-r border-neutral-800">
        <div className="mt-10"></div>
        <nav className="flex flex-col p-1 gap-4 w-full">
          <NavItem PageLink="/globalChat" icon={<Home />} label="Home" />
          <NavItem PageLink="/" icon={<Telescope  />} label="Search" />
          <NavItem icon={<Compass />} label="Explore" />
          <div onClick={()=>setQuestOpen(!QuestOpen)}> <NavItem   icon={<Swords />} label="Quests" />  
          {QuestOpen && (<div className="ml-20   bg-[#1e1e1e] p-2 rounded "> 
           <ul className="flex flex-col gap-1 text-sm">
            <li className="hover:bg-[#2e2e2e] p-1 rounded"><Link  to="/dailychellenge">Daily Quests</Link></li>
            <li className="hover:bg-[#2e2e2e] p-1 rounded" ><Link to="/weeklychallenge">Weekly Quests</Link></li>
            <li className="hover:bg-[#2e2e2e] p-1 rounded"><Link to="/monthlychallenge">Monthly Quests</Link></li>
            </ul>
            

          </div>)}
          
          </div>
         
          
          <NavItem icon={<Send  />} PageLink={"/buddyChat"} label="Messages" badge="4" />
          <NavItem icon={<OctagonAlert  />} label="Notifications" />
          <NavItem icon={<Crown  />} PageLink={"/globalRanking"} label="Rankings" />
          <NavItem icon={<Trophy  />} PageLink={"/statsAndRanking"} label="User Stats" />
        </nav>
      </aside>

      {/* Feed (center) */}
      <main className="flex-1 sm:ml-56 flex flex-col items-center pt-10 pb-20 overflow-y-auto">
        <PostCard />
        <PostCard />
        <PostCard />
      </main>

      {/* Right Side Global Chat */}
      <div className="hidden sticky -top-0 right-0 xl:flex flex-col w-[350px] border-l border-neutral-800 h-screen bg-black">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Messages</h2>
          <MessageCircle className="text-neutral-400" />
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-black">
          {(!globalMessages || globalMessages.length === 0) && (
            <div className="text-center text-neutral-500">
              No messages yet. Be the first!
            </div>
          )}

          {!isMessagesLoading &&
            globalMessages?.map((m, i) => {
              const isMine = m.senderId?._id === authUser?._id;
              return (
                <div
                  key={m?._id || i}
                  className={`flex flex-col ${
                    isMine ? "items-end" : "items-start"
                  }`}
                >
                  {!isMine && (
                    <span className="text-xs text-neutral-500 mb-1">
                      {m.senderId?.username || "Anonymous"}
                    </span>
                  )}
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                      isMine
                        ? "bg-emerald-600 text-white rounded-br-none"
                        : "bg-neutral-800 text-white rounded-bl-none"
                    }`}
                  >
                    {m?.text && <p>{m.text}</p>}
                    {m?.image && (
                      <img
                        src={m.image}
                        alt="sent-img"
                        className="mt-2 max-h-48 rounded-lg object-cover"
                      />
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-500 mt-1">
                    {new Date(m?.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          className="p-4 border-t border-neutral-800 flex items-center w-full gap-2"
          onSubmit={handleSend}
        >
          <label className="cursor-pointer text-neutral-400 hover:text-white transition">
            📷
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          <input
            name="text"
            value={messageData.text}
            onChange={(e) =>
              setMessageData({
                ...messageData,
                [e.target.name]: e.target.value,
              })
            }
            type="text"
            placeholder="Send a message..."
            className="flex-1 bg-neutral-900 border border-neutral-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-full text-sm transition"
          >
            Send
          </button>
        </form>

        {/* Image Preview */}
        {messageData.image && (
          <div className="border-t border-neutral-800 p-3 bg-neutral-900">
            <p className="mb-2 text-sm text-neutral-400">Image Preview:</p>
            <img
              src={messageData.image}
              alt="preview"
              className="max-h-48 rounded-lg object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalChat;
