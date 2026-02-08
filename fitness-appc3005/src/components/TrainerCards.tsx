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

        <div className="flex">
            <AnimatedCard className="w-full mx-4 max-w-sm dark:bg-black">
                <CardVisual>
                    <TrainerCard mainColor={mainColor} secondaryColor={secondaryColor} />
                </CardVisual>
                <CardBody>
                    <CardTitle className="text-center">Member Search</CardTitle>
                    <CardDescription className="text-center">Search members by name (case-insensitive) to view their current weight goal and last measured weight.</CardDescription>
                </CardBody>
            </AnimatedCard>
            <Card className="dark:bg-black flex flex-col items-center justify-center w-full mx-4">
                <RiUserSettingsLine className="w-20 h-20" />
                <CardHeader className="flex flex-col items-center justify-center min-w-xs">
                    <CardAction>
                    </CardAction>
                    <CardTitle>Trainer Management</CardTitle>
                    <CardDescription className="text-center">
                        Manage your sessions and trainers
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
};