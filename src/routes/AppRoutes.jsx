// src/routes/ProtectedRoute.jsx
// ============================================================
// يحمي أي Route محتاج تسجيل دخول، واختيارياً دور معيّن.
// الاستخدام:
//   <ProtectedRoute allowedRoles={["parent"]}>
//     <ParentDashboard />
//   </ProtectedRoute>
// ============================================================
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // ممكن نستبدلها بـ Spinner لاحقاً

  // مش مسجل دخول → رجّعه لصفحة تسجيل الدخول، واحتفظ بالمسار اللي كان رايحله
  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // مسجل دخول بس دوره مش من ضمن الأدوار المسموحة لهذا الـ Route
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  // الدور "null" معناه سجّل بس لسه ما كملش الملف الشخصي
  if (currentUser.role === null && location.pathname !== "/complete-profile") {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
}
