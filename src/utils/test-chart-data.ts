import { ChartData } from '@/types/chart';

/**
 * Test data for simulating AI responses with charts
 */
export const testChartResponses = {
  // Simple pie chart response
  pieChartResponse: `Here's your spending breakdown for this month:

Your total spending was ₹6,900. The largest category is groceries at ₹2,500, followed by restaurants at ₹1,800.

{
  "type": "pie",
  "data": [
    { "name": "Groceries", "value": 2500, "color": "#0088FE" },
    { "name": "Restaurants", "value": 1800, "color": "#00C49F" },
    { "name": "Transport", "value": 1200, "color": "#FFBB28" },
    { "name": "Entertainment", "value": 800, "color": "#FF8042" },
    { "name": "Shopping", "value": 600, "color": "#8884D8" }
  ],
  "config": {
    "title": "Monthly Spending Breakdown",
    "subtitle": "Your expenses by category"
  }
}`,

  // Example with JSON only (will show default message)
  jsonOnlyResponse: `{
  "type": "pie",
  "data": [
    { "name": "Category A", "value": 1000, "color": "#FF6B6B" },
    { "name": "Category B", "value": 800, "color": "#4ECDC4" },
    { "name": "Category C", "value": 600, "color": "#45B7D1" }
  ],
  "config": {
    "title": "Sample Data",
    "subtitle": "Example chart"
  }
}`,

  // Example with JSON in code block (will show default message)
  jsonCodeBlockResponse: `Here's your data:

\`\`\`json
{
  "type": "pie",
  "data": [
    { "name": "Category A", "value": 1000, "color": "#FF6B6B" },
    { "name": "Category B", "value": 800, "color": "#4ECDC4" },
    { "name": "Category C", "value": 600, "color": "#45B7D1" }
  ],
  "config": {
    "title": "Sample Data",
    "subtitle": "Example chart"
  }
}
\`\`\``,

  // Bar chart response
  barChartResponse: `Here's your weekly spending trend:

You spent the most in Week 4 (₹2,100) and the least in Week 1 (₹1,200).

{
  "type": "bar",
  "data": [
    { "name": "Week 1", "value": 1200, "color": "#0088FE" },
    { "name": "Week 2", "value": 1800, "color": "#00C49F" },
    { "name": "Week 3", "value": 1400, "color": "#FFBB28" },
    { "name": "Week 4", "value": 2100, "color": "#FF8042" }
  ],
  "config": {
    "title": "Weekly Spending Trend",
    "subtitle": "Your spending over the last 4 weeks"
  },
  "xAxisLabel": "Week",
  "yAxisLabel": "Amount (₹)"
}`,

  // Custom pie chart with different data
  customPieResponse: `Your food spending analysis:

You spend the most on restaurants and cafes, followed by grocery shopping.

{
  "type": "pie",
  "data": [
    { "name": "Restaurants", "value": 3500, "color": "#FF6B6B" },
    { "name": "Grocery Stores", "value": 2800, "color": "#4ECDC4" },
    { "name": "Coffee Shops", "value": 1200, "color": "#45B7D1" },
    { "name": "Food Delivery", "value": 900, "color": "#96CEB4" },
    { "name": "Snacks", "value": 600, "color": "#FFEAA7" }
  ],
  "config": {
    "title": "Food & Dining Expenses",
    "subtitle": "Breakdown of your food-related spending"
  }
}`,

  // Monthly comparison bar chart
  monthlyBarResponse: `Your monthly spending comparison:

June had the highest spending at ₹2,800, while January was the lowest at ₹1,500.

{
  "type": "bar",
  "data": [
    { "name": "Jan", "value": 1500, "color": "#FF6B6B" },
    { "name": "Feb", "value": 2100, "color": "#4ECDC4" },
    { "name": "Mar", "value": 1800, "color": "#45B7D1" },
    { "name": "Apr", "value": 2400, "color": "#96CEB4" },
    { "name": "May", "value": 1900, "color": "#FFEAA7" },
    { "name": "Jun", "value": 2800, "color": "#DDA0DD" }
  ],
  "config": {
    "title": "Monthly Spending Trend",
    "subtitle": "Last 6 months overview"
  },
  "xAxisLabel": "Month",
  "yAxisLabel": "Amount (₹)"
}`
};

