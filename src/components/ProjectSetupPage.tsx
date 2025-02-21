import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, Target, Loader2, ArrowLeft } from "lucide-react";
import { AI_PROVIDERS } from "@/lib/ai-providers";
import { getApiKey } from "@/lib/openai";

export default function ProjectSetupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projectGoal, setProjectGoal] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<
    { text: string; isSelected: boolean }[]
  >([]);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerateSuggestions = async (retryCount = 0) => {
    const maxRetries = 2;
    // التحقق من أن النص يحتوي على كلمتين على الأقل
    const words = projectGoal.trim().split(/\s+/);
    if (words.length < 2) {
      toast({
        title: "النص قصير جداً",
        description: "الرجاء كتابة كلمتين على الأقل للحصول على اقتراحات مناسبة",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch(AI_PROVIDERS[0].apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "HTTP-Referer": "https://tempolabs.ai",
          "X-Title": "Tempo Labs",
          Authorization: `Bearer ${getApiKey("openrouter")}`,
        },
        body: JSON.stringify({
          model: AI_PROVIDERS[0].model,
          messages: [
            {
              role: "user",
              content: `بناءً على النص التالي: "${projectGoal}"\n\nاقترح 5 أفكار مواقع مشابهة ومبتكرة. أريد النتيجة بهذا الشكل فقط، بدون أي نص إضافي:\n1. [فكرة الموقع الأول]\n2. [فكرة الموقع الثاني]\n3. [فكرة الموقع الثالث]\n4. [فكرة الموقع الرابع]\n5. [فكرة الموقع الخامس]`,
            },
          ],
          temperature: 0.9,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      const suggestionsText = data.choices?.[0]?.message?.content;
      console.log("API Response:", data);

      if (!suggestionsText) throw new Error();

      const lines = suggestionsText
        .split("\n")
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .filter((line) => line.length > 0)
        .map((text) => ({ text, isSelected: false }));

      if (lines.length === 0) throw new Error();

      setSuggestions(lines);
    } catch (error) {
      console.error("Failed to generate suggestions:", error);

      // محاولة مرة أخرى في حالة فشل الاتصال
      if (retryCount < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return handleGenerateSuggestions(retryCount + 1);
      }

      // إذا فشلت كل المحاولات
      toast({
        title: "الخدمة غير متوفرة حالياً",
        description: "يرجى المحاولة مرة أخرى بعد قليل",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggestionClick = (index: number) => {
    setSuggestions((prev) =>
      prev.map((item, i) => ({
        ...item,
        isSelected: i === index ? !item.isSelected : false,
      })),
    );
    setProjectGoal(suggestions[index].text);
  };

  const handleContinue = () => {
    if (!projectGoal.trim()) {
      toast({
        title: "مطلوب تحديد الهدف",
        description: "الرجاء تحديد هدف ونوع الموقع قبل المتابعة",
        variant: "destructive",
      });
      return;
    }
    // Store in sessionStorage to persist across navigation
    sessionStorage.setItem("projectGoal", projectGoal.trim());
    navigate("/steps/audience", {
      state: { projectGoal: projectGoal.trim() },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-6 space-y-8 bg-white/80 backdrop-blur-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">تحديد هدف ونوع الموقع</h1>
          </div>
          <p className="text-muted-foreground">
            حدد الهدف الرئيسي ونوع الموقع الذي تريد إنشاءه
          </p>
        </div>

        <div className="space-y-4">
          <Textarea
            value={projectGoal}
            onChange={(e) => setProjectGoal(e.target.value)}
            placeholder="اكتب فكرتك الأساسية هنا (مثال: موقع لبيع المنتجات المحلية مع نظام توصيل)"
            className="min-h-[100px] text-lg"
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                اقتراحات ذكية بناءً على فكرتك:
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateSuggestions}
                disabled={
                  isGenerating || projectGoal.trim().split(/\s+/).length < 2
                }
                className={`gap-2 ${projectGoal.trim().split(/\s+/).length < 2 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                توليد اقتراحات
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant={suggestion.isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSuggestionClick(index)}
                  className={`transition-all duration-300 hover:scale-105 ${suggestion.isSelected ? "bg-primary text-white" : ""}`}
                >
                  {suggestion.text}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={handleContinue}
            className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
          >
            متابعة
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
