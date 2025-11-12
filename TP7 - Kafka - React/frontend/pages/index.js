import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [txId, setTxId] = useState("");
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    userId: "user-001",
    fromAccount: "ACC-001",
    toAccount: "ACC-002",
    amount: 100,
    currency: "ARS",
  });

  const wsRef = useRef(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log(" WS conectado");
      ws.send(JSON.stringify({ action: "subscribe" }));
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (["connected", "subscribed"].includes(data.type)) return;
        setEvents((prev) => [data, ...prev].slice(0, 100));
      } catch (err) {
        console.warn("Mensaje WS no JSON:", e.data);
      }
    };

    ws.onerror = (err) => console.error("WS error", err);
    ws.onclose = () => console.log("WS cerrado");

    return () => ws.close();
  }, []);

  async function startTransaction() {
    try {
      const res = await fetch(
        (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") +
          "/transactions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error("Error en la API");

      const json = await res.json();
      if (json.transactionId) {
        setTxId(json.transactionId);
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({ action: "subscribe", transactionId: json.transactionId })
          );
        }
      } else {
        alert("Error: " + JSON.stringify(json));
      }
    } catch (err) {
      alert(" Error conectando con el servidor: " + err.message);
      console.error(err);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FFD700",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "1000px",
          backgroundColor: "#FFF8DC",
          borderRadius: "16px",
          boxShadow: "0 0 20px rgba(0,0,0,0.15)",
          padding: "30px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#444",
            marginBottom: "20px",
            fontSize: "2rem",
          }}
        >
         - Sistema de Eventos Bancarios -
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "25px",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: 1 }}>
            <h3>  Nueva Transacción</h3>
            <label>User ID</label>
            <input
              className="input"
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
            />
            <label>From Account</label>
            <input
              className="input"
              value={form.fromAccount}
              onChange={(e) => setForm({ ...form, fromAccount: e.target.value })}
            />
            <label>To Account</label>
            <input
              className="input"
              value={form.toAccount}
              onChange={(e) => setForm({ ...form, toAccount: e.target.value })}
            />
            <label>Amount</label>
            <input
              className="input"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            />
            <label>Currency</label>
            <input
              className="input"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            />
            <button
              onClick={startTransaction}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "10px",
                backgroundColor: "#FFC107",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#FFB300")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#FFC107")}
            >
              Iniciar Transacción
            </button>
            {txId && (
              <div style={{ marginTop: "10px" }}>
                <b>Transaction ID:</b> {txId}
              </div>
            )}
          </div>

          <div
            style={{
              flex: 2,
              borderLeft: "3px solid #FFD54F",
              paddingLeft: "20px",
              maxHeight: "70vh",
              overflowY: "auto",
            }}
          >
            <h3>  Eventos Recibidos</h3>
            {events.length === 0 && (
              <p style={{ color: "#777" }}>Aún no hay eventos.</p>
            )}
            {events.map((ev, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#FFF3CD",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "10px",
                  border: "1px solid #FFE082",
                }}
              >
                <div style={{ fontSize: "14px", color: "#555" }}>
                  <b>{ev.type}</b> —{" "}
                  {new Date(ev.timestamp || Date.now()).toLocaleTimeString()}
                </div>
                <pre style={{ margin: 0, fontSize: "13px", color: "#333" }}>
                  {JSON.stringify(ev.body || ev.payload || ev, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        label {
          display: block;
          margin-top: 10px;
          font-weight: 600;
        }
        .input {
          width: 100%;
          padding: 8px;
          border-radius: 6px;
          border: 1px solid #ccc;
          margin-bottom: 5px;
        }
      `}</style>
    </div>
  );
}
