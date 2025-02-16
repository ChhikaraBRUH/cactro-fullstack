import prisma from "@/lib/prisma";
import { z } from "zod";
import { NextResponse } from "next/server";

const CreatePollSchema = z.object({
  question: z.string().nonempty(),
  options: z.array(z.string().nonempty()),
});

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
