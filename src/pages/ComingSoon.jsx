// src/pages/ComingSoon.jsx
// ============================================================
// Placeholder موحّد لأي صفحة في الـ Roadmap لسه ماتبنتش
// (Specialist Dashboard, Reports, Notifications, AI Engine).
// كده الراوتينج شغال كامل من أول يوم، وكل صفحة بتتستبدل بيها
// الحقيقية لما تخلص من غير ما نلمس AppRoutes تاني.
// ============================================================
import { COLORS, FONTS } from "../styles/theme";

export default function ComingSoon({ title = "هذا القسم" }) {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        background: COLORS.background,
        color: COLORS.textMid,
        textAlign: "center",
        padding: 24,
      }}
    >
      <div style={{ fontSize: 48 }}>🚧</div>
      <h2 style={{ fontFamily: FONTS.heading, color: COLORS.text }}>{title} قيد التطوير</h2>
      <p style={{ maxWidth: 420, lineHeight: 1.8 }}>
        هذا القسم من منصة تواصل جاري العمل عليه حالياً، وسيكون متاحاً قريباً.
      </p>
    </div>
  );
}
