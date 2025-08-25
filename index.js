import { useState } from "react";

export default function Home() {
  const [cycle, setCycle] = useState("");
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");
  const [docType, setDocType] = useState("");
  const [lang, setLang] = useState("ar");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!cycle || !subject || !level || !docType || !lang) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    setResult("");

    // مجرد محاكاة للنتيجة بدون سيرفر
    setTimeout(() => {
      setResult(`تم إنشاء ${docType} للمادة ${subject} (${level}) باللغة ${lang}${topic ? `، الموضوع: ${topic}` : ""}`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ padding: 20, backgroundColor: "#fff", color: "#000", minHeight: "100vh" }}>
      <h1>مولد المذكرات والاختبارات</h1>

      <div>
        <label>الطور:</label>
        <input value={cycle} onChange={(e) => setCycle(e.target.value)} />
      </div>

      <div>
        <label>المادة:</label>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>

      <div>
        <label>المستوى/السنة:</label>
        <input value={level} onChange={(e) => setLevel(e.target.value)} />
      </div>

      <div>
        <label>نوع المستند:</label>
        <select value={docType} onChange={(e) => setDocType(e.target.value)}>
          <option value="">اختر نوع المستند</option>
          <option value="مذكرة درس">مذكرة درس</option>
          <option value="فرض">فرض</option>
          <option value="اختبار">اختبار</option>
        </select>
      </div>

      <div>
        <label>اللغة:</label>
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="ar">عربي</option>
          <option value="fr">فرنسي</option>
          <option value="en">إنجليزي</option>
        </select>
      </div>

      <div>
        <label>الموضوع (اختياري):</label>
        <input value={topic} onChange={(e) => setTopic(e.target.value)} />
      </div>

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "جاري الإنشاء..." : "إنشاء"}
      </button>

      {result && (
        <div style={{ marginTop: 20, whiteSpace: "pre-wrap", border: "1px solid #ccc", padding: 10 }}>
          {result}
        </div>
      )}
    </div>
  );
}
