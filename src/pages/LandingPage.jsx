import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  UtensilsCrossed,
  Star,
  Clock,
  Shield,
  ChevronRight,
  MapPin,
  Truck,
  Heart,
  Menu,
  X,
} from "lucide-react";

// STATS DATA
const stats = [
  { value: "500+", label: "Restaurants" },
  { value: "50k+", label: "Happy Customers" },
  { value: "4.9★", label: "Average Rating" },
  { value: "30min", label: "Avg Delivery" },
];

// ── FEATURES DATA ──────────────────────────
const features = [
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Fast Delivery",
    desc: "Get your food delivered to your door in 30 minutes or less.",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Top Rated",
    desc: "Every restaurant is rated and reviewed by real customers.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure Payments",
    desc: "Pay safely with Paystack — your data is always protected.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Wide Selection",
    desc: "From local Nigerian dishes to international cuisines.",
  },
];

// ── CUISINE CATEGORIES ─────────────────────
const cuisines = [
  { emoji: "🍲", name: "Nigerian" },
  { emoji: "🍕", name: "Pizza" },
  { emoji: "🍔", name: "Burgers" },
  { emoji: "🍣", name: "Sushi" },
  { emoji: "🌮", name: "Tacos" },
  { emoji: "🍜", name: "Chinese" },
  { emoji: "🥗", name: "Salads" },
  { emoji: "🍰", name: "Desserts" },
];

// ── FOOD IMAGES for hero slideshow ─────────
const heroImages = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&auto=format&fit=crop",
];

