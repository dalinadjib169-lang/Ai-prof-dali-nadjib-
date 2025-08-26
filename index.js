import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    if (data.success) {
      setResponse(data.result);
    } else {
      setResponse(`حدث خطأ: ${data.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-gray-900">
        <h1 className="text-2xl font-bold">Prof Dali Nadjib</h1>
        <select className="p-2 rounded border text-black">
          <option>AR</option>
          <option>FR</option>
          <option>EN</option>
        </select>
      </header>

      {/* Main Dashboard */}
      <main className="p-6 grid grid-cols-2 gap-6 md:grid-cols-4 text-right">
        <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center">
          <span className="text-4xl">📚</span>
          <p className="mt-2 font-semibold">الدروس</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center">
          <span className="text-4xl">📝</span>
          <p className="mt-2 font-semibold">الاختبارات</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center">
          <span className="text-4xl">🎒</span>
          <p className="mt-2 font-semibold">المذكرات</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center">
          <span className="text-4xl">👩‍🏫</span>
          <p className="mt-2 font-semibold">نصائح الأستاذ</p>
        </div>
      </main>

      {/* OpenAI Chat Section */}
      <section className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 justify-end">
          <input
            type="text"
            placeholder="اكتب سؤالك هنا..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 p-3 border rounded text-black"
          />
          <button type="submit" className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
            أرسل
          </button>
        </form>
        {response && (
          <div className="mt-4 p-4 bg-gray-900 rounded shadow">{response}</div>
        )}
      </section>

      {/* Footer */}
      <footer className="p-4 bg-gray-800 text-center text-white">
        © 2025 Prof Dali Nadjib
      </footer>
    </div>
  );
}
