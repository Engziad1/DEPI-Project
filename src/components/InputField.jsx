// src/components/InputField.jsx
// ============================================================
// حقل إدخال موحّد لصفحة Auth — بيدعم إظهار/إخفاء كلمة المرور
// (👁️ toggleBtn) ورسالة خطأ تحت الحقل. الأنماط في
// InputField.module.css (field/label/inputWrapper/input/
// toggleBtn/errorText — الأسماء دي كانت موجودة فعلاً في الـ CSS
// المسترجع، فالمكوّن اتكتب ليطابقها بالظبط).
// ============================================================
import { useState } from "react";
import styles from "./InputField.module.css";

export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={`${styles.inputWrapper} ${error ? styles.inputError : ""}`}>
        <input
          className={styles.input}
          type={actualType}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
