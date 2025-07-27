# Testing Charts with Dummy Data

This guide shows you how to test the chart functionality in your AI chat application.

## 🚀 Quick Start

### 1. Access the Test Page
Navigate to `/chart-test` in your browser to see the dedicated chart testing dashboard.

### 2. Test in Chat Interface
Go to the Chat page (`/chat`) and you'll see test buttons in the welcome screen.

## 📊 Available Test Charts

### Pie Charts
- **Monthly Spending Breakdown** - Shows spending by category
- **Food & Dining Expenses** - Custom food spending analysis

### Bar Charts  
- **Weekly Spending Trend** - 4-week spending comparison
- **Monthly Spending Trend** - 6-month overview

## 🧪 Testing Methods

### Method 1: Chart Test Page (`/chart-test`)
- **Best for**: Visual testing and development
- **Features**: 
  - Interactive chart previews
  - JSON data display
  - Multiple chart configurations
  - Responsive design testing

### Method 2: Chat Interface Test Buttons
- **Best for**: Integration testing
- **Features**:
  - Simulates real AI responses
  - Tests chart rendering in chat flow
  - Validates message parsing

### Method 3: Manual JSON Testing
Copy and paste these JSON examples into chat messages:

#### Pie Chart Example:
```json
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
}
```

#### Bar Chart Example:
```json
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
}
```

## 🔧 Development Testing

### Using the Test Utilities

```typescript
import { simulateAIResponseWithChart, getChartDataOnly } from '@/utils/test-chart-data';

// Get a complete AI response with chart
const response = simulateAIResponseWithChart('pie');

// Get just the chart data
const chartData = getChartDataOnly('bar');
```

### Available Chart Types
- `'pie'` - Basic pie chart
- `'bar'` - Basic bar chart  
- `'customPie'` - Custom pie chart with different data
- `'monthlyBar'` - Monthly comparison bar chart

## 🎯 Testing Scenarios

### 1. Basic Functionality
- [ ] Charts render correctly
- [ ] Colors display properly
- [ ] Tooltips work on hover
- [ ] Responsive design works on mobile

### 2. Data Validation
- [ ] Invalid JSON is handled gracefully
- [ ] Missing required fields show error
- [ ] Empty data arrays are handled
- [ ] Large datasets render properly

### 3. Integration Testing
- [ ] Charts appear in chat messages
- [ ] Multiple charts in one conversation
- [ ] Chart data persists across sessions
- [ ] Real-time updates work

### 4. Performance Testing
- [ ] Charts load quickly
- [ ] Memory usage is reasonable
- [ ] No memory leaks on chart updates
- [ ] Smooth animations

## 🐛 Common Issues & Solutions

### Chart Not Rendering
1. Check browser console for errors
2. Verify JSON format is correct
3. Ensure all required fields are present
4. Check if Recharts is properly installed

### Styling Issues
1. Verify Tailwind CSS is loaded
2. Check chart container dimensions
3. Ensure theme colors are defined
4. Test on different screen sizes

### Performance Issues
1. Limit data points (max 10-15 for pie, 20 for bar)
2. Use appropriate chart types for data size
3. Consider lazy loading for large datasets
4. Monitor memory usage

## 📱 Mobile Testing

Test on various devices:
- iPhone (Safari)
- Android (Chrome)
- iPad (Safari)
- Different screen orientations

## 🔄 Continuous Testing

Add these to your development workflow:
1. Run chart tests before commits
2. Test with different data sizes
3. Verify accessibility features
4. Check cross-browser compatibility

## 📈 Next Steps

Once basic testing is complete:
1. Integrate with real AI responses
2. Add more chart types (line, area, etc.)
3. Implement chart interactions
4. Add export functionality
5. Create chart templates for common use cases 