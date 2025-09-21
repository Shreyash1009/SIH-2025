import React, { useState } from "react";
import { Trophy, TrendingUp, Award, MapPin, Calendar, ChevronUp, ChevronDown, Star, Target, Shield } from "lucide-react";

function LeaderboardPage() {
  const [timeRange, setTimeRange] = useState("month");
  const [category, setCategory] = useState("all");

  const leaderboardData = [
    { rank: 1, name: "Asha Sharma", location: "Goa", points: 420, reports: 45, verified: 41, accuracy: "91%", badge: "🥇", trend: "+12", avatar: "AS" },
    { rank: 2, name: "Raju Kumar", location: "Chennai", points: 360, reports: 38, verified: 33, accuracy: "87%", badge: "🥈", trend: "+8", avatar: "RK" },
    { rank: 3, name: "Fatima Khan", location: "Pondicherry", points: 320, reports: 35, verified: 31, accuracy: "89%", badge: "🥉", trend: "+15", avatar: "FK" },
    { rank: 4, name: "Vikram Patel", location: "Mumbai", points: 285, reports: 30, verified: 26, accuracy: "87%", badge: "🏅", trend: "+5", avatar: "VP" },
    { rank: 5, name: "Priya Nair", location: "Kochi", points: 260, reports: 28, verified: 24, accuracy: "86%", badge: "🏅", trend: "+10", avatar: "PN" },
    { rank: 6, name: "Ahmed Ali", location: "Visakhapatnam", points: 245, reports: 27, verified: 22, accuracy: "81%", badge: "🏅", trend: "-2", avatar: "AA" },
    { rank: 7, name: "Sneha Reddy", location: "Mangalore", points: 230, reports: 25, verified: 21, accuracy: "84%", badge: "🏅", trend: "+3", avatar: "SR" },
    { rank: 8, name: "Arjun Singh", location: "Puri", points: 215, reports: 24, verified: 19, accuracy: "79%", badge: "🏅", trend: "+7", avatar: "AS" },
  ];

  const achievements = [
    { icon: <Shield className="w-6 h-6" />, title: "Verified Guardian", count: "50+ verified reports", color: "from-blue-500 to-cyan-500" },
    { icon: <Target className="w-6 h-6" />, title: "Accuracy Master", count: "90%+ accuracy rate", color: "from-green-500 to-emerald-500" },
    { icon: <Star className="w-6 h-6" />, title: "Rising Star", count: "Top 10 this month", color: "from-purple-500 to-pink-500" },
    { icon: <Trophy className="w-6 h-6" />, title: "Champion", count: "#1 Reporter", color: "from-yellow-500 to-orange-500" },
  ];

  const stats = [
    { label: "Total Reports", value: "1,234", subtext: "This month" },
    { label: "Verified Reports", value: "1,089", subtext: "88% accuracy" },
    { label: "Active Guardians", value: "456", subtext: "+23 this week" },
    { label: "Lives Protected", value: "10K+", subtext: "Estimated impact" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, hsl(209 100% 20%), hsl(195 100% 50%))' }} className="text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 translate-y-32"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 animate-bounce">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Community Champions</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Recognizing the heroes who keep our coasts safe through vigilant reporting and community action
            </p>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-8 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all transform"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                <div className="text-xs text-green-600 mt-2 font-medium">{stat.subtext}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex gap-2">
              {["all", "verified", "emergency"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    category === cat
                      ? "gradient-ocean text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              {["week", "month", "year", "all-time"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeRange === range
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {range === "all-time" ? "All Time" : range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Leaderboard */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Top 3 Showcase */}
            <div style={{ background: 'linear-gradient(135deg, hsl(209 100% 20%), hsl(195 100% 50%))' }} className="p-8">
              <div className="grid md:grid-cols-3 gap-6">
                {leaderboardData.slice(0, 3).map((user, idx) => (
                  <div
                    key={idx}
                    className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white transition-all ${
                      idx === 0 ? "md:scale-110 md:shadow-2xl" : ""
                    }`}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{user.badge}</div>
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl font-bold">{user.avatar}</span>
                      </div>
                      <h3 className="font-bold text-lg">{user.name}</h3>
                      <p className="text-sm opacity-90 flex items-center justify-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {user.location}
                      </p>
                      <div className="text-3xl font-bold mt-4">{user.points}</div>
                      <div className="text-sm opacity-90">points</div>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        {user.trend.startsWith("+") ? (
                          <ChevronUp className="w-4 h-4 text-green-300" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-red-300" />
                        )}
                        <span className="text-sm font-medium">{user.trend}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Leaderboard Table */}
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Full Rankings</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-3">Rank</th>
                      <th className="pb-3">Guardian</th>
                      <th className="pb-3 hidden sm:table-cell">Location</th>
                      <th className="pb-3">Reports</th>
                      <th className="pb-3 hidden sm:table-cell">Verified</th>
                      <th className="pb-3 hidden lg:table-cell">Accuracy</th>
                      <th className="pb-3">Points</th>
                      <th className="pb-3">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((user, idx) => (
                      <tr
                        key={idx}
                        className="border-b hover:bg-gray-50 transition-colors"
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{user.badge}</span>
                            <span className="font-medium text-gray-600">#{user.rank}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-medium">
                              {user.avatar}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500 sm:hidden">{user.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 hidden sm:table-cell">
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {user.location}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="font-medium">{user.reports}</span>
                        </td>
                        <td className="py-4 hidden sm:table-cell">
                          <span className="text-green-600 font-medium">{user.verified}</span>
                        </td>
                        <td className="py-4 hidden lg:table-cell">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            {user.accuracy}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="text-xl font-bold text-blue-600">
                            {user.points}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-1">
                            {user.trend.startsWith("+") ? (
                              <ChevronUp className="w-4 h-4 text-green-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-red-500" />
                            )}
                            <span className={`text-sm font-medium ${
                              user.trend.startsWith("+") ? "text-green-600" : "text-red-600"
                            }`}>
                              {user.trend}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-center">
                <button className="text-gradient-ocean font-medium hover:underline">
                  Load More Rankings →
                </button>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievement Badges</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg hover:scale-105 transition-all border border-gray-100"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${achievement.color} text-white mb-4`}>
                    {achievement.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Start Your Journey</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join our community of coastal guardians and help protect lives. Every report counts!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/report"
                className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-all hover:shadow-lg"
                style={{ backgroundColor: 'hsl(16 100% 66%)' }}
              >
                Submit Your First Report
              </a>
              <a
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 border-2 border-blue-100 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LeaderboardPage;