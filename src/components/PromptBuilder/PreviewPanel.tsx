import React from "react";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Copy, Wand2, Loader2 } from "lucide-react";
import { generateAIPrompt, getApiKey } from "@/lib/openai";
import ApiKeyDialog from "./ApiKeyDialog";

interface PreviewPanelProps {
  promptContent?: string;
}

const PreviewPanel = ({
  promptContent = `هذا عرض مسبق للنص. أثناء بناء النص باستخدام النموذج على اليسار، سترى التحديثات هنا مباشرة.

## الأهداف
اكتب أهداف المشروع...

## الجمهور المستهدف
حدد الجمهور المستهدف...

## المتطلبات التقنية
اذكر المتطلبات التقنية...

## تفضيلات التصميم
حدد تفضيلات التصميم...

## الميزات التفاعلية
اذكر الميزات التفاعلية...

## المحتوى والتسويق
حدد استراتيجية المحتوى والتسويق...

## الأمن والخصوصية
حدد متطلبات الأمن والخصوصية...`,
}: PreviewPanelProps) => {
  const [aiPrompt, setAiPrompt] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showApiDialog, setShowApiDialog] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      const textToCopy = aiPrompt || promptContent;
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error("Failed to copy text:", err);
      setError("حدث خطأ أثناء نسخ النص");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleConvertToPrompt = async () => {
    if (isGenerating) return;

    try {
      setIsGenerating(true);
      setIsLoading(true);
      setError("");
      const apiKey = getApiKey("openrouter");

      if (!apiKey) {
        setShowApiDialog(true);
        return;
      }

      const generatedPrompt = await generateAIPrompt(
        promptContent,
        "openrouter",
      );
      setAiPrompt(generatedPrompt);
    } catch (error) {
      setError("حدث خطأ أثناء توليد البرومت");
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  const formatContent = (content: string) => {
    return content.split("\n\n").map((section, index) => {
      // Handle section headers
      if (section.startsWith("## ")) {
        const [title, ...content] = section.split("\n");
        return (
          <div key={index} className="space-y-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {title.replace("## ", "")}
            </h2>
            <div className="text-gray-600 text-lg leading-relaxed pl-4 border-r-2 border-primary/20 pr-4">
              {content.map((line, i) => {
                // Handle bullet points
                if (line.startsWith("* ")) {
                  return (
                    <div key={i} className="flex items-start gap-2 mb-2">
                      <span className="text-primary mt-2">•</span>
                      <span>{line.replace("* ", "")}</span>
                    </div>
                  );
                }
                // Handle code blocks
                if (line.startsWith("```")) {
                  const codeContent = line
                    .replace(/^```\w*\n?/, "")
                    .replace(/```$/, "");
                  return (
                    <pre
                      key={i}
                      className="bg-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto"
                    >
                      {codeContent}
                    </pre>
                  );
                }
                // Handle normal text
                return (
                  <p key={i} className="mb-2">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        );
      }
      // Handle non-section text
      return (
        <p key={index} className="text-gray-600 text-lg leading-relaxed mb-4">
          {section}
        </p>
      );
    });
  };

  return (
    <div className="h-full w-full bg-background p-2 flex flex-col">
      <ApiKeyDialog
        open={showApiDialog}
        onOpenChange={setShowApiDialog}
        onSuccess={() => {
          setShowApiDialog(false);
        }}
      />
      <Card className="flex-1 w-full bg-gradient-to-br from-white via-purple-50/10 to-blue-50/20 shadow-lg transition-all duration-300 hover:shadow-xl border border-primary/10">
        <div className="p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              معاينة
            </h2>
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
                onClick={() => setShowApiDialog(true)}
                className="gap-2 hover:bg-primary hover:text-white transition-colors"
              >
                تركيب المفتاح
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleConvertToPrompt}
                className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                disabled={isGenerating || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                تحويل إلى برومت
              </Button>
            </div>
          </div>
          <Separator className="mb-4" />
          {error && (
            <div className="mb-4 p-2 bg-red-50 text-red-600 rounded text-sm">
              {error}
            </div>
          )}
          <ScrollArea className="h-[calc(100vh-10rem)] w-full rounded-md border border-primary/10 bg-white/50 backdrop-blur-sm p-6">
            <div className="space-y-8">
              {formatContent(aiPrompt || promptContent)}
            </div>
          </ScrollArea>
        </div>
      </Card>
      <div className="text-sm text-muted-foreground text-center mt-4">
        برنامج مفتوح المصدر صنع بواسطة
        <a
          href="https://github.com/KAShow/MufeedAi"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline mr-1"
        >
          خليفة شويطر
        </a>
      </div>
    </div>
  );
};

export default PreviewPanel;
