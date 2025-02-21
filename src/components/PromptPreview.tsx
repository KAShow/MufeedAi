import React from "react";
import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy, Wand2, Loader2 } from "lucide-react";
import { generateAIPrompt } from "@/lib/openai";

export default function PromptPreview() {
  const location = useLocation();
  const [prompt, setPrompt] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const generatePrompt = async () => {
    setIsLoading(true);
    setError("");
    try {
      if (!location.state?.projectGoal) {
        setError("لم يتم تحديد هدف المشروع");
        return;
      }
      const content = `هدف المشروع ونوعه:\n${location.state.projectGoal}\n\nالجمهور المستهدف:\n${location.state?.audience || ""}\n\nالمتطلبات التقنية:\n${location.state?.requirements || ""}\n\nالتصميم والمظهر:\n${location.state?.design || ""}`;

      const generatedPrompt = await generateAIPrompt(content, "openrouter");
      setPrompt(generatedPrompt);
    } catch (error) {
      setError("حدث خطأ أثناء توليد البرومت");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch (err) {
      console.error("Failed to copy text:", err);
      setError("حدث خطأ أثناء نسخ النص");
    }
  };

  React.useEffect(() => {
    // Only generate if we don't have a prompt yet and we have a projectGoal
    if (!prompt && location.state?.projectGoal) {
      generatePrompt();
    } else if (!location.state?.projectGoal) {
      // If no projectGoal in state, try to get it from sessionStorage
      const projectGoal = sessionStorage.getItem("projectGoal");
      if (projectGoal) {
        location.state = { ...location.state, projectGoal };
        generatePrompt();
      } else {
        setError("لم يتم تحديد هدف المشروع");
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full p-6 space-y-8 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            البرومت النهائي
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="gap-2 hover:bg-primary hover:text-white transition-colors"
            >
              <Copy className="h-4 w-4" />
              نسخ النص
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={generatePrompt}
              disabled={isLoading}
              aria-disabled={isLoading}
              className="gap-2 hover:bg-primary hover:text-white transition-colors"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              إعادة التوليد
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <ScrollArea className="h-[calc(100vh-16rem)] w-full rounded-lg border bg-white/50 backdrop-blur-sm p-6">
          <div className="space-y-6 leading-relaxed text-lg">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="whitespace-pre-wrap" style={{ direction: "rtl" }}>
                {prompt}
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
