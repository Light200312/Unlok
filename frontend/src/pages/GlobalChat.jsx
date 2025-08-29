import React, { useEffect, useState, useRef } from "react";
import { useChatStore } from "../store/Chatstore";
import { UserAuth } from "../store/userAuthStore";

const GlobalChat = () => {
  const { authUser } = UserAuth();
  const {
    globalMessages,
    getUsers,
    getGlobalMessage,
    subscribeToGlobal,
    unsubscribeFromGlobal,
    sendGlobalMessage,
  } = useChatStore();

  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
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
  }, [authUser, getUsers, getGlobalMessage, subscribeToGlobal, unsubscribeFromGlobal]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendGlobalMessage({
      text: inputMessage,
      userId: authUser._id,
    });
    setInputMessage("");
  };

  return (
    <div className="h-screen pt-20 flex flex-col bg-base-200">
      {/* Header */}
      <div className="p-4 bg-base-300 shadow-md flex items-center justify-center">
        <h2 className="text-lg font-semibold">🌍 Global Chat</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {(!globalMessages || globalMessages.length === 0) && (
          <div className="text-center text-gray-500">No globalMessages yet. Be the first!</div>
        )}

        {globalMessages &&
          globalMessages.map((message, i) => {
            const isMine = message.senderId?._id === authUser?._id;
            return (
              <div
                key={i}
                className={`chat ${isMine ? "chat-end" : "chat-start"}`}
              >
                {/* Sender name (only show for others) */}
                {!isMine && (
                  <div className="chat-header text-sm text-gray-500 mb-1">
                    {message.senderId?.username || "Anonymous"}
                  </div>
                )}

                <div
                  className={`chat-bubble ${
                    isMine ? "chat-bubble-success" : "chat-bubble-info"
                  }`}
                >
                  {message?.text}
                </div>

                <div className="chat-footer text-xs opacity-50">
                  {new Date(message?.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            );
          })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSend}
        className="p-4 bg-base-300 flex items-center gap-2 shadow-inner"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className="input input-bordered flex-1"
        />
        <button type="submit" className="btn btn-success">
          Send
        </button>
      </form>
    </div>
  );
};

export default GlobalChat;
