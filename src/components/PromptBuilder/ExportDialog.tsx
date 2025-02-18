import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Copy } from "lucide-react";

interface ExportDialogProps {
  promptData?: {
    goals: string;
    audience: string;
    requirements: string;
    preferences: string;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const defaultPromptData = {
  goals: "Create an engaging user interface",
  audience: "Web developers and designers",
  requirements: "Must be responsive and accessible",
  preferences: "Modern, minimalist design style",
};

export default function ExportDialog({
  promptData = null,
  open = true,
  onOpenChange,
}: ExportDialogProps) {
  const data = promptData?.goals ? promptData : defaultPromptData;

  const getTextFormat = () => {
    return `الأهداف:\n${data.goals}\n\nالجمهور المستهدف:\n${data.audience}\n\nالمتطلبات التقنية:\n${data.requirements}\n\nتفضيلات التصميم:\n${data.preferences}`;
  };

  const getJsonFormat = () => {
    return JSON.stringify(data, null, 2);
  };

  const getMarkdownFormat = () => {
    return `# منشئ النصوص الذكي\n\n## الأهداف\n${data.goals}\n\n## الجمهور المستهدف\n${data.audience}\n\n## المتطلبات التقنية\n${data.requirements}\n\n## تفضيلات التصميم\n${data.preferences}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Export Prompt</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>تصدير النص</DialogTitle>
          <DialogDescription>اختر الصيغة المفضلة لتصدير النص</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text">نص عادي</TabsTrigger>
            <TabsTrigger value="json">جيسون</TabsTrigger>
            <TabsTrigger value="markdown">ماركداون</TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            <Card className="relative">
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {getTextFormat()}
                </pre>
              </ScrollArea>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(getTextFormat())}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="json">
            <Card className="relative">
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {getJsonFormat()}
                </pre>
              </ScrollArea>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(getJsonFormat())}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="markdown">
            <Card className="relative">
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {getMarkdownFormat()}
                </pre>
              </ScrollArea>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(getMarkdownFormat())}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
