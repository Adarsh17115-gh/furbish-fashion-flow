
import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  TooltipProps 
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchAllOrders } from '@/lib/api';
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek, eachWeekOfInterval, 
  startOfMonth, endOfMonth, eachMonthOfInterval, subMonths, formatISO, parseISO } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface RevenueChartProps {
  timeframe: 'daily' | 'weekly' | 'monthly';
}

export const RevenueChart = ({ timeframe }: RevenueChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: fetchAllOrders,
  });
  
  useEffect(() => {
    if (!orders) return;
    
    let data: { date: string; revenue: number }[] = [];
    const now = new Date();
    
    // Generate data points based on selected timeframe
    if (timeframe === 'daily') {
      // Get last 14 days
      const start = subDays(now, 13);
      const days = eachDayOfInterval({ start, end: now });
      
      data = days.map(day => {
        const dayStr = formatISO(day, { representation: 'date' });
        const dayRevenue = orders
          .filter(order => {
            const orderDate = parseISO(order.created_at);
            return formatISO(orderDate, { representation: 'date' }) === dayStr;
          })
          .reduce((sum, order) => sum + order.total_amount, 0);
          
        return {
          date: format(day, 'MMM dd'),
          revenue: dayRevenue
        };
      });
    } else if (timeframe === 'weekly') {
      // Get last 10 weeks
      const start = startOfWeek(subDays(now, 70));
      const end = endOfWeek(now);
      const weeks = eachWeekOfInterval({ start, end });
      
      data = weeks.map(weekStart => {
        const weekEnd = endOfWeek(weekStart);
        const weekRevenue = orders
          .filter(order => {
            const orderDate = parseISO(order.created_at);
            return orderDate >= weekStart && orderDate <= weekEnd;
          })
          .reduce((sum, order) => sum + order.total_amount, 0);
          
        return {
          date: `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd')}`,
          revenue: weekRevenue
        };
      });
    } else {
      // Get last 6 months
      const start = startOfMonth(subMonths(now, 5));
      const end = endOfMonth(now);
      const months = eachMonthOfInterval({ start, end });
      
      data = months.map(month => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        const monthRevenue = orders
          .filter(order => {
            const orderDate = parseISO(order.created_at);
            return orderDate >= monthStart && orderDate <= monthEnd;
          })
          .reduce((sum, order) => sum + order.total_amount, 0);
          
        return {
          date: format(month, 'MMM yyyy'),
          revenue: monthRevenue
        };
      });
    }
    
    setChartData(data);
  }, [orders, timeframe]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
      </div>
    );
  }
  
  return (
    <div className="h-80">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 25, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tickFormatter={(value) => `$${value}`}
              width={80}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value) => [`$${value}`, 'Revenue']}
              labelStyle={{ color: '#333' }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#B76E79" // terracotta color
              strokeWidth={2.5}
              dot={{ r: 4 }}
              activeDot={{ r: 7, stroke: '#F3EEE7', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex justify-center items-center h-full text-muted-foreground">
          No revenue data available for this period
        </div>
      )}
    </div>
  );
};
