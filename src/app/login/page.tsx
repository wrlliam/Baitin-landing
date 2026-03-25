import { type Metadata } from "next";
import LoginClient from "~/components/auth/LoginClient";

export const metadata: Metadata = {
  title: "Login — Baitin 🎣",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  return <LoginClient searchParamsPromise={searchParams} />;
}
