// src/components/PasswordStrengthMeter.jsx
import { calculatePasswordStrength } from "../services/authService";

const LEVELS = {
  empty:  { label: "",              color: "transparent", width: "0%"   },
  weak:   { label: "ضعيفة",          color: "#E05555",      width: "33%"  },
  medium: { label: "متوسطة",         color: "#E8A23B",      width: "66%"  },
  strong: { label: "قوية",           color: "#4A9B72",      width: "100%" },
};

export default function PasswordStrengthMeter({ password }) {
  const strength = calculatePasswordStrength(password);
  const info = LEVELS[strength];

  if (strength === "empty") return null;

  return (
    <div style={{ marginTop: -8, marginBottom: 16 }}>
      <div style={{ height: 6, background: "#EFEBE4", borderRadius: 999, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: info.width,
            background: info.color,
            transition: "width 0.25s ease, background 0.25s ease",
          }}
        />
      </div>
      <div style={{ fontSize: 12, color: info.color, fontWeight: 700, marginTop: 4 }}>
        قوة كلمة المرور: {info.label}
      </div>
    </div>
  );
}
