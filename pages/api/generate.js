export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }

  const { cycle, subject, level, docType, lang, topic } = req.body;

  // هنا ممكن تربط مع OpenAI API أو أي مصدر تاني
  // حاليا نعطي مثال ثابت
  const content = `تم إنشاء مستند: ${docType}\nالطور: ${cycle}\nالمادة: ${subject}\nالمستوى: ${level}\nاللغة: ${lang}\nالموضوع: ${topic || "غير محدد"}`;

  res.status(200).json({ content });
}
