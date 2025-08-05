import React from "react";
import { CardSpotlight } from "../components/ui/card-spotlight"; // Adjusted path
import { Link } from "react-router-dom";
const LandingPage = () => {
  return (
    <div
      className="min-h-screen bg-gray-900 flex flex-col items-center justify-start p-4"
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

      {/* Hero Section */}
      <CardSpotlight
        className="w-full max-w-4xl p-6 border-4 border-blue-700 rounded-lg z-10 mt-12"
        style={{
          boxShadow: "0 0 15px rgba(0, 191, 255, 0.7)",
          backgroundColor: "rgba(0, 0, 139, 0.7)",
        }}
        color="#0A0A23"
        radius={400}
      >
        <div className="text-center">
          <h1
            className="text-4xl font-bold text-white mb-4"
            style={{ textShadow: "0 0 10px rgba(0, 191, 255, 1), 0 0 20px rgba(0, 191, 255, 0.6)" }}
          >
            Welcome to Unlok
          </h1>
          <p className="text-white text-lg mb-6">
            Unlock your potential with personalized stats, challenges, and a global community to inspire your journey of self-improvement.
          </p>
          <Link
            to="/register"
            className="inline-block px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            style={{ textShadow: "0 0 5px rgba(0, 191, 255, 0.8)" }}
          >
            Get Started
          </Link>
        </div>
      </CardSpotlight>

      {/* Features Section */}
      <CardSpotlight
        className="w-full max-w-4xl p-6 border-4 border-blue-700 rounded-lg z-10 mt-12"
        style={{
          boxShadow: "0 0 15px rgba(0, 191, 255, 0.7)",
          backgroundColor: "rgba(0, 0, 139, 0.7)",
        }}
        color="#0A0A23"
        radius={400}
      >
        <h2
          className="text-3xl font-bold text-white text-center mb-6"
          style={{ textShadow: "0 0 10px rgba(0, 191, 255, 1), 0 0 20px rgba(0, 191, 255, 0.6)" }}
        >
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Available Features */}
          <div className="p-4 bg-blue-900/50 rounded-lg border-2 border-blue-400" style={{ boxShadow: "inset 0 0 10px rgba(0, 191, 255, 0.3)" }}>
            <h3 className="text-xl font-semibold text-white mb-2">Personalized User Stats</h3>
            <p className="text-gray-300">Track your strength, stamina, IQ, EQ, and more with tailored insights.</p>
          </div>
          <div className="p-4 bg-blue-900/50 rounded-lg border-2 border-blue-400" style={{ boxShadow: "inset 0 0 10px rgba(0, 191, 255, 0.3)" }}>
            <h3 className="text-xl font-semibold text-white mb-2">Daily, Weekly, Monthly Challenges</h3>
            <p className="text-gray-300">Engage in challenges to build your character and boost your stats.</p>
          </div>
          <div className="p-4 bg-blue-900/50 rounded-lg border-2 border-blue-400" style={{ boxShadow: "inset 0 0 10px rgba(0, 191, 255, 0.3)" }}>
            <h3 className="text-xl font-semibold text-white mb-2">Global Ranking of Users</h3>
            <p className="text-gray-300">See where you stand among users worldwide.</p>
          </div>
          {/* Coming Soon Features */}
          <div className="p-4 bg-blue-900/50 rounded-lg border-2 border-gray-500 opacity-70" style={{ boxShadow: "inset 0 0 10px rgba(128, 128, 128, 0.3)" }}>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Community to Share Progress</h3>
            <p className="text-gray-500">Coming Soon - Connect and share your journey.</p>
          </div>
          <div className="p-4 bg-blue-900/50 rounded-lg border-2 border-gray-500 opacity-70" style={{ boxShadow: "inset 0 0 10px rgba(128, 128, 128, 0.3)" }}>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Groups & Chat Buddy</h3>
            <p className="text-gray-500">Coming Soon - Compete with rivals for motivation.</p>
          </div>
          <div className="p-4 bg-blue-900/50 rounded-lg border-2 border-gray-500 opacity-70" style={{ boxShadow: "inset 0 0 10px rgba(128, 128, 128, 0.3)" }}>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Monitor Progress in Specific Fields</h3>
            <p className="text-gray-500">Coming Soon - Track your growth in detail.</p>
          </div>
        </div>
      </CardSpotlight>

    <CardSpotlight
      className="w-full max-w-4xl p-6 border-4 border-blue-700 rounded-lg z-10 mt-12 mb-12"
      style={{
        boxShadow: "0 0 15px rgba(0, 191, 255, 0.7)",
        backgroundColor: "rgba(0, 0, 139, 0.7)",
      }}
      color="#0A0A23"
      radius={400}
    >
      <h2
        className="text-3xl font-bold text-white text-center mb-6"
        style={{ textShadow: "0 0 10px rgba(0, 191, 255, 1), 0 0 20px rgba(0, 191, 255, 0.6)" }}
      >
        Quick Links
      </h2>
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <Link
          to="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors text-center"
          style={{ textShadow: "0 0 5px rgba(0, 191, 255, 0.8)" }}
        >
          GitHub
        </Link>
        <Link
          to="https://instagram.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors text-center"
          style={{ textShadow: "0 0 5px rgba(0, 191, 255, 0.8)" }}
        >
          Instagram
        </Link>
        <Link
          to="https://facebook.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors text-center"
          style={{ textShadow: "0 0 5px rgba(0, 191, 255, 0.8)" }}
        >
          Facebook
        </Link>
      </div>
    </CardSpotlight>
    </div>
  );
};

export default LandingPage;