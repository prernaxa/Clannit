import { UserPlus, LogIn, Sparkles, Users, AlarmClock, Heart, Calendar} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-teal-50 px-6 sm:px-12 py-8 font-sans flex flex-col">
      {/* Top Nav */}
      <nav className="w-full max-w-7xl mx-auto flex items-center justify-between mb-12">
        {/* Left: Icon + Brand Name */}
        <div className="flex items-center gap-2">
          <Calendar size={36} className="text-teal-700" />
          <span className="text-2xl font-bold text-teal-700">Clannit</span>
        </div>

        {/* Right: Auth Buttons */}
        <div className="flex gap-4">
          <Link
            href="/signup"
            className="flex items-center gap-1 bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-teal-700 transition"
          >
            <UserPlus size={16} /> Sign Up
          </Link>
          <Link
            href="/signin"
            className="flex items-center gap-1 border border-teal-600 text-teal-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-teal-50 transition"
          >
            <LogIn size={16} /> Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="text-center sm:text-left max-w-4xl mx-auto mb-20">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Tiny habits, <span className="text-teal-600">big results</span>.
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto sm:mx-0 mb-8">
          Build super-specific daily micro-habits, join small social groups, and
          stay motivated with fun penalties for missed days.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
          <Link
            href="/signup"
            className="bg-teal-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-teal-700 transition shadow-md"
          >
            Get Started
          </Link>
          <Link
            href="/learn-more"
            className="border border-teal-600 text-teal-600 px-6 py-3 rounded-full font-semibold hover:bg-teal-50 transition"
          >
            Learn More
          </Link>
        </div>
      </header>

      {/* How It Works Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-5xl mx-auto text-center sm:text-left">
        <div>
          <div className="flex justify-center sm:justify-start mb-4">
            <Sparkles className="text-teal-600 bg-teal-100 p-2 rounded-full w-12 h-12" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-black">Set Micro Habits</h3>
          <p className="text-gray-600">
            Define tiny, achievable goals like “Drink 1 glass of water” that build momentum.
          </p>
        </div>
        <div>
          <div className="flex justify-center sm:justify-start mb-4">
            <Users className="text-teal-600 bg-teal-100 p-2 rounded-full w-12 h-12" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-black">Join Social Groups</h3>
          <p className="text-gray-600">
            Small, focused groups keep you motivated with check-ins and encouragement.
          </p>
        </div>
        <div>
          <div className="flex justify-center sm:justify-start mb-4">
            <AlarmClock className="text-teal-600 bg-teal-100 p-2 rounded-full w-12 h-12" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-black">Fun Penalties</h3>
          <p className="text-gray-600">
            Miss a day? Your group picks a quirky challenge to keep things fun and engaging.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 py-8 border-t border-gray-200 text-center text-sm text-gray-500 flex justify-center items-center gap-1">
        © 2025 Clannit. Made with <Heart className="w-4 h-4 text-teal-600" /> and good habits.
      </footer>
    </div>
  );
}
