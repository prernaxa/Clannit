import {
  UserPlus,
  LogIn,
  Sparkles,
  Users,
  AlarmClock,
  Heart,
  CheckCircle,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Top Nav */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-teal-100 p-2 rounded-full">
            <Calendar className="text-teal-600" />
          </div>
          <span className="text-2xl font-bold text-teal-700">Clannit</span>
        </div>
        <div className="flex gap-3">
          <Link
            href="/signup"
            className="flex items-center gap-1 bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-teal-700 transition"
          >
            <UserPlus size={16} /> Sign Up
          </Link>
          <Link
            href="/signin"
            className="flex items-center gap-1 border border-teal-600 text-teal-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-teal-50 transition"
          >
            <LogIn size={16} /> Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="px-6 sm:px-12 py-12 text-center sm:text-left max-w-5xl mx-auto mb-24 mt-14">
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight mb-6">
          Tiny habits, <span className="text-teal-600">big results</span>.
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl">
          Build micro-habits with friends. Stay consistent, have fun, and actually change.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
          <Link
            href="/signup"
            className="bg-teal-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-teal-700 shadow-md transition"
          >
            Get Started
          </Link>
          <a
            href="#why"
            className="border border-teal-600 text-teal-700 px-6 py-3 rounded-full font-semibold hover:bg-teal-50 shadow-md transition"
          >
            Learn More
          </a>
        </div>
      </header>

      {/* Why Clannit */}
      <section id="why" className="py-24 bg-teal-50 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-teal-700 mb-6">Why Clannit?</h2>
          <p className="text-lg sm:text-xl text-gray-700 mb-16 max-w-3xl mx-auto">
            Most habit apps rely on motivation. Clannit relies on real people. You build one small habit in a fun group, and the social push keeps you going.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                Icon: Sparkles,
                title: "Start Small",
                desc: "Create tiny, realistic daily habits you can actually stick to.",
              },
              {
                Icon: Users,
                title: "Find Your Clan",
                desc: "Join a small group where everyone’s rooting for you.",
              },
              {
                Icon: AlarmClock,
                title: "Make It Fun",
                desc: "Missed your habit? Expect silly penalties from your team.",
              },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition text-left">
                <div className="flex items-center gap-4 mb-4">
                  <Icon className="text-teal-600 w-10 h-10 p-2 bg-teal-100 rounded-full" />
                  <h3 className="text-xl font-semibold">{title}</h3>
                </div>
                <p className="text-gray-700">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 px-6 sm:px-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl font-bold text-teal-700 mb-6">Our Vision</h3>
          <p className="text-xl text-gray-700 mb-10">
            We believe real change comes from small wins and social accountability. Clannit makes habit-building less lonely, more joyful, and way more effective.
          </p>
          <CheckCircle className="w-10 h-10 text-teal-600 mx-auto mb-3 animate-bounce" />
          <p className="text-sm italic text-gray-500">Built by people who’ve skipped gym day too.</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center pb-24">
        <Link
          href="/signup"
          className="inline-block bg-teal-600 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-teal-700 transition transform hover:scale-105 shadow-lg"
        >
          Join Clannit Today
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-200 text-center text-sm text-gray-500 flex justify-center items-center gap-1">
        © 2025 Clannit. Made with <Heart className="w-4 h-4 text-teal-600" /> and tiny habits.
      </footer>
    </div>
  );
}
