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
import { ChevronRight, ChevronLeft, Sparkles, RefreshCw } from "lucide-react";

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
  goals: "",
  audience: "",
  requirements: "",
  preferences: "",
};

const allExamples = {
  goals: [
    "منصة لمشاركة مقاطع الفيديو القصيرة على غرار TikTok",
    "تطبيق للذكاء الاصطناعي لتحرير وتحسين الصور",
    "منصة تعليمية متخصصة في الذكاء الاصطناعي وعلوم البيانات",
    "سوق NFT للفن الرقمي والمقتنيات الرقمية",
    "منصة للتجارة الإلكترونية تدعم العملات المشفرة",
    "تطبيق للواقع المعزز للتسوق",
    "منصة لبث الألعاب المباشر على غرار Twitch",
    "موقع للتوظيف متخصص في وظائف التقنية عن بُعد",
    "منصة لتعليم البرمجة للأطفال",
    "سوق للمنتجات المستدامة والصديقة للبيئة",
    "منصة لتقديم خدمات الصحة النفسية عن بُعد",
    "تطبيق للتمارين الرياضية المنزلية مع مدرب افتراضي",
    "منصة لتداول العملات المشفرة",
    "موقع لبيع المنتجات اليدوية والحرف",
    "منصة لتعليم اللغات باستخدام الذكاء الاصطناعي",
  ],
  audience: [
    "جيل Z (15-25 سنة) المهتم بصناعة المحتوى الرقمي",
    "المهنيون في مجال التقنية والبرمجة (25-40 سنة)",
    "رواد الأعمال والشركات الناشئة في العالم العربي",
    "المستثمرون في العملات المشفرة والأصول الرقمية",
    "المهتمون بالتعلم الذاتي والتطوير المهني",
    "الفنانون الرقميون ومنشئو محتوى NFT",
    "المتسوقون المهتمون بالموضة المستدامة",
    "الأسر الباحثة عن حلول تعليمية رقمية لأطفالهم",
    "المهتمون بالصحة واللياقة البدنية",
    "العاملون عن بُعد والمستقلون",
    "المهتمون بالتكنولوجيا المالية والاستثمار",
    "الحرفيون وأصحاب المشاريع الصغيرة",
    "طلاب الجامعات في مجالات التقنية",
    "المسافرون الباحثون عن تجارب فريدة",
    "المهتمون بالطعام والطبخ المنزلي",
  ],
  requirements: [
    "Next.js 14 مع App Router للواجهة الأمامية",
    "Supabase للقاعدة البيانات والمصادقة",
    "Vercel للنشر والاستضافة",
    "TailwindCSS مع Shadcn UI للتصميم",
    "TypeScript للتطوير الآمن",
    "Prisma ORM للتعامل مع قاعدة البيانات",
    "OpenAI API لميزات الذكاء الاصطناعي",
    "Web3.js للتكامل مع البلوكتشين",
    "Socket.io للاتصال المباشر",
    "AWS S3 لتخزين الملفات",
    "Redis للتخزين المؤقت",
    "Docker للنشر والتطوير",
    "GitHub Actions للـ CI/CD",
    "Stripe للمدفوعات",
    "Algolia للبحث المتقدم",
  ],
  preferences: [
    "تصميم Glassmorphism مع تأثيرات الضباب",
    "نمط Neumorphism للعناصر التفاعلية",
    "ألوان متدرجة عصرية (Gradient)",
    "تصميم Dark Mode بألوان OLED",
    "واجهة بنمط Minimal مع مساحات بيضاء",
    "تأثيرات حركية سلسة باستخدام Framer Motion",
    "تصميم متجاوب مع أولوية الموبايل",
    "خط Dubai للواجهة العربية",
    "نظام تصميم متناسق مع Material You",
    "تأثيرات Micro-interactions للتفاعل",
    "ألوان نيون للعناصر المهمة",
    "تصميم بنمط Brutalism العصري",
    "واجهة ثلاثية الأبعاد مع Three.js",
    "تأثيرات Parallax للتمرير",
    "نمط Claymorphism للأزرار",
  ],
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
];

export default function BuilderForm({
  onFormUpdate,
  initialData = defaultFormData,
}: BuilderFormProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formValues, setFormValues] = React.useState<FormData>(defaultFormData);
  const [currentExamples, setCurrentExamples] = React.useState<{
    [key: string]: string[];
  }>({
    goals: allExamples.goals.slice(0, 5),
    audience: allExamples.audience.slice(0, 5),
    requirements: allExamples.requirements.slice(0, 5),
    preferences: allExamples.preferences.slice(0, 5),
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

  const handleExampleClick = (e: React.MouseEvent, example: string) => {
    e.preventDefault();
    const currentValue = form.getValues(currentFieldId) || "";
    const newValue = currentValue ? `${currentValue}\n${example}` : example;
    form.setValue(currentFieldId, newValue, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [refreshError, setRefreshError] = React.useState("");

  const refreshExamples = () => {
    try {
      setIsRefreshing(true);
      setRefreshError("");
      const newSuggestions = getTrendingSuggestions(currentFieldId);
      setCurrentExamples((prev) => ({
        ...prev,
        [currentFieldId]: newSuggestions,
      }));
    } catch (error) {
      setRefreshError("فشل في تحديث الاقتراحات");
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card className="h-full w-full bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 p-6 flex flex-col shadow-lg transition-all duration-300 hover:shadow-xl">
      <Form {...form}>
        <div className="flex-1 flex flex-col">
          <div className="mb-8">
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
                      className="min-h-[250px] text-lg p-4 leading-relaxed transition-all duration-300 focus:shadow-lg focus:border-primary/50 bg-white/80 hover:bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-base mt-2 text-primary/70">
                    {currentField.hint}
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="mt-8">
              <div className="mb-3">
                <h3 className="text-base font-medium flex items-center gap-2 text-primary">
                  <Sparkles className="h-4 w-4 animate-pulse text-yellow-500" />
                  اقتراحات مفيدة:
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentExamples[currentFieldId].map((example, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleExampleClick(e, example)}
                    className="text-sm bg-white/80 hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-primary/10">
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
