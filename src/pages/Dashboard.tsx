import { DollarSign, TrendingUp, Receipt, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Navigation } from "@/components/layout/navigation"

export default function Dashboard() {
  const stats = [
    {
      title: "Total Spent",
      value: "₹45,231",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-primary",
    },
    {
      title: "This Month",
      value: "₹8,921",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-success",
    },
    {
      title: "Receipts",
      value: "127",
      change: "+8 new",
      icon: Receipt,
      color: "text-warning",
    },
    {
      title: "Split Bills",
      value: "23",
      change: "₹4,567",
      icon: Users,
      color: "text-accent",
    },
  ]

  const recentTransactions = [
    { name: "Grocery Store", amount: "₹2,341", date: "Today", category: "Groceries" },
    { name: "Restaurant", amount: "₹1,245", date: "Yesterday", category: "Food" },
    { name: "Gas Station", amount: "₹890", date: "2 days ago", category: "Transport" },
    { name: "Coffee Shop", amount: "₹145", date: "3 days ago", category: "Food" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header title="Dashboard" userName="Amit" />
      
      <div className="px-4 pt-4 pb-20">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                    <span className="text-xs text-success font-medium">{stat.change}</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Spending Insights */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Spending Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Groceries</span>
                <span className="text-sm text-muted-foreground">45%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Food & Dining</span>
                <span className="text-sm text-muted-foreground">30%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-accent h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Transport</span>
                <span className="text-sm text-muted-foreground">15%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-warning h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{transaction.name}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date} • {transaction.category}</p>
                  </div>
                  <span className="font-semibold">{transaction.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  )
}