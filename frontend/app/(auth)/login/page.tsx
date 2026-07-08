import LoginForm from "../_components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const query = await searchParams;
  return <LoginForm nextPath={query.next} />;
}
