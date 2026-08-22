"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, PlusCircle, Bookmark, MessageSquare, FileText, LogOut, ChevronDown } from "lucide-react";

export function ProfileMenu({
  name,
  email,
  avatarUrl
}: {
  name: string;
  email: string | null;
  avatarUrl: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-stone-200 bg-white p-1 pr-3 text-xs font-medium text-stone-700 hover:border-stone-300 transition shadow-sm"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={name || "User"}
            width={28}
            height={28}
            className="h-7 w-7 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-coral-100 text-xs font-bold text-coral-600">
            {name?.[0]?.toUpperCase() || "U"}
          </div>
        )}
        <span className="hidden sm:inline font-semibold text-stone-800 truncate max-w-[100px]">
          {name || "Account"}
        </span>
        <ChevronDown className="h-3 w-3 text-stone-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-50 w-56 rounded-2xl border border-stone-200 bg-white p-2 shadow-warm-lg space-y-1 text-xs">
            <div className="p-2 border-b border-stone-100 mb-1">
              <p className="font-bold text-stone-900 truncate">{name || "Signed in"}</p>
              {email && <p className="text-stone-400 truncate text-[11px]">{email}</p>}
            </div>

            <Link
              href="/onboarding"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl p-2 font-medium text-stone-700 hover:bg-stone-50 transition"
            >
              <User className="h-4 w-4 text-stone-400" />
              <span>Edit Vibe Profile</span>
            </Link>

            <Link
              href="/post"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl p-2 font-medium text-stone-700 hover:bg-stone-50 transition"
            >
              <PlusCircle className="h-4 w-4 text-stone-400" />
              <span>Post a Room</span>
            </Link>

            <Link
              href="/messages"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl p-2 font-medium text-stone-700 hover:bg-stone-50 transition"
            >
              <MessageSquare className="h-4 w-4 text-stone-400" />
              <span>Messages</span>
            </Link>

            <Link
              href="/agreement"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl p-2 font-medium text-stone-700 hover:bg-stone-50 transition"
            >
              <FileText className="h-4 w-4 text-stone-400" />
              <span>Roommate Agreement</span>
            </Link>

            <Link
              href="/saved"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl p-2 font-medium text-stone-700 hover:bg-stone-50 transition"
            >
              <Bookmark className="h-4 w-4 text-stone-400" />
              <span>Saved Listings</span>
            </Link>

            <div className="border-t border-stone-100 pt-1 mt-1">
              <Link
                href="/auth/logout"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl p-2 font-medium text-rose-600 hover:bg-rose-50 transition"
              >
                <LogOut className="h-4 w-4 text-rose-500" />
                <span>Sign Out</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
