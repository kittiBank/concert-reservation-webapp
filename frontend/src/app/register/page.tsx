import { redirect } from "next/navigation";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const role = params.role === "admin" ? "admin" : "user";
  redirect(`/login?role=${role}&view=register`);
}
