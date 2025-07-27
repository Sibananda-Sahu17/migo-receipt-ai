import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartMessage } from './chart-message';
import { createSamplePieChart, createSampleBarChart } from '@/utils/chart-parser';

export const ChartDemo: React.FC = () => {
  const [currentChart, setCurrentChart] = React.useState<'pie' | 'bar' | null>(null);

  const pieChartData = createSamplePieChart();
  const barChartData = createSampleBarChart();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Chart Data Format Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Data Format for AI Responses:</h3>
            <p className="text-sm text-muted-foreground mb-4">
              When the AI wants to display a chart, it should include JSON data in this format:
            </p>
            
            <div className="bg-muted p-4 rounded-lg text-sm font-mono">
              <pre>{`{
  "type": "pie" | "bar",
  "data": [
    { "name": "Category", "value": 100, "color": "#0088FE" }
  ],
  "config": {
    "title": "Chart Title",
    "subtitle": "Chart Subtitle"
  }
}`}</pre>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => setCurrentChart('pie')}
              variant={currentChart === 'pie' ? 'default' : 'outline'}
            >
              Show Pie Chart
            </Button>
            <Button 
              onClick={() => setCurrentChart('bar')}
              variant={currentChart === 'bar' ? 'default' : 'outline'}
            >
              Show Bar Chart
            </Button>
            <Button 
              onClick={() => setCurrentChart(null)}
              variant="outline"
            >
              Hide Chart
            </Button>
          </div>

          {currentChart && (
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">
                {currentChart === 'pie' ? 'Pie Chart' : 'Bar Chart'} Example:
              </h4>
              <ChartMessage 
                chartData={currentChart === 'pie' ? pieChartData : barChartData} 
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sample JSON for AI Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Pie Chart JSON:</h4>
              <div className="bg-muted p-3 rounded text-xs font-mono overflow-x-auto">
                <pre>{JSON.stringify(pieChartData, null, 2)}</pre>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Bar Chart JSON:</h4>
              <div className="bg-muted p-3 rounded text-xs font-mono overflow-x-auto">
                <pre>{JSON.stringify(barChartData, null, 2)}</pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 