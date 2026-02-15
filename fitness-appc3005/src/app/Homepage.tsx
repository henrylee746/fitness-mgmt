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

const ArrowRight = () => <FaArrowRight className="transition-transform group-hover:translate-x-1" />;

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
        inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border-2 
        transition-all duration-300 cursor-pointer
        ${selected
          ? "bg-primary/10 dark:bg-primary/20 border-primary text-primary shadow-md shadow-primary/20"
          : "bg-card/50 dark:bg-card/30 border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-card"
        }
      `}
    >
      <div className="flex items-center gap-2 sm:gap-2.5">
        <Icon />
        <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
          {text}
        </span>
      </div>
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
    })
  };

  if (!isMounted) return <Loading />;

  return (
    <div className="relative w-full group overflow-hidden">
      {/* Fitness background image with layered opacity effects */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/fitness.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-20 scale-110 group-hover:scale-100 transition-transform duration-1000"
          width={1000}
          height={1000}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/30 rounded-full blur-[100px]" />
      </div>
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">

        <div className="max-w-5xl mx-auto">
          {/* Grain texture background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
              opacity: isDark ? 0.07 : 0.04,
            }}
          />
          {/* Subtle top color bloom */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(139, 92, 246, 0.07) 0%, transparent 100%)',
            }}
          />
          {/* Hero section */}
          <div
            className={`text-center transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 mt-8 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 text-primary text-xs sm:text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Fitness Management Platform
            </div>

            {/* Main heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-foreground mt-4">
              <span className="block">Hassle-free management</span>
              <span className="block mt-1 sm:mt-2 text-primary">
                for your fitness club
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl sm:max-w-2xl mx-auto mb-6 sm:mb-8 mt-4 leading-relaxed px-2">
              Manage your gym operations with powerful tools for managing members,
              trainers, bookings, and health metrics - all in one place.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
              {!session && !isPending && isMounted ? (
                <>
                  <Link href="/signup" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto group cursor-pointer inline-flex gap-3 items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25">
                      Get Started
                      <ArrowRight />
                    </button>
                  </Link>
                  <Link href="/signin" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-card hover:bg-accent border border-border rounded-full font-semibold text-sm sm:text-base text-foreground transition-all duration-300 hover:border-primary/50">
                      Sign In
                    </button>
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleSignOut}
                  className="group cursor-pointer inline-flex gap-3 items-center px-6 sm:px-8 py-3 sm:py-4 bg-card hover:bg-accent border border-border rounded-full font-semibold text-sm sm:text-base text-foreground transition-all duration-300 hover:border-destructive/50 hover:text-destructive"
                >
                  Sign Out
                  <ArrowRight />
                </button>
              )}
            </div>

            {/* Role pills */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-14">
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

          {/* Marquee section */}
          <div
            className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="relative">
              {/* Subtle card container */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent rounded-3xl -z-10" />

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
    </div>
  );
}

export default Homepage;