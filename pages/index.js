import { useState, useRef } from "react";
import { saveAs } from "file-saver";
import htmlToDocx from "html-to-docx";
import jsPDF from "jspdf";

const UI = {
  ar: {
    title: "مساعد الأستاذ بالذكاء الاصطناعي",
    cycle: "الطور",
    subject: "المادة",
    level: "المستوى/السنة",
    docType: "النوع",
    docTypes: { memo: "مذكرة", assessment: "فرض", exam: "اختبار" },
    lang: "لغة الإخراج",
    topic: "موضوع الدرس (اختياري)",
    generate: "توليد",
    regenerate: "إعادة توليد",
    exportPDF: "تصدير PDF",
    exportWord: "تصدير Word",
    placeholder: "الناتج سيظهر هنا ويمكنك تعديله قبل التصدير...",
    cycles: ["ابتدائي", "متوسط", "ثانوي"],
    levels: ["1", "2", "3", "4", "5"],
    langs: { ar: "العربية", fr: "الفرنسية", en: "الإنجليزية" }
  },
  fr: {
    title: "Assistant Enseignant IA",
    cycle: "Cycle",
    subject: "Matière",
    level: "Niveau/Année",
    docType: "Type",
    docTypes: { memo: "Fiche", assessment: "Devoir", exam: "Examen" },
    lang: "Langue de sortie",
    topic: "Thème (optionnel)",
    generate: "Générer",
    regenerate: "Régénérer",
    exportPDF: "Exporter PDF",
    exportWord: "Exporter Word",
    placeholder: "La sortie apparaîtra ici et vous pouvez la modifier avant l’export…",
    cycles: ["Primaire", "Collège", "Lycée"],
    levels: ["1", "2", "3", "4", "5"],
    langs: { ar: "Arabe", fr: "Français", en: "Anglais" }
  },
  en: {
    title: "AI Teacher Assistant",
    cycle: "Cycle",
    subject: "Subject",
    level: "Level/Grade",
    docType: "Type",
    docTypes: { memo: "Lesson Plan", assessment: "Quiz", exam: "Exam" },
    lang: "Output Language",
    topic: "Topic (optional)",
    generate: "Generate",
    regenerate: "Regenerate",
    exportPDF: "Export PDF",
    exportWord: "Export Word",
    placeholder: "The output will appear here and you can edit before exporting…",
    cycles: ["Primary", "Middle", "Secondary"],
    levels: ["1", "2", "3", "4", "5"],
    langs: { ar: "Arabic", fr: "French", en: "English" }
  }
};

export default function Home() {
  const [uiLang, setUiLang] = useState("ar");
  const T = UI[uiLang];

  const [cycle, setCycle] = useState(T.cycles[1]);
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState(T.levels[2]);
  const [docType, setDocType] = useState("memo");
  const [lang, setLang] = useState(uiLang);
  const [topic, setTopic] = useState("");

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const outputRef = useRef(null);

  const onGenerate = async () => {
    if (!cycle || !subject || !level || !docType || !lang) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cycle, subject, level, docType, lang, topic })
      });
      const data = await res.json();
      setContent(data.content || data.error || "حدث خطأ أثناء التوليد.");
    } catch {
      setContent("خطأ في الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const html = outputRef.current?.innerHTML || content || "";
    const text = html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|li|h\d)>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\n{3,}/g, "\n\n");

    const lineHeight = 16;
    const margin = 40;
    const maxWidth = 515;
    let y = margin;
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line) => {
      if (y > 780) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y, { align: uiLang === "ar" ? "right" : "left" });
      y += lineHeight;
    });

    const fileName =
      (docType === "memo" ? "memo" : docType === "assessment" ? "assessment" : "exam") +
      "-" +
      (subject || "subject") +
      ".pdf";
    doc.save(fileName);
  };

  const exportWord = async () => {
    const node = outputRef.current;
    const html =
      node?.innerHTML ||
      `<div><pre style="white-space:pre-wrap">${content}</pre></div>`;
    const fileBuffer = await htmlToDocx(html, null, {
      table: { row: { cantSplit: true } },
      footer: false,
      pageNumber: false
    });
    const blob = new Blob([fileBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    });
    const fileName =
      (docType === "memo" ? "memo" : docType === "assessment" ? "assessment" : "exam") +
      "-" +
      (subject || "subject") +
      ".docx";
    saveAs(blob, fileName);
  };

  return (
    <div style={{ padding: 24, fontFamily: "Arial, sans-serif", maxWidth: 960, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <select value={uiLang} onChange={(e) => { setUiLang(e.target.value); setLang(e.target.value); }}>
          <option value="ar">العربية</option>
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </div>

      <h1 style={{ marginTop: 8 }}>{T.title}</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 12,
        marginTop: 12,
        alignItems: "center"
      }}>
        <div>
          <label>{T.cycle}</label>
          <select value={cycle} onChange={(e) => setCycle(e.target.value)} style={{ width: "100%", padding: 8 }}>
            {T.cycles.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label>{T.subject}</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
            placeholder={uiLang === "ar" ? "مثال: رياضيات" : uiLang === "fr" ? "Ex: Mathématiques" : "e.g., Math"}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div>
          <label>{T.level}</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)} style={{ width: "100%", padding: 8 }}>
            {T.levels.map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
          </select>
        </div>

        <div>
          <label>{T.docType}</label>
          <select value={docType} onChange={(e) => setDocType(e.target.value)} style={{ width: "100%", padding: 8 }}>
            <option value="memo">{T.docTypes.memo}</option>
            <option value="assessment">{T.docTypes.assessment}</option>
            <option value="exam">{T.docTypes.exam}</option>
          </select>
        </div>

        <div>
          <label>{T.lang}</label>
          <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ width: "100%", padding: 8 }}>
            <option value="ar">{T.langs.ar}</option>
            <option value="fr">{T.langs.fr}</option>
            <option value="en">{T.langs.en}</option>
          </select>
        </div>

        <div>
          <label>{T.topic}</label>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)}
            placeholder={uiLang === "ar" ? "اختياري: الدوال/المعادلات..." : ""}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
        <button onClick={onGenerate} disabled={loading}>{loading ? "..." : T.generate}</button>
        <button onClick={exportPDF}>{T.exportPDF}</button>
        <button onClick={exportWord}>{T.exportWord}</button>
      </div>

      <div ref={outputRef} contentEditable style={{
        marginTop: 12, padding: 12, minHeight: 200, border: "1px solid #ccc", borderRadius: 4,
        whiteSpace: "pre-wrap", overflowY: "auto"
      }}>
        {content || T.placeholder}
      </div>
    </div>
  );
}
``
