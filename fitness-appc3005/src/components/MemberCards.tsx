"use client"
import {
    AnimatedCard,
    CardVisual,
    CardBody,
} from "@/components/ui/animated-card";
import { MemberCard } from "@/components/ui/membercard";
import {
    Card,
    CardAction,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { FaUserCircle, FaUserFriends } from "react-icons/fa";
import { useTheme } from "next-themes";



export const MemberCards = () => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    // Define colors based on theme
    const mainColor = isDark ? "#a78bfa" : "#8b5cf6"; // Purple - lighter in dark mode
    const secondaryColor = isDark ? "#fcd34d" : "#fbbf24"; // Amber/Yellow - lighter in dark mode

    return (

        <div className="flex gap-2 sm:gap-3 md:gap-4">
            <Card className="dark:bg-black flex flex-col items-center justify-center w-[280px] sm:w-[320px] md:w-[356px] mx-2 sm:mx-3 md:mx-4">
                <FaUserCircle className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />
                <CardHeader className="flex flex-col items-center justify-center w-full">
                    <CardAction>
                    </CardAction>
                    <CardTitle className="text-base sm:text-lg text-center">Profile Management</CardTitle>
                    <CardDescription className="text-center text-xs sm:text-sm">
                        Update your details/fitness goals
                    </CardDescription>
                </CardHeader>
            </Card>
            <AnimatedCard className="dark:bg-black">
                <CardVisual>
                    <MemberCard mainColor={mainColor} secondaryColor={secondaryColor} />
                </CardVisual>
                <CardBody>
                    <CardTitle className="text-center text-base sm:text-lg">Dashboard</CardTitle>
                    <CardDescription className="text-center text-xs sm:text-sm">Check your metrics and upcoming sessions here</CardDescription>
                </CardBody>
            </AnimatedCard>
            <Card className="dark:bg-black flex flex-col items-center justify-center w-[280px] sm:w-[320px] md:w-[356px] mx-2 sm:mx-3 md:mx-4">
                <FaUserFriends className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />
                <CardHeader className="flex flex-col items-center justify-center w-full">
                    <CardAction>
                    </CardAction>
                    <CardTitle className="text-base sm:text-lg text-center">Group Class</CardTitle>
                    <CardDescription className="text-center text-xs sm:text-sm">
                        Book your next session here such as yoga, pilates, etc.
                    </CardDescription>
                </CardHeader>

            </Card>
        </div>
    );
};