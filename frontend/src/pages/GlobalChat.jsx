import React, { useEffect, useState, useRef } from "react";
import { useChatStore } from "../store/Chatstore";
import { UserAuth } from "../store/userAuthStore";
import { Link } from "react-router-dom";
import { usePostStore } from "../store/PostStore";
import PostCard from "../components/SubComponent/PostCard";
import {
  Home,
  Search,
  Compass,
  Clapperboard,
  OctagonAlert,
  Heart,
  Crown,
  MessageCircle,
  Telescope,
  Send,
  Bookmark,
  MoreHorizontal,
  SquarePlus,
  User,
  Sword,
  Swords,
  Trophy,
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
const {
  fetchAllPosts,
  fetchUserPostsByStatus,
  completedPosts,
  posts,
  loading,
  fetchLatestPost,
  currentPage,
  totalPages,
} = usePostStore();

  function NavItem({ icon, label, badge, PageLink }) {
    return (
      <Link
        to={PageLink}
        className="relative flex items-center gap-4 px-4 py-2 hover:bg-neutral-800 rounded-xl cursor-pointer transition-all w-fit sm:w-full"
      >
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
useEffect(() => {
  fetchLatestPost(1);
}, []);
const scrollTimeout = useRef(null);
const handleScroll = (e) => {
  if (scrollTimeout.current) return;
  scrollTimeout.current = setTimeout(() => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 100;
    if (bottom && !loading && currentPage < totalPages) {
      fetchLatestPost(currentPage + 1);
    }
    scrollTimeout.current = null;
  }, 300);
};


// attach scroll listener to main feed
const mainRef = useRef(null);
useEffect(() => {
  const mainEl = mainRef.current;
  if (mainEl) mainEl.addEventListener("scroll", handleScroll);
  return () => mainEl && mainEl.removeEventListener("scroll", handleScroll);
}, [loading, currentPage, totalPages]);

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
          <NavItem PageLink="/" icon={<Telescope />} label="Search" />
          <NavItem icon={<Compass />} label="Explore" />
          <div onClick={() => setQuestOpen(!QuestOpen)}>
            {" "}
            <NavItem icon={<Swords />} label="Quests" />
            {QuestOpen && (
              <div className="ml-20   bg-[#1e1e1e] p-2 rounded ">
                <ul className="flex flex-col gap-1 text-sm">
                  <li className="hover:bg-[#2e2e2e] p-1 rounded">
                    <Link to="/dailychellenge">Daily Quests</Link>
                  </li>
                  <li className="hover:bg-[#2e2e2e] p-1 rounded">
                    <Link to="/weeklychallenge">Weekly Quests</Link>
                  </li>
                  <li className="hover:bg-[#2e2e2e] p-1 rounded">
                    <Link to="/monthlychallenge">Monthly Quests</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <NavItem
            icon={<Send />}
            PageLink={"/buddyChat"}
            label="Messages"
            badge="4"
          />
          <NavItem icon={<OctagonAlert />} label="Notifications" />
          <NavItem
            icon={<Crown />}
            PageLink={"/globalRanking"}
            label="Rankings"
          />
          <NavItem
            icon={<Trophy />}
            PageLink={"/statsAndRanking"}
            label="User Stats"
          />
        </nav>
      </aside>

      {/* Feed (center) */}
     {/* Feed (center) */}
<main
  ref={mainRef}
  className="flex-1 sm:ml-56 flex flex-col items-center pt-10 pb-20 overflow-y-auto"
>
  {loading && currentPage === 1 ? (
    <div className="text-neutral-500 mt-10">Loading posts...</div>
  ) : completedPosts.length === 0 ? (
    <div className="text-neutral-500 mt-10">No live posts yet</div>
  ) : (
    completedPosts
      .filter((p) => p.live === true)
      .map((post) => <PostCard key={post._id} post={post} />)
  )}

  {/* Loader indicator for next page */}
  {loading && currentPage > 1 && (
    <div className="text-neutral-500 text-sm mt-4">Loading more posts...</div>
  )}
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
