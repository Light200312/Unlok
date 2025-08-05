import React, { useState, useEffect } from "react";
import { UserAuth } from "../store/userAuthStore";
import { CardSpotlight } from "../components/ui/card-spotlight"; // Adjusted path

const GlobalRanking = () => {
  const { getGlobalRanking, ranking } = UserAuth();

  useEffect(() => {
    getGlobalRanking();
  }, []);

  return (
    <div
      className="min-h-screen bg-gray-900 flex items-center justify-center p-4"
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
        }}
        color="#0A0A23"
        radius={350}
      >
        {/* Header with Neon Effect */}
        <div
          className="absolute -top-4 sm:-top-8 left-1/2 transform -translate-x-1/2 text-white text-md sm:text-2xl font-bold bg-blue-700 sm:px-4 sm:py-2 px-2 py-1 rounded-t-lg"
          style={{
            textShadow: "0 0 10px rgba(0, 191, 255, 1), 0 0 20px rgba(0, 191, 255, 0.6)",
            zIndex: 20,
          }}
        >
          [GLOBAL RANKINGS]
        </div>

        {/* Ranking List */}
        <div className="mt-8 space-y-4">
          {ranking?.users?.map((user, index) => {
            // Determine rank color based on position
            const rankColor =
              user.rank === 1
                ? "text-yellow-400"
                : user.rank === 2
                ? "text-gray-300"
                : user.rank === 3
                ? "text-orange-400"
                : "text-gray-400";

            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-blue-900/50 hover:bg-blue-800/50 rounded-lg transition-colors border-2 border-blue-400"
                style={{ boxShadow: "inset 0 0 10px rgba(0, 191, 255, 0.3)" }}
              >
                <span className={`text-lg font-semibold ${rankColor}`}>
                  #{user.rank}
                </span>
                <span className="text-white flex-1 ml-4 truncate">
                  {user.username}
                </span>
                <span className="text-green-400 font-medium ml-4">
                  {user.points} pts
                </span>
                <span className="text-blue-300 font-mono ml-4">
                  {user.rankCode}
                </span>
                <span className="text-purple-300 ml-4">{user.rankTitle}</span>
              </div>
            );
          }) || (
            <div className="text-white text-center">No rankings available</div>
          )}
        </div>
      </CardSpotlight>
    </div>
  );
};

export default GlobalRanking;