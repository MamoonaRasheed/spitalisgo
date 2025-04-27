import SignInForm from "@/components/admin/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignIn For Dashboard",
  description: "This is Signin Page Dashboard",
};

export default function SignIn() {
  return <SignInForm />;
}
