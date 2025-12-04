import Homepage from "./Homepage";

export default function Home() {
  /*Can use this to test loading.tsx page
  console.log("Fetching revenue data...");
  await new Promise((resolve) => setTimeout(resolve, 30000));
  */
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <Homepage />
    </div>
  );
}
