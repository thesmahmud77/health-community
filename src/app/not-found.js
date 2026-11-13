import Link from "next/link";

export const metadata = {
  title: "পেজ খুঁজে পাওয়া যায়নি | হেলথ কম্যুনিটি",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50 p-4 text-black">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* বামপাশের ব্যানার */}
        <div className="relative flex flex-col items-center justify-center bg-emerald-700 text-white p-10 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1000')`,
            }}
          ></div>

          <div className="relative z-10 text-center">
            <h1 className="text-8xl md:text-9xl font-extrabold tracking-tight drop-shadow-lg">
              404
            </h1>

            {/* হার্টবিট লাইন */}
            <svg
              className="w-48 h-12 mx-auto mt-2 text-emerald-200"
              viewBox="0 0 200 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M0 20 H60 L70 5 L85 35 L95 20 H200" />
            </svg>
          </div>
        </div>

        {/* ডানপাশের মেসেজ */}
        <div className="p-8 md:p-10 flex flex-col justify-center items-center text-center space-y-4">
          <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
            ত্রুটি ৪০৪
          </span>

          <h2 className="text-2xl font-bold text-gray-800">
            পেজটি খুঁজে পাওয়া যায়নি
          </h2>

          <p className="text-sm text-gray-500 leading-relaxed">
            আপনি যে পেজটি খুঁজছেন সেটি হয়তো সরানো হয়েছে, মুছে ফেলা হয়েছে,
            অথবা লিংকটি ভুল। অনুগ্রহ করে লিংকটি আবার দেখে নিন।
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
            <Link
              href="/"
              className="flex-1 bg-emerald-600 text-white p-2.5 rounded-lg hover:bg-emerald-700 transition font-medium text-sm shadow-md shadow-emerald-600/20"
            >
              হোমে ফিরে যান
            </Link>
            <Link
              href="/community"
              className="flex-1 border border-emerald-600 text-emerald-600 p-2.5 rounded-lg hover:bg-emerald-50 transition font-medium text-sm"
            >
              কম্যুনিটিতে যান
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
