"use client";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface ChartProps<DataEntry> {
  data: DataEntry[];
  dataKey: string;
}

export default function Chart<DataEntry>({
  data,
  dataKey,
}: ChartProps<DataEntry>) {
  return (
    <LineChart
      width={500}
      height={800}
      margin={{ left: 100, top: 100 }}
      data={data}
    >
      <XAxis dataKey="key" />
      <Line
        type="monotone"
        name={dataKey}
        dataKey={(entry: any) => {
          const keys = dataKey.split(".");
          let val = entry;
          for (let key of keys) {
            val = val[key];
          }
          return Number(val);
        }}
        stroke="#8884d8"
        dot={false}
      />
      <Legend verticalAlign="top" height={36} />

      <CartesianGrid stroke="#ccc" />
      <XAxis />
      <YAxis />
      <Tooltip />
    </LineChart>
  );
}
