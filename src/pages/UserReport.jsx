import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { MapPin, Filter, Users, Twitter, Facebook } from "lucide-react"

const mockReports = [
    {
        id: 1,
        image: 'data:image/jpeg;base64,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',
        type: 'Oil Spill',
        location: 'Marina Beach, Chennai',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        description: 'A significant oil spill has been reported near the coastline, affecting local wildlife and beach activities. Urgent action is required to contain the spread and minimize environmental damage.',
        source: 'citizen',
        socialSource: null,
        category: 'Environmental',
    },
    {
        id: 2,
        image: 'https://c8.alamy.com/comp/A0MN0F/boat-on-land-damage-by-natural-disaster-tsunami-earthquake-on-sea-A0MN0F.jpg',
        type: 'High Waves',
        location: 'Juhu Beach, Mumbai',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        description: 'Unusually high waves are crashing on the shore, making it dangerous for swimmers and small boats. Authorities have issued warnings for beachgoers.',
        source: 'socialMedia',
        socialSource: 'twitter',
        category: 'Natural Disaster',
    },
    {
        id: 3,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWGjaLwn2X6CueUr766NxfyKy56AWmAD-Irw&s',
        type: 'Pollution/Debris',
        location: 'Baga Beach, Goa',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        description: 'Large amounts of plastic and other debris have washed ashore, requiring immediate cleanup efforts from local volunteers and agencies.',
        source: 'citizen',
        socialSource: null,
        category: 'Environmental',
    },
    {
        id: 4,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWGjaLwn2X6CueUr766NxfyKy56AWmAD-Irw&s',
        type: 'Coastal Erosion',
        location: 'Puri, Odisha',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        description: 'Visible signs of coastal erosion are threatening beachside structures and natural habitats. Long-term solutions are being discussed by experts.',
        source: 'socialMedia',
        socialSource: 'facebook',
        category: 'Geological',
    },
    {
        id: 5,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWGjaLwn2X6CueUr766NxfyKy56AWmAD-Irw&s',
        type: 'Flooding',
        location: 'Sundarbans, West Bengal',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        description: 'Low-lying areas are experiencing flooding due to a combination of high tides and heavy rainfall, displacing several families and affecting wildlife.',
        source: 'citizen',
        socialSource: null,
        category: 'Natural Disaster',
    },
    {
        id: 6,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWGjaLwn2X6CueUr766NxfyKy56AWmAD-Irw&s',
        type: 'Unusual Tides',
        location: 'Kochi, Kerala',
        timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        description: 'Reports from local fishermen about unusually low tides in the morning, followed by rapid high tides, causing concern among the maritime community.',
        source: 'socialMedia',
        socialSource: 'twitter',
        category: 'Oceanographic',
    },
];


const mostRepostedData = mockReports.slice(0, 4)

function ReportCard({ report }) {
  const handleVerify = () => console.log(`[v0] Report ${report.id} verified!`)
  const handleFake = () => console.log(`[v0] Report ${report.id} marked as fake!`)

  return (
    <div>
      <img
        src={report.image || "/placeholder.svg"}
        alt={report.type}
        className="w-full h-52 object-cover rounded-t-xl"
      />
      <div className="pt-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-slate-800 leading-tight mb-3">{report.type}</h3>
        <div className="flex justify-between items-center text-sm text-slate-500 mb-4 gap-2">
          <div className="flex items-center min-w-0">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{report.location}</span>
          </div>
          <span className="flex-shrink-0 text-right">{formatDistanceToNow(report.timestamp, { addSuffix: true })}</span>
        </div>
        <p className="text-slate-600 flex-grow mb-5 line-clamp-3">{report.description}</p>
        <div className="flex gap-4 mt-auto pt-5 border-t border-gray-100">
          <button
            onClick={handleVerify}
            className="flex-1 bg-green-500 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 text-sm"
          >
            Verify
          </button>
          <button
            onClick={handleFake}
            className="flex-1 bg-red-500 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200 text-sm"
          >
            Fake
          </button>
        </div>
      </div>
    </div>
  )
}

