import React, { useEffect } from "react";
import { UserAuth } from "../store/userAuthStore";
import { Loader2, Check, X, Send } from "lucide-react";

export default function RequestsPage() {
  const { authUser, fetchAllNotifications, notifications, acceptRequest } = UserAuth();

  useEffect(() => {
    if (authUser?._id) {
      fetchAllNotifications(authUser._id);
    }
  }, [authUser]);

  if (!authUser) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Please login to view your notifications.
      </div>
    );
  }

  const received = notifications?.received || [];
  const sent = notifications?.sent || [];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-white">
          Requests & Notifications
        </h1>

        {/* ✅ Received Requests */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-blue-400 flex items-center gap-2">
            <Loader2 size={20} /> Incoming Requests
          </h2>
          <div className="bg-[#1b1b1b] p-4 rounded-lg space-y-3">
            {received.length ? (
              received.map((req) => (
                <div
                  key={req.notificationId}
                  className="flex justify-between items-center bg-[#222] p-3 rounded-md hover:bg-[#2b2b2b] transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={req.sender?.profilePic || "/default-avatar.png"}
                      alt="profile"
                      className="w-10 h-10 rounded-full border border-gray-700"
                    />
                    <div>
                      <p className="font-semibold text-white">
                        {req.sender?.username || "Unknown User"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {req.message || "sent you a friend request."}
                      </p>
                    </div>
                  </div>

                  {!req.isAccepted ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          acceptRequest({
                            userId: authUser._id,
                            notificationId: req.notificationId,
                          })
                        }
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-md flex items-center gap-1 text-sm"
                      >
                        <Check size={14} /> Accept
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-1 text-sm"
                      >
                        <X size={14} /> Decline
                      </button>
                    </div>
                  ) : (
                    <span className="text-green-400 text-sm flex items-center gap-1">
                      <Check size={14} /> Accepted
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No pending requests.</p>
            )}
          </div>
        </section>

        {/* ✅ Sent Requests */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-yellow-400 flex items-center gap-2">
            <Send size={20} /> Sent Requests
          </h2>
          <div className="bg-[#1b1b1b] p-4 rounded-lg space-y-3">
            {sent.length ? (
              sent.map((req) => (
                <div
                  key={req.notificationId}
                  className="flex justify-between items-center bg-[#222] p-3 rounded-md hover:bg-[#2b2b2b] transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={req.receiver?.profilePic || "/default-avatar.png"}
                      alt="profile"
                      className="w-10 h-10 rounded-full border border-gray-700"
                    />
                    <div>
                      <p className="font-semibold text-white">
                        {req.receiver?.username || "Unknown User"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {req.message || "Friend request pending..."}
                      </p>
                    </div>
                  </div>
                  {req.isAccepted ? (
                    <span className="text-green-400 text-sm flex items-center gap-1">
                      <Check size={14} /> Accepted
                    </span>
                  ) : (
                    <span className="text-yellow-400 text-sm flex items-center gap-1">
                      <Loader2 size={14} /> Pending
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No sent requests.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
