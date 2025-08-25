export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { cycle, subject, level, docType, lang, topic } = req.body || {};

  if (!cycle || !subject || !level || !docType || !lang) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const model = process.env.HF_MODEL || "tiiuae/falcon-7b-instruct";
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Missing HUGGINGFACE_API_KEY" });

  const labels = {
    ar: { memo: "مذكرة درس", assessment: "فرض", exam: "اختبار" },
    fr: { memo: "fiche de cours", assessment: "devoir", exam: "examen" },
    en: { memo: "lesson plan", assessment: "quiz", exam: "exam" }
  };

  const typeLabel = (lang === "ar" ? labels.ar : lang === "fr" ? labels.fr : labels.en)[docType];

  const localeBlock = {
    ar: `اكتب ${typeLabel} باللغة العربية مع بنية منظمة قابلة للطباعة والتعديل، وبدون زخرفة زائدة.`,
    fr: `Rédige un(e) ${typeLabel} en français, structuré(e), prêt(e) à imprimer et modifier, sans fioritures.`,
    en: `Write a ${typeLabel} in English, well-structured, ready to print and edit, without fluff.`
  }[lang];

  const metaLine = {
    ar: `الطور: ${cycle} | المستوى/السنة: ${level} | المادة: ${subject}` + (topic ? ` | الموضوع: ${topic}` : ""),
    fr: `Cycle: ${cycle} | Niveau/Année: ${level} | Matière: ${subject}` + (topic ? ` | Thème: ${topic}` : ""),
    en: `Cycle: ${cycle} | Level/Grade: ${level} | Subject: ${subject}` + (topic ? ` | Topic: ${topic}` : "")
  }[lang];

  const structure = {
    ar: `المطلوب:
- عنوان واضح للـ${typeLabel}
- الأهداف التعلمية (3–5 نقاط)
- الكفاءات/المهارات المستهدفة
- الوسائل/الموارد
- تمهيد مختصر
- عرض الدرس بخطوات مرتّبة
- أنشطة وتعلم نشط (أسئلة موجهة/مشاريع صغيرة)
- تقويم (أسئلة قصيرة مع حلول موجزة)
- واجب منزلي (اختياري)
- ملاحظات للأستاذ
صيّغ المحتوى ملائمًا للطور والمستوى المذكورين أعلاه.`,
    fr: `Exigences :
- Titre clair du/de la ${typeLabel}
- Objectifs d’apprentissage (3–5 points)
- Compétences visées
- Ressources/matériel
- Introduction concise
- Déroulement en étapes
- Activités (questions guidées / mini-projets)
- Évaluation (questions courtes avec corrigé bref)
- Devoir à domicile (optionnel)
- Notes pour l’enseignant
Adapter le contenu au cycle et niveau ci-dessus.`,
    en: `Requirements:
- Clear title for the ${typeLabel}
- Learning objectives (3–5 bullets)
- Target competencies/skills
- Materials/resources
- Concise warm-up
- Step-by-step lesson flow
- Activities (guided questions / mini projects)
- Assessment (short questions with brief answers)
- Homework (optional)
- Notes for the teacher
Adapt content to the given cycle and level.`
  }[lang];

  const prompt = `${localeBlock}\n\n${metaLine}\n\n${structure}\n\nتنسيق الإخراج/Output format:
- استخدم عناوين فرعية واضحة.
- استخدم ترقيم ونقاط.
- لا تضف زخرفة أو رموز غير ضرورية.
- إجابة موجزة، مركزة، وعملية.`;

  try {
    const hfRes = await fetch(`https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 600, temperature: 0.6, return_full_text: false } })
    });

    if (!hfRes.ok) {
      const errText = await hfRes.text();
      return res.status(hfRes.status).json({ error: `HF error: ${errText}` });
    }

    const data = await hfRes.json();
    let generated = "";
    if (Array.isArray(data) && data[0]?.generated_text) generated = data[0].generated_text;
    else if (data?.generated_text) generated = data.generated_text;
    else if (typeof data === "string") generated = data;
    else generated = JSON.stringify(data);

    generated = generated.replace(/\n{3,}/g, "\n\n").trim();
    return res.status(200).json({ content: generated, model });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error while generating." });
  }
}
