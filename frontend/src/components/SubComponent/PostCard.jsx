import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  ShieldCheck,
  X,
} from "lucide-react";
import { usePostStore } from "../../store/PostStore";
import { UserAuth } from "../../store/userAuthStore";

const PostCard = ({ post }) => {
  const { authUser } = UserAuth();
  const {
    toggleLike,
    fetchPostComments,
    comments,
    addComment,
    verifyPost,
  } = usePostStore();

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [expandedChallenge, setExpandedChallenge] = useState(null); // 👁️ Enlarge proof view
  const [verifying, setVerifying] = useState(false);

  const postComments = comments[post._id] || [];

  // 🧠 Toggle Comments
  const handleToggleComments = async () => {
    if (!showComments) await fetchPostComments(post?._id);
    setShowComments(!showComments);
  };

  // 💬 Add Comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    await addComment(post._id, {
      userId: authUser?._id,
      text: commentText,
    });
    setCommentText("");
    await fetchPostComments(post._id);
  };

  // ❤️ Like/Unlike Post
  const handleLike = async () => {
    await toggleLike(post?._id, authUser?._id);
  };

  // 🛡️ Verify challenge
  const handleVerify = async (index) => {
    if (verifying) return;
    setVerifying(true);
    await verifyPost(post._id, authUser?._id, index);
    setVerifying(false);
  };

  return (
    <div className="w-full sm:w-[450px] md:w-[500px] bg-black text-white rounded-2xl border border-neutral-800 overflow-hidden my-6 shadow-md relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img
            src={post.userId?.avatar || "/profile.png"}
            alt="user"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-semibold text-sm">{post.userId?.username}</span>
        </div>
        <MoreHorizontal className="text-neutral-400 cursor-pointer" />
      </div>

      {/* Challenges grid */}
      <div className="grid grid-cols-2 gap-1">
        {post.challenges.map((ch, i) => (
          <div
            key={i}
            className="relative group cursor-pointer overflow-hidden border border-neutral-800"
            onClick={() => setExpandedChallenge({ ...ch, index: i })}
          >
            <img
              src={ch.proofImage || "/noImage.jpg"}
              alt={ch.title}
              className="object-cover w-full h-40 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs p-2">
              <b>{ch.title}</b>
              <p className="text-neutral-400 truncate">
                {ch.description || "No summary"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between px-4 py-3">
        <div className="flex gap-5 items-center">
          <Heart
            className={`cursor-pointer ${
              post.likes?.includes(authUser?._id)
                ? "text-red-500 fill-red-500"
                : "text-neutral-300"
            }`}
            onClick={handleLike}
          />
          <MessageCircle
            onClick={handleToggleComments}
            className="hover:text-neutral-300 cursor-pointer"
          />
          <Send className="hover:text-neutral-300 cursor-pointer" />
        </div>
        <Bookmark className="hover:text-neutral-300 cursor-pointer" />
      </div>

      {/* Like / comment counts */}
      <div className="px-4 text-sm font-semibold flex justify-between">
        <span>{post.likes?.length || 0} likes</span>
        <span>{postComments.length || 0} comments</span>
      </div>

      {/* Caption */}
      <div className="px-4 pb-3 text-sm">
        <span className="font-semibold">{post.userId?.username} </span>
        {post.caption || ""}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4 text-sm animate-fadeIn">
          {postComments.length === 0 ? (
            <p className="text-neutral-500">No comments yet</p>
          ) : (
            postComments.map((c) => (
              <div key={c._id} className="mb-2">
                <span className="font-semibold">{c.username}: </span>
                {c.text}
              </div>
            ))
          )}

          {/* Add new comment input */}
          <div className="mt-3 border-t border-neutral-800 pt-2 flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="bg-transparent border-none outline-none flex-1 text-sm placeholder-neutral-500"
            />
            <button
              onClick={handleAddComment}
              className="text-emerald-500 font-semibold text-sm hover:text-emerald-400"
            >
              Post
            </button>
          </div>
        </div>
      )}

      {/* Expanded Proof Modal */}
      {expandedChallenge && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-neutral-900 rounded-2xl p-5 max-w-lg w-full relative">
            <button
              className="absolute top-3 right-3 text-neutral-400 hover:text-white"
              onClick={() => setExpandedChallenge(null)}
            >
              <X />
            </button>

            <img
              src={expandedChallenge.proofImage || "/noimg.svg"}
              alt={expandedChallenge.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />

            <h2 className="text-lg font-extralight">{expandedChallenge.description}</h2>
            <p className="text-sm text-neutral-400 mb-3">
              {expandedChallenge.proofText}
            </p>

            <div className="flex justify-between items-center">
              <p className="text-sm">
                ✅ {expandedChallenge.verifyCount || 0}/45 verified
              </p>
              <button
                onClick={() => handleVerify(expandedChallenge.index)}
                disabled={verifying}
                className={`px-3 py-1 rounded-md text-sm ${
                  verifying
                    ? "bg-neutral-700 text-neutral-400"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                <ShieldCheck className="inline mr-1 w-4 h-4" />
                {verifying ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
