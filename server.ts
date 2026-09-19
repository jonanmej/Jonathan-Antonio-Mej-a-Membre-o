import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { getUsers, createUser, updateUserRole, getUserByEmail } from './src/db/users.ts';
import { getReports, upsertReport } from './src/db/reports.ts';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ error: "Usuario no encontrado" });
      }
      
      if (!user.isActive) {
        return res.status(403).json({ error: "Este usuario está desactivado" });
      }

      if (user.password) {
        if (password !== user.password) {
          return res.status(401).json({ error: "Contraseña incorrecta" });
        }
      }
      
      res.json(user);
    } catch (error) {
      console.error("Login failed:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  app.post("/api/analyze-image", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "Missing imageBase64" });
      }
      const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
      
      const prompt = `Analiza esta imagen y responde estrictamente en formato JSON con la siguiente estructura:
{
  "isValid": boolean,
  "message": "Mensaje en español"
}
Si la imagen está desenfocada, borrosa o demasiado oscura como para distinguir detalles, isValid debe ser false y message debe explicar el problema de forma breve (ej. "La imagen está demasiado oscura", "La imagen está borrosa").
Si la imagen tiene claridad e iluminación suficientes, isValid debe ser true y message debe ser vacío o de aprobación.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-pro",
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Data,
                },
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      });

      const text = response.text || "{}";
      const result = JSON.parse(text);
      res.json(result);
    } catch (error) {
      console.error("Error analyzing image:", error);
      res.status(500).json({ error: "Failed to analyze image" });
    }
  });

  app.post("/api/generate-summary", async (req, res) => {
    try {
      const { serviceCategory, serviceType, notes } = req.body;
      
      const prompt = `Actúa como EA Service y redacta un reporte ejecutivo dirigido a nuestro cliente final. El cliente leerá este resumen, por lo que el tono debe ser formal, muy profesional y aportar seguridad sobre el trabajo realizado (utiliza primera persona del plural "nosotros"). Extensión: 1 párrafo, máximo 4 oraciones. 
Narra las actividades realizadas aportando valor.
Categoría: ${serviceCategory}
Tipo de Servicio: ${serviceType}
Notas/Comentarios del técnico: ${notes || 'Ninguno'}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-pro",
        contents: [
          { role: "user", parts: [{ text: prompt }] },
        ],
      });
      
      res.json({ summary: response.text });
    } catch (error) {
      console.error("Error generating AI summary:", error);
      res.status(500).json({ error: "Failed to generate summary" });
    }
  });

  // Database endpoints
  app.get('/api/users', async (req, res) => {
    try {
      const users = await getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      const user = await createUser(req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.put('/api/users/:id/role', async (req, res) => {
    try {
      const user = await updateUserRole(parseInt(req.params.id), req.body.role);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update role" });
    }
  });

  app.get('/api/reports', async (req, res) => {
    try {
      const reports = await getReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  app.post('/api/reports/sync', async (req, res) => {
    try {
      const reportData = req.body;
      reportData.date = new Date(reportData.date);
      // Hardcode userId=1 for now as there is no real auth flow implemented to map frontend user ID
      reportData.userId = 1;
      
      const report = await upsertReport(reportData);
      res.json(report);
    } catch (error) {
      console.error("Failed to sync report", error);
      res.status(500).json({ error: "Failed to sync report" });
    }
  });

  
  app.post('/api/send-welcome-email', async (req, res) => {
    try {
      const { email, tempPassword, displayName } = req.body;
      // Simulando ejecución de Firebase Cloud Function
      console.log(`
======================================================`);
      console.log(`⚡ [Firebase Cloud Function] ENVIO DE CORREO DISPARADO`);
      console.log(`======================================================`);
      console.log(`Destinatario: ${email}`);
      console.log(`Asunto: Bienvenido a EA Service - Credenciales de Acceso`);
      console.log(`Cuerpo del correo:`);
      console.log(`Hola ${displayName || 'Usuario'},`);
      console.log(`Se ha creado tu cuenta en el sistema. Tu contraseña temporal es: ${tempPassword}`);
      console.log(`Por favor, inicia sesión para actualizarla inmediatamente.`);
      console.log(`======================================================
`);
      
      res.json({ success: true, message: "Correo enviado via Cloud Function" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
