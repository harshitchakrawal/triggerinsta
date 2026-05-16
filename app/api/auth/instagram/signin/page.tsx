"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignInContent() {
  const params = useSearchParams();

  useEffect(() => {
    const email = params.get("email");
    const name = params.get("name");
    const image = params.get("image");

    if (email) {
      signIn("instagram", {
        email,
        name: name || "",
        image: image || "",
        callbackUrl: "/dashboard",
        redirect: true,
      });
    }
  }, [params]);

  return (
    <div className="min-h-screen bg-[#F4F1EB] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-[#0F0F0F]/10 border-t-[#0F0F0F] rounded-full animate-spin" />
        <p className="text-sm text-[#6B6660] font-medium">Signing you in...</p>
      </div>
    </div>
  );
}

export default function InstagramSignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  );
}
