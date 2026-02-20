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

        <div className="flex gap-2 sm:gap-3 md:gap-4">
            <Card className="hover:scale-103 transition-all duration-300 dark:bg-black flex flex-col items-center justify-center w-[280px] sm:w-[320px] md:w-[356px] m-2 sm:m-3 md:m-4">
                <MdMeetingRoom className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20" />
                <CardHeader className="flex flex-col items-center justify-center w-full">
                    <CardAction>
                    </CardAction>
                    <CardTitle className="text-base sm:text-lg text-center">Room Booking</CardTitle>
                    <CardDescription className="text-center text-xs sm:text-sm">
                        Book different rooms for the following class sessions
                    </CardDescription>
                </CardHeader>
            </Card>
            <Card className="hover:scale-103 transition-all duration-300 dark:bg-black flex flex-col items-center justify-center w-[280px] sm:w-[320px] md:w-[356px] m-2 sm:m-3 md:m-4">
                <MdClass className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20" />
                <CardHeader className="flex flex-col items-center justify-center w-full">
                    <CardAction>
                    </CardAction>
                    <CardTitle className="text-base sm:text-lg text-center">Class Management</CardTitle>
                    <CardDescription className="text-center text-xs sm:text-sm">
                        Manage your sessions and trainers
                    </CardDescription>
                </CardHeader>

            </Card>
        </div>
    );
};