import GroupClass from "./(components)/GroupClass";
import MemberSearch from "./(components)/MemberSearch";

export default function Trainer() {
  return (
    <>
      <h1 className="max-w-s mb-4 text-center text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        Trainers
      </h1>
      <div className="h-full flex flex-1 flex-col items-center justify-center font-sans gap-8 ">
        <GroupClass />
        <MemberSearch />
      </div>
    </>
  );
}
