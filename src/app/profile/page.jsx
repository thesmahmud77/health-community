"use client";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

// তারিখ বাংলায় দেখানোর ফাংশন
const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "তথ্য নেই";

// একটি তথ্যের সারি
function InfoRow({ label, value, badge }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3 border-b border-gray-100 last:border-0">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      {badge ? (
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full w-fit border ${
            badge === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-600 border-red-200"
          }`}
        >
          {value}
        </span>
      ) : (
        <span className="text-sm text-gray-800 font-medium break-all sm:text-right">
          {value}
        </span>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // লোডিং স্কেলিটন
  if (isPending) {
    return (
      <div className="min-h-[calc(100vh-4.25rem)] bg-gradient-to-br from-blue-50 to-emerald-50 p-4 flex items-center justify-center">
        <div className="bg-white shadow-2xl rounded-2xl w-full max-w-xl p-8 space-y-4 animate-pulse">
          <div className="w-28 h-28 rounded-full bg-gray-200 mx-auto"></div>
          <div className="h-6 w-40 bg-gray-200 rounded mx-auto"></div>
          <div className="h-4 w-56 bg-gray-100 rounded mx-auto"></div>
          <div className="h-32 bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-4.25rem)] bg-gradient-to-br from-blue-50 to-emerald-50 p-4 py-10 text-black">
      <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* ওপরের কভার ইমেজ */}
        <div className="relative bg-emerald-700 h-36 overflow-visible">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1000')`,
            }}
          ></div>
        </div>

        <div className="px-6 sm:px-10 pb-8">
          {/* প্রোফাইল ছবি কভারের ওপর আসার জন্য relative এবং z-10 যুক্ত করা হয়েছে */}
          <div className="relative -mt-16 flex flex-col items-center text-center z-10">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Profile"}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl bg-white"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-emerald-600 text-white flex items-center justify-center text-5xl font-bold border-4 border-white shadow-xl">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}

            <h1 className="text-2xl font-bold text-gray-800 mt-3">
              {user.name}
            </h1>
            <p className="text-sm text-gray-500">{user.email}</p>

            <span
              className={`mt-2 text-xs font-semibold px-3 py-1 rounded-full border ${
                user.emailVerified
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {user.emailVerified
                ? "✔ ইমেইল ভেরিফাইড"
                : "○ ইমেইল ভেরিফাই হয়নি"}
            </span>
          </div>

          {/* প্রয়োজনীয় অ্যাকাউন্ট ইনফো */}
          <div className="mt-8 border border-emerald-100 bg-emerald-50/40 rounded-xl p-5">
            <h2 className="text-sm font-bold text-emerald-700 mb-2">
              অ্যাকাউন্টের তথ্য
            </h2>
            <InfoRow label="পূর্ণ নাম" value={user.name} />
            <InfoRow label="ইমেইল এড্রেস" value={user.email} />
            <InfoRow
              label="ইমেইল স্ট্যাটাস"
              value={user.emailVerified ? "ভেরিফাইড" : "ভেরিফাই হয়নি"}
              badge={user.emailVerified ? "success" : "error"}
            />
            <InfoRow
              label="যোগদানের তারিখ"
              value={formatDate(user.createdAt)}
            />
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/"
              className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition font-medium text-sm shadow-md shadow-emerald-600/20"
            >
              হোমে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
