"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Helper to check if link is active
  const isActive = (path) =>
    pathname === path
      ? "text-white font-bold underline decoration-blue-500 underline-offset-4"
      : "text-gray-400 hover:text-blue-300";

  return (
    <nav className="p-4 bg-slate-800 flex justify-between items-center border-b border-slate-700">
      <Link href="/" className="text-xl font-bold text-blue-400">
        Blog Platform
      </Link>

      <div className="flex items-center space-x-6">
        {/* Always show, but style differently */}
        <Link href="/" className={isActive("/")}>
          Home
        </Link>

        {user ? (
          <>
            <Link href="/dashboard" className={isActive("/dashboard")}>
              Dashboard
            </Link>

            <div className="flex items-center ml-4 pl-4 border-l border-slate-600">
              <span className="text-xs text-gray-500 mr-2">Signed in as</span>
              <span className="text-sm font-semibold text-blue-200">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="ml-4 text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded hover:bg-red-500/20"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <Link href="/login" className="btn bg-blue-600 hover:bg-blue-500">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
