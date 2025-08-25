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

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cycle, subject, level, docType, lang, topic }),
      });

      const data = await res.json();
      if (res.ok) setResult(data.content);
      else alert(data.error || "حدث خطأ");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الاتصال بالخادم");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", padding: 20, fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>مولد المذكرات والاختبارات</h1>

      <div style={{ marginBottom: 10 }}>
        <label>الطور: </label>
        <input value={cycle} onChange={(e) => setCycle(e.target.value)} style={{ width: "100%" }} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>المادة: </label>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: "100%" }} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>المستوى/السنة: </label>
        <input value={level} onChange={(e) => setLevel(e.target.value)} style={{ width: "100%" }} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>نوع المستند: </label>
        <select value={docType} onChange={(e) => setDocType(e.target.value)} style={{ width: "100%" }}>
          <option value="">اختر نوع المستند</option>
          <option value="memo">مذكرة درس</option>
          <option value="assessment">فرض</option>
          <option value="exam">اختبار</option>
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>اللغة: </label>
        <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ width: "100%" }}>
          <option value="ar">عربي</option>
          <option value="fr">فرنسي</option>
          <option value="en">إنجليزي</option>
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>الموضوع (اختياري): </label>
        <input value={topic} onChange={(e) => setTopic(e.target.value)} style={{ width: "100%" }} />
      </div>

      <button onClick={handleGenerate} disabled={loading} style={{ width: "100%", padding: 10, fontSize: 16 }}>
        {loading ? "جاري الإنشاء..." : "إنشاء"}
      </button>

      {result && (
        <div style={{ marginTop: 20, whiteSpace: "pre-wrap", border: "1px solid #ccc", padding: 10, borderRadius: 5 }}>
          {result}
        </div>
      )}
    </div>
  );
}
