import React from "react";
import { useForm } from "react-hook-form";
import { getTrendingSuggestions } from "@/lib/suggestions";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
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
import { AI_PROVIDERS } from "@/lib/ai-providers";
import { getApiKey } from "@/lib/openai";

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
  const [isLoadingSuggestions, setIsLoadingSuggestions] = React.useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] =
    React.useState(false);
  const [lastClickTime, setLastClickTime] = React.useState<{
    [key: string]: number;
  }>({});
  const { toast } = useToast();
  const [currentExamples, setCurrentExamples] = React.useState<{
    [key: string]: { text: string; isSelected: boolean }[];
  }>({});

  const currentField = steps[currentStep];
  const currentFieldId = currentField.id as keyof FormData;
  const debounceTime = 500; // 500ms للحماية من الضغط المتتالي

  const form = useForm<FormData>({
    defaultValues: {
      ...defaultFormData,
      [currentFieldId]: formValues[currentFieldId],
    },
  });

  const isButtonCooldown = (buttonId: string) => {
    const lastClick = lastClickTime[buttonId] || 0;
    const now = Date.now();
    return now - lastClick < debounceTime;
  };

  const updateLastClickTime = (buttonId: string) => {
    setLastClickTime((prev) => ({ ...prev, [buttonId]: Date.now() }));
  };

  const generateAISuggestions = async () => {
    const defaultSuggestions = [
      {
        text: "منصة لتعليم البرمجة للأطفال باستخدام الذكاء الاصطناعي",
        isSelected: false,
      },
      {
        text: "سوق إلكتروني للمنتجات المستدامة والصديقة للبيئة",
        isSelected: false,
      },
      {
        text: "منصة لربط المستثمرين برواد الأعمال في مجال التكنولوجيا",
        isSelected: false,
      },
      {
        text: "تطبيق للرعاية الصحية عن بعد مع دعم الذكاء الاصطناعي",
        isSelected: false,
      },
      { text: "منصة لإدارة وتتبع الأهداف الشخصية والمهنية", isSelected: false },
    ];

    if (isButtonCooldown("generate") || isGeneratingSuggestions) return;
    updateLastClickTime("generate");
    setIsGeneratingSuggestions(true);

    try {
      const response = await fetch(
        `${AI_PROVIDERS[0].apiEndpoint}?key=${getApiKey("gemini")}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `اقترح 5 أفكار مواقع مبتكرة وعصرية. أريد النتيجة بهذا الشكل فقط، بدون أي نص إضافي:\n1. [فكرة الموقع الأول]\n2. [فكرة الموقع الثاني]\n3. [فكرة الموقع الثالث]\n4. [فكرة الموقع الرابع]\n5. [فكرة الموقع الخامس]`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.9,
              maxOutputTokens: 1024,
            },
          }),
        },
      );

      if (!response.ok) throw new Error();

      const data = await response.json();
      const suggestions = data.choices?.[0]?.message?.content;

      if (!suggestions) throw new Error();

      // تحويل النص إلى مصفوفة من الاقتراحات
      const lines = suggestions
        .split("\n")
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .filter((line) => line.length > 0)
        .map((text) => ({ text, isSelected: false }));

      if (lines.length === 0) throw new Error();

      setCurrentExamples((prev) => ({
        ...prev,
        goals: lines,
      }));
    } catch (error) {
      console.error("Failed to generate suggestions:", error);
      // استخدام الاقتراحات الافتراضية
      setCurrentExamples((prev) => ({
        ...prev,
        goals: defaultSuggestions,
      }));

      toast({
        title: "تم استخدام الاقتراحات الافتراضية",
        description: "سنستخدم مجموعة من الاقتراحات المحددة مسبقاً",
        variant: "default",
      });
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  React.useEffect(() => {
    const initializeSuggestions = async () => {
      setIsLoadingSuggestions(true);
      try {
        await generateAISuggestions();
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    initializeSuggestions();
  }, []);

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

  const handleNext = async () => {
    if (isButtonCooldown("next")) return;
    updateLastClickTime("next");

    // التحقق من طول النص في الخطوة الأولى
    if (currentStep === 0) {
      const goalsText = form.getValues("goals");
      if (!goalsText || goalsText.trim().length < 5) {
        toast({
          title: "النص قصير جداً",
          description: "يرجى كتابة ما لا يقل عن 5 أحرف",
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (isButtonCooldown("prev")) return;
    updateLastClickTime("prev");

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleExampleClick = (e: React.MouseEvent, index: number) => {
    if (isButtonCooldown(`example-${index}`)) return;
    updateLastClickTime(`example-${index}`);

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
              <div className="mb-3 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h3 className="text-base font-medium flex items-center gap-2 text-primary">
                    {isLoadingSuggestions ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 animate-pulse text-yellow-500" />
                    )}
                    {isLoadingSuggestions
                      ? "جاري توليد اقتراحات ذكية..."
                      : "اقتراحات مفيدة:"}
                  </h3>
                  {currentStep === 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={generateAISuggestions}
                      disabled={isGeneratingSuggestions}
                      className="gap-2"
                    >
                      {isGeneratingSuggestions ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      توليد اقتراحات جديدة
                    </Button>
                  )}
                </div>
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
