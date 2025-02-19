let apiKey: string | null = import.meta.env.VITE_OPENAI_API_KEY || null;

export const setApiKey = (key: string) => {
  apiKey = key;
};

export const generateAIPrompt = async (content: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key غير متوفر");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "أنت مساعد محترف في تحويل متطلبات المواقع إلى برومت منظم.",
          },
          {
            role: "user",
            content: `قم بتحويل المتطلبات التالية إلى برومت منظم ومفصل يمكن استخدامه مع ChatGPT لإنشاء موقع:\n\n${content}\n\nيجب أن يتضمن البرومت:\n1. وصف دقيق للموقع وأهدافه\n2. تفاصيل الجمهور المستهدف\n3. المتطلبات التقنية والتكنولوجيا المستخدمة\n4. تفاصيل التصميم والهوية البصرية\n5. أي متطلبات إضافية مهمة\n\nقم بتنسيق البرومت بشكل واضح ومنظم.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating AI prompt:", error);
    throw new Error("حدث خطأ أثناء توليد البرومت");
  }
};
