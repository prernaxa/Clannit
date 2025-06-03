import {
  UserPlus,
  LogIn,
  Sparkles,
  Users,
  AlarmClock,
  Heart,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-teal-50 px-6 sm:px-12 py-10 font-sans flex flex-col">
      {/* Top Nav */}
      <nav className="w-full max-w-7xl mx-auto flex items-center justify-between mb-16">
        <div className="flex items-center gap-3">
          <Calendar size={32} className="text-teal-700" />
          <span className="text-2xl font-bold tracking-tight text-teal-800">Clannit</span>
        </div>
        <div className="flex gap-4">
          <Link
            href="/signup"
            className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-teal-700 transition-shadow shadow-sm hover:shadow-md"
          >
            <UserPlus size={16} /> Sign Up
          </Link>
          <Link
            href="/signin"
            className="flex items-center gap-2 border border-teal-600 text-teal-700 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-teal-50 transition-shadow shadow-sm hover:shadow-md"
          >
            <LogIn size={16} /> Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="text-center sm:text-left max-w-4xl mx-auto mb-20">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
          Tiny habits, <span className="text-teal-600">big results</span>.
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto sm:mx-0 mb-10">
          Build ultra-specific daily micro-habits, team up in focused groups, and
          stay accountable with fun consequences for missed days.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
          <Link
            href="/signup"
            className="bg-teal-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-teal-700 transition-shadow shadow-md"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="border border-teal-600 text-teal-700 px-6 py-3 rounded-full font-semibold hover:bg-teal-50 transition-shadow shadow-md"
          >
            Learn More
          </Link>
        </div>
      </header>

      {/* How It Works */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-6xl mx-auto text-center sm:text-left">
        <div className="p-4 rounded-lg hover:bg-white transition">
          <div className="flex justify-center sm:justify-start mb-4">
            <Sparkles className="text-teal-600 bg-teal-100 p-2 rounded-full w-12 h-12" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Set Micro Habits</h3>
          <p className="text-gray-600 leading-relaxed">
            Define small, actionable goals like “Drink 1 glass of water” that create momentum.
          </p>
        </div>
        <div className="p-4 rounded-lg hover:bg-white transition">
          <div className="flex justify-center sm:justify-start mb-4">
            <Users className="text-teal-600 bg-teal-100 p-2 rounded-full w-12 h-12" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Join Social Groups</h3>
          <p className="text-gray-600 leading-relaxed">
            Stay accountable and inspired through small, encouraging community groups.
          </p>
        </div>
        <div className="p-4 rounded-lg hover:bg-white transition">
          <div className="flex justify-center sm:justify-start mb-4">
            <AlarmClock className="text-teal-600 bg-teal-100 p-2 rounded-full w-12 h-12" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Fun Penalties</h3>
          <p className="text-gray-600 leading-relaxed">
            Miss a day? Your group assigns a playful challenge to keep things light but effective.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 py-10 border-t border-gray-200 text-center text-sm text-gray-500 flex justify-center items-center gap-1">
        © 2025 Clannit. Made with <Heart className="w-4 h-4 text-teal-600" /> and good habits.
      </footer>
    </div>
  );
}
