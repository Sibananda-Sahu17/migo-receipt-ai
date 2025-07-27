# Chart Data Format for AI Chat Integration

This document describes the data format that the AI should use when it wants to display charts in chat responses.

## Overview

When the AI wants to show a chart (pie chart or bar chart) in a chat message, it should include JSON data in a specific format. The chat interface will automatically detect this JSON and render the appropriate chart component.

## Data Format

### Basic Structure

```json
{
  "type": "pie" | "bar",j8juioi
  "data": [
    {
      "name": "Category Name",
      "value": 100,
      "color": "#0088FE" // optional
    }
  ],
  "config": {
    "title": "Chart Title",
    "subtitle": "Chart Subtitle"
  }
}
```

### Pie Chart Example

```json
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
}
```

### Bar Chart Example

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

## Field Descriptions

### Required Fields

- **type**: Must be either `"pie"` or `"bar"`
- **data**: Array of data points, each containing:
  - **name**: String representing the category or label
  - **value**: Numeric value for the data point

### Optional Fields

- **color**: Hex color code for individual data points (if not provided, default colors will be used)
- **config**: Object containing chart configuration:
  - **title**: Main chart title
  - **subtitle**: Secondary subtitle text
- **xAxisLabel**: Label for X-axis (bar charts only)
- **yAxisLabel**: Label for Y-axis (bar charts only)

## Integration with AI Responses

### Example AI Response with Chart

```
Here's your spending breakdown for this month:

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
}
```

### Parsing Logic

The chat interface will:
1. Look for JSON objects in the AI response text
2. Validate the JSON structure against the expected format
3. If valid, render the appropriate chart component below the text message
4. If invalid, display only the text message

## Best Practices

1. **Always include descriptive text** before the chart JSON to provide context
2. **Use meaningful titles and subtitles** to help users understand the chart
3. **Choose appropriate chart types**:
   - Use pie charts for showing proportions/percentages
   - Use bar charts for comparing values across categories
4. **Provide reasonable color schemes** or let the system use defaults
5. **Keep data points manageable** (recommend 5-10 for pie charts, 10-15 for bar charts)

## Error Handling

If the JSON format is invalid or missing required fields, the chart will not be rendered and only the text message will be displayed. The system will log parsing errors for debugging purposes.

## Testing

You can test chart rendering by:
1. Using the `ChartDemo` component in the development environment
2. Sending test messages with valid JSON data through the chat interface
3. Using the sample data functions in `src/utils/chart-parser.ts` 