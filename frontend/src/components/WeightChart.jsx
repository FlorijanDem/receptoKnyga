`use client`;
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const WeightChart = () => {
  const data = [
    {
      name: "Jan",
      weight: 80,
    },
    {
      name: "Feb",
      weight: 78,
    },
    {
      name: "Mar",
      weight: 79,
    },
    {
      name: "Apr",
      weight: 82,
    },
    {
      name: "May",
      weight: 85,
    },
    {
      name: "Jun",
      weight: 84,
    },
    {
      name: "Jul",
      weight: 85,
    },
    {
      name: "Aug",
      weight: 88,
    },
    {
      name: "Sep",
      weight: 86,
    },
    {
      name: "Oct",
      weight: 89,
    },
    {
      name: "Nov",
      weight: 90,
    },
    {
      name: "Dec",
      weight: 91,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis type="number" p />
        <Tooltip />
        <Legend />

        <Line type="monotone" dataKey="weight" stroke="#8979FF" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeightChart;