/**
 * Function to simulate AI response with chart data
 * Use this in your chat testing
 */
export function simulateAIResponseWithChart(chartType: 'pie' | 'bar' | 'customPie' | 'monthlyBar' | 'jsonOnly' | 'jsonCodeBlock'): string {
  switch (chartType) {
    case 'pie':
      return testChartResponses.pieChartResponse;
    case 'bar':
      return testChartResponses.barChartResponse;
    case 'customPie':
      return testChartResponses.customPieResponse;
    case 'monthlyBar':
      return testChartResponses.monthlyBarResponse;
    case 'jsonOnly':
      return testChartResponses.jsonOnlyResponse;
    case 'jsonCodeBlock':
      return testChartResponses.jsonCodeBlockResponse;
    default:
      return testChartResponses.pieChartResponse;
  }
}

/**
 * Get just the JSON data without the text
 */
export function getChartDataOnly(chartType: 'pie' | 'bar' | 'customPie' | 'monthlyBar' | 'jsonOnly' | 'jsonCodeBlock'): ChartData {
  const responses = {
    pie: {
      type: 'pie' as const,
      data: [
        { name: 'Groceries', value: 2500, color: '#0088FE' },
        { name: 'Restaurants', value: 1800, color: '#00C49F' },
        { name: 'Transport', value: 1200, color: '#FFBB28' },
        { name: 'Entertainment', value: 800, color: '#FF8042' },
        { name: 'Shopping', value: 600, color: '#8884D8' }
      ],
      config: {
        title: 'Monthly Spending Breakdown',
        subtitle: 'Your expenses by category'
      }
    },
    bar: {
      type: 'bar' as const,
      data: [
        { name: 'Week 1', value: 1200, color: '#0088FE' },
        { name: 'Week 2', value: 1800, color: '#00C49F' },
        { name: 'Week 3', value: 1400, color: '#FFBB28' },
        { name: 'Week 4', value: 2100, color: '#FF8042' }
      ],
      config: {
        title: 'Weekly Spending Trend',
        subtitle: 'Your spending over the last 4 weeks'
      },
      xAxisLabel: 'Week',
      yAxisLabel: 'Amount (₹)'
    },
    customPie: {
      type: 'pie' as const,
      data: [
        { name: 'Restaurants', value: 3500, color: '#FF6B6B' },
        { name: 'Grocery Stores', value: 2800, color: '#4ECDC4' },
        { name: 'Coffee Shops', value: 1200, color: '#45B7D1' },
        { name: 'Food Delivery', value: 900, color: '#96CEB4' },
        { name: 'Snacks', value: 600, color: '#FFEAA7' }
      ],
      config: {
        title: 'Food & Dining Expenses',
        subtitle: 'Breakdown of your food-related spending'
      }
    },
    monthlyBar: {
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
    jsonOnly: {
      type: 'pie' as const,
      data: [
        { name: 'Category A', value: 1000, color: '#FF6B6B' },
        { name: 'Category B', value: 800, color: '#4ECDC4' },
        { name: 'Category C', value: 600, color: '#45B7D1' }
      ],
      config: {
        title: 'Sample Data',
        subtitle: 'Example chart'
      }
    },
    jsonCodeBlock: {
      type: 'pie' as const,
      data: [
        { name: 'Category A', value: 1000, color: '#FF6B6B' },
        { name: 'Category B', value: 800, color: '#4ECDC4' },
        { name: 'Category C', value: 600, color: '#45B7D1' }
      ],
      config: {
        title: 'Sample Data',
        subtitle: 'Example chart'
      }
    }
  };

  return responses[chartType];
} 