function MostRepostedCard({ report, onClick }) {
  const SourceIcon = report.source === "citizen" ? Users : report.socialSource === "twitter" ? Twitter : Facebook

  return (
    <div
      className="relative rounded-xl overflow-hidden w-80 h-96 flex-shrink-0 cursor-pointer group"
      onClick={() => onClick(report)}
    >
      <img
        src={report.image || "/placeholder.svg"}
        alt={report.type}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-5 text-white">
        <span className="text-xs font-semibold bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md">
          {report.category}
        </span>
        <h4 className="text-xl font-bold mt-2">{report.type}</h4>
        <p className="text-sm text-slate-300 mt-1 line-clamp-2">{report.description}</p>
        <div className="flex items-center text-xs mt-3 opacity-80">
          <SourceIcon className="w-4 h-4 mr-2" />
          <span>{report.source === "citizen" ? "Citizen Report" : `Via ${report.socialSource}`}</span>
        </div>
      </div>
    </div>
  )
}

export default function ReportPage() {
  const [reports, setReports] = useState(mockReports)
  const [filteredReports, setFilteredReports] = useState(mockReports)

  const [locationFilter, setLocationFilter] = useState("")
  const [eventTypeFilter, setEventTypeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [socialSourceFilter, setSocialSourceFilter] = useState("all")

  useEffect(() => {
    let result = reports
    if (locationFilter) result = result.filter((r) => r.location.toLowerCase().includes(locationFilter.toLowerCase()))
    if (eventTypeFilter !== "all") result = result.filter((r) => r.type === eventTypeFilter)
    if (dateFilter)
      result = result.filter((r) => new Date(r.timestamp).toDateString() === new Date(dateFilter).toDateString())
    if (sourceFilter !== "all") {
      result = result.filter((r) => r.source === sourceFilter)
      if (sourceFilter === "socialMedia" && socialSourceFilter !== "all") {
        result = result.filter((r) => r.socialSource === socialSourceFilter)
      }
    }
    setFilteredReports(result)
  }, [locationFilter, eventTypeFilter, dateFilter, sourceFilter, socialSourceFilter, reports])

  useEffect(() => {
    if (sourceFilter !== "socialMedia") setSocialSourceFilter("all")
  }, [sourceFilter])

  const uniqueEventTypes = [...new Set(reports.map((r) => r.type))]

  const handleFeaturedClick = (report) => {
    setLocationFilter(report.location)
    setEventTypeFilter(report.type)
    const filterElement = document.getElementById("filter-bar")
    if (filterElement) {
      filterElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <main className="bg-slate-50 min-h-screen">
      <header className="mb-8 bg-slate-800 p-6">
        <h1 className="text-4xl font-bold text-white">Hazard Reports</h1>
        <p className="text-slate-300 mt-1">Browse, filter, and review all submitted hazard reports.</p>
      </header>

      {/* --- Most Reposted Section --- */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 mx-auto px-4 sm:px-6 lg:px-8">Most Reposted Posts</h2>

        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] group">
          <ul className="flex items-center [&_li]:mx-4 animate-marquee [--marquee-duration:40s] min-w-max group-hover:[animation-play-state:paused]">
            {mostRepostedData.map((report) => (
              <li key={report.id}>
                <MostRepostedCard report={report} onClick={handleFeaturedClick} />
              </li>
            ))}
            {mostRepostedData.map((report) => (
              <li key={`${report.id}-dup`} aria-hidden="true">
                <MostRepostedCard report={report} onClick={handleFeaturedClick} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --- Filter & Reports Grid --- */}
      <section className="mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div id="filter-bar" className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
            {/* Location */}
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g., Mumbai"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Event Type */}
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">Event Type</label>
              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                {uniqueEventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            {/* Date */}
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Source */}
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">Source</label>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Sources</option>
                <option value="citizen">Citizen</option>
                <option value="socialMedia">Social Media</option>
              </select>
            </div>
            {/* Platform */}
            <div>
              <label
                className={`text-sm font-medium block mb-1 ${
                  sourceFilter !== "socialMedia" ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Platform
              </label>
              <select
                value={socialSourceFilter}
                onChange={(e) => setSocialSourceFilter(e.target.value)}
                disabled={sourceFilter !== "socialMedia"}
                className={`w-full p-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  sourceFilter !== "socialMedia" ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "border-gray-300"
                }`}
              >
                <option value="all">All Platforms</option>
                <option value="twitter">Twitter</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        {filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200/80">
            <Filter className="mx-auto w-12 h-12 text-slate-400 mb-2" />
            <h3 className="text-lg font-semibold text-slate-700">No Reports Found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your filter criteria.</p>
          </div>
        )}
      </section>
    </main>
  )
}
