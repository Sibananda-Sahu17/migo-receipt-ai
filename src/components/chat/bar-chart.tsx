import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChartData } from '@/types/chart';

interface BarChartProps {
  data: BarChartData;
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#FF7C80', '#A4DE6C', '#D0ED57'
];

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const { data: chartData, config, xAxisLabel, yAxisLabel } = data;
  
  // Create chart config for the UI components
  const chartConfig = chartData.reduce((acc, item, index) => {
    acc[item.name] = {
      label: item.name,
      color: item.color || COLORS[index % COLORS.length],
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        {config?.title && (
          <h3 className="text-lg font-semibold mb-2 text-center">{config.title}</h3>
        )}
        {config?.subtitle && (
          <p className="text-sm text-muted-foreground mb-4 text-center">{config.subtitle}</p>
        )}
        
        <div className="h-64 w-full">
          <ChartContainer config={chartConfig}>
            <RechartsBarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
              />
              <YAxis 
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="#8884d8">
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Bar>
            </RechartsBarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}; 