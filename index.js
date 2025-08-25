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
      setContent(data.content || data.error || "");
    } catch (err) {
      setContent("Error generating content");
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    if (!outputRef.current) return;
    const doc = new jsPDF();
    doc.text(outputRef.current.innerText, 10, 10);
    doc.save("lesson.pdf");
  };

  const exportWord = async () => {
    if (!outputRef.current) return;
    const blob = await htmlToDocx(outputRef.current, null, { table: { row: { cantSplit: true } } });
    saveAs(blob, "lesson.docx");
  };

  return (
    <div>
      <h1>{T.title}</h1>
      <div>
        <select value={cycle} onChange={(e) => setCycle(e.target.value)}>
          {T.cycles.map(c => <option key={c}>{c}</option>)}
        </select>
        <input placeholder={T.subject} value={subject} onChange={e => setSubject(e.target.value)} />
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          {T.levels.map(l => <option key={l}>{l}</option>)}
        </select>
        <select value={docType} onChange={(e) => setDocType(e.target.value)}>
          {Object.entries(T.docTypes).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          {Object.entries(T.langs).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <input placeholder={T.topic} value={topic} onChange={e => setTopic(e.target.value)} />
        <button onClick={onGenerate}>{T.generate}</button>
        <button onClick={exportPDF}>{T.exportPDF}</button>
        <button onClick={exportWord}>{T.exportWord}</button>
      </div>
      <div ref={outputRef} contentEditable style={{ border: "1px solid #ccc", padding: "10px", minHeight: "200px" }}>
        {content || T.placeholder}
      </div>
    </div>
  );
}
