import GroupClass from "./GroupClass";
import MemberSearch from "./MemberSearch";

export default async function Member() {
  return (
    <div className="dark:bg-stone-950 h-full flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans">
      <h1 className="max-w-s mb-4 text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        Trainers
      </h1>
      <div className="flex w-full gap-4 flex-wrap justify-center">
        <GroupClass />
        <MemberSearch />
      </div>
    </div>
  );
}
