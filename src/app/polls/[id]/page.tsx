"use client";

import { useEffect, useState, useRef, useCallback, use } from "react";
import getPoll from "@/actions/getPoll";
import PollCard from "@/components/poll-card";
import { MY_PORTFOLIO_LINK, REFETCH_INTERVAL, Route } from "@/lib/constants";
import { Home, Loader, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

const ViewPollPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: pollId } = use(params);
  const [pollData, setPollData] =
    useState<Awaited<ReturnType<typeof getPoll>>>();
  const [isFetching, setIsFetching] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>(null);

  const fetchPoll = useCallback(async () => {
    try {
      setIsFetching(true);
      const data = await getPoll(pollId);
      if (!data) notFound();
      setPollData(data);
    } catch (error) {
      console.error("Error fetching poll: ", error);
    } finally {
      setIsFetching(false);
    }
  }, [pollId]);

  useEffect(() => {
    // Initial fetch
    fetchPoll();

    // Set up polling interval to fetch poll data every REFETCH_INTERVAL ms
    intervalRef.current = setInterval(fetchPoll, REFETCH_INTERVAL);

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchPoll, pollId]);

  const refreshPollData = () => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Fetch data immediately
    fetchPoll();

    // Set up new interval
    intervalRef.current = setInterval(fetchPoll, 5000);
  };

  const optimisticUpdateOption = useCallback(
    (optionId: string) => {
      setPollData((prevData) => {
        if (!prevData) return prevData;

        const updatedOptions = prevData.options.map((option) => {
          return {
            ...option,
            votes: option.id === optionId ? option.votes + 1 : option.votes,
            percentage:
              option.id === optionId
                ? Math.round(
                    ((option.votes + 1) / (prevData.totalVotes + 1)) * 100
                  )
                : Math.round((option.votes / (prevData.totalVotes + 1)) * 100),
          };
        });

        return {
          ...prevData,
          options: updatedOptions,
        };
      });
    },
    [setPollData]
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] w-full">
      {isFetching ? (
        <Loader
          size={24}
          className="text-neutral-600 animate-spin fixed top-2 right-2"
        />
      ) : null}

      <main className="flex flex-col items-center justify-center gap-8 w-full container mx-auto max-w-3xl">
        <div className="flex items-center gap-4">
          <Link
            href={Route.Index}
            className="hover:bg-gray-100 p-2 rounded-md transition-all"
          >
            <Home size={24} />
          </Link>

          <h1 className="text-2xl md:text-4xl font-bold text-center dark:text-white">
            Chaitanya&apos;s Cactro Polls!
          </h1>
        </div>

        {!pollData ? (
          <Loader2 size={48} className="text-blue-500 animate-spin" />
        ) : (
          <PollCard
            poll={pollData}
            refreshPollData={refreshPollData}
            optimisticUpdateOption={optimisticUpdateOption}
          />
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
