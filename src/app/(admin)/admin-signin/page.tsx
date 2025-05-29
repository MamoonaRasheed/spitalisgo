import { Metadata } from "next";
import { Suspense } from "react";
import SignInForm from "@/components/admin/SignInForm";

export const metadata: Metadata = {
  title: "SignIn For Dashboard",
  description: "This is Signin Page Dashboard",
};

export default function SignIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
