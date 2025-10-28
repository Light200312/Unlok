import React,{useState} from "react";
import {
  Home,Menu,
  Search,
  Compass,
  Clapperboard,OctagonAlert ,
  Heart,Crown ,
  MessageCircle, Telescope ,
  Send,
  Bookmark,
  MoreHorizontal,
  SquarePlus,
  User,Sword,Swords ,Trophy ,X,Scissors
} from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { UserAuth } from "../store/userAuthStore";

// const links = [
//   { name: "Daily Challenges", link: "/dailychellenge", icon: <Clock size={20} /> },
//   { name: "Weekly Challenges", link: "/weeklychallenge", icon: <Calendar size={20} /> },
//   { name: "Monthly Challenges", link: "/monthlychallenge", icon: <Target size={20} /> },
//   { name: "Comunity Chat", link: "/globalChat", icon: <MessageSquare size={20} /> },
//   { name: "Rival Buddy", link: "/buddyChat", icon: <Users size={20} /> },
//   { name: "Stats and Ranking", link: "/statsAndRanking", icon: <BarChart size={20} /> },
//   { name: "Global Rankings", link: "/globalRanking", icon: <Trophy size={20} /> },
// ];

const SidebarLayout = ({ setsidebarOpen, sidebarOpen: open }) => {
    const { authUser, logout } = UserAuth();
  
  const toggleSidebar = () => setsidebarOpen(!open);
 const [QuestOpen, setQuestOpen] = useState(false);
   function NavItem({ icon, label, badge ,PageLink}) {
     return (
       <Link to={PageLink} className="relative flex items-center gap-4 px-4 py-2 hover:bg-neutral-800 rounded-xl cursor-pointer transition-all w-fit sm:w-full">
         <div className="relative">
           {icon}
           {badge && (
             <span className="absolute -top-1 -right-2 bg-red-500 text-xs font-bold rounded-full px-1.5">
               {badge}
             </span>
           )}
         </div>
         <span className="hidden sm:inline">{label}</span>
       </Link>
     );
   }
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
        <NavItem PageLink="/globalChat" icon={<Home />} label="Home" />
                 <NavItem PageLink="/" icon={<Telescope  />} label="Search" />
                 <NavItem icon={<Compass />} label="Explore" />
                 <div onClick={()=>setQuestOpen(!QuestOpen)}> <NavItem   icon={<Swords />} label="Quests" />  
                 {QuestOpen && (<div className="ml-20   bg-[#1e1e1e] p-2 rounded "> 
                  <ul className="flex flex-col gap-1 text-sm">
                   <li className="hover:bg-[#2e2e2e] p-1 rounded"><Link  to="/dailychellenge">Daily Quests</Link></li>
                   <li className="hover:bg-[#2e2e2e] p-1 rounded" ><Link to="/weeklychallenge">Weekly Quests</Link></li>
                   <li className="hover:bg-[#2e2e2e] p-1 rounded"><Link to="/monthlychallenge">Monthly Quests</Link></li>
                   </ul>
                   
       
                 </div>)}
                 
                 </div>
                
                 {/* postEditor */}
                 <NavItem icon={<Send  />} PageLink={"/buddyChat"} label="Messages" badge="4" />
                 <NavItem icon={<Scissors />} PageLink={"/postEditor"} label="Draft Post" />
                 <NavItem icon={<OctagonAlert  />} label="Notifications" />
                 <NavItem icon={<Crown  />} PageLink={"/globalRanking"} label="Rankings" />
                 <NavItem icon={<Trophy  />} PageLink={"/statsAndRanking"} label="User Stats" />
              <div className="px-16.5">  <button className="btn btn-warning " onClick={logout}> Logout</button></div>
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
