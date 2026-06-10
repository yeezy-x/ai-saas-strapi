import { logoutAction } from "../../../../actions/auth";

export default function LogoutPage() {
  return (
    <form action={logoutAction} method="POST">
      <button
        type="submit"
        className="w-full rounded-md border px-4 py-2"
      >
        Sign Out
      </button>
    </form>
  );
}