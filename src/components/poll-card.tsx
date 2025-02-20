"use client";

import getPoll from "@/actions/getPoll";
import votePollOption from "@/actions/votePollOption";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface PollCardProps {
  poll: Awaited<ReturnType<typeof getPoll>>;
  refreshPollData: () => void;
  optimisticUpdateOption: (optionId: string) => void;
}

const PollCard: React.FC<PollCardProps> = ({
  poll,
  refreshPollData,
  optimisticUpdateOption,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onVotePollOptionHandler = async (optionId: string) => {
    setIsLoading(true);

    try {
      optimisticUpdateOption(optionId);
      await votePollOption(optionId);
      toast.success("Voted successfully!");
    } catch (error) {
      console.error("Error voting on poll: ", error);
      toast.error("Error voting on poll!");
    } finally {
      setIsLoading(false);
      refreshPollData();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 bg-white border border-neutral-200 rounded-xl shadow w-full">
      <h2 className="text-2xl font-semibold text-neutral-800 text-center">
        {poll.question}
      </h2>

      <div className="w-full flex flex-col gap-4 ">
        {poll.options.map((option) => (
          <div
            key={option.id}
            className="w-full flex flex-col rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-neutral-100"
          >
            <div className="w-full flex items-center justify-between p-4 ">
              <p className="text-lg text-neutral-700">{option.text}</p>

              <Button
                type="button"
                variant="outline"
                className="w-max shrink-0"
                disabled={isLoading}
                onClick={() => onVotePollOptionHandler(option.id)}
              >
                Vote
              </Button>
            </div>

            <div className="p-2">
              <div className="flex items-center justify-between">
                <div className="w-full bg-blue-200 rounded-full h-6 relative">
                  <div
                    className="bg-blue-500 h-6 rounded-full absolute top-0 left-0"
                    style={{ width: `${option.percentage}%` }}
                  ></div>
                </div>
                <p className="ml-3 text-sm font-medium text-blue-700 w-max shrink-0">
                  {option.votes} votes ({option.percentage}%)
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollCard;
