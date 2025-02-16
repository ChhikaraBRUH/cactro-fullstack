import { Button } from "@/components/ui/button";
import { MY_PORTFOLIO_LINK } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center justify-center gap-8">
        <h1 className="text-2xl md:text-4xl font-bold text-center dark:text-white">
          Welcome to Chaitanya&apos;s Cactro Polls!
        </h1>

        <Button className="w-full md:w-max md:px-10 group">
          Create a Poll
          <ArrowRight className="group-hover:translate-x-1 transition-all" />
        </Button>
      </main>

      <footer className="text-center">
        Made with{" "}
        <span role="img" aria-label="magic">
          ✨🧙🏻‍♂️
        </span>{" "}
        by{" "}
        <a
          className="text-blue-600 font-medium visited:text-purple-600 hover:underline dark:text-secondary"
          href={MY_PORTFOLIO_LINK}
          target="_blank"
          rel="noopener noreferrer"
        >
          Chaitanya
        </a>
      </footer>
    </div>
  );
}
