import React, { useState } from "react";
import {
    CheckCircle,
    Eye,
    Tag,
    Heart,
    MessageCircle,
    Send,
    Maximize, // New icon for expand
    Minimize, // New icon for collapse
} from "lucide-react";
import { cn } from "../../lib/utils";

// --- Import Swiper components and styles ---
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules"; 
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation"; 
// ------------------------------------------

/**
 * A redesigned, minimalist PostCard with a Swiper for multiple challenges,
 * featuring a Glassmorphism theme, clear images, and expandable details.
 */
export default function PostCard({
    post,
    currentUserId,
    onLike,
    onShowComments,
    onAddComment,
    onVerify,
}) {
    const [commentText, setCommentText] = useState("");
    // State to manage which challenge slide is expanded
    const [expandedChallengeIndex, setExpandedChallengeIndex] = useState(null); 

    const isLiked = post.likes?.includes(currentUserId);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentText.trim() || !onAddComment) return;
        onAddComment(post._id, commentText);
        setCommentText("");
    };

    // --- Glassmorphism Style Classes ---
    const glassCardClass = cn(
        "bg-white/10 rounded-2xl p-6 mb-6 backdrop-blur-xl shadow-lg transition-all",
        "border border-white/20",
        "text-white",
        "post-card-glass"
    );

    // Input uses black/30 background for contrast and readability
    const glassInputClass = "input input-bordered input-sm w-full bg-black/30 border-white/40 placeholder-white/70 text-white focus:ring-2 focus:ring-primary";
    // ------------------------------------

    return (
        <div className={glassCardClass}>
            {/* --- Card Header: User Info --- */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <img
                        src={post.userId?.profilePic || "/profile.png"}
                        alt={post.userId?.username || "user"}
                        className="w-10 h-10 rounded-full bg-white/30 object-cover border border-white/50"
                    />
                    <div>
                        <h2 className="font-semibold text-white drop-shadow">
                            {post.userId?.username || "Unknown User"}
                        </h2>
                        <p className="text-sm text-white/70 drop-shadow">
                            {post.userId?.rank || "Novice"}
                        </p>
                    </div>
                </div>
                <div className="text-sm text-white/60 pt-1 drop-shadow">
                    {formatDate(post.createdAt)}
                </div>
            </div>

            {/* --- Post Caption/Description --- */}
            {post.caption && (
                <p className="text-white/90 my-4 whitespace-pre-line text-lg font-bold drop-shadow">
                    {post.caption || "none Post Caption"}
                </p>

            )}
            <div className="ml-2">{ post.description}</div>

            {/* --- Challenge Swiper (Social Media Post Style) --- */}
            {post.challenges && post.challenges.length > 0 && (
                <div className="mt-4 mb-6 relative">
                    <Swiper
                        modules={[Pagination, Navigation]}
                        spaceBetween={10}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        // Set unique navigation IDs for multi-card scenario
                        navigation={{
                             nextEl: `.swiper-button-next-${post._id}`,
                             prevEl: `.swiper-button-prev-${post._id}`,
                        }}
                        className="rounded-xl overflow-hidden shadow-2xl glass-swiper w-full"
                        onSlideChange={() => setExpandedChallengeIndex(null)}
                    >
                        {post.challenges.map((ch, i) => {
                            const isExpanded = expandedChallengeIndex === i;

                            return (
                                <SwiperSlide key={ch.challengeId || i}>
                                    <div
                                        className={cn(
                                            "flex flex-col rounded-xl overflow-hidden transition-all duration-300",
                                            isExpanded ? "h-[550px] min-h-[550px]" : "h-96 min-h-96" // Adjust overall slide height
                                        )}
                                    >
                                    
                                        
                                        {/* === CHALLENGE HEADER (Above Image) === */}
                                        <div className="flex-shrink-0 p-3 border-b border-white/20 bg-black/50 backdrop-blur-md z-10">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-lg font-bold text-white drop-shadow">
                                                    {ch.title}
                                                </h3>
                                                {/* Metric/SubMetric */}
                                                <div className="text-right text-xs text-white/80 font-medium drop-shadow-md">
                                                    <Tag size={12} className="inline-block mr-1" />
                                                    <span className="uppercase">{ch.metricCategory || "General"}</span>
                                                    <div className="text-white/60">{ch.subMetric || "N/A"}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* === IMAGE/PROOF AREA (Main Content) === */}
                                        <div className="flex-grow w-full min-h-0"> {/* flex-grow to take remaining space, min-h-0 for proper flex behavior */}
                                            {ch.proofImage ? (
                                                <img 
                                                    src={ch.proofImage} 
                                                    alt={`Challenge ${i + 1} proof`}
                                                    className="w-full h-full object-cover" 
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-700/80">
                                                    <Eye size={48} className="text-white/50" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* === CHALLENGE FOOTER (Below Image) === */}
                                        <div
                                            className={cn(
                                                "flex-shrink-0 p-4 border-t border-white/20",
                                                "bg-black/50 backdrop-blur-md shadow-2xl z-10", 
                                                "transition-all duration-300",
                                                // Adjust footer height based on expanded state
                                                isExpanded ? "h-fit max-h-[60%] overflow-y-auto" : "max-h-[80px] overflow-hidden" 
                                            )}
                                            onClick={(e) => { // Allow clicking anywhere on the footer to expand/collapse
                                                e.stopPropagation();
                                                setExpandedChallengeIndex(isExpanded ? null : i);
                                            }}
                                        >
                                            {/* Scrollable Content Area */}
                                            <div className={cn(
                                                "transition-all duration-300",
                                                isExpanded ? "opacity-100" : "opacity-80" 
                                            )}>
                                                
                                                {/* Description / Goal (Always visible, expands fully) */}
                                                <div className="mb-2 text-sm text-white/80 drop-shadow">
                                                    <span className="font-semibold uppercase text-white/90">Goal: </span>
                                                    <p className={cn(
                                                        "transition-all duration-300",
                                                        isExpanded ? "max-h-24 overflow-y-auto" : "max-h-6 truncate"
                                                    )}>
                                                        {ch.description}
                                                    </p>
                                                </div>
                                                
                                                {/* Proof Text (Only fully visible when expanded) */}
                                                {ch.proofText && (
                                                    <div className={cn(
                                                        "pt-1 transition-all duration-300",
                                                        isExpanded ? "max-h-40 opacity-100 overflow-y-auto" : "max-h-0 opacity-0"
                                                    )}>
                                                        <div className="text-xs font-semibold uppercase text-white/80 mb-1 drop-shadow">Solution:</div>
                                                        <p className="text-sm text-white/90 leading-relaxed whitespace-pre-line drop-shadow">
                                                            {ch.proofText}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Bar (Always Visible at bottom of footer) */}
                                            <div className="flex justify-between items-center pt-2 mt-2 border-t border-white/30">
                                                <span className="font-medium text-primary text-sm drop-shadow flex items-center gap-1">
                                                    <Eye size={14} /> {ch.verifyCount}/7 Approvals
                                                </span>
                                                
                                                <div className="flex items-center gap-2">
                                                     {/* Toggle Button */}
                                                    <button
                                                         onClick={(e) => {
                                                            e.stopPropagation(); 
                                                            setExpandedChallengeIndex(isExpanded ? null : i);
                                                         }}
                                                         className="btn btn-sm btn-ghost text-white/70 hover:text-white transition"
                                                         aria-label={isExpanded ? "Collapse Details" : "Expand Details"}
                                                    >
                                                        {isExpanded ? <Minimize size={18} /> : <Maximize size={18} />}
                                                    </button>
                                                
                                                    {/* Verification Button (Only visible when expanded) */}
                                                    {onVerify && isExpanded && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation(); 
                                                                onVerify(ch, post._id);
                                                            }}
                                                            className="btn btn-sm bg-white/80 text-base-content hover:bg-white border-none"
                                                            aria-label="Approve Solution"
                                                        >
                                                            <CheckCircle size={16} />
                                                            Verify
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                    
                     {/* Custom Swiper Navigation Buttons (Ensures visibility and custom styling) */}
                     <div className={`swiper-button-prev swiper-button-prev-${post._id} !text-white !bg-black/30 !rounded-full !w-8 !h-8 !transition-all hover:!bg-black/50 !-left-2`}></div>
                     <div className={`swiper-button-next swiper-button-next-${post._id} !text-white !bg-black/30 !rounded-full !w-8 !h-8 !transition-all hover:!bg-black/50 !-right-2`}></div>
                </div>
            )}

            {/* --- Post Actions (Like/Comment/Tags) --- */}
            <div className="flex items-center gap-2 pt-4 border-t border-white/20">
                {onLike && (
                    <button
                        onClick={() => onLike(post._id)}
                        className={cn(
                            "btn btn-sm btn-ghost flex items-center gap-1.5 text-white/70",
                            isLiked ? "text-red-400" : "hover:text-red-300"
                        )}
                        aria-label="Like post"
                    >
                        <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                        {post.likes?.length || 0}
                    </button>
                )}
                {onShowComments && (
                    <button
                        onClick={() => onShowComments(post._id)}
                        className="btn btn-sm btn-ghost flex items-center gap-1.5 text-white/70 hover:text-white"
                        aria-label="Show comments"
                    >
                        <MessageCircle size={18} />
                        {post.commentCount || 0}
                    </button>
                )}
                <div className="flex-grow"></div>
                {/* Spacer */}
                
                {/* --- Post Tags (Re-integrated) --- */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 justify-end">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="text-xs text-white/70 border border-white/50 px-2 py-0.5 rounded-full backdrop-blur-sm drop-shadow"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* --- Add Comment Input (Re-integrated) --- */}
            {onAddComment && (
                <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-4">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        className={glassInputClass}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        aria-label="Add a comment"
                    />
                    <button
                        type="submit"
                        className="btn btn-primary btn-sm btn-square bg-white/30 border-none hover:bg-white/40 text-white"
                        aria-label="Send comment"
                    >
                        <Send size={16} />
                    </button>
                </form>
            )}
        </div>
    );
}