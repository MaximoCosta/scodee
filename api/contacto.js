const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = {
  nombre: 80,
  email: 120,
  telefono: 40,
  horario: 120,
  mensaje: 4000,
};

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function clean(value, max) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function readBody(req) {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return Promise.resolve(req.body);
  }

  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("JSON_INVALID"));
      }
    });
    req.on("error", reject);
  });
}

async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.VERCEL) {
      throw new Error("TURNSTILE_MISSING");
    }
    console.warn("TURNSTILE_SECRET_KEY ausente: se omite el captcha en local.");
    return true;
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (ip) body.set("remoteip", ip);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const result = await response.json();
  return Boolean(result.success);
}

async function sendEmail({ nombre, email, telefono, horario, mensaje }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "contact@scodedigital.com";
  const from = process.env.CONTACT_FROM_EMAIL || "sCode <noreply@scodedigital.com>";

  if (!apiKey) {
    if (process.env.VERCEL) {
      throw new Error("RESEND_MISSING");
    }
    console.info("[contacto:local]", { nombre, email, telefono, horario, mensaje });
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Consulta web — ${nombre}`,
      text: [
        `Nombre: ${nombre}`,
        `Email: ${email}`,
        `Teléfono: ${telefono}`,
        `Disponibilidad: ${horario || "—"}`,
        "",
        mensaje,
      ].join("\n"),
      html: `
        <h2>Nueva consulta desde scodedigital.com</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(telefono)}</p>
        <p><strong>Disponibilidad:</strong> ${escapeHtml(horario || "—")}</p>
        <p>${escapeHtml(mensaje).replaceAll("\n", "<br>")}</p>
      `,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Resend error", response.status, detail);
    throw new Error("RESEND_FAILED");
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    send(res, 405, { error: "Método no permitido" });
    return;
  }

  let payload;
  try {
    payload = await readBody(req);
  } catch {
    send(res, 400, { error: "Pedido inválido" });
    return;
  }

  if (clean(payload.website, 200)) {
    send(res, 200, { ok: true });
    return;
  }

  const nombre = clean(payload.nombre, MAX.nombre);
  const email = clean(payload.email, MAX.email).toLowerCase();
  const telefono = clean(payload.telefono, MAX.telefono);
  const horario = clean(payload.horario, MAX.horario);
  const mensaje = clean(payload.mensaje, MAX.mensaje);
  const turnstileToken = clean(payload.turnstileToken || payload.turnstileToken, 2048);

  if (nombre.length < 2 || !EMAIL_RE.test(email) || telefono.length < 6 || mensaje.length < 10) {
    send(res, 400, { error: "Revisá los datos e intentá de nuevo." });
    return;
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress;

  try {
    const captchaOk = await verifyTurnstile(turnstileToken, ip);
    if (!captchaOk) {
      send(res, 400, { error: "Completá la verificación antes de enviar." });
      return;
    }

    await sendEmail({ nombre, email, telefono, horario, mensaje });
    send(res, 200, { ok: true });
  } catch (error) {
    console.error("contacto", error);
    const message =
      error.message === "TURNSTILE_MISSING" || error.message === "RESEND_MISSING"
        ? "El formulario no está configurado todavía."
        : "No se pudo enviar. Probá de nuevo en un momento.";
    send(res, 500, { error: message });
  }
}
