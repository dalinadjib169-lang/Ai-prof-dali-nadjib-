import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }

  const { cycle, subject, level, docType, lang, topic } = req.body;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `أنشئ ${docType} باللغة ${lang} لمادة ${subject}، مستوى ${level}, الطور ${cycle}, الموضوع: ${topic}`
        }
      ]
    });

    const content = completion.choices[0].message.content;
    res.status(200).json({ content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "حدث خطأ أثناء توليد المحتوى" });
  }
}
