export default function handler(req, res) {
  if (req.method === "POST") {
    const { cycle, subject, level, docType, lang, topic } = req.body;

    // محتوى تجريبي لإظهار النتيجة
    const content = `
الطور: ${cycle}
المادة: ${subject}
المستوى/السنة: ${level}
نوع المستند: ${docType}
اللغة: ${lang}
الموضوع: ${topic || "لا يوجد موضوع محدد"}

🔹 هذه نتيجة تجريبية لإنشاء المستند.
    `;

    res.status(200).json({ content });
  } else {
    res.status(405).json({ error: "Only POST requests allowed" });
  }
}
