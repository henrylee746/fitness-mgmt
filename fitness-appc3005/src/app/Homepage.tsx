import { FlippingCard } from "@/components/ui/flipping-card";
import HeroSection from "./HeroSection";

/*
interface CardData {
  id: string;
  front: {
    imageSrc: string;
    imageAlt: string;
    title: string;
  };
  back: {
    description: string[];
  };
}

const cardsData: CardData[] = [
  {
    id: "member",
    front: {
      imageSrc: "/member.png",
      imageAlt: "Member",
      title: "Members",
    },
    back: {
      description: [
        "Register as a member",
        "Update your information & metrics (timestamped)",
        "View your information on a dashboard",
        "Register for group sessions",
      ],
    },
  },
  {
    id: "trainer",
    front: {
      imageSrc: "/trainer.png",
      imageAlt: "Trainer",
      title: "Trainers",
    },
    back: {
      description: [
        "View all sessions and their details filtered by trainer",
        "View all members by search (case-insensitive)",
      ],
    },
  },
  {
    id: "admin",
    front: {
      imageSrc: "/admin.jpg",
      imageAlt: "Admins",
      title: "Administrative Staff",
    },
    back: {
      description: [
        "Edit room assignments for sessions",
        "Create new sessions",
      ],
    },
  },
];

interface GenericCardFrontProps {
  data: CardData["front"];
}
function GenericCardFront({ data }: GenericCardFrontProps) {
  return (
    <div className="flex h-full w-full flex-col p-4">
      <img
        src={data.imageSrc}
        alt={data.imageAlt}
        className="h-auto min-h-0 w-full flex-grow rounded-md object-cover"
      />
      <div className="p-2">
        <h3 className="mt-2 text-base font-semibold">{data.title}</h3>
      </div>
    </div>
  );
}

interface GenericCardBackProps {
  data: CardData["back"];
}
function GenericCardBack({ data }: GenericCardBackProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <ul className="text-muted-foreground mt-2 text-center text-[18.5px] list-disc list-inside">
        {data.description.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </div>
  );
}

function FlippingCardDemo() {
  return (
    <div className="flex gap-8 my-6 p-4 flex-wrap justify-center items-center">
      {cardsData.map((card) => (
        <FlippingCard
          key={card.id}
          width={300}
          height={300}
          frontContent={<GenericCardFront data={card.front} />}
          backContent={<GenericCardBack data={card.back} />}
        />
      ))}
    </div>
  );
}
*/

const Homepage = () => (
  <>
    <HeroSection />
    {/*
      <Separator />
      <h3 className="max-w-lg text-2xl font-medium leading-10 tracking-tight text-black dark:text-zinc-50">
        A fitness application with functionality for{" "}
        <i className="text-slate-400">members,</i>{" "}
        <i className="text-violet-400">trainers,</i> and{" "}
        <i className="text-blue-400">administrators.</i>
        </h3>
      */}

    {/* <FlippingCardDemo /> */}
  </>
);

export default Homepage;
