import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const { cycle, subject, level, docType, lang, topic } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: `أنت أستاذ. أنشئ ${docType} في مادة ${subject} للطور ${cycle} والمستوى ${level} باللغة ${lang}. الموضوع: ${topic || "عام"}`
        }
      ]
    });

    res.status(200).json({ content: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "فشل توليد المستند" });
  }
}
