import React, { useEffect, useState, useRef } from "react";
import { useChatStore } from "../store/Chatstore";
import { UserAuth } from "../store/userAuthStore";

const RivalBuddy = () => {
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

  const { authUser } = UserAuth();
  const userId = authUser._id;

  const messageEndRef = useRef(null);
  const [messageData, setMessageData] = useState({
    text: "",
    image: "",
    userId,
  });

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    getUsers(userId);
    if (selectedUser?._id) getMessages(userId, selectedUser._id);

    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Handle file upload
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
    <div className="flex h-[100dvh] pt-16 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Sidebar (Chats List) */}
      <aside
        className={`w-full sm:w-64 border-r bg-white p-4 dark:border-gray-700 dark:bg-gray-800 
          ${selectedUser ? "hidden sm:block" : "block"}`}
      >
        <h2 className="mb-4 text-lg font-semibold">Chats</h2>
        <ul className="space-y-2">
          {users?.map((u, i) => (
            <li key={i}>
              <button
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                  selectedUser?._id === u._id
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                onClick={() => setSelectedUser(u)}
              >
                {u?.username}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Chat Window */}
      <div
        className={`flex w-full flex-1 flex-col ${
          selectedUser ? "block" : "hidden sm:flex"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-2 border-b bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {/* Back button (only on mobile) */}
          {selectedUser && (
            <button
              onClick={() => setSelectedUser(null)}
              className="sm:hidden rounded-lg px-2 py-1 text-sm text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              ← Back
            </button>
          )}
          <h3 className="text-md font-medium">
            {selectedUser ? selectedUser.username : "Select a chat"}
          </h3>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {isMessagesLoading ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Loading messages...
            </p>
          ) : (
            messages?.map((m, i) => (
              <div
                key={m?._id || i}
                className={`mb-3 flex ${
                  m?.senderId === userId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 text-sm break-words ${
                    m?.senderId === userId
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
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
            className="flex w-full items-center gap-2 border-t bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
            onSubmit={handleSend}
          >
            {/* Image Upload */}
            <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
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
                setMessageData({ ...messageData, [e.target.name]: e.target.value })
              }
              type="text"
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />

            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
            >
              Send
            </button>
          </form>
        )}

        {/* Image Preview */}
        {messageData.image && selectedUser && (
          <div className="border-t bg-gray-100 p-3 dark:border-gray-700 dark:bg-gray-800">
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
              Image Preview:
            </p>
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

export default RivalBuddy;
