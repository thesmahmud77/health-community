"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "হোম" },
  { href: "/community", label: "কম্যুনিটি" },
  { href: "/share-experience", label: "অভিজ্ঞতা শেয়ার" },
];

export default function Navbar() {
  const pathname = usePathname();

  // "/" শুধু হোমপেজে অ্যাক্টিভ হবে, বাকিগুলো সাবরুটেও অ্যাক্টিভ থাকবে
  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  const linkClass = (href) =>
    `font-medium pb-1 border-b-2 transition ${
      isActive(href)
        ? "text-green-600 border-green-600"
        : "text-gray-700 border-transparent hover:text-green-600"
    }`;

  const authBtnClass = (href) =>
    `px-4 py-2 rounded-lg text-sm font-medium border transition ${
      isActive(href)
        ? "bg-green-600 text-white border-green-600"
        : "text-green-600 border-green-600 hover:bg-green-50"
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-green-600">
              হেলথ কম্যুনিটি
            </Link>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
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

          <div className="flex items-center space-x-3">
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
          </div>

        </div>
      </div>
    </nav>
  );
}