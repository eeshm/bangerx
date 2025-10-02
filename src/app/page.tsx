// import TwitterSearchGenerator from "@/components/TwitterSearchGenerator";
import TwitterSearchGenerator from "@/components/TwitterSearchGenerator";
import Image from "next/image";
import { ModeToggle } from "@/components/toggle-mode";

export default function Home() {
  return (
    <div>
      <div className="max-w-2xl mx-auto relative">

        {/* <div className="absolute inset-y-0 right-0 h-full w-px border-1 border-dotted bg-orange-600 pointer-events-none"/> */}
        {/* <div className="absolute inset-y-0  h-full left-0 w-px border-1 border-dotted bg-orange-600 pointer-events-none"/> */}
        {/* <div className="absolute inset-x-0  bottom-0 w-full h-px  border-1 border-dotted bg-orange-600 pointer-events-none"/> */}
        {/* <div className="border-l border-2 fixed h-full border-dotted"/> */}
        {/* <div className="border-l border-2 fixed h-full"/> */}
        <TwitterSearchGenerator />
      </div>
    </div>
  );
}
