"use client";

import { use, useEffect, useState } from "react";
import getPoll from "@/actions/getPoll";
import PollCard from "@/components/poll-card";
import { MY_PORTFOLIO_LINK } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";

const ViewPollPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: pollId } = use(params);
  const [pollData, setPollData] =
    useState<Awaited<ReturnType<typeof getPoll>>>();

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const data = await getPoll(pollId);
        if (!data) notFound();
        setPollData(data);
      } catch (error) {
        console.error("Error fetching poll: ", error);
      }
    };

    // Initial fetch
    fetchPoll();

    // Set up polling interval to fetch poll data every 5 seconds
    const interval = setInterval(fetchPoll, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [pollId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] w-full">
      <main className="flex flex-col items-center justify-center gap-8 w-full container mx-auto max-w-3xl">
        <h1 className="text-2xl md:text-4xl font-bold text-center dark:text-white">
          Chaitanya&apos;s Cactro Polls!
        </h1>

        {!pollData ? (
          <Loader2 size={48} className="text-blue-500 animate-spin" />
        ) : (
          <PollCard poll={pollData} />
        )}
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
};

export default ViewPollPage;
