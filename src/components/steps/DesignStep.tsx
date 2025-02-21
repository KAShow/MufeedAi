import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoadingDialog } from "@/components/ui/loading-dialog";
import { generateAIPrompt } from "@/lib/openai";
import { Textarea } from "@/components/ui/textarea";
import StepLayout from "./StepLayout";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getApiKey } from "@/lib/openai";
import { AI_PROVIDERS } from "@/lib/ai-providers";

export default function DesignStep() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoading, setShowLoading] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(30);
  const [design, setDesign] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<
    { text: string; isSelected: boolean }[]
  >([]);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const { toast } = useToast();

  const generateSuggestions = async () => {
    if (!design.trim() || design.trim().split(/\s+/).length < 2) {
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
              content: `بناءً على:\n1. هدف الموقع: "${location.state?.projectGoal || ""}"\n2. الجمهور المستهدف: "${location.state?.audience || ""}"\n3. المتطلبات التقنية: "${location.state?.requirements || ""}"\n4. التصميم الحالي: "${design}"\n\nاقترح 5 أفكار تصميم إضافية مناسبة تتناسب مع الهدف والجمهور. أريد النتيجة بهذا الشكل فقط:\n1. [فكرة تصميم]\n2. [فكرة تصميم]\n3. [فكرة تصميم]\n4. [فكرة تصميم]\n5. [فكرة تصميم]`,
            },
          ],
          temperature: 0.9,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      const suggestionsText = data.choices?.[0]?.message?.content;

      if (!suggestionsText) throw new Error();

      const lines = suggestionsText
        .split("\n")
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .filter((line) => line.length > 0)
        .map((text) => ({ text, isSelected: false }));

      if (lines.length === 0) throw new Error();

      setSuggestions(lines);
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من توليد اقتراحات جديدة",
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
        isSelected: i === index ? !item.isSelected : item.isSelected,
      })),
    );

    const suggestion = suggestions[index];
    if (!suggestion.isSelected) {
      setDesign((prev) =>
        prev ? `${prev}\n${suggestion.text}` : suggestion.text,
      );
    } else {
      setDesign((prev) => {
        const lines = prev.split("\n");
        return lines
          .filter((line) => line.trim() !== suggestion.text.trim())
          .join("\n");
      });
    }
  };

  return (
    <StepLayout
      title="التصميم والمظهر"
      description="كيف تريد أن يبدو موقعك؟"
      currentStep={3}
      totalSteps={4}
      onNext={async () => {
        setShowLoading(true);
        const timer = setInterval(() => {
          setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);

        try {
          const currentState = location.state || {};
          const content = `هدف المشروع ونوعه:\n${currentState.projectGoal}\n\nالجمهور المستهدف:\n${currentState.audience}\n\nالمتطلبات التقنية:\n${currentState.requirements}\n\nالتصميم والمظهر:\n${design}`;

          const generatedPrompt = await generateAIPrompt(content, "openrouter");
          navigate("/preview", {
            state: {
              ...currentState,
              design,
              generatedPrompt,
            },
          });
        } catch (error) {
          toast({
            title: "حدث خطأ",
            description: "لم نتمكن من توليد البرومت",
            variant: "destructive",
          });
        } finally {
          clearInterval(timer);
          setShowLoading(false);
          setTimeLeft(30);
        }
      }}
      nextText="أحصل على برومت"
      isNextDisabled={design.trim().length < 5}
    >
      <div className="space-y-4">
        <Textarea
          value={design}
          onChange={(e) => setDesign(e.target.value)}
          placeholder="حدد الألوان، الخطوط، الأسلوب العام، والهوية البصرية المطلوبة"
          className="min-h-[150px] text-lg"
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              اقتراحات ذكية:
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={generateSuggestions}
              disabled={isGenerating}
              className="gap-2"
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
      <LoadingDialog open={showLoading} timeLeft={timeLeft} />
    </StepLayout>
  );
}
