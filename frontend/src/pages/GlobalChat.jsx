// import React, { useEffect, useState, useRef } from "react";
// import { useChatStore } from "../store/Chatstore";
// import { UserAuth } from "../store/userAuthStore";

// const GlobalChat = () => {
//   const { authUser } = UserAuth();
//   const {
//     globalMessages,
//     getUsers,
//     isMessagesLoading,
//     getGlobalMessage,
//     subscribeToGlobal,
//     unsubscribeFromGlobal,
//     sendGlobalMessage,
//   } = useChatStore();

//   const [inputMessage, setInputMessage] = useState({text:"",image:""});
//   const messagesEndRef = useRef(null);

//   // Scroll to bottom on new messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [globalMessages]);

//   useEffect(() => {
//     if (authUser?._id) {
//       getUsers(authUser._id);
      
//       getGlobalMessage();
//       subscribeToGlobal();
//     }
//     return () => unsubscribeFromGlobal();
//   }, [authUser, subscribeToGlobal]);

//   const handleSend = (e) => {
//     e.preventDefault();
//     if (!inputMessage.text.trim()) return;
//     sendGlobalMessage({
//       text: inputMessage.text,
//       userId: authUser._id,
//     });
//     setInputMessage({text:"",image:""});
//   };

//   return (
//     <div className="h-screen pt-20 flex flex-col bg-base-200">
//       {/* Header */}
//       <div className="p-4 bg-base-300 shadow-md flex items-center justify-center">
//         <h2 className="text-lg font-semibold">🌍 Global Chat</h2>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
//         {(!globalMessages || globalMessages.length === 0) && (
//           <div className="text-center text-gray-500">No globalMessages yet. Be the first!</div>
//         )}

//         {!isMessagesLoading &&
//           globalMessages?.map((message, i) => {
//             const isMine = message.senderId?._id === authUser?._id;
//             return (
//               <div
//                 key={i}
//                 className={`chat ${isMine ? "chat-end" : "chat-start"}`}
//               >
//                 {!isMine && (
//                   <div className="chat-header text-sm text-gray-500 mb-1">
//                     {message.senderId?.username || "Anonymous"}
//                   </div>
//                 )}

//                 <div
//                   className={`chat-bubble ${
//                     isMine ? "chat-bubble-success" : "chat-bubble-info"
//                   }`}
//                 >
//                   {message?.text}
//                 </div>

//                 <div className="chat-footer text-xs opacity-50">
//                   {new Date(message?.createdAt).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </div>
//               </div>
//             );
//           })}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input bar */}
//       <form
       
//         className="p-4 bg-base-300 flex items-center gap-2 shadow-inner"
//       >
//         <input
//           type="text"
//           name="text"
//           value={inputMessage.text}
//           onChange={(e) =>{
           
//             setInputMessage({...inputMessage,[e.target.name]:e.target.value})
            
//           }}
//           placeholder="Type a message..."
//           className="input input-bordered flex-1"
//         />
//         <button onClick={(e)=>{
//           e.preventDefault();
//           handleSend(e)
//         }} type="submit" className="btn btn-success">
//           Send
//         </button>
//       </form>
//     </div>
//   );
// };

// export default GlobalChat;
import React, { useEffect, useState, useRef } from "react";
import { useChatStore } from "../store/Chatstore";
import { UserAuth } from "../store/userAuthStore";

const GlobalChat = () => {
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

  const [messageData, setMessageData] = useState({
    text: "",
    image: "",
    userId: authUser?._id,
  });

  const messagesEndRef = useRef(null);

  // ✅ Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [globalMessages]);

  // ✅ Fetch messages + subscribe
  useEffect(() => {
    if (authUser?._id) {
      getUsers(authUser._id);
      getGlobalMessage();
      subscribeToGlobal();
    }
    return () => unsubscribeFromGlobal();
  }, [authUser?._id]);

  // ✅ Handle file upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setMessageData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // ✅ Handle send
  const handleSend = (e) => {
    e.preventDefault();
    if (!messageData.text.trim() && !messageData.image) return;

    sendGlobalMessage(messageData);
    setMessageData({ text: "", image: "", userId: authUser._id });
  };

  return (
    <div className="h-screen pt-20 flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="p-4 bg-white shadow-md flex items-center justify-center dark:bg-gray-800">
        <h2 className="text-lg font-semibold">🌍 Global Chat</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {(!globalMessages || globalMessages.length === 0) && (
          <div className="text-center text-gray-500">
            No messages yet. Be the first!
          </div>
        )}

        {!isMessagesLoading &&
          globalMessages?.map((m, i) => {
            const isMine = m.senderId?._id === authUser?._id;
            return (
              <div
                key={m?._id || i}
                className={`chat ${isMine ? "chat-end" : "chat-start"}`}
              >
                {!isMine && (
                  <div className="chat-header text-sm text-gray-500 mb-1">
                    {m.senderId?.username || "Anonymous"}
                  </div>
                )}

                <div
                  className={`chat-bubble max-w-xs break-words ${
                    isMine ? "chat-bubble-success" : "chat-bubble-info"
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

                <div className="chat-footer text-xs opacity-50">
                  {new Date(m?.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            );
          })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        className="p-4 bg-white flex items-center gap-2 shadow-inner dark:bg-gray-800"
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

        {/* Text Input */}
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

        {/* Send Button */}
        <button
          type="submit"
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
        >
          Send
        </button>
      </form>

      {/* Image Preview */}
      {messageData.image && (
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
  );
};

export default GlobalChat;
