import { redirect } from "next/navigation";

// /auth/login is not a valid route — the login page is at /login
export default function AuthLoginRedirect() {
  redirect("/login");
}
