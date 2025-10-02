// import TwitterSearchGenerator from "@/components/TwitterSearchGenerator";
import TwitterSearchGenerator from "@/components/TwitterSearchGenerator";
import Image from "next/image";
import { ModeToggle } from "@/components/toggle-mode";

export default function Home() {
  return (
    <div>
      <div className="max-w-2xl mx-auto relative">
        <TwitterSearchGenerator />
      </div>
    </div>
  );
}
