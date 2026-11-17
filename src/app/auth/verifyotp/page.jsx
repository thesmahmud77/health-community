"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL থেকে name ও email
  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const password = sessionStorage.getItem("pendingPassword");

  // console.log("Session Storage Pass: ", password);
  // console.log("Name & Email:", name, email);

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("৬ ডিজিটের OTP দিন");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/get-otp?email=${email}`,
      );
      const result = await res.json();
      console.log(result);

      if (!res.ok) {
        throw new Error(result.message || "OTP পাওয়া যায়নি বা মেয়াদ শেষ");
      }

      // ২. ক্লায়েন্ট সাইডে (ব্রাউজারে) ওটিপি ম্যাচ করা (ডিসিশন নেওয়া)
      if (result.serverOtp !== otp) {
        throw new Error("ভুল ওটিপি দিয়েছেন! আবার চেষ্টা করুন।");
      }

      // ৩. ওটিপি মিলে গেলে Better Auth দিয়ে সাইন-আপ করা
      const { error: signUpError } = await authClient.signUp.email({
        name: name || "User",
        email,
        password,
      });

      if (signUpError) {
        throw new Error(signUpError.message || "অ্যাকাউন্ট তৈরি করা যায়নি");
      }

      // ৪. ক্লিয়ার করে হোম পেজে পাঠানো
      sessionStorage.removeItem("pendingPassword");
      router.replace("/");
    } catch (err) {
      setError(err.message || "কিছু একটা সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 text-black">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-2">OTP ভেরিফিকেশন</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          <span className="font-medium text-gray-700">{email}</span> এ পাঠানো ৬
          ডিজিটের কোড দিন
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="______"
            className="w-full p-3 text-center text-2xl tracking-[0.5em] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {error && (
            <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 transition font-medium text-sm disabled:opacity-60 cursor-pointer"
          >
            {loading ? "যাচাই করা হচ্ছে..." : "ভেরিফাই করুন"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">লোড হচ্ছে...</div>}>
      <VerifyOtpForm />
    </Suspense>
  );
}
