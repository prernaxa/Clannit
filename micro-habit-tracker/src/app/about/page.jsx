import { Sparkles, Users, AlarmClock, Heart, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-teal-100 px-6 sm:px-16 py-16 font-sans text-gray-900 relative overflow-hidden">
      {/* Background accent circles */}
      <div className="absolute top-[-100px] left-[-100px] w-72 h-72 bg-teal-300 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-80px] right-[-80px] w-96 h-96 bg-teal-400 rounded-full opacity-15 blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="max-w-4xl mx-auto text-center mb-20 z-10 relative">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 text-teal-700 tracking-wide">
          About Clannit
        </h1>
        <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto">
          Tiny habits. Real accountability. Big change.
        </p>
      </header>

      {/* Mission Section */}
      <section className="max-w-3xl mx-auto text-center mb-24 z-10 relative">
        <h2 className="text-3xl font-semibold mb-6 text-teal-600 tracking-tight">Why Clannit?</h2>
        <p className="text-gray-800 text-lg sm:text-xl leading-relaxed">
          Most habit apps rely only on willpower — and that doesn’t work for everyone. At Clannit, you form micro-habits inside small groups where encouragement and playful penalties make change stick.
        </p>
      </section>

      {/* How It Works */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-16 max-w-5xl mx-auto text-center z-10 relative">
        {[{
          Icon: Sparkles,
          title: "Start Small",
          description: "Create tiny, daily habits that are easy to commit to and build upon."
        }, {
          Icon: Users,
          title: "Find Your Clan",
          description: "Join a small accountability group that checks in and encourages you."
        }, {
          Icon: AlarmClock,
          title: "Make It Fun",
          description: "Miss a day? Face playful consequences from your group – like goofy dares."
        }].map(({ Icon, title, description }) => (
          <div key={title} className="group p-6 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-default">
            <div className="flex justify-center mb-6">
              <Icon className="text-teal-600 bg-teal-100 p-3 rounded-full w-14 h-14 transition-transform group-hover:scale-110" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-900">{title}</h3>
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </div>
        ))}
      </section>

      {/* Vision Section */}
      <section className="max-w-3xl mx-auto text-center mt-28 mb-20 z-10 relative">
        <h2 className="text-3xl font-semibold mb-5 text-teal-600 tracking-tight">Our Vision</h2>
        <p className="text-gray-800 text-lg sm:text-xl leading-relaxed mb-8">
          Meaningful change starts small and grows with community. Clannit makes habit-building less lonely, more social, and way more fun.
        </p>
        <CheckCircle className="w-10 h-10 text-teal-600 mx-auto mb-3 animate-pulse" />
        <p className="text-gray-600 italic text-sm sm:text-base">Built by people who’ve skipped gym day too.</p>
      </section>

      {/* Call to Action */}
      <section className="text-center z-10 relative">
        <Link
          href="/signup"
          className="inline-block bg-teal-600 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-teal-700 transition transform hover:scale-105 shadow-lg"
        >
          Join Clannit Today
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-32 py-10 border-t border-gray-300 text-center text-sm text-gray-500 flex justify-center items-center gap-2 z-10 relative">
        © 2025 Clannit. Made with <Heart className="w-5 h-5 text-teal-600" /> and good habits.
      </footer>
    </div>
  );
}
