// src/context/AuthContext.jsx
// ============================================================
// مصدر واحد لحالة المستخدم الحقيقي عبر Supabase. يقرأ الجلسة
// (auth.users) ثم يجيب الدور (role) من جدول profiles، عشان
// أي Component يقدر يعرف "هو مين ودوره إيه" بدون ما يكرر
// استعلامات Supabase بنفسه.
// ============================================================
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // profile: undefined = لسه بيتحمّل، null = مش مسجل دخول، object = مسجل ومعاه role
  const [profile, setProfile] = useState(undefined);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile(userId) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (isMounted) setProfile(error ? null : data);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadProfile(session.user.id);
      else if (isMounted) setProfile(null);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadProfile(session.user.id);
      else setProfile(null);
    });

    return () => {
      isMounted = false;
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{ profile, loading: profile === undefined, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth لازم يتنادى جوه AuthProvider");
  return ctx;
}
