import Link from "next/link";
import { UniShareLogo } from "@/components/unishare/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#171c1b]">
      <header className="border-b-[1.5px] border-[#111]">
        <div className="mx-auto flex h-16 max-w-[860px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 text-[18px] font-bold">
            <span className="text-[#0f6b63]">
              <UniShareLogo size={22} />
            </span>
            UniShare
          </Link>
          <Link
            href="/campus-home"
            className="rounded-md border-[1.5px] border-[#0f6b63] bg-[#0f6b63] px-4 py-2 text-[14px] font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#111]"
          >
            Campus home
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[860px] flex-1 flex-col items-start justify-center px-6 py-20">
        <p className="mb-3 inline-block rounded-full border-[1.5px] border-[#111] bg-[#e4ebe8] px-3 py-1 text-[12px] font-medium text-[#0f6b63]">
          404
        </p>
        <h1 className="text-[34px] font-bold leading-tight tracking-tight sm:text-[42px]">
          This shelf is empty.
        </h1>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#4b5552]">
          The page you are looking for was moved, renamed or never listed on
          the campus marketplace.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-md border-[1.5px] border-[#0f6b63] bg-[#0f6b63] px-5 py-2.5 text-[15px] font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#111]"
          >
            Return home
          </Link>
          <Link
            href="/marketplace"
            className="rounded-md border-[1.5px] border-[#0f6b63] bg-white px-5 py-2.5 text-[15px] font-medium text-[#0f6b63] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#111]"
          >
            Browse marketplace
          </Link>
        </div>
      </main>

      <footer className="mt-auto border-t-[1.5px] border-[#111]">
        <div className="mx-auto flex max-w-[860px] flex-wrap justify-between gap-2 px-6 py-5 text-[12px] text-[#4b5552]">
          <span>UniShare. Made for university students in Bangladesh.</span>
          <span>
            <Link href="/privacy" className="font-medium text-[#0f6b63]">Privacy</Link>
            {" · "}
            <Link href="/terms" className="font-medium text-[#0f6b63]">Terms</Link>
            {" · "}
            <Link href="/get-help" className="font-medium text-[#0f6b63]">Get help</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
