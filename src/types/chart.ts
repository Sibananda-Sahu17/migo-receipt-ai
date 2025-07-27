export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface ChartConfig {
  title?: string;
  subtitle?: string;
  height?: number;
  width?: number;
}

export interface PieChartData {
  type: 'pie';
  data: ChartDataPoint[];
  config?: ChartConfig;
}

export interface BarChartData {
  type: 'bar';
  data: ChartDataPoint[];
  config?: ChartConfig;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export type ChartData = PieChartData | BarChartData;

export interface ChatMessageWithChart {
  id: string;
  role: 'user' | 'ai';
  content: string;
  created_at: string;
  chartData?: ChartData;
} 