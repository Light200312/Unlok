import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../../store/userAuthStore";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "../ui/Navbar2.jsx";

const Layout = ({ children }) => {
  const { authUser, logout } = UserAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    // globalChat buddyChat
    { name: "Daily Challenges", link: "/dailychellenge" },
    { name: "Weekly Challenges", link: "/weeklychallenge" },
    { name: "Monthly Challenges", link: "/monthlychallenge" },
    { name: "Comunity Chat", link: "/globalChat" },
    { name: "Rival Buddy", link: "/buddyChat" },
    { name: "Stats and Ranking", link: "/statsAndRanking" },
    { name: "Global Rankings", link: "/globalRanking" },
  ];

  return (
    <div className="relative w-full">
      {/* Navbar */}
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary" onClick={logout}>
              Logout
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                to={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-base-content"
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                variant="primary"
                className="w-full"
              >
                Logout
              </NavbarButton>
              {/* <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Book a call
              </NavbarButton> */}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Page Content */}
      <div className="">{children}</div>
    </div>
  );
};

export default Layout;
