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
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f6fa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#2c3e50" }}>
          📘 مولد المذكرات والاختبارات
        </h1>

        <div style={{ marginBottom: "15px" }}>
          <label>الطور:</label>
          <input
            value={cycle}
            onChange={(e) => setCycle(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
