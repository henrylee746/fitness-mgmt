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

        <div className="flex">
            <Card className="dark:bg-black flex flex-col items-center justify-center w-full mx-4">
                <FaUserCircle className="w-20 h-20" />
                <CardHeader className="flex flex-col items-center justify-center min-w-sm">
                    <CardAction>
                    </CardAction>
                    <CardTitle>Profile Management</CardTitle>
                    <CardDescription className="text-center">
                        Update your details/fitness goals
                    </CardDescription>
                </CardHeader>
            </Card>
            <AnimatedCard className="w-full mx-4 dark:bg-black">
                <CardVisual>
                    <MemberCard mainColor={mainColor} secondaryColor={secondaryColor} />
                </CardVisual>
                <CardBody>
                    <CardTitle className="text-center">Dashboard</CardTitle>
                    <CardDescription className="text-center">Check your metrics and upcoming sessions here</CardDescription>
                </CardBody>
            </AnimatedCard>
            <Card className="dark:bg-black flex flex-col items-center justify-center w-full mx-4">
                <FaUserFriends className="w-20 h-20" />
                <CardHeader className="flex flex-col items-center justify-center min-w-sm">
                    <CardAction>
                    </CardAction>
                    <CardTitle>Group Class</CardTitle>
                    <CardDescription className="text-center">
                        Book your next session here such as yoga, pilates, etc.
                    </CardDescription>
                </CardHeader>

            </Card>
        </div>
    );
};