import React, { useState, useEffect } from "react";
import { matrixAuthStore } from "../store/matrixStore";
import { useChallengeStore } from "../store/ChallengeStore";
import { UserAuth } from "../store/userAuthStore";
import { CardSpotlight } from "../components/ui/card-spotlight"; // Adjusted path

const ChallengeComponent = () => {
  const { authUser } = UserAuth();
  const userId = authUser?._id;
  const {
    generateChallenges,
    fetchChallenges,
    completeChallenge,
    calculateRank,
    challenges,
    rank,
    loading,
    delete_challenge,
  } = useChallengeStore();

  const [openDescIndex, setOpenDescIndex] = useState(null); // for toggle

  useEffect(() => {
    if (userId) {
      fetchChallenges(userId, "daily");
      calculateRank(userId);
    }
  }, [userId]);

  return (
    <div
      className="bg-gray-900 min-h-screen pt-24 p-2 flex items-center justify-center"
      style={{
        backgroundImage: `url(./challengebg.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed", // Keep the static background image
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
          backdropFilter: "blur(10px)", // Translucent blue with blur
        }}
        color="#0A0A23" // Dark blue to match the theme
        radius={350}
      >
        {/* Content Wrapper to ensure content is above the pattern */}
        <div className="relative z-10">
          {/* Header with Neon Effect */}
          <div className="absolute  -top-18 left-1/2 transform -translate-x-1/2 text-white text-lg sm:text-3xl font-bold bg-blue-700 px-4 py-2 rounded-t-lg" style={{ textShadow: "0 0 10px rgba(0, 191, 255, 1), 0 0 20px rgba(0, 191, 255, 0.6)", zIndex: 20 }}>
            Daily Quests
          </div>

          {/* New Challenges Button */}
          <div className="text-center my-4">
            <span
              onClick={() => {
                generateChallenges(userId);
              }}
              className="text-sm border rounded-md p-1 hover:bg-gray-500 hover:scale-120 text-white"
              style={{ textShadow: "0 0 5px rgba(0, 191, 255, 0.8)" }}
            >
              New Quests 
            </span>
          </div>

          {loading && <p className="text-center text-white">Loading...</p>}

          <ul className="space-y-4 mt-4">
            {challenges.map((c, i) => {
              const isCompleted = c.completed || false
              return (
                <li
                  key={i}
                  className="flex flex-col border-2 border-blue-400 rounded-md px-4 py-3 bg-blue-900 transition hover:bg-blue-800"
                  style={{ boxShadow: "inset 0 0 10px rgba(0, 191, 255, 0.3)" }}
                >
                  <div className="sm:flex items-start justify-between">
                    <div className="sm:text-lg font-medium text-white" style={{ textShadow: "0 0 3px rgba(0, 191, 255, 0.8)" }}>
                      {c.title}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setOpenDescIndex(openDescIndex === i ? null : i)}
                        className="text-sm text-blue-300 hover:underline"
                        style={{ textShadow: "0 0 3px rgba(0, 191, 255, 0.6)" }}
                      >
                        {openDescIndex === i ? "Hide" : "Details"}
                      </button>
                      {/* <button onClick={() => { fetchChallenges(userId, "daily"); delete_challenge(c._id); }} className="text-red-400 hover:text-red-300">❌</button> */}
                    <select
  value={isCompleted ? "Completed" : "Pending"}
  onChange={async (e) => {
    if (e.target.value === "Completed" && !isCompleted) {
      await completeChallenge({
        userId,
        category: c.metricCategory,
        metric: c.subMetric,
        cId: c._id,
      });

      // Wait for fresh data before re-render
      await fetchChallenges(userId, "daily");
    }
  }}
  className="bg-blue-800 text-white border border-blue-500 rounded-md p-1 accent-green-500"
  disabled={isCompleted}
>
  <option value="Pending">Pending</option>
  <option value="Completed">Completed</option>
</select>

                    </div>
                  </div>

                  {openDescIndex === i && (
                    <div className="text-sm text-gray-300 mt-2 ml-7">
                      <p>{c.description}</p>
                      {c.resource?.url && (
                        <a
                          href={c.resource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block mt-1 text-blue-400 underline"
                          style={{ textShadow: "0 0 2px rgba(0, 191, 255, 0.4)" }}
                        >
                          🔗 {c.resource.name}
                        </a>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="text-center mt-6">
            <p className="text-md font-semibold text-white" style={{ textShadow: "0 0 5px rgba(0, 191, 255, 0.8)" }}>
              🧬 Your Current Rank:{" "}
              <span className="text-purple-600">{rank?.rank}</span>
            </p>
          </div>
        </div>
      </CardSpotlight>
    </div>
  );
};

export default ChallengeComponent;