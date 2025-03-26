import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Define a color mapping for specific data keys
const COLOR_MAP = {
  Open: "#FF76CE",
  Assigned: "#00C49F", // Green
  Closed: "#FFBB28", // Yellow
  Canceled: "#FF0000", // Crimson
};

const TicketStatusPieChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {data?.map((entry, index) => (
            // Use the COLOR_MAP to get the color for each entry based on the name
            <Cell
              key={`cell-${index}`}
              fill={COLOR_MAP[entry.name] || "#8884d8"}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TicketStatusPieChart;
