"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFieldArray } from "react-hook-form";
import { CreatePollSchema } from "@/lib/validation";
import { toast } from "sonner";
import { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import useZodForm from "@/hooks/use-zod-form";

interface CreatePollDialogProps {
  className?: string;
}

const CreatePollDialog: React.FC<CreatePollDialogProps> = ({ className }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useZodForm({
    schema: CreatePollSchema,
    defaultValues: {
      question: "Who is the best Avenger?",
      options: ["Iron Man", "Captain America"],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "options" as never,
    control: form.control,
    rules: {
      minLength: 2,
      maxLength: 4,
      required: true,
    },
  });

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
    }

    setIsDialogOpen(isOpen);
  };

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      console.log(data);
      // TODO: Implement API call
    } catch (error) {
      console.error(error);
      toast.error("Failed to create poll");
    }
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-max md:px-10 group">
          Create a Poll
          <ArrowRight className="group-hover:translate-x-1 transition-all" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className={cn("flex w-full flex-col gap-5", className)}
          >
            <DialogHeader>
              <DialogTitle>Create a Poll</DialogTitle>
              <DialogDescription>
                Create a poll to get quick feedback from your friends and
                followers. Add a question and up to 4 options.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Question <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        required
                        type="text"
                        placeholder="What's your question?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <FormLabel>
                  Options <span className="text-red-500">*</span>
                </FormLabel>
                {fields?.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-2">
                    <FormField
                      control={form.control}
                      name={`options.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              type="text"
                              required
                              placeholder={`Option ${index + 1}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => remove(index)}
                      disabled={fields.length <= 2}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {fields.length < 4 ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => append("")}
                    disabled={form.watch("options")?.[fields.length - 1] === ""}
                  >
                    Add Option
                  </Button>
                ) : null}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePollDialog;
