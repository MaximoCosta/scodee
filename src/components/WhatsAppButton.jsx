import { WHATSAPP_URL } from "../constants";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      className="whatsapp-btn"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Enviar mensaje por WhatsApp a sCode"
    >
      <WhatsAppIcon />
      <span>WhatsApp</span>
    </a>
  );
}
