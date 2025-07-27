import { ChartData, PieChartData, BarChartData, ChartDataPoint } from '@/types/chart';

/**
 * Parses chart data from AI response text
 * Expected format: JSON object with chart data
 */
export function parseChartData(text: string): ChartData | null {
  try {
    // Look for JSON-like structure in the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate the parsed data
    if (!parsed.type || !parsed.data || !Array.isArray(parsed.data)) {
      return null;
    }
    
    // Validate data points
    const validData = parsed.data.every((item: any) => 
      item.name && typeof item.value === 'number'
    );
    
    if (!validData) return null;
    
    // Return the parsed chart data
    return parsed as ChartData;
  } catch (error) {
    console.error('Failed to parse chart data:', error);
    return null;
  }
}

/**
 * Creates sample chart data for testing
 */
export function createSamplePieChart(): PieChartData {
  return {
    type: 'pie',
    data: [
      { name: 'Groceries', value: 2500, color: '#0088FE' },
      { name: 'Restaurants', value: 1800, color: '#00C49F' },
      { name: 'Transport', value: 1200, color: '#FFBB28' },
      { name: 'Entertainment', value: 800, color: '#FF8042' },
      { name: 'Shopping', value: 600, color: '#8884D8' },
    ],
    config: {
      title: 'Monthly Spending Breakdown',
      subtitle: 'Your expenses by category',
    }
  };
}

export function createSampleBarChart(): BarChartData {
  return {
    type: 'bar',
    data: [
      { name: 'Week 1', value: 1200, color: '#0088FE' },
      { name: 'Week 2', value: 1800, color: '#00C49F' },
      { name: 'Week 3', value: 1400, color: '#FFBB28' },
      { name: 'Week 4', value: 2100, color: '#FF8042' },
    ],
    config: {
      title: 'Weekly Spending Trend',
      subtitle: 'Your spending over the last 4 weeks',
    },
    xAxisLabel: 'Week',
    yAxisLabel: 'Amount (₹)'
  };
}

/**
 * Validates chart data structure
 */
export function validateChartData(data: any): data is ChartData {
  if (!data || typeof data !== 'object') return false;
  if (!data.type || !['pie', 'bar'].includes(data.type)) return false;
  if (!data.data || !Array.isArray(data.data)) return false;
  
  return data.data.every((item: any) => 
    item && 
    typeof item === 'object' && 
    typeof item.name === 'string' && 
    typeof item.value === 'number'
  );
} 