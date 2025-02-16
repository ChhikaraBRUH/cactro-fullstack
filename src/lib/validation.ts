import { z } from "zod";

export const CreatePollSchema = z.object({
  question: z.string().nonempty(),
  options: z.array(z.string().min(1).max(64)).min(2).max(4),
});
