import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy, ArrowRight, Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function PromptResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { generatedPrompt } = location.state || {};

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      toast({
        title: "تم النسخ",
        description: "تم نسخ البرومت إلى الحافظة",
      });
    } catch (err) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء نسخ النص",
        variant: "destructive",
      });
    }
  };

  const formatContent = (content: string) => {
    if (!content) return null;

    return content.split("\n\n").map((section, index) => {
      if (section.startsWith("## ")) {
        const [title, ...content] = section.split("\n");
        return (
          <div key={index} className="space-y-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {title.replace("## ", "")}
            </h2>
            <div className="text-gray-600 text-lg leading-relaxed pl-4 border-r-2 border-primary/20 pr-4">
              {content.map((line, i) => (
                <p key={i} className="mb-2">
                  {line}
                </p>
              ))}
            </div>
          </div>
        );
      }
      return (
        <p key={index} className="text-gray-600 text-lg leading-relaxed mb-4">
          {section}
        </p>
      );
    });
  };

  if (!generatedPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 space-y-4 text-center">
          <h1 className="text-2xl font-bold text-red-500">خطأ</h1>
          <p className="text-gray-600">لم يتم العثور على البرومت</p>
          <Button
            onClick={() => navigate(-1)}
            className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            <ArrowRight className="h-4 w-4" />
            العودة للخلف
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full p-6 space-y-8 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              البرومت النهائي
            </h1>
            <p className="text-muted-foreground">
              يمكنك نسخ البرومت واستخدامه في أي نموذج لغوي
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="gap-2 hover:bg-primary hover:text-white transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
              رجوع
            </Button>
            <Button
              onClick={copyToClipboard}
              className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Copy className="h-4 w-4" />
              نسخ البرومت
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-16rem)] w-full rounded-lg border bg-white/50 backdrop-blur-sm p-6">
          <div className="space-y-8">{formatContent(generatedPrompt)}</div>
        </ScrollArea>
      </Card>
    </div>
  );
}
