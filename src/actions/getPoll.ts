"use server";

import prisma from "@/lib/prisma";

const getPoll = async (pollId: string) => {
  "server only";

  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: {
      options: {
        orderBy: { votes: "desc" },
      },
    },
  });

  if (!poll) {
    throw new Error("Poll not found!");
  }

  // Calculate the total votes and the percentage for each option
  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );
  const resultsWithPercentages = {
    ...poll,
    totalVotes,
    options: poll.options.map((option) => ({
      ...option,
      percentage:
        totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0,
    })),
  };

  return resultsWithPercentages;
};

export default getPoll;
