"use server";

import prisma from "@/lib/prisma";

const votePollOption = async (optionId: string) => {
  "server only";

  // Verify that the option exists and belongs to the poll
  const option = await prisma.option.findUnique({
    where: {
      id: optionId,
    },
  });

  if (!option) {
    throw new Error("Invalid option for this poll!");
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

  return updatedOption;
};

export default votePollOption;
