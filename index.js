export default function Home() {
  return (
    <div style={{
      backgroundColor: "#f0f2f5",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ fontSize: "2.5rem", color: "#333" }}>
        👨‍🏫 تطبيق محفة الأستاذ
      </h1>
      <p style={{ fontSize: "1.2rem", color: "#555", marginTop: "10px" }}>
        مرحبًا بك في منصتك التعليمية!
      </p>
    </div>
  );
}
