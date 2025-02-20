import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { CreatePollSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const reqJson = await req.json();
  const { question, options } = CreatePollSchema.parse(reqJson);

  const poll = await prisma.poll.create({
    data: {
      question,
      options: {
        create: options.map((option) => ({
          text: option,
        })),
      },
    },
  });

  return NextResponse.json({ poll }, { status: 201 });
}
