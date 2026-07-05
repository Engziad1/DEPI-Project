// src/context/AuthContext.jsx
// ============================================================
// مصدر واحد لحالة المستخدم (مسجّل دخول؟ دوره إيه؟) على مستوى
// التطبيق كله. أي Component محتاج يعرف "هو مين؟" بيستخدم
// useAuth() بدل ما يقرأ localStorage بنفسه في كل مكان.
// ============================================================
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // currentUser: null = لسه بيتحمّل، false = مش مسجل دخول، object = مسجل
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: استبدال ده بـ Firebase onAuthStateChanged لما نفعّل Firebase الحقيقي
    // import { onAuthStateChanged } from "firebase/auth";
    // import { auth } from "../firebase";
    // return onAuthStateChanged(auth, async (user) => {
    //   if (user) {
    //     const profile = await getUserProfile(user.uid); // من profileService
    //     setCurrentUser(profile);
    //   } else {
    //     setCurrentUser(false);
    //   }
    //   setLoading(false);
    // });

    // Mock مؤقت: بيقرأ من localStorage عشان نقدر نختبر الراوتينج فوراً
    const stored = localStorage.getItem("tawasol_mock_user");
    setCurrentUser(stored ? JSON.parse(stored) : false);
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem("tawasol_mock_user", JSON.stringify(userData));
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("tawasol_mock_user");
    setCurrentUser(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth لازم يتنادى جوه AuthProvider");
  return ctx;
}
