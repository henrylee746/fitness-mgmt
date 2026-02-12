"use client"
import {
    AnimatedCard,
    CardVisual,
    CardBody,
} from "@/components/ui/animated-card";
import { TrainerCard } from "@/components/ui/trainercard";
import {
    Card,
    CardAction,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { RiUserSettingsLine } from "react-icons/ri";
import { useTheme } from "next-themes";


export const TrainerCards = () => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    // Define colors based on theme
    const mainColor = isDark ? "#60a5fa" : "#3b82f6"; // Blue - lighter in dark mode
    const secondaryColor = isDark ? "#34d399" : "#10b981"; // Green - lighter in dark mode

    return (

        <div className="flex gap-2 sm:gap-3 md:gap-4">
            <AnimatedCard className="hover:scale-103 transition-all duration-300 m-2 sm:m-3 md:m-4 dark:bg-black">
                <CardVisual>
                    <TrainerCard mainColor={mainColor} secondaryColor={secondaryColor} />
                </CardVisual>
                <CardBody>
                    <CardTitle className="text-center text-base sm:text-lg">Member Search</CardTitle>
                    <CardDescription className="text-center text-xs sm:text-sm">Search members by name to view their current weight goal and last measured weight.</CardDescription>
                </CardBody>
            </AnimatedCard>
            <Card className="hover:scale-103 transition-all duration-300 dark:bg-black flex flex-col items-center justify-center w-[280px] sm:w-[320px] md:w-[356px] m-2 sm:m-3 md:m-4">
                <RiUserSettingsLine className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />
                <CardHeader className="flex flex-col items-center justify-center w-full">
                    <CardAction>
                    </CardAction>
                    <CardTitle className="text-base sm:text-lg">Trainer Management</CardTitle>
                    <CardDescription className="text-center text-xs sm:text-sm">
                        Manage your sessions and trainers
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
};