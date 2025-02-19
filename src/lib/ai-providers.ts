export type AIProvider = {
  id: string;
  name: string;
  keyPrefix: string;
  apiEndpoint: string;
  keyPlaceholder: string;
  keyInstructions: string;
  model: string;
};

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    keyPrefix: "AI",
    apiEndpoint:
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
    keyPlaceholder: "AI...",
    keyInstructions: "https://makersuite.google.com/app/apikey",
    model: "gemini-pro",
  },
];
