import React from "react";
import Particles from "../components/Landing Page Component/Particles";
import TextReveal from "../components/Landing Page Component/text-revel";
import { motion } from "framer-motion";
import { ThreeDCardDemo } from "../components/Landing Page Component/ThreeDCardDemo";
import Footer from "../components/Landing Page Component/Footer";
import FeaturesSection from "../components/Landing Page Component/FeaturesSection";
import { Link, useNavigate } from "react-router-dom";

// const Navigate = useNavigate();
const habits = [
  {
    likes: 60,
    title: "Optimal Sleep Routine",
    description:
      "By reducing screen time before bed and setting a strict sleep schedule.",
    poster:
      "https://images.unsplash.com/photo-1600783355700-5d2424dc013e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbGVlcCUyMGpvdXJuYWwlMjBiZWR0aW1lfGVufDF8fHx8MTc2MTgwMjY3MHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    likes: 80,
    title: "Deep Work Sessions",
    description:
      "I've implemented the Pomodoro technique with dedicated deep work blocks in the morning.",
    poster:
      "https://images.unsplash.com/photo-1758611970983-ff9f0ec0b0c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb2N1cyUyMGNvbmNlbnRyYXRpb24lMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzYxODAyNjcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    likes: 100,
    title: "Balanced Meal Planning",
    description:
      "Meal prepping on Sundays has been a game-changer. I focus on whole foods",
    poster:
      "https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHByZXB8ZW58MXx8fHwxNzYxNzQxNzQyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];
const LandingPage = () => {
  return (
    <div className="bg-[#06000f] w-full h-screen text-white flex flex-col relative overflow-x-hidden font-Poppins">
      <Particles
        className={`h-screen`}
        particleColors={["#ffffff", "#ffffff"]}
        particleCount={500}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
      />
      <div className="absolute inset-0 z-10">
        {/* <Navbar /> */}
        {/* Landing part */}
        <div className="w-full h-[720px] flex justify-center items-center bg-amdber-600">
          <div className="flex flex-col items-center justify-center pt-20 ">
            <TextReveal
              staggerDelay={0.2}
              text={"Discover Your Potential. Design Your Life."}
              className="text-white text-center font-bold text-4xl sm:text-5xl md:text-6xl lg:text-5xl mb-4 leading-tight"
            />
            {/* MODIFIED: Added styling for opacity, size, width, and margin */}
            <TextReveal
              text={
                "Social media, re-engineered for growth instead of distraction."
              }
              className="text-2xl text-white/70 max-w-lg mx-auto mb-8 text-center text-nowrap"
              staggerDelay={0.2}
            />

            <div className="flex flex-col sm:flex-row gap-5 bg-grecen-600 ml-2 ">
              <Link
                // onClick={Navigate("/register")}
                to={"/register"}
                className="bg-white text-gray-900 font-semibold py-2 px-7 rounded-xl
                             hover:bg-gray-200 transition-all duration-300 ease-in-out
                             shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Register
              </Link>

              <Link
                to={"/login"}
                className="bg-transparent text-white font-semibold py-2 px-7 rounded-xl
                             border-2 border-white
                             hover:bg-white hover:text-gray-900 transition-all duration-300 ease-in-out
                             shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
        {/* Why us */}
        <div className="w-full flex items-center justify-center px-8 py-5 md:px-12 md:py-9 lg:py-16 mb-0">
          <motion.div
            className="w-full max-w-[85%] rounded-lg border border-gray-700/50 shadow-2xl shadow-indigo-900/20 overflow-hidden grid md:grid-cols-2"
            initial={{ opacity: 0, y: 50 }} // Start state: invisible and 50px down
            whileInView={{ opacity: 1, y: 0 }} // End state: fully visible at original position
            transition={{ duration: 0.6, ease: "easeInOut" }} // Animation properties
            viewport={{ once: true, amount: 0.3 }} // Trigger animation once, when 30% is visible
          >
            <div className="flex flex-col justify-center p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose Us?
              </h2>
              <p className="text-lg text-gray-300 mb-4">
                Tired of endless scrolling and passive consumption? We're
                different. We're not just another feed; we're a focused
                community.
              </p>
              <p className="text-lg text-gray-300">
                Our platform is built for{" "}
                <strong className="text-indigo-400">productivity</strong> and{" "}
                <strong className="text-indigo-400">
                  meaningful connections
                </strong>
                . Find peers who share your specific interests, collaborate on
                projects, and grow your skills—without the noise.
              </p>

              <a
                href="#"
                className="mt-8 inline-block max-w-xs rounded-lg bg-white px-6 py-3 text-center font-medium text-black shadow-lg transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
              >
                Join the Community
              </a>
            </div>

            <div className="flex items-center justify-center md:border-l md:border-gray-700/50 bg-gray-900/30 p-8">
              <img
                src="../../public/Whyus.jpg"
                alt="Placeholder image illustrating productivity and connection"
                className="rounded-lg shadow-xl w-full h-auto object-cover "
              />
            </div>
          </motion.div>
        </div>
        {/* Features */}
        <div className="w-full p-8 md:p-12 lg:py-12 mt-0">
          <FeaturesSection />
        </div>
        {/* testimonial */}
        <motion.h1
          className="text-center text-5xl font-semibold"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          Testimonial
        </motion.h1>
        <div className="w-full  bg-ambefr-400 p-2 flex sm:justify-evenly items-center flex-wrap justify-center">
          {habits.map((posts) => (
            <ThreeDCardDemo
              key={posts.title}
              title={posts.title}
              discpriction={posts.description}
              poster={posts.poster}
              likes={posts.likes}
            />
          ))}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
