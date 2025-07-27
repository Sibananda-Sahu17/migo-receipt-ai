import React from 'react';
import { PieChart } from './pie-chart';
import { BarChart } from './bar-chart';
import { ChartData } from '@/types/chart';

interface ChartMessageProps {
  chartData: ChartData;
}

export const ChartMessage: React.FC<ChartMessageProps> = ({ chartData }) => {
  if (chartData.type === 'pie') {
    return <PieChart data={chartData} />;
  } else if (chartData.type === 'bar') {
    return <BarChart data={chartData} />;
  } else {
    return (
      <div className="text-sm text-muted-foreground">
        Unsupported chart type: {(chartData as any).type}
      </div>
    );
  }
}; 