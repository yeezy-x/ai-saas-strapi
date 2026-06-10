export default function LogoutPage() {
  return (
    <form action="/api/auth/logout" method="POST">
      <button
        type="submit"
        className="w-full rounded-md border px-4 py-2"
      >
        Sign Out
      </button>
    </form>
  );
}