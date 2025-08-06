import React, { useState, useEffect } from "react";
import { matrixAuthStore } from "../store/matrixStore";
import { useChallengeStore } from "../store/ChallengeStore";
import { UserAuth } from "../store/userAuthStore";
import { CardSpotlight } from "../components/ui/card-spotlight";
import "../index.css";

const rankTiers = [
  { points: 700, code: "S1", title: "Devine" },
  { points: 500, code: "A2", title: "Spirit" },
  { points: 350, code: "B3", title: "Sovereign" },
  { points: 200, code: "C4", title: "Saint" },
  { points: 100, code: "D5", title: "Master" },
  { points: 50,  code: "E6", title: "Awakened" },
  { points: 0,   code: "F7", title: "Sleeper" },
];

const StatsAndRanking = () => {
  const { calculateRank } = useChallengeStore();
  const { authUser } = UserAuth();
  const {
    matrices,
    fetchMatrices,
    updateMetric,
    deleteMatrix,
    addCustom,
    addCustomToGeneral,
  } = matrixAuthStore();

  const [openMatrixIds, setOpenMatrixIds] = useState([]);

  useEffect(() => {
    if (authUser?._id) {
      calculateRank(authUser._id);
      fetchMatrices(authUser._id);
    }
  }, [authUser]);

  const toggleMatrix = (id) => {
    setOpenMatrixIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // --- Calculate rank and title ---
  const points = parseInt(authUser?.points || 0);
  const matchedTier = rankTiers.find((tier) => points >= tier.points) || rankTiers[rankTiers.length - 1];
  const computedRank = matchedTier.code;
  const computedTitle = matchedTier.title;
  const computedBadge = matchedTier.title; // You can change badge logic if needed

  const CategoryDescription = {
    "Cognitive Growth": "Cognitive Growth refers to the development of mental capabilities like focus, problem solving, critical thinking, learning speed, and memory. It enhances your ability to process information, make sound decisions, and adapt to new knowledge.",
    "Physical Wellness": "Physical Wellness involves maintaining a healthy body through strength, stamina, sleep, and overall health score. It supports energy levels, immunity, and mental clarity.",
    "Emotional Intelligence": "Emotional Intelligence is the ability to understand, use, and manage emotions effectively. Skills like self-awareness, impulse control, empathy, and stress management help build meaningful relationships.",
    "Social Character": "Social Character encompasses traits like communication, leadership, conflict resolution, and integrity. These are critical for building trust and collaboration.",
    "Discipline & Productivity": "This reflects your ability to stay organized, complete tasks, and manage time. Essential for consistent progress and long-term success.",
    "Growth Mindset": "A Growth Mindset believes in developing abilities through effort and learning. It encourages persistence and self-improvement.",
    "Purpose & Values": "Purpose & Values involve aligning your actions with meaningful goals, core values, and contribution. It brings direction and motivation.",
  };

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
      <div className="absolute inset-0 bg-black opacity-20" style={{ zIndex: 1 }}></div>

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
        {/* Header */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white text-lg sm:text-3xl font-bold bg-blue-700 px-4 py-2 rounded-t-lg font-bitcount" style={{ textShadow: "0 0 10px rgba(0, 191, 255, 1), 0 0 20px rgba(0, 191, 255, 0.6)", zIndex: 20 }}>
          [{authUser?.username?.toUpperCase() || "PROFILE"}]
        </div>

        {/* Profile Info */}
        <div className="text-white sm:text-lg mt-8 flex flex-col items-center font-bitcount">
          <div className="mb-2"><strong>NAME:</strong> {authUser?.username?.toUpperCase() || "Unknown"}</div>
          <div className="mb-2"><strong>AGE:</strong> Unknown</div>
          <div className="mb-2"><strong>POINTS:</strong> {authUser?.points ?? "N/A"}</div>
          <div className="mb-2"><strong>RANKING:</strong> {computedRank}</div>
          <div className="mb-2"><strong>TITLE:</strong> {computedTitle}</div>
          <div className="mb-2"><strong>BADGES:</strong> {computedBadge}</div>
        </div>

        {/* Matrix Cards */}
        <div className="mt-6">
          {matrices?.map((matrix) => (
            <div key={matrix._id} className="mb-6 p-1 sm:p-2 bg-blue-900 hover:bg-blue-800 border-2 border-blue-400 rounded-sm sm:rounded-lg" style={{ boxShadow: "inset 0 0 10px rgba(0, 191, 255, 0.3)" }}>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => toggleMatrix(matrix._id)}
                  className="flex items-center sm:text-xl font-bold text-white font-bitcount"
                  style={{ textShadow: "0 0 5px rgba(0, 191, 255, 0.8)" }}
                >
                  {matrix.category}
                  <span
                    className="ml-2 transform transition-transform duration-300 font-bitcount"
                    style={{ textShadow: "0 0 3px rgba(0, 191, 255, 0.8)" }}
                    aria-label={openMatrixIds.includes(matrix._id) ? "Collapse" : "Expand"}
                  >
                    <span className="text-xs">{openMatrixIds.includes(matrix._id) ? "▲" : "▼"}</span>
                  </span>
                </button>
              </div>

              {openMatrixIds.includes(matrix._id) && (
                <>
                  <div className="text-sm text-gray-300 mt-1 transition-all duration-300 ease-in-out font-bitcount">
                    {CategoryDescription[matrix.category] || "No description"}
                  </div>
                  {matrix.metrics.map((metric) => (
                    <div key={metric.name} className="flex items-center gap-2 mb-1 text-white mt-2 font-bitcount">
                      <span>{metric.name}: {metric.value}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 text-white text-sm italic font-bitcount">
          <strong>OVERALL EVALUATION:</strong> A user with unique skills awakened due to recent challenges. It's best to observe carefully.
        </div>
      </CardSpotlight>
    </div>
  );
};

export default StatsAndRanking;
