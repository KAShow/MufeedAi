import React from "react";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

interface PreviewPanelProps {
  promptContent?: string;
}

const PreviewPanel = ({
  promptContent = "# Sample Prompt\n\nThis is a preview of your AI prompt. As you build your prompt using the form on the left, you'll see it update here in real-time.\n\n## Context\nProvide background information and context here.\n\n## Requirements\nList specific requirements and constraints here.\n\n## Expected Output\nDescribe the desired output format and examples here.",
}: PreviewPanelProps) => {
  return (
    <div className="h-full w-full bg-background p-4">
      <Card className="h-full w-full">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Preview</h2>
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
