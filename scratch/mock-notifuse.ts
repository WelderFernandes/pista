import * as http from "http";

const PORT = 8080;

const server = http.createServer((req, res) => {
  console.log(`[Mock Notifuse] Recebida requisição: ${req.method} ${req.url}`);
  
  if (req.method === "POST" && req.url === "/api/transactional.send") {
    let body = "";
    
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    
    req.on("end", () => {
      const authHeader = req.headers["authorization"];
      console.log("[Mock Notifuse] Headers recebidos:", req.headers);
      console.log("[Mock Notifuse] Body recebido:", body);
      
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Unauthorized. Missing or invalid Bearer token." }));
        return;
      }
      
      try {
        const payload = JSON.parse(body);
        if (!payload.workspace_id || !payload.notification || !payload.notification.to || !payload.notification.template_id) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Bad Request. Missing required fields." }));
          return;
        }
        
        // Retorna sucesso
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          success: true,
          message: "Notification successfully processed (Mock)",
          notification_id: "mock_notif_123456789"
        }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON body" }));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(PORT, () => {
  console.log(`[Mock Notifuse] Servidor mock rodando em http://localhost:${PORT}`);
});
