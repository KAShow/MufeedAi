import React from "react";
import BuilderForm from "./BuilderForm";
import PreviewPanel from "./PreviewPanel";

interface PromptBuilderLayoutProps {
  onSave?: (data: any) => void;
}

export default function PromptBuilderLayout({
  onSave,
}: PromptBuilderLayoutProps) {
  const [promptContent, setPromptContent] = React.useState("");

  const handleFormUpdate = (data: any) => {
    const content = `# النص الذكي

## الأهداف
${data.goals}

## الجمهور المستهدف
${data.audience}

## المتطلبات التقنية
${data.requirements}

## تفضيلات التصميم
${data.preferences}`;

    setPromptContent(content);
    onSave?.(data);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <BuilderForm onFormUpdate={handleFormUpdate} />
      <PreviewPanel promptContent={promptContent} />
    </div>
  );
}
