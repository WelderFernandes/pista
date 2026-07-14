"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Global Error Captured:", error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body>
        <div style={{
          padding: "40px 20px",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          textAlign: "center",
          maxWidth: "500px",
          margin: "80px auto",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
        }}>
          <h2 style={{ color: "#e11d48", marginBottom: "16px" }}>Algo deu errado!</h2>
          <p style={{ color: "#4b5563", fontSize: "14px", marginBottom: "24px" }}>
            Ocorreu um erro inesperado no aplicativo. Por favor, tente recarregar a página.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
          >
            Tentar Novamente
          </button>
        </div>
      </body>
    </html>
  );
}
