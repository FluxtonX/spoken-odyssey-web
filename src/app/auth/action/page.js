import { Suspense } from "react";
import AuthActionClient from "./AuthActionClient";

function AuthActionFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a]">
      <div className="w-8 h-8 rounded-full border-4 border-[var(--brand)] border-t-transparent animate-spin" />
    </div>
  );
}

export default function AuthActionPage() {
  return (
    <Suspense fallback={<AuthActionFallback />}>
      <AuthActionClient />
    </Suspense>
  );
}
