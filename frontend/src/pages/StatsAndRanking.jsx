"use client";

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

const CategoryDescription = {
  "Cognitive Growth": "Cognitive Growth refers to the development of mental capabilities like focus, problem solving, critical thinking, learning speed, and memory.",
  "Physical Wellness": "Physical Wellness involves maintaining a healthy body through strength, stamina, sleep, and overall health score.",
  "Emotional Intelligence": "Emotional Intelligence is the ability to understand, use, and manage emotions effectively.",
  "Social Character": "Social Character includes communication, leadership, conflict resolution, and integrity.",
  "Discipline & Productivity": "This reflects your ability to stay organized, complete tasks, and manage time.",
  "Growth Mindset": "A Growth Mindset believes in developing abilities through effort and learning.",
  "Purpose & Values": "Purpose & Values involve aligning your actions with meaningful goals and contribution.",
};

const StatsAndRanking = () => {
  const { calculateRank } = useChallengeStore();
  const { authUser } = UserAuth();
  const { matrices, fetchMatrices } = matrixAuthStore();

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

  const points = parseInt(authUser?.points || 0);
  const matchedTier =
    rankTiers.find((tier) => points >= tier.points) || rankTiers.at(-1);
  const computedRank = matchedTier?.code || "N/A";
  const computedTitle = matchedTier?.title || "N/A";

  return (
    <div
      className="bg-background text-foreground min-h-screen p-4 pt-24 flex items-center justify-center font-bitcount relative"
      style={{
        backgroundImage: `url(./panelbg.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/20 dark:bg-black/50 z-0" />

      <CardSpotlight
        className="w-full max-w-3xl p-6 border-4 border-primary rounded-lg z-10 relative"
        style={{
          boxShadow: "0 0 20px rgba(0, 191, 255, 0.7)",
          backgroundColor: "rgba(10, 10, 35, 0.8)",
          backdropFilter: "blur(12px)",
        }}
        color="#0A0A23"
        radius={350}
      >
        {/* 🧱 Header */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-md sm:text-2xl font-bold bg-primary text-base px-4 py-2 rounded-t-lg font-bitcount z-20">
          [{authUser?.username?.toUpperCase() || "PROFILE"}]
        </div>

        {/* 🧍 Profile Section */}
        <div className="mt-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-black/40 p-5 rounded-lg border border-cyan-400/30 shadow-inner">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-cyan-400 overflow-hidden shadow-[0_0_20px_rgba(0,255,255,0.3)]">
              <img
                src={authUser?.profilePic || "/profile.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-cyan-600/90 text-xs px-2 py-1 rounded-full border border-cyan-300 shadow-lg">
              {computedRank}
            </div>
          </div>

          {/* User Info */}
          <div className="flex flex-col text-center sm:text-left font-bitcount">
            <h2 className="text-2xl font-bold text-cyan-300 mb-2">
              {authUser?.username?.toUpperCase() || "UNKNOWN"}
            </h2>
            <p className="text-sm text-cyan-200/80 mb-2">
              “{computedTitle}” — {points} pts
            </p>
            <p className="text-sm text-cyan-100/70 mb-1">
              <strong>Age:</strong> {authUser?.age || "Not Available"}
            </p>
            <p className="text-sm text-cyan-100/70 mb-1">
              <strong>Rank:</strong> {computedRank}
            </p>
            <p className="text-sm text-cyan-100/70 mb-1">
              <strong>Badges:</strong> {authUser?.badges?.length || 0}
            </p>
            <p className="text-sm text-cyan-100/70 mb-1">
              <strong>Titles:</strong>{" "}
              {authUser?.titles?.length
                ? authUser.titles.join(", ")
                : computedTitle}
            </p>
          </div>
        </div>

        {/* 📊 Matrices Section */}
        <div className="mt-8">
          {(matrices?.length > 0 ? matrices : []).map((matrix) => (
            <div
              key={matrix?._id || Math.random()}
              className="mb-6 p-3 bg-muted/60 hover:bg-muted/80 border border-cyan-500/40 rounded-md transition-all duration-300"
              style={{ boxShadow: "inset 0 0 10px rgba(0, 191, 255, 0.2)" }}
            >
              <div className="flex justify-between items-center">
                <button
                  onClick={() => toggleMatrix(matrix._id)}
                  className="flex items-center sm:text-xl font-bold font-bitcount text-foreground"
                >
                  {matrix?.category || "Unnamed Category"}
                  <span className="ml-2 text-sm">
                    {openMatrixIds.includes(matrix._id) ? "▲" : "▼"}
                  </span>
                </button>
              </div>

              {openMatrixIds.includes(matrix._id) && (
                <>
                  <div className="text-sm text-cyan-300 mt-2 transition-all duration-300 ease-in-out font-bitcount">
                    {CategoryDescription[matrix.category] ||
                      "No description available."}
                  </div>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-cyan-100">
                    {(matrix?.metrics || []).map((metric, i) => (
                      <div
                        key={i}
                        className="bg-black/40 border border-cyan-700/30 rounded-md px-2 py-1 text-xs text-center shadow-inner"
                      >
                        <span className="block font-semibold">
                          {metric?.name || "Unnamed"}
                        </span>
                        <span>{metric?.value ?? "N/A"}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* 📜 Footer */}
        <div className="mt-6 text-cyan-200 text-sm italic text-center font-bitcount">
          <strong>OVERALL EVALUATION:</strong> A user with unique skills awakened
          through consistent growth and challenge mastery.
        </div>
      </CardSpotlight>
    </div>
  );
};

export default StatsAndRanking;
