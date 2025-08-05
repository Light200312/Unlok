import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UserAuth } from "./store/userAuthStore";
import GlobalRanking from "./pages/GlobalRanking"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DailyChellenges from "./pages/dailyChellenges";
import StatsAndRanking from "./pages/StatsAndRanking";

import Navbar from "./components/SubComponent/Navbar";
import { CanvasRevealEffectDemo } from "./components/CanvarCover";

const App = () => {
  const { authUser } = UserAuth();

  return (
    // <div className="App ">
      <Navbar>
        <Routes>
          <Route path="/" element={authUser?.username ? <Home /> : <Login />} />
          <Route path="/dailychellenge" element={authUser?.username ? <DailyChellenges /> : <Login />} />
          <Route path="/statsAndRanking" element={authUser?.username ? <StatsAndRanking /> : <Login />} />
          <Route path="/globalRanking" element={authUser?.username ? <GlobalRanking /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/canvas" element={<CanvasRevealEffectDemo />} />
        </Routes>
      <Toaster />
      </Navbar>
    // </div>
  );
};

export default App;
