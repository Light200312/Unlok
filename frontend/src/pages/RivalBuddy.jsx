import React, { useEffect, useState, useRef } from "react";
import { useChatStore } from "../store/Chatstore";
import { UserAuth } from "../store/userAuthStore";
import { 
  User, 
  UserPlus, 
  Camera, 
  Check, 
  Search, 
  Bell, 
  Users 
} from "lucide-react";

const RivalBuddy = () => {
  const [inputData, setinputData] = useState({
    neededUsername: "",
    neededUserID: "",
  });

  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    setSelectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    getUsers,
    sendMessage,
    users,
  } = useChatStore();

  const {
    authUser,
    foundUsers,
    notifications,
    searchUser,
    makeFriendReq,
    fetchAllNotifications,
    acceptRequest,
  } = UserAuth();

  const userId = authUser._id;
  const messageEndRef = useRef(null);

  const [messageData, setMessageData] = useState({
    text: "",
    image: "",
    userId,
  });

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    getUsers(userId);
    if (selectedUser?._id) getMessages(userId, selectedUser._id);
    fetchAllNotifications(userId);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id]);

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
    sendMessage(messageData);
    setMessageData({ text: "", image: "", userId });
  };

  return (
    <div className="flex h-screen pt-16 bg-[#2b2d31] text-gray-200">
      {/* Left Sidebar */}
      <aside className="w-72 border-r border-gray-700 bg-[#1e1f22]">
        <h2 className="text-lg font-semibold px-4 py-3 border-b border-gray-700 flex items-center gap-2">
          <Users size={18} /> Friends
        </h2>
        <div className=" flex flex-row w-full ">   {/* Friends col */}
        <div className="flex flex-col p-2  ">
          {users?.map((u, i) => (

            <div className="tooltip tooltip-right p-1" data-tip={u.username}>
            <button
              key={i}
              onClick={() => setSelectedUser(u)}
              title={u.username} // Tooltip
              className={`flex h-12 w-12 items-center justify-center rounded-full transition overflow-hidden
                ${selectedUser?._id === u._id
                  ? "ring-2 ring-blue-500"
                  : "bg-[#313338] hover:bg-[#404249]"}`}
            >
              {u.profilePic ? (
                <img src={u.profilePic} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="text-gray-400" />
              )}
            </button>
            </div>
          ))}
        </div>

        {/* Selected User Card */}
        {selectedUser && (
          <div className="m-4 p-4 rounded-lg bg-[#313338] shadow space-y-2 text-sm">
            {selectedUser.profilePic ? (
              <img
                src={selectedUser.profilePic}
                alt="profile"
                className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center bg-[#404249]">
                <User size={28} />
              </div>
            )}
            <ul className="space-y-1 text-center">
              <li><span className="font-semibold">Username:</span> {selectedUser.username}</li>
              <li><span className="font-semibold">Rank:</span> {selectedUser.rank}</li>
              <li><span className="font-semibold">Points:</span> {selectedUser.points}</li>
              <li><span className="font-semibold">Email:</span> {selectedUser.email}</li>
              <li>
                <span className="font-semibold">Joined:</span>{" "}
                {new Date(selectedUser.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "2-digit",
                })}
              </li>
            </ul>
          </div>
        )}</div>

      

      </aside>

      {/* Chat Area */}
      <main className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-gray-700 bg-[#313338] px-4 py-3">
          {selectedUser ? (
            <h3 className="text-md font-medium">{selectedUser.username}</h3>
          ) : (
            <p className="text-sm text-gray-400">Select a chat</p>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#313338]">
          {isMessagesLoading ? (
            <p className="text-center text-gray-400">Loading messages...</p>
          ) : (
            messages?.map((m, i) => (
              <div
                key={m?._id || i}
                className={`flex ${m?.senderId === userId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-3 py-2 text-sm break-words ${
                    m?.senderId === userId
                      ? "bg-blue-600 text-white"
                      : "bg-[#404249] text-gray-200"
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
              </div>
            ))
          )}
          <div ref={messageEndRef} />
        </div>

        {/* Input */}
        {selectedUser && (
          <form
            className="flex items-center gap-2 border-t border-gray-700 bg-[#383a40] px-4 py-3"
            onSubmit={handleSend}
          >
            <label className="cursor-pointer rounded bg-[#404249] p-2 text-gray-300 hover:bg-[#50535a]">
              <Camera size={18} />
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
                setMessageData({ ...messageData, [e.target.name]: e.target.value })
              }
              type="text"
              placeholder="Message..."
              className="flex-1 rounded bg-[#404249] px-3 py-2 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Send
            </button>
          </form>
        )}
      </main>

      {/* Right Sidebar */}
      <aside className="w-80 border-l border-gray-700 bg-[#1e1f22] p-4 space-y-6 hidden lg:block">
        {/* Search */}
        <div>
          <h4 className="mb-3 text-md font-semibold text-gray-300 flex items-center gap-2">
            <Search size={18} /> Find User
          </h4>
          <div className="space-y-2">
            <input
              type="text"
              value={inputData.neededUsername}
              className="w-full rounded bg-[#313338] px-3 py-2 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="neededUsername"
              placeholder="Search by username"
              onChange={(e) =>
                setinputData({ ...inputData, [e.target.name]: e.target.value })}
            />
            <input
              type="text"
              value={inputData.neededUserID}
              className="w-full rounded bg-[#313338] px-3 py-2 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="neededUserID"
              placeholder="Search by ID"
              onChange={(e) =>
                setinputData({ ...inputData, [e.target.name]: e.target.value })}
            />
            <button
              className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              onClick={(e) => {
                e.preventDefault();
                searchUser(inputData);
              }}
            >
              Search
            </button>
          </div>
        </div>

        

        {/* Found Users */}
        <div>
          <h4 className="mb-3 text-md font-semibold text-gray-300 flex items-center gap-2">
            <Users size={18} /> Found Users
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {foundUsers?.map((u, i) => (
              <div
                key={i}
                className="flex flex-col items-center rounded bg-[#313338] p-3 text-sm text-gray-200"
              >
                {u.profilePic ? (
                  <img
                    src={u.profilePic}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover mb-2"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400 mb-2" />
                )}
                <p className="text-sm font-medium">{u.username}</p>
                <button
                  onClick={() => makeFriendReq({ friendId: u._id, userId })}
                  className="mt-2 flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                >
                  <UserPlus size={14} /> Add
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Notifications in Left Sidebar */}
        <div className="mt-auto p-4 border-t border-gray-700">
          <h4 className="mb-3 text-md font-semibold text-gray-300 flex items-center gap-2">
            <Bell size={18} /> Notifications
          </h4>
          <div className="space-y-2">
            {notifications?.notifications?.map((n, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded bg-[#313338] p-2 text-sm text-gray-200"
              >
                <div>
                  <p>{n.username}</p>
                  <p className="text-xs text-gray-400">{n.notificationType}</p>
                </div>
                {n.notificationType === "received" && (
                  <button
                    onClick={() => acceptRequest({ userId, requestId: n._id })}
                    className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700 flex items-center gap-1"
                  >
                    <Check size={14} /> Accept
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default RivalBuddy;
