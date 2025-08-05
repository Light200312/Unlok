import React, { useState, useEffect } from "react";
import { matrixAuthStore } from "../store/matrixStore";
import { useChallengeStore } from "../store/ChallengeStore";
import { UserAuth } from "../store/userAuthStore";
import { CardSpotlight } from "../components/ui/card-spotlight"; // Adjusted path
import "../index.css";

const StatsAndRanking = () => {
  const { calculateRank, rank, titles, badges } = useChallengeStore();
  const { authUser } = UserAuth();
  const {
    matrices,
    fetchMatrices,
    updateMetric,
    deleteMatrix,
    addCustom,
    addCustomToGeneral,
  } = matrixAuthStore();

  const CategoryDescription = {
    "Cognitive Growth":
      "Cognitive Growth refers to the development of mental capabilities like focus, problem solving, critical thinking, learning speed, and memory. It enhances your ability to process information, make sound decisions, and adapt to new knowledge. Strengthening this area improves mental agility and long-term intellectual development, essential for success in education and work.",

    "Physical Wellness":
      "Physical Wellness involves maintaining a healthy body through strength, stamina, sleep, and overall health score. It supports energy levels, immunity, and mental clarity. A well-maintained physical condition enables you to perform daily tasks efficiently and reduces the risk of chronic illnesses, directly impacting quality of life.",

    "Emotional Intelligence":
      "Emotional Intelligence is the ability to understand, use, and manage emotions effectively. Skills like self-awareness, impulse control, empathy, and stress management help build meaningful relationships and regulate emotional responses. It is vital for both personal well-being and social success, reducing conflict and promoting resilience.",

    "Social Character":
      "Social Character encompasses interpersonal traits such as communication, listening, leadership, conflict resolution, and integrity. These qualities are critical for collaboration, building trust, and creating a positive social impact. A strong social character helps you contribute effectively to communities, teams, and relationships.",

    "Discipline & Productivity":
      "This area reflects your ability to stay organized, complete tasks, manage time, and maintain habits aligned with goals. Developing discipline and productivity boosts personal achievement and reduces stress. It forms the foundation of consistent progress, essential for long-term success and fulfillment.",

    "Growth Mindset":
      "A Growth Mindset is the belief that abilities can be developed through effort and learning. Qualities like openness to feedback, engaging in learning activities, resilience, and seeking mentorship promote personal and professional evolution. It encourages persistence through challenges and fosters continuous self-improvement.",

    "Purpose & Values":
      "Purpose & Values involve aligning your actions with meaningful goals, core values, and a sense of contribution. Attributes like goal clarity, value alignment, contribution, and self-reflection bring direction and motivation. Cultivating this area leads to a more meaningful life and inner fulfillment.",
  };

  useEffect(() => {
    calculateRank(authUser._id);
    fetchMatrices(authUser._id);
  }, []);

  return (
    <div
      className="bg-gray-900 min-h-screen p-2 pt-24 flex items-center justify-center font-bitcount"
      style={{
        backgroundImage: `url(./panelbg.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        position: "relative",
      }}
    >
      {/* Overlay to darken the blurred background */}
      <div
        className="absolute inset-0 bg-black opacity-20"
        style={{ zIndex: 1 }}
      ></div>
      <CardSpotlight
        className="w-full max-w-2xl p-6 border-4 border-blue-700 rounded-lg z-10"
        style={{
          boxShadow: "0 0 15px rgba(0, 191, 255, 0.7)",
          backgroundColor: "rgba(0, 0, 139, 0.7)",
          backdropFilter: "blur(0px)",
        }}
        color="#0A0A23"
        radius={350}
      >
        {/* Header with Neon Effect */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white text-lg sm:text-3xl font-bold bg-blue-700 px-4 py-2 rounded-t-lg font-bitcount" style={{ textShadow: "0 0 10px rgba(0, 191, 255, 1), 0 0 20px rgba(0, 191, 255, 0.6)", zIndex: 20 }}>
          [{authUser.username} PROFILE]
        </div>

        {/* User Info */}
        <div className="text-white sm:text-lg mt-8 flex flex-col items-center font-bitcount">
          <div className="mb-2"><strong>NAME:</strong> {authUser.username.toUpperCase() || "Unknown"}</div>
          <div className="mb-2"><strong>AGE:</strong> UnKnown</div>
          <div className="mb-2"><strong>Points:</strong> {authUser.points}</div>
          <div className="mb-2"><strong>RANKING:</strong> {rank || "N/A"}</div>
          <div className="mb-2"><strong>TITLE:</strong> {titles || "No Title"}</div>
          <div className="mb-2"><strong>BADGES:</strong> {badges?.join(", ") || "None"}</div>
        </div>

        {/* Stats and Skills */}
        <div className="mt-6">
          {/* {console.log(metrics)} */}
          {matrices?.map((matrix) => {
            const [isOpen, setIsOpen] = useState(false);

            return (
              <div key={matrix._id} className="mb-6 p-1 sm:p-2 bg-blue-900 hover:bg-blue-800 border-2 border-blue-400 rounded-sm sm:rounded-lg " style={{ boxShadow: "inset 0 0 10px rgba(0, 191, 255, 0.3)" }}>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center sm:text-xl font-bold text-white font-bitcount"
                    style={{ textShadow: "0 0 5px rgba(0, 191, 255, 0.8)" }}
                  >
                    {matrix.category}
                    <span
                      className="ml-2 transform transition-transform duration-300 font-bitcount"
                      style={{ textShadow: "0 0 3px rgba(0, 191, 255, 0.8)" }}
                      aria-label={isOpen ? "Collapse" : "Expand"}
                    >
                      <span className="text-xs">{isOpen ? "▲" : "▼"}</span>
                    </span>
                  </button>
                </div>
                {isOpen && (
                  <>
                    <div className="text-sm text-gray-300 mt-1 transition-all duration-300 ease-in-out font-bitcount">
                      {CategoryDescription[matrix.category]}
                    </div>
                    {matrix.metrics.map((metric) => (
                      <div key={metric.name} className="flex items-center gap-2 mb-1 text-white mt-2 font-bitcount">
                        <span>{metric.name}: {metric.value}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Overall Evaluation */}
        <div className="mt-6 text-white text-sm italic font-bitcount">
          <strong>OVERALL EVALUATION:</strong> A user with unique skills awakened due to recent challenges. It's best to observe carefully.
        </div>
      </CardSpotlight>
    </div>
  );
};

export default StatsAndRanking;