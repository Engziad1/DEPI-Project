// src/hooks/useNotifications.js
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

export function useNotifications() {
  const { profile } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!profile?.id) return;
    setLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(20);
    setItems(data || []);
    setLoading(false);
  }, [profile?.id]);

  useEffect(() => { load(); }, [load]);

  // تحديث تلقائي كل 30 ثانية — بديل بسيط لـ Realtime subscription
  useEffect(() => {
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  async function markAsRead(id) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  }

  async function markAllRead() {
    const unreadIds = items.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await supabase.from("notifications").update({ is_read: true }).in("id", unreadIds);
  }

  async function notifySelf({ type, title, message }) {
    if (!profile?.id) return;
    await supabase.from("notifications").insert({ user_id: profile.id, type, title, message });
    load();
  }

  const unreadCount = items.filter((n) => !n.is_read).length;

  return { items, unreadCount, loading, markAsRead, markAllRead, notifySelf, refresh: load };
}
