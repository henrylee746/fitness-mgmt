"use client";
import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { IoMdFitness } from "react-icons/io";
import { RiAdminFill } from "react-icons/ri";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import { MemberCards } from "@/components/MemberCard";
import { TrainerCards } from "@/components/TrainerCards";
import { AdminCards } from "@/components/AdminCards";


const MemberIcon = () => <FaUser />;

const TrainerIcon = () => <IoMdFitness />;

const AdminIcon = () => <RiAdminFill />;

const ArrowRight = () => <FaArrowRight />;


const iconMap = {
  member: MemberIcon,
  trainer: TrainerIcon,
  admin: AdminIcon,
};

interface userPillProps {
  selected: boolean;
  user: keyof typeof iconMap;
  text: string;
  onClick: () => void;
}

const UserPill = ({ user, text, selected, onClick }: userPillProps) => {
  const Icon = iconMap[user];
  return (
    <button
      onClick={onClick}
      className={`
        
        inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border transition-all duration-200 hover:scale-105 hover:shadow-md
        ${selected
          ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600"
          : "bg-transparent border-transparent hover:bg-transparent hover:border-transparent hover:scale-100 hover:shadow-none"
        }
      `}
    >
      <div className="flex items-center gap-2">
        <Icon />
        <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
          {text}
        </span>
      </div>
    </button>
  );
};


export const Homepage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPill, setSelectedPill] =
    useState<keyof typeof iconMap>("member");

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const users: Array<{ id: keyof typeof iconMap; name: string }> = [
    { id: "member", name: "Members" },
    { id: "trainer", name: "Trainers" },
    { id: "admin", name: "Administrative Staff" },
  ];

  return (
    <div className="font-sans h-full">
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-400 { animation-delay: 400ms; }
      `}</style>

      <div className="px-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-4 sm:mb-8 transition-all duration-500 ease-out ${isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5"
              }`}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mt-4 sm:mt-6 mb-4 sm:mb-6 leading-tight transition-colors duration-300">
              Hassle-free management system
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span> for your fitness club 🏋️‍♂️
            </h1>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed transition-colors duration-300">
              Welcome! This application is
              designed to help you manage your fitness club. It includes
              features for managing members, trainers, bookings, sessions, and
              health metrics.
            </p>
            <Link href="/signup">
              <button className="cursor-pointer group inline-flex gap-3 mb-6 items-center px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-medium text-base sm:text-lg transition-all duration-200 hover:bg-gray-800 dark:hover:bg-gray-200 hover:scale-105 hover:shadow-lg">
                Sign Up
                <ArrowRight />
              </button>
            </Link>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-6">
              {users.map((user) => (
                <UserPill
                  key={user.id}
                  user={user.id}
                  text={user.name}
                  selected={selectedPill === user.id}
                  onClick={() => setSelectedPill(user.id)}
                />
              ))}
            </div>
          </div>

          <div
            className={`mb-8 sm:mb-12 ${isVisible ? "animate-slide-up animation-delay-200" : "opacity-0"
              }`}
          >
            <Marquee
              autoFill={true}
              pauseOnHover={true}
              gradient={true}
              gradientColor="black"
            >
              {selectedPill === "member" ? <MemberCards /> : selectedPill === "trainer" ? <TrainerCards /> : <AdminCards />}
            </Marquee>
          </div>
        </div>
      </div>
    </div >
  );
}

export default Homepage;