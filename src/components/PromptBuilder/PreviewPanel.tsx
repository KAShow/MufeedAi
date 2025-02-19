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
  promptContent = "# نموذج النص\n\nهذا عرض مسبق للنص الذكي. أثناء بناء النص باستخدام النموذج على اليسار، سترى التحديثات هنا مباشرة.",
}: PreviewPanelProps) => {
  const [aiPrompt, setAiPrompt] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showApiDialog, setShowApiDialog] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiPrompt || promptContent);
  };

  const handleConvertToPrompt = async () => {
    try {
      setIsLoading(true);
      setError("");
      const apiKey = getApiKey("gemini");

      if (!apiKey) {
        setShowApiDialog(true);
        setIsLoading(false);
        return;
      }

      const generatedPrompt = await generateAIPrompt(promptContent, "gemini");
      setAiPrompt(generatedPrompt);
      navigator.clipboard.writeText(generatedPrompt);
    } catch (error) {
      setError("حدث خطأ أثناء توليد البرومت");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-background p-2 sm:p-4">
      <ApiKeyDialog
        open={showApiDialog}
        onOpenChange={setShowApiDialog}
        onSuccess={() => {
          setShowApiDialog(false);
        }}
      />
      <Card className="h-full w-full bg-gradient-to-br from-white to-blue-50/50 shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
            <h2 className="text-2xl font-semibold">معاينة</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                نسخ النص
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiDialog(true)}
                className="gap-2"
              >
                تركيب المفتاح
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleConvertToPrompt}
                className="gap-2"
                disabled={isLoading}
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
          <ScrollArea className="h-[calc(100vh-12rem)] w-full rounded-md border p-4">
            <div className="whitespace-pre-wrap font-mono text-sm">
              {aiPrompt || promptContent}
            </div>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
};

export default PreviewPanel;
