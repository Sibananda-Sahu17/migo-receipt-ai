import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Header } from "@/components/layout/header"

const features = [
  {
    title: "Smart Receipt Capture",
    description: "Upload receipts via photo, file, video, or live stream. Multi-upload supported.",
    icon: <span className="text-3xl" role="img" aria-label="camera">📸</span>,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "AI Analysis",
    description: "Extracts merchant, date, items, taxes, and total. Get smart spending insights.",
    icon: <span className="text-3xl" role="img" aria-label="robot">🤖</span>,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Insights & Analytics",
    description: "Visualize spend patterns, category breakdowns, and reimbursement tracking.",
    icon: <span className="text-3xl" role="img" aria-label="chart">📊</span>,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Split & Categorize",
    description: "Split bills, create custom categories, and allocate items easily.",
    icon: <span className="text-3xl" role="img" aria-label="people">👥</span>,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "AI Chat Assistant",
    description: "Ask anything about your expenses. Chat UI like Google Pay, with voice input.",
    icon: <span className="text-3xl" role="img" aria-label="chat">💬</span>,
    color: "bg-pink-100 text-pink-600",
  },
  {
    title: "Untracked Expenses",
    description: "Auto-detect from SMS/Email. Upload, mark as misc, or enter manually.",
    icon: <span className="text-3xl" role="img" aria-label="alert">❗</span>,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Gmail & Wallet Integration",
    description: "Auto-track receipts from Gmail. Save receipts to Google Wallet.",
    icon: <span className="text-3xl" role="img" aria-label="link">🔗</span>,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    title: "Grocery & Meal Planner",
    description: "Auto grocery builder, inventory tracker, and meal planner from itemized data.",
    icon: <span className="text-3xl" role="img" aria-label="cart">🛒</span>,
    color: "bg-teal-100 text-teal-600",
  },
]

const steps = [
  { title: "Upload", description: "Snap or upload your receipt.", icon: <span className="text-2xl" role="img" aria-label="upload">📤</span>, color: "bg-blue-100 text-blue-600" },
  { title: "AI Analysis", description: "We extract and analyze data.", icon: <span className="text-2xl" role="img" aria-label="ai">🤖</span>, color: "bg-purple-100 text-purple-600" },
  { title: "Insights", description: "See smart charts and breakdowns.", icon: <span className="text-2xl" role="img" aria-label="insights">📈</span>, color: "bg-green-100 text-green-600" },
  { title: "Save to Wallet", description: "Store receipts securely.", icon: <span className="text-2xl" role="img" aria-label="wallet">💳</span>, color: "bg-yellow-100 text-yellow-600" },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-[#222]" style={{ fontFamily: 'Inter, Google Sans, Arial, sans-serif' }}>
      <Header title="Migo AI" userName="Amit" />
      <main className="flex-1 px-4 pt-4 pb-20 max-w-lg mx-auto w-full">
        {/* Hero Section with soft gradient */}
        <div className="mb-8 text-center relative">
          <div className="absolute inset-0 w-full h-56 rounded-2xl bg-gradient-to-br from-blue-25 via-indigo-25 to-pink-25 -z-10" />
          <h1 className="text-3xl font-bold mb-2 tracking-tight bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 text-transparent bg-clip-text drop-shadow">Migo AI</h1>
          <p className="text-lg text-gray-600 mb-4">Smart Receipt Management with AI-powered insights</p>
          <Link to="/login">
            <Button size="lg" className="h-12 px-8 shadow-lg text-lg rounded-full">Get Started</Button>
          </Link>
        </div>

        {/* How It Works */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-center text-blue-600">How It Works</h2>
          <div className="grid grid-cols-2 gap-4">
            {steps.map((step, idx) => (
              <Card key={idx} className={`flex flex-col items-center py-4 shadow-md ${step.color} bg-opacity-40`}>
                <div className={`mb-2 w-12 h-12 flex items-center justify-center rounded-full ${step.color} bg-opacity-60`}>{step.icon}</div>
                <h3 className="font-semibold text-base mb-1 text-indigo-600">{step.title}</h3>
                <p className="text-xs text-indigo-400 text-center">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-center text-purple-600">Features</h2>
          <div className="grid grid-cols-1 gap-4">
            {features.map((feature, idx) => (
              <Card key={idx} className={`flex flex-row items-center p-4 shadow-md ${feature.color} bg-opacity-30`}>
                <div className={`mr-4 w-10 h-10 flex items-center justify-center rounded-full ${feature.color} bg-opacity-60`}>{feature.icon}</div>
                <div>
                  <h3 className="font-semibold text-base mb-1 text-indigo-600">{feature.title}</h3>
                  <p className="text-xs text-indigo-400">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <Link to="/login">
            <Button size="lg" className="h-12 px-8 shadow-lg text-lg rounded-full">Try Migo AI Now</Button>
          </Link>
        </div>
      </main>
    </div>
  )
} 