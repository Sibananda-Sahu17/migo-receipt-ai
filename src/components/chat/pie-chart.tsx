import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChartData } from '@/types/chart';

interface PieChartProps {
  data: PieChartData;
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#FF7C80', '#A4DE6C', '#D0ED57'
];

export const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const { data: chartData, config } = data;
  
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
            <RechartsPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </RechartsPieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}; 