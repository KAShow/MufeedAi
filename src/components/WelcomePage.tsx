import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, Key, ArrowLeft, Code2, Target, Users } from "lucide-react";
import { getApiKey } from "@/lib/openai";

export default function WelcomePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [apiKey, setApiKey] = React.useState("");
  const [isKeyValid, setIsKeyValid] = React.useState(false);

  React.useEffect(() => {
    // تحقق من وجود مفتاح في .env
    const envKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (envKey) {
      setIsKeyValid(true);
      return;
    }

    // إذا لم يكن هناك مفتاح في .env، تحقق من localStorage
    const localKey = localStorage.getItem("openrouter_api_key");
    if (localKey) {
      setApiKey(localKey);
      setIsKeyValid(true);
    }
  }, []);

  const validateAndSaveKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال مفتاح API",
        variant: "destructive",
      });
      return;
    }

    try {
      localStorage.setItem("openrouter_api_key", apiKey.trim());
      setIsKeyValid(true);
      toast({
        title: "تم بنجاح",
        description: "تم حفظ مفتاح API بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ المفتاح",
        variant: "destructive",
      });
    }
  };

  const handleStart = () => {
    if (!isKeyValid) {
      toast({
        title: "مطلوب مفتاح API",
        description: "الرجاء إدخال مفتاح API أولاً",
        variant: "destructive",
      });
      return;
    }
    navigate("/setup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-6 space-y-8 bg-white/80 backdrop-blur-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            مرحباً بك في مفيد AI
          </h1>
          <p className="text-lg text-muted-foreground">
            منصة ذكية لبناء وتطوير المواقع الإلكترونية باستخدام الذكاء الاصطناعي
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">الأهداف</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              تسهيل عملية تخطيط وتطوير المواقع الإلكترونية باستخدام واجهة سهلة
              الاستخدام مع دعم الذكاء الاصطناعي
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">لمن هذا الموقع؟</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              مطوري الويب، مصممي المواقع، أصحاب المشاريع، وكل من يريد إنشاء موقع
              إلكتروني احترافي
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">المميزات</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              اقتراحات ذكية، نماذج جاهزة، تخصيص سهل، ومساعدة في كل خطوة من خطوات
              التطوير
            </p>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">مفتاح API</h3>
            </div>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="أدخل مفتاح OpenRouter API الخاص بك"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono"
              />
              <Button
                variant="outline"
                onClick={validateAndSaveKey}
                className="shrink-0"
              >
                <Key className="h-4 w-4 mr-2" />
                حفظ المفتاح
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              يمكنك الحصول على مفتاح API مجاناً من{" "}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                OpenRouter
              </a>
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleStart}
            className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
          >
            <Sparkles className="h-5 w-5" />
            ابدأ الآن
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
