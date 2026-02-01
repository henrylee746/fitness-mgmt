import {
    AnimatedCard,
    CardVisual,
    CardBody,
    CardTitle,
    CardDescription,
} from "@/components/ui/animated-card";
import { Visual1 } from "@/components/ui/visual-1";
import {
    Card,
    CardAction,
    CardHeader,
} from "@/components/ui/card"
import { FaUserCircle, FaUserFriends } from "react-icons/fa";



export const AdminCards = () => {
    return (

        <div className="flex">
            <Card className="dark:bg-black flex flex-col items-center justify-center w-full max-w-sm sm:min-w-sm sm:max-w-md mx-4">
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
            <AnimatedCard className="w-full max-w-sm sm:min-w-sm sm:max-w-md mx-4">
                <CardVisual>
                    <Visual1 mainColor="#ff6900" secondaryColor="#f54900" />
                </CardVisual>
                <CardBody>
                    <CardTitle>Dashboard</CardTitle>
                    <CardDescription>Check your metrics and upcoming sessions here</CardDescription>
                </CardBody>
            </AnimatedCard>
            <Card className="dark:bg-black flex flex-col items-center justify-center w-full max-w-sm sm:min-w-sm sm:max-w-md mx-4">
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