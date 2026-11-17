"use client";
import { useForm } from "react-hook-form";

export default function VerifyOtpForm({ registrationData }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("Email:", registrationData?.email, "OTP:", data.otp);
    // Add your verification API call here
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 text-black">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">ওটিপি ভেরিফিকেশন</h1>
          <p className="text-sm text-gray-500 mt-1">
            কোড পাঠানো হয়েছে:{" "}
            <span className="font-semibold text-emerald-600">
              {registrationData?.email}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            {...register("otp", { required: true })}
            placeholder="৬ ডিজিটের কোড দিন"
            className="w-full text-center tracking-widest text-lg p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 transition font-medium text-sm"
          >
            ভেরিফাই করুন
          </button>
        </form>
      </div>
    </div>
  );
}
