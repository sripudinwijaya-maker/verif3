// app/layout.js
export const metadata = {
  title: "SheerID Verifier - Cyber",
  description: "Verifikasi SheerID — Simple Mode (no OAuth)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0b0f12", color: "#c8f76b", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
