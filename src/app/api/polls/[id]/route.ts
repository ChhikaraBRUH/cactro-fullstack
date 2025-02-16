import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        options: {
          orderBy: { votes: "desc" },
        },
      },
    });

    if (!poll) {
      return NextResponse.json({ error: "Poll not found!" }, { status: 404 });
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

    return NextResponse.json(resultsWithPercentages);
  } catch (error) {
    console.error("Error fetching poll:", error);
    return NextResponse.json({ error: "Error fetching poll" }, { status: 500 });
  }
}
