import { AppWindow, Code2, Palette } from "lucide-react";
import { Link } from "react-router-dom";

const layers = [
  {
    className: "layer-code",
    Icon: Code2,
    title: "Web & Sistemas",
    label: "código",
    path: "/servicios/web-y-sistemas/",
  },
  {
    className: "layer-brand",
    Icon: Palette,
    title: "Branding",
    label: "marca",
    path: "/servicios/branding/",
  },
  {
    className: "layer-saas",
    Icon: AppWindow,
    title: "SaaS",
    label: "producto",
    badge: "nuevo",
    path: "/servicios/saas/",
  },
];

export function ServiceStack({ showBadge = true, linked = false }) {
  return (
    <div className="stack-layers">
      {layers.map(({ className, Icon, title, label, badge, path }) => {
        const Tag = linked ? Link : "div";
        const extra = linked ? { to: path } : {};
        return (
          <Tag className={`stack-layer ${className}`} key={title} {...extra}>
            <span className="layer-icon" aria-hidden="true">
              <Icon />
            </span>
            <div className="layer-copy">
              <strong>{title}</strong>
              <span>{label}</span>
            </div>
            {showBadge && badge ? <span className="tag-nuevo">{badge}</span> : null}
          </Tag>
        );
      })}
    </div>
  );
}