const LandingPage = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // Auto-cycle hero background images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 font-sans">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-7 h-7 text-orange-500" />
            <span
              className="text-xl font-bold text-gray-900"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              FoodHub
            </span>
          </div>

          {/* Nav links - desktop only */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a
              href="#features"
              className="hover:text-orange-500 transition-colors"
            >
              Features
            </a>
            <a
              href="#cuisines"
              className="hover:text-orange-500 transition-colors"
            >
              Cuisines
            </a>
            <a
              href="#how-it-works"
              className="hover:text-orange-500 transition-colors"
            >
              How it works
            </a>
          </div>

          {/* Auth buttons — desktop only */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-semibold text-orange-500 border-2 border-orange-500
                         rounded-xl hover:bg-orange-50 transition-all duration-200"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 text-sm font-semibold text-white bg-orange-500
                         rounded-xl hover:bg-orange-600 transition-all duration-200 shadow-md shadow-orange-200"
            >
              Sign Up
            </Link>
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden p-2 rounded-xl text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-all"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle menu"
          >
            {mobileNavOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* ── MOBILE DROPDOWN MENU ── */}
        <div
          style={{
            maxHeight: mobileNavOpen ? "400px" : "0px",
            overflow: "hidden",
            transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
          className="md:hidden"
        >
          <div className="px-6 pb-6 pt-2 bg-white border-t border-orange-100 flex flex-col gap-1">
            {/* Nav links */}
            <a
              href="#features"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 font-medium
                         hover:bg-orange-50 hover:text-orange-500 transition-all duration-200"
            >
              Features
            </a>
            <a
              href="#cuisines"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 font-medium
                         hover:bg-orange-50 hover:text-orange-500 transition-all duration-200"
            >
              Cuisines
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 font-medium
                         hover:bg-orange-50 hover:text-orange-500 transition-all duration-200"
            >
              How it works
            </a>

            {/* Divider */}
            <div className="my-2 border-t border-gray-100" />

            {/* Auth buttons */}
            <Link
              to="/login"
              onClick={() => setMobileNavOpen(false)}
              className="w-full text-center px-5 py-3 text-sm font-semibold text-orange-500
                         border-2 border-orange-500 rounded-xl hover:bg-orange-50 transition-all duration-200"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileNavOpen(false)}
              className="w-full text-center px-5 py-3 text-sm font-semibold text-white bg-orange-500
                         rounded-xl hover:bg-orange-600 transition-all duration-200 shadow-md shadow-orange-200"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image with smooth transition */}
        {heroImages.map((img, index) => (
          <div
            key={img}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url('${img}')`,
              opacity: currentImage === index ? 1 : 0,
            }}
          />
        ))}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

        {/* Hero content */}
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto pt-20">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/40
                          backdrop-blur-sm rounded-full px-4 py-2 mb-6"
          >
            <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span className="text-sm text-orange-200 font-medium">
              Nigeria's #1 Food Delivery App
            </span>
          </div>

          {/* Main headline */}
          <h1
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Delicious food,
            <br />
            <span className="text-orange-400">delivered fast.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Order from hundreds of top-rated restaurants near you. Fresh meals
            at your door in minutes.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600
                         text-white font-bold rounded-2xl text-lg transition-all duration-200
                         shadow-xl shadow-orange-500/30 hover:scale-105"
            >
              Get Started Free
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20
                         backdrop-blur-sm text-white font-bold rounded-2xl text-lg
                         border border-white/30 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>

          {/* Image dots indicator */}
          <div className="flex items-center justify-center gap-2 mt-12">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentImage === index
                    ? "w-8 bg-orange-400"
                    : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/*  STATS STRIP */}
      <section className="bg-orange-500 py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center text-white">
              <p
                className="text-3xl font-bold"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {stat.value}
              </p>
              <p className="text-orange-100 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center mb-14">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">
              Why FoodHub
            </p>
            <h2
              className="text-4xl font-bold text-gray-900"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Everything you need,
              <span className="text-orange-500"> in one app</span>
            </h2>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-gray-100 bg-amber-50
                           hover:shadow-lg hover:border-orange-200 transition-all duration-300 group"
              >
                <div
                  className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center
                                text-orange-500 mb-4 group-hover:bg-orange-500 group-hover:text-white transition-all"
                >
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUISINE CATEGORIES */}
      <section id="cuisines" className="py-20 bg-amber-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">
              What are you craving?
            </p>
            <h2
              className="text-4xl font-bold text-gray-900"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Explore by cuisine
            </h2>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {cuisines.map((c) => (
              <Link
                to="/signup"
                key={c.name}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl
                           hover:shadow-md hover:scale-105 transition-all duration-200
                           border border-gray-100 cursor-pointer group"
              >
                <span className="text-3xl">{c.emoji}</span>
                <span className="text-xs font-medium text-gray-600 group-hover:text-orange-500 transition-colors">
                  {c.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">
              Simple as 1-2-3
            </p>
            <h2
              className="text-4xl font-bold text-gray-900"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              How it works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Connecting line — desktop only */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-orange-200" />

            {[
              {
                step: "01",
                icon: <MapPin className="w-6 h-6" />,
                title: "Choose a restaurant",
                desc: "Browse hundreds of restaurants by cuisine, rating or location.",
              },
              {
                step: "02",
                icon: <UtensilsCrossed className="w-6 h-6" />,
                title: "Pick your meals",
                desc: "Add your favourite items to cart and adjust quantities easily.",
              },
              {
                step: "03",
                icon: <Truck className="w-6 h-6" />,
                title: "Fast delivery",
                desc: "Pay securely and track your order straight to your door.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  <div
                    className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center
                                  text-white shadow-lg shadow-orange-200 rotate-3"
                  >
                    {item.icon}
                  </div>
                  <span
                    className="absolute -top-2 -right-2 w-7 h-7 bg-gray-900 text-white text-xs
                                   font-bold rounded-full flex items-center justify-center"
                  >
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section
        className="py-24 bg-cover bg-center relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/90 to-black/80" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center text-white">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Ready to order?
            <br />
            <span className="text-orange-400">Join FoodHub today.</span>
          </h2>
          <p className="text-gray-300 text-lg mb-10">
            Sign up in seconds and start exploring hundreds of restaurants near
            you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold
                         rounded-2xl text-lg transition-all duration-200 shadow-xl shadow-orange-500/30
                         hover:scale-105"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="px-10 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white
                         font-bold rounded-2xl text-lg border border-white/30 transition-all duration-200"
            >
              Already have an account
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-orange-500" />
            <span
              className="text-white font-bold"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              FoodHub
            </span>
          </div>
          <p className="text-sm">
            © 2025 FoodHub. Built with ❤️ for CSC project.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              to="/login"
              className="hover:text-orange-400 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="hover:text-orange-400 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
