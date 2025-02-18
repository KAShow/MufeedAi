import React from "react";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

interface PreviewPanelProps {
  promptContent?: string;
}

const PreviewPanel = ({
  promptContent = "# نموذج النص\n\nهذا عرض مسبق للنص الذكي. أثناء بناء النص باستخدام النموذج على اليسار، سترى التحديثات هنا مباشرة.\n\n## السياق\nأضف المعلومات الأساسية والسياق هنا.\n\n## المتطلبات\nاذكر المتطلبات والقيود المحددة هنا.\n\n## المخرجات المتوقعة\nصف شكل المخرجات المطلوبة والأمثلة هنا.",
}: PreviewPanelProps) => {
  return (
    <div className="h-full w-full bg-background p-4">
      <Card className="h-full w-full">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">معاينة</h2>
          <Separator className="mb-4" />
          <ScrollArea className="h-[calc(100vh-12rem)] w-full rounded-md border p-4">
            <div className="whitespace-pre-wrap font-mono text-sm">
              {promptContent}
            </div>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
};

export default PreviewPanel;
