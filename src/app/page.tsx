import Image from "next/image";
import VoiceRecorder from "@/components/ClientVoiceRecorder";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-100 p-6 flex justify-center items-center">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-8">Record your message</h1>
        <VoiceRecorder />
      </div>
    </main>
  );
}
