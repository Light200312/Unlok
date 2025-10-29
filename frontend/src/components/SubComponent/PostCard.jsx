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
  const [expandedChallenge, setExpandedChallenge] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const postComments = comments[post._id] || [];

  const handleToggleComments = async () => {
    if (!showComments) await fetchPostComments(post?._id);
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    await addComment(post._id, {
      userId: authUser?._id,
      text: commentText,
    });
    setCommentText("");
    await fetchPostComments(post._id);
  };

  const handleLike = async () => {
    await toggleLike(post?._id, authUser?._id);
  };

  const handleVerify = async (index) => {
    if (verifying) return;
    setVerifying(true);
    await verifyPost(post._id, authUser?._id, index);
    setVerifying(false);
  };

  return (
    <div
      className="relative w-full max-w-2xl border-4 border-emerald-400 rounded-xl p-5 my-8
      bg-[rgba(10,10,35,0.65)] backdrop-blur-md text-white shadow-[0_0_15px_rgba(0,255,150,0.4)]
      transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,255,180,0.8)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={post.userId?.avatar || "/profile.png"}
            alt="user"
            className="w-10 h-10 rounded-full border border-emerald-500"
          />
          <span className="font-semibold">{post.userId?.username}</span>
        </div>
        <MoreHorizontal className="text-gray-400 cursor-pointer hover:text-emerald-400" />
      </div>

      {/* Caption */}
      {post.caption && (
        <p className="mb-3 text-sm text-gray-300 border-l-2 border-emerald-400 pl-3 italic">
          {post.caption}
        </p>
      )}

      {/* Challenges */}
      <ul className="space-y-3">
        {post.challenges.map((ch, i) => (
          <li
            key={i}
            onClick={() => setExpandedChallenge({ ...ch, index: i })}
            className="flex justify-between items-center px-4 py-3 border-2 border-emerald-400 rounded-lg 
            cursor-pointer bg-black/40 hover:bg-emerald-900/20 
            transition-all duration-300 hover:shadow-[0_0_12px_rgba(0,255,180,0.5)]"
          >
            <span className="font-medium">{ch.title}</span>
            <button className="text-sm text-emerald-400 hover:text-white transition">
              Details
            </button>
          </li>
        ))}
      </ul>

      {/* Actions (Glow Box) */}
      <div
        className="mt-5 border-2 border-emerald-500 rounded-lg p-3 flex justify-between items-center
        transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,150,0.7)]"
      >
        <div className="flex gap-6 items-center">
          <Heart
            className={`cursor-pointer transition ${
              post.likes?.includes(authUser?._id)
                ? "text-emerald-400 fill-emerald-400 scale-110"
                : "text-gray-400 hover:text-emerald-300"
            }`}
            onClick={handleLike}
          />
          <MessageCircle
            onClick={handleToggleComments}
            className="cursor-pointer text-gray-400 hover:text-emerald-300"
          />
          <Send className="cursor-pointer text-gray-400 hover:text-emerald-300" />
        </div>
        <Bookmark className="cursor-pointer text-gray-400 hover:text-emerald-300" />
      </div>

      {/* Like / comment counts */}
      <div className="text-sm font-semibold flex justify-between mt-2 text-emerald-300">
        <span>{post.likes?.length || 0} likes</span>
        <span>{postComments.length || 0} comments</span>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-emerald-500 pt-3 text-sm">
          {postComments.length === 0 ? (
            <p className="text-gray-400">No comments yet</p>
          ) : (
            postComments.map((c) => (
              <div key={c._id} className="mb-2">
                <span className="font-semibold text-emerald-300">{c.username}: </span>
                {c.text}
              </div>
            ))
          )}
          {/* Add comment */}
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="bg-transparent border border-emerald-500 rounded-md px-2 py-1 flex-1 text-white focus:outline-none text-sm"
            />
            <button
              onClick={handleAddComment}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm px-3 py-1 rounded-md transition"
            >
              Post
            </button>
          </div>
        </div>
      )}

{expandedChallenge && (
  <div
    className="sticky top-12  z-[9999] flex items-center justify-center 
               bg-black/80 backdrop-blur-md animate-fadeIn"
  >
    <div
      className="relative bg-[#0b0b20] border border-emerald-500 rounded-2xl 
                 shadow-[0_0_40px_rgba(0,255,180,0.7)] p-6 w-[90%] sm:w-[700px] 
                 max-h-[90vh] overflow-y-auto text-white"
    >
      {/* Close button */}
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        onClick={() => setExpandedChallenge(null)}
      >
        <X size={22} />
      </button>

      {/* Image */}
      {expandedChallenge.proofImage && (
        <div className="flex justify-center mb-4">
          <img
            src={expandedChallenge.proofImage}
            alt={expandedChallenge.title}
            className="w-full max-h-[60vh] object-contain rounded-lg border border-emerald-600"
          />
        </div>
      )}

      {/* Title */}
      <h2 className="text-xl font-semibold text-emerald-300 mb-2 text-center">
        {expandedChallenge.title}
      </h2>

      {/* Description */}
      <p className="text-sm text-gray-300 leading-relaxed mb-4 text-center">
        {expandedChallenge.description ||
          expandedChallenge.proofText ||
          "No description available for this challenge."}
      </p>

      {/* Verify Section */}
      <div className="flex justify-between items-center mt-3">
        <p className="text-sm text-emerald-400">
          ✅ {expandedChallenge.verifyCount || 0}/45 verified
        </p>
        <button
          onClick={() => handleVerify(expandedChallenge.index)}
          disabled={verifying}
          className={`px-4 py-1.5 rounded-md text-sm flex items-center gap-1
            ${
              verifying
                ? "bg-neutral-700 text-neutral-400"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
        >
          <ShieldCheck className="w-4 h-4" />
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
