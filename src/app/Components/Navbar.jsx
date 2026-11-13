"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { href: "/", label: "হোম" },
  { href: "/community", label: "কম্যুনিটি" },
  { href: "/share-experience", label: "অভিজ্ঞতা শেয়ার" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // better-auth সেশন হুক: data = লগইন থাকলে ইউজার ডাটা, isPending = লোড হচ্ছে
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // "/" শুধু হোমপেজে অ্যাক্টিভ হবে, বাকিগুলো সাবরুটেও অ্যাক্টিভ থাকবে
  const isActive = (href) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  // নেভ লিংক: অ্যাক্টিভ হলে সবুজ পিল, নইলে হোভারে হালকা সবুজ
  const linkClass = (href) =>
    `px-4 py-2 rounded-full text-sm font-medium transition ${
      isActive(href)
        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
        : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
    }`;

  const authBtnClass = (href) =>
    `px-4 py-2 rounded-lg text-sm font-medium border transition ${
      isActive(href)
        ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
        : "text-emerald-600 border-emerald-600 hover:bg-emerald-50"
    }`;

  // লগআউট ফাংশন (কনফার্মেশন সহ)
  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "আপনি কি লগআউট করতে চান?",
      text: "লগআউট করলে এই ডিভাইস থেকে আপনার সেশন শেষ হয়ে যাবে।",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, লগআউট",
      cancelButtonText: "না",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    // "না" চাপলে বা পপআপের বাইরে ক্লিক করলে কিছুই হবে না, ইউজার একই পেজে থাকবে
    if (!result.isConfirmed) return;

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "লগআউট সফল!",
            text: "আপনি সফলভাবে লগআউট করেছেন।",
            timer: 1500,
            showConfirmButton: false,
          });
          router.push("/auth/login");
          router.refresh();
        },
        onError: (ctx) => {
          Swal.fire({
            icon: "error",
            title: "লগআউট ব্যর্থ হয়েছে",
            text: ctx.error.message || "কোথাও কোনো সমস্যা হয়েছে।",
            confirmButtonColor: "#dc2626",
          });
        },
      },
    });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      {/* ওপরের সবুজ গ্রেডিয়েন্ট লাইন */}
      <div className="h-1 bg-gradient-to-r from-emerald-600 via-emerald-400 to-blue-400"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* লোগো (লগইন ও রেজিস্টার পেজের ব্যানারের মতো) */}
          <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
            <span className="bg-emerald-700 text-white px-2.5 py-1.5 rounded-xl font-bold text-lg shadow-md shadow-emerald-700/30">
              MediCare
            </span>
            <span className="text-lg font-semibold tracking-wide text-emerald-700">
              Bangladesh
            </span>
          </Link>

          {/* নেভ লিংক */}
          <div className="hidden md:flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-full p-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={linkClass(link.href)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ডানপাশ: লগইন/রেজিস্টার অথবা প্রোফাইল + লগআউট */}
          <div className="flex items-center space-x-3">
            {isPending ? (
              // সেশন লোড হওয়ার সময় স্কেলিটন (বাটন জাম্প করা এড়াতে)
              <div className="w-24 h-9 rounded-lg bg-gray-100 animate-pulse"></div>
            ) : user ? (
              <>
                {/* প্রোফাইল ছবি (ছবি না থাকলে নামের প্রথম অক্ষর) */}
                <Link
                  href="/profile"
                  title={user.name}
                  className="flex-shrink-0"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "Profile"}
                      className="w-10 h-10 rounded-full object-cover border-2 border-emerald-600 hover:ring-4 hover:ring-emerald-100 transition"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold border-2 border-emerald-600 hover:ring-4 hover:ring-emerald-100 transition">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </Link>

                <button
                  onClick={handleLogout}
                  type="button"
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                >
                  লগআউট
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  aria-current={isActive("/auth/login") ? "page" : undefined}
                  className={authBtnClass("/auth/login")}
                >
                  লগইন
                </Link>
                <Link
                  href="/auth/register"
                  aria-current={isActive("/auth/register") ? "page" : undefined}
                  className={authBtnClass("/auth/register")}
                >
                  রেজিস্ট্রেশন
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
