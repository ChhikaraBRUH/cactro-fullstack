import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const VoteSchema = z.object({
  optionId: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { optionId } = VoteSchema.parse(body);

    // Verify that the option exists and belongs to the poll
    const option = await prisma.option.findUnique({
      where: {
        id: optionId,
      },
    });

    if (!option) {
      return NextResponse.json(
        { error: "Invalid option for this poll!" },
        { status: 400 }
      );
    }

    // Increment the votes atomically
    const updatedOption = await prisma.option.update({
      where: { id: optionId },
      data: {
        votes: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(updatedOption);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data!" },
        { status: 400 }
      );
    }
    console.error("Error voting on poll: ", error);
    return NextResponse.json(
      { error: "Error voting on poll!" },
      { status: 500 }
    );
  }
}
