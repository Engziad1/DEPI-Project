// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { COLORS, FONTS } from "../styles/theme";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        background: COLORS.background,
        textAlign: "center",
        padding: 24,
      }}
    >
      <h1 style={{ fontFamily: FONTS.heading, fontSize: 64, color: COLORS.primary }}>404</h1>
      <p style={{ color: COLORS.textMid, fontSize: 16 }}>الصفحة اللي بتدور عليها مش موجودة.</p>
      <Link
        to="/"
        style={{
          color: COLORS.white,
          background: COLORS.primary,
          padding: "10px 24px",
          borderRadius: 50,
          textDecoration: "none",
          fontWeight: 700,
        }}
      >
        الرجوع للرئيسية
      </Link>
    </div>
  );
}
