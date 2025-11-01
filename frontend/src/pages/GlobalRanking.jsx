import React, { useEffect, useState } from "react";
import { UserAuth } from "../store/userAuthStore";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Crown, Award } from "lucide-react";

// Helper component for Rank Badges (e.g., A2, B3)
const RankBadge = ({ code = "F7" }) => {
  const rankLetter = code.charAt(0)?.toUpperCase();
  const colors = {
    S: "bg-red-500 text-white",
    A: "bg-purple-500 text-white",
    B: "bg-blue-500 text-white",
    C: "bg-green-500 text-white",
    D: "bg-yellow-500 text-black",
    E: "bg-orange-500 text-white",
    F: "bg-gray-500 text-white",
  };
  return (
    <span
      className={`ml-3 flex h-6 w-8 items-center justify-center rounded-md text-xs font-bold ${
        colors[rankLetter] || colors.F
      }`}
    >
      {code}
    </span>
  );
};

// Helper component for Rank Titles (e.g., Spirit, Awakened)
const RankTitle = ({ title = "Sleeper" }) => {
  const colors = {
    Devine: "text-red-400",
    Spirit: "text-purple-400",
    Sovereign: "text-blue-400",
    Saint: "text-green-400",
    Master: "text-yellow-400",
    Awakened: "text-orange-400",
    Sleeper: "text-gray-400",
  };
  return (
    <span
      className={`ml-3 hidden w-24 text-left text-sm font-medium sm:block ${
        colors[title] || colors.Sleeper
      }`}
    >
      {title}
    </span>
  );
};

// Helper component for a single player row
const PlayerRow = ({ user }) => {
  if (!user) return null;
  return (
    <div className="flex items-center rounded-lg bg-gray-800/60 p-3 shadow-md transition-all hover:bg-gray-800">
      <span className="w-8 text-center text-lg font-semibold text-gray-400">
        #{user.rank}
      </span>
      <img
        src={user.profilePic || "/profile.png"}
        alt={user.username}
        className="mx-3 h-10 w-10 rounded-full object-cover"
      />
      <span className="flex-1 truncate text-base font-medium text-white">
        {user.username}
      </span>
      <span className="hidden w-28 text-right text-lg font-bold text-gray-300 sm:block">
        {user.points} pts
      </span>
      <RankBadge code={user.rankCode} />
      <RankTitle title={user.rankTitle} />
    </div>
  );
};

const GlobalRanking = () => {
  const { getGlobalRanking, ranking, authUser } = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getGlobalRanking();
  }, []);

  const users = ranking?.users || [];
  const top3 = users.slice(0, 3);
  const restOfPlayers = users.slice(3);
  const myRank = users.find((u) => u.username === authUser?.username);

  // Helper for Top 3 styling
  const podiumStyles = [
    // Rank 2 (index 0)
    {
      order: 1, // Show first (left)
      scale: "scale-110",
      color: "text-yellow-300",
      icon: <Award size={20} className="text-yellow-400" />,
      badge: "Gold",
    },
    // Rank 1 (index 1)
    {
      order: 2, // Show second (center)
      scale: "scale-100",
      color: "text-gray-400",
      icon: <Crown size={24} className="text-gray-400" />,
      badge: "Silver",
    },
    // Rank 3 (index 2)
    {
      order: 3, // Show third (right)
      scale: "scale-90",
      color: "text-yellow-600",
      icon: <Award size={20} className="text-yellow-700" />,
      badge: "Bronze",
    },
  ];

  return (
    <div className="flex h-screen flex-col bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center border-b border-gray-700 bg-gray-900/80 p-4 backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full p-2 text-gray-400 transition-all hover:bg-gray-700 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="ml-4 text-xl font-bold">Global Rankings</h1>
      </header>

      {/* Main Content (Scrollable) */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Top 3 Podium */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-yellow-400">
              Top 3
            </h2>
            <div className="flex items-end justify-center gap-2 sm:gap-6">
              {top3.map((user, index) => (
                <div
                  key={user.rank}
                  className={`flex flex-col items-center p-3 sm:p-4
                    ${podiumStyles[index]?.scale || "scale-90"}
                    rounded-lg bg-gray-800/50 transition-all`}
                  style={{ order: podiumStyles[index]?.order || index + 1 }}
                >
                  <div className="relative">
                    <img
                      src={user.profilePic || "/profile.png"}
                      alt={user.username}
                      className="h-16 w-16 rounded-full object-cover ring-2 sm:h-20 sm:w-20"
                      style={{
                        borderColor:
                          podiumStyles[index]?.color.replace("text-", "") ||
                          "gray",
                      }}
                    />
                    {user.rank === 1 && (
                      <Crown
                        size={24}
                        className="absolute -top-3 right-0 rotate-12 text-yellow-400"
                        fill="currentColor"
                      />
                    )}
                  </div>
                  <span className="mt-2 text-base font-bold text-white sm:text-lg">
                    #{user.rank} {user.username}
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      podiumStyles[index]?.color || "text-gray-300"
                    }`}
                  >
                    {user.points} pts
                  </span>
                  <div className="mt-1 flex items-center gap-1">
                    {podiumStyles[index]?.icon}
                    <span
                      className={`text-xs font-medium ${
                        podiumStyles[index]?.color || "text-gray-400"
                      }`}
                    >
                      {podiumStyles[index]?.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* All Players List */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-gray-300">
              All Players
            </h2>
            <div className="space-y-3">
              {restOfPlayers.length > 0 ? (
                restOfPlayers.map((user) => (
                  <PlayerRow key={user.rank} user={user} />
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No other players to show.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Sticky Footer: Your Rank */}
      {myRank && (
        <footer className="sticky bottom-0 z-10 border-t border-gray-700 bg-gray-800 p-4 shadow-lg">
          <div className="mx-auto max-w-4xl">
            <h3 className="mb-2 text-sm font-semibold text-gray-400">
              Your Rank
            </h3>
            <PlayerRow user={myRank} />
          </div>
        </footer>
      )}
    </div>
  );
};

export default GlobalRanking;
