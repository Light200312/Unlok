import React , { lazy, Suspense ,useEffect}from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UserAuth } from "./store/userAuthStore";

const GlobalRanking = lazy(() => import("./pages/GlobalRanking"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const WeeklyChallenges =lazy(() => import("./pages/WeeklyChallenges"));
const MonthlyChallenge=lazy(() => import("./pages/MonthlyChallenge"));

const DailyChellenges = lazy(() => import("./pages/dailyChellenges"));
const StatsAndRanking = lazy(() => import("./pages/StatsAndRanking"));
import Navbar from "./components/SubComponent/Navbar";
const CanvasRevealEffectDemo = lazy(() => import("./components/CanvarCover"));
import { matrixAuthStore } from "./store/matrixStore";
import RivalBuddy from "./pages/RivalBuddy";
const GlobalChat=lazy(()=>import("./pages/GlobalChat"))
const App = () => {
  const { authUser } = UserAuth();
  const {fetchMatrices}=matrixAuthStore()
// useEffect(() => {
//   fetchMatrices(authUser._id)

 
// }, [])

  return (
    <div  className="relative">
      <Navbar>
        <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={authUser?.username ?  <Navigate to="/statsAndRanking" />: <Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/"
              // element={authUser?.username ? <Home /> : <Navigate to="/login" />}
                element={<Home/>}
              
            />
            <Route
              path="/dailychellenge"
              element={authUser?.username ? <DailyChellenges /> : <Navigate to="/login" />}
            />
             <Route
              path="/globalChat"
              element={authUser?.username ? <GlobalChat /> : <Navigate to="/login" />}
            />
             <Route
              path="/buddyChat"
              element={authUser?.username ? <RivalBuddy /> : <Navigate to="/login" />}
            />
               <Route
              path="/weeklychallenge"
              element={authUser?.username ? <WeeklyChallenges /> : <Navigate to="/login" />}
            />
             <Route
              path="/monthlychallenge"
              element={authUser?.username ? <MonthlyChallenge /> : <Navigate to="/login" />}
            />
            <Route
              path="/statsAndRanking"
              element={authUser?.username ? <StatsAndRanking /> : <Navigate to="/login" />}
            />
            <Route
              path="/globalRanking"
              element={authUser?.username ? <GlobalRanking /> : <Navigate to="/login" />}
            />

            {/* Canvas Route - no auth */}
            <Route path="/canvas" element={<CanvasRevealEffectDemo />} />

            {/* Optional Fallback */}
            {/* <Route path="*" element={<Navigate to="/" />} /> */}
          </Routes>
        </Suspense>
      </Navbar>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default App;
