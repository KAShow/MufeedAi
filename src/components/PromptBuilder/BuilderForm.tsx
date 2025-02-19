import React from "react";
import { useForm } from "react-hook-form";
import { getTrendingSuggestions } from "@/lib/suggestions";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

interface FormData {
  goals: string;
  audience: string;
  requirements: string;
  preferences: string;
  features: string;
  content: string;
  security: string;
}

interface BuilderFormProps {
  onFormUpdate?: (data: FormData) => void;
  initialData?: Partial<FormData>;
}

const defaultFormData: FormData = {
  goals: "",
  audience: "",
  requirements: "",
  preferences: "",
  features: "",
  content: "",
  security: "",
};

const steps = [
  {
    id: "goals",
    title: "نوع الموقع والهدف",
    description: "ما هو نوع الموقع والغرض الرئيسي منه؟",
    hint: "حدد نوع الموقع (تجاري، خدمي، تعليمي، إلخ) واذكر الهدف الرئيسي منه",
  },
  {
    id: "audience",
    title: "الجمهور المستهدف",
    description: "من هم المستخدمون المستهدفون للموقع؟",
    hint: "حدد الفئة العمرية، المجال المهني، الاهتمامات، والمنطقة الجغرافية",
  },
  {
    id: "requirements",
    title: "المتطلبات التقنية",
    description: "ما هي التقنيات والأدوات المطلوبة؟",
    hint: "حدد لغات البرمجة، أطر العمل، قواعد البيانات، والاستضافة المناسبة",
  },
  {
    id: "preferences",
    title: "التصميم والمظهر",
    description: "كيف تريد أن يبدو الموقع؟",
    hint: "حدد الألوان، الخطوط، الأسلوب العام، والهوية البصرية المطلوبة",
  },
  {
    id: "features",
    title: "الميزات التفاعلية",
    description: "ما هي الميزات التفاعلية التي يحتاجها الموقع؟",
    hint: "حدد أنظمة المكافآت، المحادثات المباشرة، الخرائط التفاعلية، وميزات المشاركة",
  },
  {
    id: "content",
    title: "المحتوى والتسويق",
    description: "ما هي استراتيجية المحتوى والتسويق؟",
    hint: "حدد نوع المحتوى، صفحات الهبوط، حملات البريد الإلكتروني، وبرامج الإحالة",
  },
  {
    id: "security",
    title: "الأمن والخصوصية",
    description: "ما هي متطلبات الأمن والخصوصية؟",
    hint: "حدد آليات التشفير، نظام الصلاحيات، النسخ الاحتياطي، وتتبع النشاطات",
  },
];

export default function BuilderForm({
  onFormUpdate,
  initialData = defaultFormData,
}: BuilderFormProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formValues, setFormValues] = React.useState<FormData>(defaultFormData);
  const [currentExamples, setCurrentExamples] = React.useState<{
    [key: string]: { text: string; isSelected: boolean }[];
  }>({
    goals: getTrendingSuggestions("goals").map((text) => ({
      text,
      isSelected: false,
    })),
    audience: getTrendingSuggestions("audience").map((text) => ({
      text,
      isSelected: false,
    })),
    requirements: getTrendingSuggestions("requirements").map((text) => ({
      text,
      isSelected: false,
    })),
    preferences: getTrendingSuggestions("preferences").map((text) => ({
      text,
      isSelected: false,
    })),
    features: getTrendingSuggestions("features").map((text) => ({
      text,
      isSelected: false,
    })),
    content: getTrendingSuggestions("content").map((text) => ({
      text,
      isSelected: false,
    })),
    security: getTrendingSuggestions("security").map((text) => ({
      text,
      isSelected: false,
    })),
  });

  const currentField = steps[currentStep];
  const currentFieldId = currentField.id as keyof FormData;

  const form = useForm<FormData>({
    defaultValues: {
      ...defaultFormData,
      [currentFieldId]: formValues[currentFieldId],
    },
  });

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      const newValues = {
        ...formValues,
        [currentFieldId]: value[currentFieldId],
      };
      setFormValues(newValues);
      onFormUpdate?.(newValues);
    });
    return () => subscription.unsubscribe();
  }, [form, currentFieldId]);

  React.useEffect(() => {
    form.setValue(currentFieldId, formValues[currentFieldId] || "");
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleExampleClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const currentValue = form.getValues(currentFieldId) || "";
    const examples = currentExamples[currentFieldId];
    const example = examples[index];

    setCurrentExamples((prev) => ({
      ...prev,
      [currentFieldId]: examples.map((item, i) =>
        i === index ? { ...item, isSelected: !item.isSelected } : item,
      ),
    }));

    if (!example.isSelected) {
      const newValue = currentValue
        ? `${currentValue}\n${example.text}`
        : example.text;
      form.setValue(currentFieldId, newValue, {
        shouldDirty: true,
        shouldTouch: true,
      });
    } else {
      const lines = currentValue.split("\n");
      const filteredLines = lines.filter(
        (line) => line.trim() !== example.text.trim(),
      );
      form.setValue(currentFieldId, filteredLines.join("\n"), {
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  const refreshExamples = () => {
    setCurrentExamples((prev) => ({
      ...prev,
      [currentFieldId]: getTrendingSuggestions(
        currentFieldId as keyof FormData,
      ).map((text) => ({ text, isSelected: false })),
    }));
  };

  return (
    <Card className="h-full w-full bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 p-2 sm:p-4 flex flex-col shadow-lg transition-all duration-300 hover:shadow-xl">
      <Form {...form}>
        <div className="flex-1 flex flex-col">
          <div className="mb-4">
            <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              {currentField.title}
            </h2>
            <p className="text-gray-600 text-lg">{currentField.description}</p>
          </div>

          <div className="flex-1">
            <FormField
              control={form.control}
              name={currentFieldId}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder={`اكتب ${currentField.title} هنا...`}
                      className="min-h-[200px] text-lg p-4 leading-relaxed transition-all duration-300 focus:shadow-lg focus:border-primary/50 bg-white/80 hover:bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-base mt-2 text-primary/70">
                    {currentField.hint}
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="mt-4">
              <div className="mb-3">
                <h3 className="text-base font-medium flex items-center gap-2 text-primary">
                  <Sparkles className="h-4 w-4 animate-pulse text-yellow-500" />
                  اقتراحات مفيدة:
                </h3>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {currentExamples[currentFieldId]?.map((example, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant={example.isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={(e) => handleExampleClick(e, index)}
                    className={`text-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md ${example.isSelected ? "bg-primary text-white" : "bg-white/80 hover:bg-primary hover:text-white"}`}
                  >
                    {example.text}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-primary/10">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="gap-2 transition-all duration-300 hover:scale-105 hover:bg-secondary/90 hover:text-white active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              <ChevronRight className="h-4 w-4" />
              السابق
            </Button>

            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all duration-300 transform ${index === currentStep ? "bg-primary scale-125" : "bg-gray-200 hover:scale-110"}`}
                />
              ))}
            </div>

            <Button
              type="button"
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              التالي
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
}
