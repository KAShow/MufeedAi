import React from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StepLayout from "./StepLayout";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getApiKey } from "@/lib/openai";
import { AI_PROVIDERS } from "@/lib/ai-providers";

interface AudienceData {
  ageRange: string;
  interests: string;
  language: string;
  country: string;
}

export default function AudienceStep() {
  const navigate = useNavigate();
  const [audience, setAudience] = React.useState<AudienceData>({
    ageRange: "",
    interests: "",
    language: "",
    country: "",
  });
  const [suggestions, setSuggestions] = React.useState<
    { text: string; isSelected: boolean }[]
  >([]);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const { toast } = useToast();

  const generateSuggestions = async () => {
    const audienceText = `الفئة العمرية: ${audience.ageRange}\nالإهتمامات: ${audience.interests}\nاللغة: ${audience.language}\nالبلد: ${audience.country}`;

    if (!audienceText.trim() || audienceText.trim().split(/\s+/).length < 2) {
      toast({
        title: "النص قصير جداً",
        description: "الرجاء ملء الحقول للحصول على اقتراحات مناسبة",
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
              content: `بناءً على الجمهور التالي:\n${audienceText}\n\nاقترح 5 فئات مستهدفة إضافية مناسبة. أريد النتيجة بهذا الشكل فقط:\n1. الفئة العمرية: [العمر] | الإهتمامات: [الإهتمامات] | اللغة: [اللغة] | البلد: [البلد]\n2. الفئة العمرية: [العمر] | الإهتمامات: [الإهتمامات] | اللغة: [اللغة] | البلد: [البلد]\n3. الفئة العمرية: [العمر] | الإهتمامات: [الإهتمامات] | اللغة: [اللغة] | البلد: [البلد]\n4. الفئة العمرية: [العمر] | الإهتمامات: [الإهتمامات] | اللغة: [اللغة] | البلد: [البلد]\n5. الفئة العمرية: [العمر] | الإهتمامات: [الإهتمامات] | اللغة: [اللغة] | البلد: [البلد]`,
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
    const suggestion = suggestions[index];
    const parts = suggestion.text.split(" | ");
    const newAudience: AudienceData = {
      ageRange: parts[0].split(":")[1].trim(),
      interests: parts[1].split(":")[1].trim(),
      language: parts[2].split(":")[1].trim(),
      country: parts[3].split(":")[1].trim(),
    };
    setAudience(newAudience);
  };

  const isFormValid = () => {
    return Object.values(audience).every((value) => value.trim().length > 0);
  };

  return (
    <StepLayout
      title="الجمهور المستهدف"
      description="من هم المستخدمون المستهدفون للموقع؟"
      currentStep={1}
      totalSteps={4}
      onNext={() => {
        const currentState = location.state || {};
        navigate("/steps/requirements", {
          state: {
            ...currentState,
            audience: Object.values(audience).join(" | "),
          },
        });
      }}
      isNextDisabled={!isFormValid()}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>الفئة العمرية</Label>
            <Input
              value={audience.ageRange}
              onChange={(e) =>
                setAudience((prev) => ({ ...prev, ageRange: e.target.value }))
              }
              placeholder="مثال: 18-24 سنة"
            />
          </div>

          <div className="space-y-2">
            <Label>الإهتمامات</Label>
            <Input
              value={audience.interests}
              onChange={(e) =>
                setAudience((prev) => ({ ...prev, interests: e.target.value }))
              }
              placeholder="مثال: التكنولوجيا، الرياضة"
            />
          </div>

          <div className="space-y-2">
            <Label>اللغة</Label>
            <Input
              value={audience.language}
              onChange={(e) =>
                setAudience((prev) => ({ ...prev, language: e.target.value }))
              }
              placeholder="مثال: العربية، الإنجليزية"
            />
          </div>

          <div className="space-y-2">
            <Label>البلد</Label>
            <Input
              value={audience.country}
              onChange={(e) =>
                setAudience((prev) => ({ ...prev, country: e.target.value }))
              }
              placeholder="مثال: البحرين، السعودية"
            />
          </div>
        </div>

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
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(index)}
                className="transition-all duration-300 hover:scale-105 hover:bg-primary hover:text-white"
              >
                {suggestion.text}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </StepLayout>
  );
}
