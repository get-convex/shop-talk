import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { MyAudio } from "@/MyAudio";

export default function VoiceControls() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-4 text-amber-800">Voice Controls</h2>
      
      <MyAudio />
    </div>
  );
}
