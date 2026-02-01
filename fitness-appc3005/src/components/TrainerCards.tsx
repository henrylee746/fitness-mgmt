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
import { FaUserFriends } from "react-icons/fa";
import { RiUserSettingsLine } from "react-icons/ri";




export const TrainerCards = () => {
    return (

        <div className="flex">
            <AnimatedCard className="w-full mx-4 max-w-sm">
                <CardVisual>
                    <TrainerCard mainColor="#ff6900" secondaryColor="#f54900" />
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