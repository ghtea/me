"use client";

import Link from "next/link";
import { useAuth } from "../../../lib/hooks/auth";

export type HeaderProps = {};

export const Header = ({}: HeaderProps) => {
  const { authState, auth, user } = useAuth();

  return (
    <div className="fixed z-[1] top-0 w-screen">
      <div className="px-4 bg-slate-50/50 backdrop-blur-lg h-[56px] flex flex-row items-center">
        <Link href="/" className="flex-1 flex justify-start">
          Skills
        </Link>
        <div className="flex-1 flex justify-end">
          {authState === "signedIn" && <div>{user?.email}</div>}
          {authState === "signedOut" && (
            <button
              type="button"
              onClick={async () => {
                const { data, error } = await auth.signInWithOAuth({
                  provider: "google",
                  options: {
                    queryParams: {
                      access_type: "offline",
                      prompt: "consent",
                    },
                  },
                });
              }}
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
