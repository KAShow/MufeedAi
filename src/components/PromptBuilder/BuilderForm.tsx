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
  goals: "إنشاء واجهة مستخدم جذابة",
  audience: "مطورو الويب والمصممون",
  requirements: "يجب أن تكون متجاوبة وسهلة الوصول",
  preferences: "نمط تصميم حديث وبسيط",
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
                الأهداف
              </AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ما الذي تريد تحقيقه من هذا النص؟</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="أدخل أهدافك هنا..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        صف الأهداف الرئيسية والنتائج المرجوة
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="audience">
              <AccordionTrigger className="text-lg font-semibold">
                الجمهور المستهدف
              </AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>لمن يتوجه هذا النص؟</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="حدد جمهورك المستهدف..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        حدد الفئة المستهدفة لهذا النص
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="requirements">
              <AccordionTrigger className="text-lg font-semibold">
                المتطلبات التقنية
              </AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ما هي المواصفات التقنية؟</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="اذكر المتطلبات التقنية..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        أضف أي متطلبات أو قيود تقنية محددة
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="preferences">
              <AccordionTrigger className="text-lg font-semibold">
                تفضيلات التصميم
              </AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="preferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ما هي تفضيلاتك في التصميم؟</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="صف تفضيلات التصميم..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        حدد أنماط التصميم والمظهر المرئي المفضل
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
              إعادة تعيين
            </Button>
            <Button type="submit">حفظ</Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
