import { useState } from "react";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

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
        body: JSON.stringify({ cycle, subject, level, docType, lang, topic })
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

  const handleDownloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(result, 180);
    doc.text(splitText, 10, 10);
    doc.save(`${subject || "document"}.pdf`);
  };

  const handleDownloadTXT = () => {
    if (!result) return;
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${subject || "document"}.txt`);
  };

  return (
    <div style={{ padding: 20 }}>
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
          <option value="memo">مذكرة درس</option>
          <option value="assessment">فرض</option>
          <option value="exam">اختبار</option>
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
          <div style={{ marginTop: 10 }}>
            <button onClick={handleDownloadPDF} style={{ marginRight: 10 }}>
              تحميل PDF
            </button>
            <button onClick={handleDownloadTXT}>تحميل TXT</button>
          </div>
        </div>
      )}
    </div>
  );
}
