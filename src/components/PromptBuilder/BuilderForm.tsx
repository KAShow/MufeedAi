import React from "react";
import { useForm } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FormData {
  goals: string;
  audience: string;
  requirements: string;
  preferences: string;
}

interface BuilderFormProps {
  onFormUpdate?: (data: FormData) => void;
  initialData?: Partial<FormData>;
}

const defaultFormData: FormData = {
  goals: "Create an engaging user interface",
  audience: "Web developers and designers",
  requirements: "Must be responsive and accessible",
  preferences: "Modern, minimalist design style",
};

export default function BuilderForm({
  onFormUpdate,
  initialData = defaultFormData,
}: BuilderFormProps) {
  const form = useForm<FormData>({
    defaultValues: initialData,
  });

  const onSubmit = (data: FormData) => {
    onFormUpdate?.(data);
  };

  // Update preview on form changes
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      onFormUpdate?.(value as FormData);
    });
    return () => subscription.unsubscribe();
  }, [form, onFormUpdate]);

  return (
    <Card className="h-full w-full bg-white p-6 overflow-y-auto">
      <Form {...form}>
        <form onChange={form.handleSubmit(onSubmit)} className="space-y-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="goals">
              <AccordionTrigger className="text-lg font-semibold">
                Prompt Goals
              </AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        What do you want to achieve with this prompt?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your prompt goals..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe the main objectives and desired outcomes.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="audience">
              <AccordionTrigger className="text-lg font-semibold">
                Target Audience
              </AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Who is this prompt intended for?</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Define your target audience..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Specify the intended users or audience for this prompt.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="requirements">
              <AccordionTrigger className="text-lg font-semibold">
                Technical Requirements
              </AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        What are the technical specifications?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List technical requirements..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include any specific technical constraints or
                        requirements.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="preferences">
              <AccordionTrigger className="text-lg font-semibold">
                Design Preferences
              </AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="preferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What are your design preferences?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe design preferences..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Specify any design styles, themes, or visual
                        preferences.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset(defaultFormData)}
            >
              Reset
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
