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

export default function ExportDialog({
  promptData,
  open = true,
  onOpenChange,
}: ExportDialogProps) {
  const data = promptData || {
    goals: "",
    audience: "",
    requirements: "",
    preferences: "",
  };

  const getTextFormat = () => {
    return `الأهداف:\n${data.goals}\n\nالجمهور المستهدف:\n${data.audience}\n\nالمتطلبات التقنية:\n${data.requirements}\n\nتفضيلات التصميم:\n${data.preferences}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">تصدير النص</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>تصدير النص</DialogTitle>
          <DialogDescription>نسخ النص المنسق</DialogDescription>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  );
}
