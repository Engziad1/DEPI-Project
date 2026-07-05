// src/services/authService.js
// ============================================================
// طبقة المصادقة. أي Component (Auth.jsx) بيتكلم مع الدوال دي
// بس، مش بيعرف حاجة عن Firebase أو الـ Mock — كده لو اتفعّل
// Firebase الحقيقي، مفيش أي تعديل مطلوب في الواجهات.
// ============================================================

const USE_MOCK_AUTH = true; // بدّلها false بعد ما تحط مفاتيح Firebase الحقيقية في firebase.js

// --- الكود الحقيقي (معلّق لحد تفعيل Firebase) ---
// import { auth, db } from "../firebase";
// import {
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   GoogleAuthProvider,
//   signInWithPopup,
// } from "firebase/auth";
// import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const MOCK_NETWORK_DELAY = 700;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ERROR_MESSAGES = {
  "auth/email-already-in-use": "هذا البريد الإلكتروني مستخدم بالفعل.",
  "auth/invalid-email": "صيغة البريد الإلكتروني غير صحيحة.",
  "auth/weak-password": "كلمة المرور ضعيفة جداً (6 أحرف على الأقل).",
  "auth/user-not-found": "لا يوجد حساب مسجّل بهذا البريد الإلكتروني.",
  "auth/wrong-password": "كلمة المرور غير صحيحة.",
  "auth/too-many-requests": "محاولات كثيرة جداً، حاول مرة أخرى بعد قليل.",
  default: "حدث خطأ غير متوقع، برجاء المحاولة مرة أخرى.",
};

export function getAuthErrorMessage(code) {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.default;
}

function mockUid(seed) {
  return "uid-" + btoa(unescape(encodeURIComponent(seed))).replace(/[^a-zA-Z0-9]/g, "").slice(0, 12);
}

export async function loginWithEmail(email, password) {
  if (USE_MOCK_AUTH) {
    await delay(MOCK_NETWORK_DELAY);
    if (!/\S+@\S+\.\S+/.test(email)) throw { code: "auth/invalid-email" };
    if (password.length < 6) throw { code: "auth/wrong-password" };
    return {
      uid: mockUid(email),
      name: email.split("@")[0],
      email,
      role: "parent",
      photoURL: null,
    };
  }

  // const cred = await signInWithEmailAndPassword(auth, email, password);
  // return getUserProfile(cred.user.uid);
}

export async function registerUser({ name, email, password, role, extra = {} }) {
  if (USE_MOCK_AUTH) {
    await delay(MOCK_NETWORK_DELAY);
    if (!/\S+@\S+\.\S+/.test(email)) throw { code: "auth/invalid-email" };
    if (password.length < 6) throw { code: "auth/weak-password" };
    return { uid: mockUid(email), name, email, role, photoURL: null, ...extra };
  }

  // const cred = await createUserWithEmailAndPassword(auth, email, password);
  // await setDoc(doc(db, "users", cred.user.uid), {
  //   uid: cred.user.uid, name, email, role, createdAt: serverTimestamp(), ...extra,
  // });
  // return getUserProfile(cred.user.uid);
}

export async function loginWithGoogle() {
  if (USE_MOCK_AUTH) {
    await delay(MOCK_NETWORK_DELAY);
    return {
      uid: "uid-google-mock",
      name: "مستخدم جوجل",
      email: "user@gmail.com",
      role: null, // مستخدم جديد عبر جوجل → لازم يكمل بياناته
      photoURL: null,
    };
  }

  // const cred = await signInWithPopup(auth, new GoogleAuthProvider());
  // const snap = await getDoc(doc(db, "users", cred.user.uid));
  // if (snap.exists()) return snap.data();
  // await setDoc(doc(db, "users", cred.user.uid), {
  //   uid: cred.user.uid, name: cred.user.displayName, email: cred.user.email,
  //   role: null, photoURL: cred.user.photoURL, createdAt: serverTimestamp(),
  // });
  // return { uid: cred.user.uid, role: null, ... };
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
