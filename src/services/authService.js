// src/services/authService.js
// ============================================================
// طبقة المصادقة الحقيقية — متصلة بـ Supabase Auth مباشرة.
// أي Component (Auth.jsx) بيتكلم مع الدوال دي بس.
// ============================================================
import { supabase } from "../supabaseClient";

const ERROR_MESSAGES = {
  "invalid_credentials": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  "user_already_exists": "هذا البريد الإلكتروني مستخدم بالفعل.",
  "email_not_confirmed": "برجاء تأكيد بريدك الإلكتروني أولاً.",
  "weak_password": "كلمة المرور ضعيفة جداً (6 أحرف على الأقل).",
  "invalid_email": "صيغة البريد الإلكتروني غير صحيحة.",
  default: "حدث خطأ غير متوقع، برجاء المحاولة مرة أخرى.",
};

export function getAuthErrorMessage(code) {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.default;
}

// --- تسجيل الدخول بالإيميل ---
export async function loginWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw { code: error.message.includes("Invalid") ? "invalid_credentials" : "default" };
  return data.user;
}

// --- إنشاء حساب جديد ---
// role: "parent" | "specialist"
// extra: { childName, childAge } لو parent، أو { specialty } لو specialist
export async function registerUser({ name, email, password, role, extra = {} }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // بتتخزن في raw_user_meta_data وبيقدر الـ trigger يقرأها
      // عشان يعمل صف في profiles تلقائياً بدون race condition
      data: { full_name: name, role },
    },
  });

  if (error) {
    const code = error.message.includes("already registered")
      ? "user_already_exists"
      : error.message.includes("Password")
      ? "weak_password"
      : "default";
    throw { code };
  }

  // لو parent ومعاه بيانات طفل، نضيفه في جدول children
  if (role === "parent" && extra.childName && data.user) {
    const { error: childError } = await supabase.from("children").insert({
      parent_id: data.user.id,
      full_name: extra.childName,
      age: extra.childAge || null,
    });
    if (childError) console.error("child insert error:", childError);
  }

  // لو specialist، نحدّث بيانات التخصص في جدول specialists
  if (role === "specialist" && data.user) {
    const { error: specError } = await supabase.from("specialists").insert({
      id: data.user.id,
      specialization: extra.specialty || null,
    });
    if (specError) console.error("specialist insert error:", specError);
  }

  return data.user;
}

// --- تسجيل دخول بجوجل ---
export async function loginWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin + "/complete-profile" },
  });
  if (error) throw { code: "default" };
  return data;
}

// --- تسجيل خروج ---
export async function logout() {
  await supabase.auth.signOut();
}

export function calculatePasswordStrength(password) {
  if (!password) return "empty";
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return "weak";
  if (score <= 2) return "medium";
  return "strong";
}

export const SPECIALTIES = [
  { value: "aba", label: "أخصائي تحليل سلوك تطبيقي (ABA Specialist)" },
  { value: "speech", label: "أخصائي علاج نطق ولغة (Speech-Language Pathologist)" },
  { value: "occupational", label: "أخصائي علاج وظيفي (Occupational Therapist)" },
  { value: "behavioral", label: "أخصائي سلوكي (Behavioral Therapist)" },
  { value: "pecs", label: "أخصائي نظام تواصل بالصور (PECS Specialist)" },
  { value: "psychologist", label: "أخصائي نفسي أطفال (Child Psychologist)" },
  { value: "neurologist", label: "طبيب أعصاب (Neurologist)" },
];
