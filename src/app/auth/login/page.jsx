"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const router = useRouter();

  // ইনপুট ভ্যালু রিয়েল-টাইমে ট্র্যাক করার জন্য
  const passwordValue = watch("password", "");
  const emailValue = watch("email", "");

  // পাসওয়ার্ড শর্তসমূহ
  const hasLength = passwordValue.length >= 8;
  const hasLower = /[a-z]/.test(passwordValue);
  const hasUpper = /[A-Z]/.test(passwordValue);
  const hasNumber = /\d/.test(passwordValue);
  const hasSpecial = /[@$!%*?&]/.test(passwordValue);

  // ইমেইল শর্ত (@gmail.com চেক)
  const isValidGmail =
    emailValue.endsWith("@gmail.com") && emailValue.length > 10;

  const onSubmit = async (data) => {
    setLoading(true);
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: (ctx) => {
          setLoading(false);
          Swal.fire({
            icon: "success",
            title: "সফল!",
            text: "লগইন সফল হয়েছে!",
            timer: 1500,
            showConfirmButton: false,
          });
          router.push("/");
        },
        onError: (ctx) => {
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "লগইন ব্যর্থ হয়েছে",
            text: ctx.error.message || "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।",
            confirmButtonColor: "#dc2626",
          });
        },
      },
    );
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50 p-4 text-black relative">
      {/* ফুল পেজ লোডিং ওভারলে */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white px-6 py-4 rounded-lg shadow-xl flex items-center space-x-3">
            <div className="w-6 h-6 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-800 font-medium">
              লগইন হচ্ছে, অপেক্ষা করুন...
            </span>
          </div>
        </div>
      )}

      {/* মেইন প্রিমিয়াম স্প্লিট কার্ড ডিজাইন */}
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* বামপাশের মেডিকেল কমিউনিটি ব্যানার */}
        <div className="relative hidden md:flex flex-col justify-between bg-emerald-700 text-white p-10 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1000')`,
            }}
          ></div>

          {/* টপ লোগো বা ব্র্যান্ডিং */}
          <div className="relative z-10 flex items-center space-x-2">
            <span className="bg-white text-emerald-700 p-2 rounded-xl font-bold text-xl shadow-md">
              MediCare
            </span>
            <span className="text-xl font-semibold tracking-wide">
              Bangladesh
            </span>
          </div>

          {/* সেন্ট্রাল মেসেজ */}
          <div className="relative z-10 my-auto space-y-3">
            <h2 className="text-3xl font-bold leading-snug">
              সেরা মেডিকেল পরামর্শ ও স্বাস্থ্যসেবা কমিউনিটি
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              বাংলাদেশের সেরা ডাক্তারদের পরামর্শ খুঁজুন, আপনার অভিজ্ঞতা শেয়ার
              করুন এবং পোস্টে লাইক-কমেন্টের মাধ্যমে হাজারো মানুষের সাথে যুক্ত
              থাকুন।
            </p>
          </div>

          {/* ফুটার নোট */}
          <div className="relative z-10 text-xs text-emerald-200">
            © 2026 MediCare BD Community. All rights reserved.
          </div>
        </div>

        {/* ডানপাশের লগইন ফর্ম */}
        <div className="p-8 space-y-4 flex flex-col justify-center">
          <div className="text-center md:text-left mb-5">
            <h1 className="text-2xl font-bold text-gray-800 text-center">
              লগইন করুন
            </h1>
            <p className="text-sm text-gray-500 mt-1 text-center">
              আপনার অ্যাকাউন্টে প্রবেশ করতে তথ্য দিন
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-3"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setActiveField(null);
              }
            }}
          >
            {/* ইমেইল ফিল্ড */}
            <div>
              {errors.email && (
                <p className="text-red-500 text-xs mb-1">
                  {errors.email.message}
                </p>
              )}
              <input
                type="email"
                placeholder="ইমেইল এড্রেস (example@gmail.com)"
                onFocus={() => setActiveField("email")}
                {...register("email", {
                  required: "ইমেইল আবশ্যক",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                    message: "ইমেইল অবশ্যই @gmail.com এর হতে হবে",
                  },
                })}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
              />

              {/* শুধু ইমেইল ফোকাস থাকলে গাইডলাইন দেখাবে */}
              {activeField === "email" && (
                <div className="mt-1 p-2 bg-emerald-50/80 border border-emerald-200 rounded-lg text-xs space-y-1">
                  <p
                    className={
                      isValidGmail
                        ? "text-emerald-700 font-medium"
                        : "text-gray-500"
                    }
                  >
                    {isValidGmail ? "✔" : "○"} ইমেইলটি অবশ্যই @gmail.com এর হতে
                    হবে
                  </p>
                </div>
              )}
            </div>

            {/* পাসওয়ার্ড ফিল্ড */}
            <div>
              {errors.password && (
                <p className="text-red-500 text-xs mb-1">
                  {errors.password.message}
                </p>
              )}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="পাসওয়ার্ড"
                  onFocus={() => setActiveField("password")}
                  {...register("password", {
                    required: "পাসওয়ার্ড আবশ্যক",
                    validate: () =>
                      (hasLength &&
                        hasLower &&
                        hasUpper &&
                        hasNumber &&
                        hasSpecial) ||
                      "পাসওয়ার্ডের শর্তগুলো পূরণ হয়নি",
                  })}
                  className="w-full p-2.5 pr-10 border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* পাসওয়ার্ড ফোকাস থাকলে রিয়েল-টাইম ভ্যালিডেশন লিস্ট দেখাবে */}
              {activeField === "password" && (
                <div className="mt-2 p-2 bg-emerald-50/80 border border-emerald-200 rounded-lg text-xs space-y-1">
                  <p
                    className={
                      hasLength
                        ? "text-emerald-700 font-medium"
                        : "text-gray-500"
                    }
                  >
                    {hasLength ? "✔" : "○"} অন্তত ৮ অক্ষরের হতে হবে
                  </p>
                  <p
                    className={
                      hasUpper
                        ? "text-emerald-700 font-medium"
                        : "text-gray-500"
                    }
                  >
                    {hasUpper ? "✔" : "○"} অন্তত একটি বড় হাতের অক্ষর (A-Z)
                    থাকতে হবে
                  </p>
                  <p
                    className={
                      hasLower
                        ? "text-emerald-700 font-medium"
                        : "text-gray-500"
                    }
                  >
                    {hasLower ? "✔" : "○"} অন্তত একটি ছোট হাতের অক্ষর (a-z)
                    থাকতে হবে
                  </p>
                  <p
                    className={
                      hasNumber
                        ? "text-emerald-700 font-medium"
                        : "text-gray-500"
                    }
                  >
                    {hasNumber ? "✔" : "○"} অন্তত একটি সংখ্যা (0-9) থাকতে হবে
                  </p>
                  <p
                    className={
                      hasSpecial
                        ? "text-emerald-700 font-medium"
                        : "text-gray-500"
                    }
                  >
                    {hasSpecial ? "✔" : "○"} অন্তত একটি বিশেষ চরিত্র (!@#$%^&*)
                    থাকতে হবে
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white p-2.5 rounded-lg hover:bg-emerald-700 transition font-medium text-sm shadow-md shadow-emerald-600/20"
            >
              লগইন
            </button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs">অথবা</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 p-2.5 rounded-lg hover:bg-gray-50 transition text-sm shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.14C3.15 21.32 7.22 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.62H1.18C.43 8.13 0 9.83 0 12s.43 3.87 1.18 5.38l4.09-3.14z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.15 2.68 1.18 6.62l4.09 3.14c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>
            গুগল দিয়ে লগইন করুন
          </button>

          <p className="text-center text-xs text-gray-600 pt-1">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/auth/register"
              className="text-emerald-600 font-semibold hover:underline"
            >
              রেজিস্ট্রেশন করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
