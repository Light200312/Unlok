import React from "react";
import {
  Menu,
  X,
  MessageSquare,
  Users,
  Trophy,
  BarChart,
  Target,
  Calendar,
  Clock,
} from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const links = [
  { name: "Daily Challenges", link: "/dailychellenge", icon: <Clock size={20} /> },
  { name: "Weekly Challenges", link: "/weeklychallenge", icon: <Calendar size={20} /> },
  { name: "Monthly Challenges", link: "/monthlychallenge", icon: <Target size={20} /> },
  { name: "Comunity Chat", link: "/globalChat", icon: <MessageSquare size={20} /> },
  { name: "Rival Buddy", link: "/buddyChat", icon: <Users size={20} /> },
  { name: "Stats and Ranking", link: "/statsAndRanking", icon: <BarChart size={20} /> },
  { name: "Global Rankings", link: "/globalRanking", icon: <Trophy size={20} /> },
];

const SidebarLayout = ({ setsidebarOpen, sidebarOpen: open }) => {
  const toggleSidebar = () => setsidebarOpen(!open);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Sidebar overlay */}
      <div
        className={`fixed top-0 left-0 h-screen z-50 backdrop-blur-md bg-background/90 border-r border-border
          transition-all duration-300 
          ${open ? "w-56" : "w-0"} overflow-hidden`}
      >
        {/* Header */}
        <button
          className="flex items-center justify-center p-3 hover:bg-muted transition w-full"
          onClick={toggleSidebar}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 mt-2">
          {links.map((item, i) => (
            <Link
              key={i}
              to={item.link}
              className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-muted transition"
              onClick={() => setsidebarOpen(false)} // close when navigating
            >
              <span className="text-primary">{item.icon}</span>
              <span className={`whitespace-nowrap ${open ? "block" : "hidden"}`}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content (no margin shift) */}
      <main className="relative z-0 p-0 m-0">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
