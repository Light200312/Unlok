import React, { useEffect, useState, useRef } from "react";
import { useChatStore } from "../store/Chatstore";
import { useClanStore } from "../store/clanStore";
import { UserAuth } from "../store/userAuthStore";
import {
  Users,
  Shield,
  Camera,
  Send,
  Check,
  UserPlus,
  Search,
  Bell,
  X,Link 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const RivalBuddy = () => {
  const [activeTab, setActiveTab] = useState("friends");
  const [inputData, setInputData] = useState({
    neededUsername: "",
    neededUserID: "",
  });
  const [clanSearch, setClanSearch] = useState("");
  const [showClanChat, setShowClanChat] = useState(false);

  const navigate = useNavigate();

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
    getFriends,
    friends,
    clanRequests,
    getClanRequests,
  } = useChatStore();

  const {
    clan,
    foundClans,getClanInfo,
    searchClans,
    requestJoinClan,
    getClanMessages,
    clanMessages,
    sendClanMessage,
    subscribeToClanChat,
    unsubscribeFromClanChat,
    acceptClanInvite,
  } = useClanStore();

  const {
    authUser,
    foundUsers,
    notifications,
    searchUser,
    makeFriendReq,
    fetchAllNotifications,
    acceptRequest,
    rejectRequest,syncChallenges
  } = UserAuth();

  const userId = authUser._id;
  const messageEndRef = useRef(null);
  const [messageData, setMessageData] = useState({
    text: "",
    image: "",
    userId,
  });
  const [clanText, setClanText] = useState("");

  /** Scroll chat */
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  /** Load initial data */
  useEffect(() => {
    getUsers(userId);
    getFriends(userId);getClanInfo(authUser.clan)
    if (selectedUser?._id) getMessages(userId, selectedUser._id);
    fetchAllNotifications(userId);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id]);

  /** Clan Chat setup */
 useEffect(() => {
  if (!showClanChat || !clan?._id) return;

  // 🧠 Fetch only once when opening
  getClanMessages(clan._id);

  // 🔔 Subscribe to real-time chat
  subscribeToClanChat(clan.chatRoomId);

  // ✅ Cleanup properly on close
  return () => {
    unsubscribeFromClanChat(clan.chatRoomId);
  };
}, [showClanChat, clan?.chatRoomId]);


  /** Image Upload */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setMessageData((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  /** Send Friend Chat */
  const handleSend = (e) => {
    e.preventDefault();
    if (!messageData.text.trim() && !messageData.image) return;
    sendMessage(messageData);
    setMessageData({ text: "", image: "", userId });
  };

  /** Send Clan Chat */
  const handleClanSend = async (e) => {
    e.preventDefault();
    if (!clanText.trim()) return;
    await sendClanMessage(clan.chatRoomId, { userId, text: clanText });
    setClanText("");
  };

  return (
    <div className="flex h-screen pt-16 bg-[#0d1117] text-gray-200">
      {/* LEFT SIDEBAR */}
      <aside className="w-72 bg-[#161b22] border-r border-gray-800 flex flex-col">
        <div className="flex justify-around border-b border-gray-700 py-3">
          <button
            onClick={() => {
              setActiveTab("friends");
              setShowClanChat(false);
            }}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-all ${
              activeTab === "friends"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Users size={16} /> Friends
          </button>
          <button
            onClick={() => {
              setActiveTab("clan");
              setShowClanChat(false); setShowClanChat(true)
            }}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-all ${
              activeTab === "clan"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Shield size={16 }  /> Clan
          </button>
        </div>

        {/* FRIENDS TAB */}
        {activeTab === "friends" && (
          <div className="flex-1 overflow-y-auto p-2">
            {friends?.map((u, i) => (
              <div className=" flex gap-2 py-2"> 
              <button
                key={i}
                onClick={() => setSelectedUser(u)}
                className={`flex items-center gap-3 w-full px-3  py-2 bg-[#1f2630] rounded-md border border-gray-700 hover:bg-[#2a323f] transition-all ${
                  selectedUser?._id === u._id
                    ? "bg-gray-700 text-white"
                    : "hover:bg-[#1f2630] text-gray-300"
                }`}
              >
                <img
                  src={u.profilePic || "/profile.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <p className="truncate">{u.username}</p>

              </button>  <button className="p-1 px-2 m-1 border hover:bg-white hover:text-black rounded-full" onClick={()=>syncChallenges(userId,u._id,7)}><Link size={15}/></button> </div>
            ))}
          </div>
        )}

        {/* CLAN TAB */}
         {activeTab === "clan" && (
          <div className="flex flex-col items-center justify-between flex-1 p-4">
            {clan ? (
              <div className="text-center">
                
                <div>
                  {" "}
                 <li className="text-left mt-3">
  <p className="font-semibold mb-2 text-sm text-gray-300">Members:</p>
  <div className="space-y-2">
    {clan?.members?.map((member) => (
      <div
        key={member._id}
        className="flex items-center gap-3 p-2 bg-[#1f2630] rounded-md border border-gray-700 hover:bg-[#2a323f] transition-all"
      >
        <img
          src={member.profilePic || "/profile.png"}
          alt={member.username}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <p className="text-white text-sm font-medium">
            {member.username}
          </p>
          <p className="text-xs text-gray-400">
            {member.rank || "Unranked"}
          </p>
        </div>
        <Link className="ml-30 cursor-pointer" onClick={()=>syncChallenges(authUser._id,member._id,7)}/>
      </div>
    ))}
  </div>
</li>

                </div>
                <div className="mt-4">
<h3 className="text-lg font-semibold text-white">
                  {clan.name}
                </h3>
                <p className="text-gray-400 text-sm mt-1">{clan.description}</p>
                
                </div>
                
              </div>
            ) : (
              <>
                <p className="text-gray-400 text-sm mb-2">
                  You are not in a clan yet.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/create-clan")}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
                  >
                    Create Clan
                  </button>
                </div>

                {/* 🔍 Clan Search */}
                <div className="w-full mt-6">
                  <div className="flex items-center bg-[#1f2630] rounded px-2">
                    <Search size={16} className="text-gray-400" />
                    <input
                      type="text"
                      value={clanSearch}
                      onChange={(e) => setClanSearch(e.target.value)}
                      placeholder="Search clans..."
                      className="w-full bg-transparent px-2 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none"
                    />
                    <button
                      onClick={() => searchClans(clanSearch)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                    >
                      Go
                    </button>
                  </div>

                  <div className="mt-3 max-h-48 overflow-y-auto space-y-2">
                    {foundClans?.length > 0 ? (
                      foundClans.map((c) => (
                        <div
                          key={c._id}
                          className="p-2 bg-[#1e242f] border border-gray-700 rounded-md"
                        >
                          <p className="font-semibold text-white">{c.name}</p>
                          <p className="text-xs text-gray-400">
                            {c.description || "No description"}
                          </p>
                          <button
                            onClick={() =>
                              requestJoinClan({ clanId: c._id, userId })
                            }
                            className="mt-2 bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1 rounded"
                          >
                            Request to Join
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-xs text-center">
                        No clans found yet.
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        
      
      </aside>

      {/* MAIN CHAT AREA */}
      <main className="flex flex-col flex-1 bg-[#0f141a]">
        {showClanChat ? (
          <>
            <div className="flex items-center gap-2 border-b border-gray-800 bg-[#161b22] px-5 py-3">
              <h3 className="text-md font-medium text-white">{clan?.name}</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {clanMessages?.map((m, i) => {
  const isMine = m.senderId?._id === authUser?._id;
  return (
    <div
      key={m._id || i}
      className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
    >
      {/* Sender Name */}
      {!isMine && (
        <span className="text-xs text-cyan-400 mb-1 font-medium">
          {m.senderId?.username || "Anonymous"}
        </span>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-[80%] px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
          isMine
            ? "bg-cyan-600/40 border border-cyan-500/50 text-cyan-50"
            : "bg-neutral-800/60 border border-cyan-700/30 text-gray-200"
        }`}
        style={{
          boxShadow: isMine
            ? "0 0 10px rgba(0,255,255,0.3)"
            : "0 0 5px rgba(0,255,255,0.2)",
        }}
      >
        {m.text && <p>{m.text}</p>}
        {m.image && (
          <img
            src={m.image}
            alt="sent"
            className="mt-2 max-h-48 rounded-md border border-cyan-700/40"
          />
        )}
      </div>

      {/* Timestamp */}
      <span className="text-[10px] text-neutral-500 mt-1">
        {new Date(m?.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
})}
              <div ref={messageEndRef} />
            </div>

            <form
              onSubmit={handleClanSend}
              className="flex items-center gap-2 border-t border-gray-800 bg-[#161b22] px-4 py-3"
            >
              <input
                value={clanText}
                onChange={(e) => setClanText(e.target.value)}
                placeholder="Message your clan..."
                className="flex-1 rounded bg-[#1f2630] px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium text-white flex items-center gap-1"
              >
                <Send size={16} /> Send
              </button>
            </form>
          </>
        ) : activeTab === "friends" ? (
          <>
            <div className="flex items-center gap-2 border-b border-gray-800 bg-[#161b22] px-5 py-3">
              {selectedUser ? (
                <h3 className="text-md font-medium text-white">
                  {selectedUser.username}
                </h3>
              ) : (
                <p className="text-sm text-gray-500">Select a chat</p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isMessagesLoading ? (
                <p className="text-center text-gray-400">Loading messages...</p>
              ) : (
                messages?.map((m, i) => (
                  <div
                    key={m?._id || i}
                    className={`flex ${
                      m?.senderId === userId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                        m?.senderId === userId
                          ? "bg-blue-600 text-white"
                          : "bg-[#1f2630] text-gray-200"
                      }`}
                    >
                      {m?.text && <p>{m.text}</p>}
                      {m?.image && (
                        <img
                          src={m.image}
                          alt="sent"
                          className="mt-2 max-h-48 rounded-lg object-cover"
                        />
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messageEndRef} />
            </div>

            {selectedUser && (
              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 border-t border-gray-800 bg-[#161b22] px-4 py-3"
              >
                <label className="cursor-pointer rounded bg-[#1f2630] p-2 text-gray-300 hover:bg-[#2a3544]">
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
                    setMessageData({
                      ...messageData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  placeholder="Message..."
                  className="flex-1 rounded bg-[#1f2630] px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium text-white flex items-center gap-1"
                >
                  <Send size={16} /> Send
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center text-gray-500 text-sm">
            Join or Create a Clan to Chat!
          </div>
        )}
      </main>

      {/* RIGHT SIDEBAR (Notifications, Search Users) */}
      {activeTab === "friends" && (
        <aside className="w-80 border-l border-gray-800 bg-[#161b22] p-5 space-y-6 hidden sm:block">
          {/* Search Users */}
          <div>
            <h4 className="mb-3 text-md font-semibold text-white flex items-center gap-2">
              <Search size={18} /> Find Users
            </h4>
            <div className="space-y-2">
              {["neededUsername", "neededUserID"].map((field) => (
                <input
                  key={field}
                  type="text"
                  value={inputData[field]}
                  name={field}
                  placeholder={
                    field === "neededUsername"
                      ? "Search by username"
                      : "Search by ID"
                  }
                  onChange={(e) =>
                    setInputData({
                      ...inputData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  className="w-full rounded bg-[#1b1f24] border border-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ))}
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
            <div>

            </div>
            <div>
              {foundUsers && foundUsers.map((u,i)=>(
                 <div className="flex items-center justify-between p-3 bg-base-200/70 rounded-xl shadow-md hover:bg-base-300 transition-all mb-2 border border-base-300">
      {/* 👤 Profile Info */}
      <div className="flex items-center gap-3">
        <img
          src={u.profilePic || "/profile.png"}
          alt={u.username}
          className="w-10 h-10 rounded-full object-cover border border-base-300"
        />
        <div>
          <h3 className="font-semibold text-base-content">{u.username}</h3>
          <p className="text-sm text-base-content/70">
            {u.rank || "Unranked"} • {u.clan || "Solo"} ({u.clanRole || "No role"})
          </p>
        </div>
      </div>

      {/* ➕ Add Friend Button */}
      <button
        onClick={() => makeFriendReq({ friendId: u._id, userId })}
        className="btn btn-sm btn-primary text-white px-4"
      >
        Add Friend
      </button>
    </div>
              ))}
              
            </div>
          </div>

          {/* Notifications */}
          <div className="mt-auto pt-4 border-t border-gray-800">
            <h4 className="mb-3 text-md font-semibold text-white flex items-center gap-2">
              <Bell size={18} /> Notifications
            </h4>
            <div className="space-y-2">
              {notifications?.received?.length ? (
                notifications.received.map((n, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded bg-[#1b1f24] p-2 text-sm text-gray-200 hover:bg-[#232830]"
                  >
                    <div>
                      <p className="font-medium">
                        {n.senderName || n.sender?.username}
                      </p>
                      <p className="text-xs text-gray-400">
                        {n.type === "clan"
                          ? `Clan: ${n.message}`
                          : n.message || n.type}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (n.type === "clan" || n.relatedModel === "Clan") {
                            // Clan join acceptance
                            acceptClanInvite({
                              userId,
                              clanId: n.relatedId, // this is the clan ID
                              notificationId: n.notificationId,
                            });
                          } else if (n.type === "friend") {
                            // Friend acceptance
                            acceptRequest({
                              userId,
                              notificationId: n.notificationId,
                            });
                          } else {
                            toast.error("Unknown request type");
                          }
                        }}
                        className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700 flex items-center gap-1"
                      >
                        <Check size={14} /> Accept
                      </button>

                      <button
                        onClick={() =>
                          rejectRequest({
                            userId,
                            notificationId: n.notificationId,
                          })
                        }
                        className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 flex items-center gap-1"
                      >
                        <X size={14} /> Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-xs">No new notifications.</p>
              )}
            </div>
          </div>

          {/* Clan Join Requests (for Leaders) */}
{clan && clan.leader?._id === authUser?._id && (
  <div className="mt-8 pt-4 border-t border-gray-800">
    <h4 className="mb-3 text-md font-semibold text-white flex items-center gap-2">
      <Shield size={18} /> Clan Join Requests
    </h4>
    <button
      onClick={async () => {
        getClanRequests({ clanId: clan._id, userId: authUser._id });
       
      }}
      className="mb-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
    >
      Refresh Requests
    </button>

    <div className="space-y-2 max-h-60 overflow-y-auto">
      {clanRequests?.length ? (
        clanRequests.map((r) => (
          <div
            key={r._id}
            className="flex items-center justify-between rounded bg-[#1b1f24] p-2 text-sm text-gray-200 hover:bg-[#232830]"
          >
            <div className="flex items-center gap-2">
              <img
                src={r.profilePic || "/profile.png"}
                className="w-8 h-8 rounded-full object-cover"
                alt="user"
              />
              <p className="font-medium">{r._id}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  acceptClanInvite({ clanId: clan._id, userId: r._id })
                }
                className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700 flex items-center gap-1"
              >
                <Check size={14} /> Accept
              </button>
              <button
                onClick={() =>
                  rejectJoinRequest({ clanId: clan._id, userId: r._id })
                }
                className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 flex items-center gap-1"
              >
                <X size={14} /> Reject
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-xs">No join requests yet.</p>
      )}
    </div>
  </div>
)}

        </aside>
      )}
    </div>
  );
};

export default RivalBuddy;
