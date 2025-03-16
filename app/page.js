"use client"
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem("theme", !isDark ? "dark" : "light");
  };

  return (
    <div className={`${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} min-h-screen transition-colors duration-300`}>
      <Head>
        <title>Referral System</title>
        <meta name="description" content="A campaign-based referral system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Referral System</h1>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition"
        >
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Referral System</h1>
          <p className="text-xl max-w-2xl mx-auto">
            A simple, effective way for businesses to create referral campaigns and for users to earn rewards.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center mt-12">
          <div className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-md max-w-md`}>
            <h2 className="text-2xl font-bold mb-4">For Businesses</h2>
            <p className="mb-6">
              Create referral campaigns, track performance, and reward your customers for bringing in new business.
            </p>
            <div className="flex gap-4">
              <Link href="/login">
                <span className="cursor-pointer bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">Login</span>
              </Link>
              <Link href="/register">
                <span className="cursor-pointer bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">Register</span>
              </Link>
            </div>
          </div>

          <div className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-md max-w-md`}>
            <h2 className="text-2xl font-bold mb-4">For Users</h2>
            <p>Refer friends, complete tasks, and earn rewards. It&apos;s that simple!</p>

            <Link href="/get-referral">
              <span className="cursor-pointer bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600">
                Get Referral Link
              </span>
            </Link>
          </div>
        </div>

        <div className={`${isDark ? "bg-gray-800" : "bg-white"} mt-16 p-8 rounded-lg shadow-md max-w-4xl mx-auto`}>
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Businesses Create Campaigns</h3>
              <p>Set up referral campaigns with custom tasks and rewards for both referrers and referred users.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Users Share Referral Links</h3>
              <p>Existing users get personalized referral links to share with friends and contacts.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Both Earn Rewards</h3>
              <p>When new users complete tasks, both the referrer and new user receive rewards!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
