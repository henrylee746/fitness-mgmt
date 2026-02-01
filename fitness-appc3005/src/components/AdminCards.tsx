import {
    Card,
    CardAction,
    CardTitle,
    CardDescription,
    CardHeader,
} from "@/components/ui/card"
import { MdClass, MdMeetingRoom } from "react-icons/md";



export const AdminCards = () => {
    return (

        <div className="flex">
            <Card className="dark:bg-black flex flex-col items-center justify-center w-full max-w-sm sm:min-w-sm sm:max-w-md mx-4">
                <MdMeetingRoom className="w-20 h-20" />
                <CardHeader className="flex flex-col items-center justify-center min-w-sm">
                    <CardAction>
                    </CardAction>
                    <CardTitle>Room Booking</CardTitle>
                    <CardDescription className="text-center">
                        Book different rooms for the following class sessions
                    </CardDescription>
                </CardHeader>
            </Card>
            <Card className="dark:bg-black flex flex-col items-center justify-center w-full max-w-sm sm:min-w-sm sm:max-w-md mx-4">
                <MdClass className="w-20 h-20" />
                <CardHeader className="flex flex-col items-center justify-center min-w-sm">
                    <CardAction>
                    </CardAction>
                    <CardTitle>Class Management</CardTitle>
                    <CardDescription className="text-center">
                        Manage your sessions and trainers
                    </CardDescription>
                </CardHeader>

            </Card>
        </div>
    );
};