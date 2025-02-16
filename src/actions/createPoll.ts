"use server";

import prisma from "@/lib/prisma";
import { CreatePollSchema } from "@/lib/validation";

const createPoll = async (data: { question: string; options: string[] }) => {
  "server only";

  const parsedData = CreatePollSchema.parse(data);
  const { question, options } = parsedData;

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

  return poll;
};

export default createPoll;
