"use client";
import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { IoMdFitness } from "react-icons/io";
import { RiAdminFill } from "react-icons/ri";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import { MemberCards } from "@/components/MemberCards";
import { TrainerCards } from "@/components/TrainerCards";
import { AdminCards } from "@/components/AdminCards";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Loading from "./loading";
import { useTheme } from "next-themes";
import Image from "next/image";

const MemberIcon = () => <FaUser />;
const TrainerIcon = () => <IoMdFitness />;
const AdminIcon = () => <RiAdminFill />;
const ArrowRight = () => (
  <FaArrowRight className="transition-transform group-hover:translate-x-1" />
);

const iconMap = {
  member: MemberIcon,
  trainer: TrainerIcon,
  admin: AdminIcon,
};

interface userPillProps {
  index: number;
  selected: boolean;
  user: keyof typeof iconMap;
  text: string;
  onClick: () => void;
}

const UserPill = ({ user, text, selected, onClick, index }: userPillProps) => {
  const Icon = iconMap[user];
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center px-4 py-2.5 sm:px-5 sm:py-3 border
        transition-all duration-300 cursor-pointer gap-3
        ${
          selected
            ? "bg-primary border-primary text-primary-foreground"
            : "bg-transparent border-border/60 text-muted-foreground hover:border-primary/60 hover:text-foreground"
        }
      `}
    >
      <span
        className={`text-secondary-foreground text-xs font-mono font-bold tracking-wider ${selected ? "opacity-60" : "opacity-30"}`}
      >
        0{index + 1}
      </span>
      <Icon />
      <span className="text-slate-100 dark:text-foreground text-xs sm:text-sm font-bold tracking-widest uppercase whitespace-nowrap">
        {text}
      </span>
    </button>
  );
};

export const Homepage = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { data: session, isPending } = authClient.useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedPill, setSelectedPill] =
    useState<keyof typeof iconMap>("member");

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const users: Array<{ id: keyof typeof iconMap; name: string }> = [
    { id: "member", name: "Members" },
    { id: "trainer", name: "Trainers" },
    { id: "admin", name: "Admin" },
  ];

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success(`Signed out successfully`);
        },
        onError: (error) => {
          toast.error(`Failed to sign out: ${error.error.message}`);
        },
      },
    });
  };

  if (!isMounted) return <Loading />;

  return (
    <div className="relative w-full group overflow-hidden">
      {/* Sharp top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary z-20" />

      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/fitness.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-20 scale-110 group-hover:scale-100 transition-transform duration-1000"
          width={1000}
          height={1000}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
        <div className="sm:block hidden absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-primary/40" />
        <div className="sm:block hidden absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-primary/40" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Grain texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
              opacity: isDark ? 0.07 : 0.04,
            }}
          />

          {/* Hero section */}
          <div className="text-center">
            {/* Badge */}
            <div
              className={`transition-all duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 mt-10 border border-primary/60 bg-primary/10 text-primary">
                <svg
                  width="14"
                  height="10"
                  viewBox="0 0 14 10"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <polyline
                    points="0,5 2.5,5 4,1 6,9 8,3 9.5,5 14,5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-indigo-900 dark:text-primary text-xs font-bold tracking-[0.2em] uppercase">
                  Fitness Management Platform
                </span>
              </div>
            </div>

            {/* Main heading - Barlow Condensed display font */}
            <div
              className={`transition-all duration-600 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "100ms" }}
            >
              <h1
                className="mt-5 text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span
                  className="block font-black uppercase leading-none"
                  style={{ fontSize: "clamp(3.5rem, 11vw, 8.5rem)" }}
                >
                  Hassle-free
                </span>
                <span
                  className="block font-black uppercase leading-none text-violet-900 dark:text-primary sm:wrap-normal wrap-break-word"
                  style={{ fontSize: "clamp(3.5rem, 11vw, 8.5rem)" }}
                >
                  Management
                </span>
                <span
                  className="block font-bold tracking-[0.35em] uppercase mt-3 text-muted-foreground"
                  style={{
                    fontSize: "clamp(0.6rem, 1.4vw, 0.8rem)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  for your fitness club
                </span>
              </h1>
            </div>

            {/* Description */}
            <div
              className={`transition-all duration-600 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: "200ms" }}
            >
              <p className="text-slate-100 dark:text-foreground text-sm sm:text-base max-w-xl sm:max-w-2xl mx-auto mb-8 mt-5 leading-relaxed px-2">
                Manage your gym operations with powerful tools for managing
                members, trainers, bookings, and health metrics - all in one
                place.
              </p>
            </div>

            {/* CTA buttons - rectangular, no rounded-full */}
            <div
              className={`transition-all duration-600 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12">
                {!session && !isPending && isMounted ? (
                  <>
                    <Link href="/signup" className="w-full sm:w-auto">
                      <button className="w-full sm:w-auto group cursor-pointer inline-flex gap-3 items-center justify-center px-8 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:shadow-xl hover:shadow-primary/25">
                        Get Started
                        <ArrowRight />
                      </button>
                    </Link>
                    <Link href="/signin" className="w-full sm:w-auto">
                      <button className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center px-8 py-3.5 bg-transparent hover:bg-white/5 border border-border/60 hover:border-primary/50 font-bold text-sm text-foreground tracking-widest uppercase transition-all duration-300">
                        <p className="text-slate-100 dark:text-foreground">
                          Sign In
                        </p>
                      </button>
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={handleSignOut}
                    className="group cursor-pointer inline-flex gap-3 items-center px-8 py-3.5 bg-transparent border border-border/60 hover:border-destructive/60 font-bold text-sm text-foreground hover:text-destructive tracking-widest uppercase transition-all duration-300"
                  >
                    <p className="text-slate-100 dark:text-foreground">
                      Sign Out
                    </p>
                    <ArrowRight />
                  </button>
                )}
              </div>
            </div>

            {/* Role pills - angular with numbered prefix */}
            <div
              className={`transition-all duration-600 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: "400ms" }}
            >
              <div className="flex flex-wrap justify-center gap-2 sm:gap-0 mb-12 sm:mb-16">
                {users.map((user, index) => (
                  <UserPill
                    key={user.id}
                    index={index}
                    user={user.id}
                    text={user.name}
                    selected={selectedPill === user.id}
                    onClick={() => setSelectedPill(user.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Marquee section */}
          <div
            className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: "500ms" }}
          >
            <Marquee
              autoFill={true}
              gradientColor={isDark ? "black" : "#fbf9fc"}
            >
              {selectedPill === "member" ? (
                <MemberCards />
              ) : selectedPill === "trainer" ? (
                <TrainerCards />
              ) : (
                <AdminCards />
              )}
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  );
};
