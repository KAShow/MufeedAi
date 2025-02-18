import React, { useState } from "react";
import BuilderForm from "./BuilderForm";
import PreviewPanel from "./PreviewPanel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface PromptBuilderLayoutProps {
  onSave?: (data: any) => void;
}

interface FormData {
  goals: string;
  audience: string;
  requirements: string;
  preferences: string;
}

export default function PromptBuilderLayout({
  onSave,
}: PromptBuilderLayoutProps = {}) {
  const [promptContent, setPromptContent] = useState<string>("");

  const handleFormUpdate = (data: FormData) => {
    const formattedContent = `# AI Prompt

## Goals
${data.goals}

## Target Audience
${data.audience}

## Technical Requirements
${data.requirements}

## Design Preferences
${data.preferences}`;

    setPromptContent(formattedContent);
    onSave?.(data);
  };

  return (
    <div className="h-full w-full bg-background">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full rounded-lg border"
      >
        <ResizablePanel defaultSize={50} minSize={30}>
          <BuilderForm onFormUpdate={handleFormUpdate} />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={50} minSize={30}>
          <PreviewPanel promptContent={promptContent} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
