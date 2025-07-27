import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Navigation } from '@/components/layout/navigation';
import { ChartMessage } from '@/components/chat/chart-message';
import { createSamplePieChart, createSampleBarChart } from '@/utils/chart-parser';
import { ChartData } from '@/types/chart';

export default function ChartTest() {
  const [currentChart, setCurrentChart] = useState<ChartData | null>(null);
  const [showJson, setShowJson] = useState(false);

  const pieChartData = createSamplePieChart();
  const barChartData = createSampleBarChart();

  const testCharts = [
    {
      name: 'Pie Chart - Monthly Spending',
      data: pieChartData,
      description: 'Shows spending breakdown by category'
    },
    {
      name: 'Bar Chart - Weekly Trend',
      data: barChartData,
      description: 'Shows spending trend over weeks'
    },
    {
      name: 'Custom Pie Chart',
      data: {
        type: 'pie' as const,
        data: [
          { name: 'Food & Dining', value: 3500, color: '#FF6B6B' },
          { name: 'Transportation', value: 2200, color: '#4ECDC4' },
          { name: 'Shopping', value: 1800, color: '#45B7D1' },
          { name: 'Bills & Utilities', value: 1200, color: '#96CEB4' },
          { name: 'Entertainment', value: 800, color: '#FFEAA7' }
        ],
        config: {
          title: 'Custom Spending Analysis',
          subtitle: 'Personal expense breakdown'
        }
      },
      description: 'Custom data with different colors'
    },
    {
      name: 'Custom Bar Chart',
      data: {
        type: 'bar' as const,
        data: [
          { name: 'Jan', value: 1500, color: '#FF6B6B' },
          { name: 'Feb', value: 2100, color: '#4ECDC4' },
          { name: 'Mar', value: 1800, color: '#45B7D1' },
          { name: 'Apr', value: 2400, color: '#96CEB4' },
          { name: 'May', value: 1900, color: '#FFEAA7' },
          { name: 'Jun', value: 2800, color: '#DDA0DD' }
        ],
        config: {
          title: 'Monthly Spending Trend',
          subtitle: 'Last 6 months overview'
        },
        xAxisLabel: 'Month',
        yAxisLabel: 'Amount (₹)'
      },
      description: 'Monthly spending comparison'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header title="Chart Testing" showProfile={false} showHamburger={false} />
      
      <div className="px-4 pt-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chart Testing Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Test different chart types and configurations. Click on any chart to view it in detail.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {testCharts.map((chart, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{chart.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{chart.description}</p>
                      <Button 
                        onClick={() => setCurrentChart(chart.data)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        View Chart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowJson(!showJson)}
                  variant="outline"
                >
                  {showJson ? 'Hide' : 'Show'} JSON Data
                </Button>
                <Button 
                  onClick={() => setCurrentChart(null)}
                  variant="outline"
                >
                  Clear Chart
                </Button>
              </div>
            </CardContent>
          </Card>

          {currentChart && (
            <Card>
              <CardHeader>
                <CardTitle>Chart Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <ChartMessage chartData={currentChart} />
                </div>
                
                {showJson && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">JSON Data:</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(currentChart, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>How to Use in Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. AI Response Format:</h4>
                  <div className="bg-muted p-3 rounded text-sm font-mono">
                    <pre>{`Here's your spending analysis:

Your total spending this month was ₹6,900.

{
  "type": "pie",
  "data": [
    { "name": "Groceries", "value": 2500, "color": "#0088FE" },
    { "name": "Restaurants", "value": 1800, "color": "#00C49F" },
    { "name": "Transport", "value": 1200, "color": "#FFBB28" }
  ],
  "config": {
    "title": "Monthly Spending Breakdown",
    "subtitle": "Your expenses by category"
  }
}`}</pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. Quick Test in Chat:</h4>
                  <p className="text-sm text-muted-foreground">
                    Copy any of the JSON examples above and paste them into a chat message to test the chart rendering.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">3. Available Chart Types:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Pie Chart:</strong> For showing proportions and percentages</li>
                    <li>• <strong>Bar Chart:</strong> For comparing values across categories</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Navigation />
    </div>
  );
} 