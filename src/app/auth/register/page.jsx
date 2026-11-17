"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeField, setActiveField] = useState(null);

  // ফাইল এবং প্রিভিউ হ্যান্ডেল করার জন্য
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // ইনপুট ভ্যালু রিয়েল-টাইমে ট্র্যাক করার জন্য
  const passwordValue = watch("password", "");
  const emailValue = watch("email", "");

  // ফাইল সিলেক্ট করলে প্রিভিউ URL তৈরি
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  // পাসওয়ার্ড শর্তসমূহ
  const hasLength = passwordValue.length >= 8;
  const hasLower = /[a-z]/.test(passwordValue);
  const hasUpper = /[A-Z]/.test(passwordValue);
  const hasNumber = /\d/.test(passwordValue);
  const hasSpecial = /[@$!%*?&]/.test(passwordValue);

  // ইমেইল শর্ত (@gmail.com চেক)
  const isValidGmail =
    emailValue.endsWith("@gmail.com") && emailValue.length > 10;

  // ImgBB ইমেজ আপলোড ফাংশন
  const uploadImageToImgBB = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
      {
        method: "POST",
        body: formData,
      },
    );

    const result = await response.json();
    if (result.success) {
      return result.data.url;
    } else {
      throw new Error("ছবি আপলোড ব্যর্থ হয়েছে");
    }
  };

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      // ছবি সিলেক্ট করা থাকলে আগে আপলোড করে URL নেওয়া
      let imageUrl = "";
      if (selectedFile) {
        imageUrl = await uploadImageToImgBB(selectedFile);
      }

      const query = new URLSearchParams({
        name: data.name,
        email: data.email,
      });

      const response = await fetch(
        `http://localhost:5000/api/otp-send?${query}`,
        {
          method: "POST",
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "OTP পাঠানো যায়নি, আবার চেষ্টা করুন",
        );
      }

      // password ও ছবির URL রাখা হচ্ছে (name, email URL এ যাবে)
      sessionStorage.setItem("pendingPassword", data.password);
      if (imageUrl) {
        sessionStorage.setItem("pendingImage", imageUrl);
      } else {
        sessionStorage.removeItem("pendingImage");
      }

      router.push(`/auth/verifyotp?${query}`);
    } catch (err) {
      setError(err.message || "কিছু একটা সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50 p-4 text-black relative">
      {/* ফুল পেজ লোডিং ওভারলে */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white px-6 py-4 rounded-lg shadow-xl flex items-center space-x-3">
            <div className="w-6 h-6 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-800 font-medium">
              OTP পাঠানো হচ্ছে, অপেক্ষা করুন...
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

        {/* ডানপাশের রেজিস্ট্রেশন ফর্ম */}
        <div className="p-8 space-y-4 flex flex-col justify-center">
          <div className="text-center md:text-left mb-5">
            <h1 className="text-2xl font-bold text-gray-800 text-center">
              রেজিস্ট্রেশন করুন
            </h1>
            <p className="text-sm text-gray-500 mt-1 text-center">
              আপনার সঠিক তথ্য দিয়ে অ্যাকাউন্ট তৈরি করুন
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
            {/* নাম ফিল্ড */}
            <div>
              {errors.name && (
                <p className="text-red-500 text-xs mb-1">
                  {errors.name.message}
                </p>
              )}
              <input
                type="text"
                placeholder="আপনার নাম"
                onFocus={() => setActiveField("name")}
                {...register("name", { required: "নাম আবশ্যক" })}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
              />
            </div>

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

              {/* পাসওয়ার্ড ফোকাস থাকলে রিয়েল-টাইম ভ্যালিডেশন লিস্ট */}
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

            {/* প্রফাইল ছবি আপলোড ফিল্ড ও ডানপাশে প্রিভিউ */}
            <div className="border border-gray-300 w-full p-2 rounded-lg bg-gray-50/50">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                প্রফাইল ছবি (ঐচ্ছিক)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onFocus={() => setActiveField("image")}
                  onChange={handleFileChange}
                  className="w-full text-xs mt-1 border border-green-200 rounded p-2 text-gray-500 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />

                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-10 h-10 rounded object-cover border border-green-200 shadow-sm flex-shrink-0"
                  />
                )}
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-emerald-600 text-white p-2.5 rounded-lg hover:bg-emerald-700 transition font-medium text-sm shadow-md shadow-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "OTP পাঠানো হচ্ছে..." : "পরবর্তী ধাপ (OTP ভেরিফিকেশন)"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 pt-1">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/auth/login"
              className="text-emerald-600 font-semibold hover:underline"
            >
              লগইন করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
