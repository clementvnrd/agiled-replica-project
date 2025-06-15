import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { PeriodFilter, PeriodType } from '@/components/ui/period-filter';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';

interface InteractiveChartProps {
  title: string;
  data: Array<any>;
  dataKey: string;
  color?: string;
  category?: string;
  className?: string;
}

const InteractiveChart: React.FC<InteractiveChartProps> = ({ 
  title, 
  data, 
  dataKey,
  color = "#2563eb",
  category,
  className
}) => {
  const [period, setPeriod] = useState<PeriodType>("30d");
  const [chartType, setChartType] = useState<"area" | "bar" | "line">("area");

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey={dataKey} fill={color} />
          </BarChart>
        );
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} />
          </LineChart>
        );
      default:
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              fillOpacity={1} 
              fill={`url(#color-${dataKey})`} 
            />
          </AreaChart>
        );
    }
  };

  const chartTypeIcons = {
    area: <TrendingUp className="h-4 w-4" />,
    bar: <BarChart3 className="h-4 w-4" />,
    line: <PieChart className="h-4 w-4" />
  };

  return (
    <EnhancedCard
      className={className}
      title={title}
      subtitle={category}
      hover
      actions={
        <div className="flex items-center gap-2">
          <PeriodFilter value={period} onChange={setPeriod} />
          <div className="flex gap-1">
            {(Object.keys(chartTypeIcons) as Array<keyof typeof chartTypeIcons>).map((type) => (
              <Button
                key={type}
                variant={chartType === type ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setChartType(type)}
              >
                {chartTypeIcons[type]}
              </Button>
            ))}
          </div>
        </div>
      }
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </EnhancedCard>
  );
};

export default InteractiveChart;
