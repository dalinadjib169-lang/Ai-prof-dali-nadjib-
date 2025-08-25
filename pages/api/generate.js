export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { cycle, subject, level, docType, lang, topic } = req.body;

  if (!cycle || !subject || !level || !docType || !lang) {
    return res.status(400).json({ error: "يرجى ملء جميع الحقول المطلوبة" });
  }

  try {
    // هنا يمكنك استدعاء OpenAI API أو أي منطق لإنشاء المذكرة/الاختبار
    // مثال: محتوى افتراضي للتجربة
    const content = `مذكرة/اختبار:
الطور: ${cycle}
المادة: ${subject}
المستوى: ${level}
نوع المستند: ${docType}
اللغة: ${lang}
الموضوع: ${topic || "عام"}`;

    res.status(200).json({ content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "حدث خطأ أثناء إنشاء المستند" });
  }
}
