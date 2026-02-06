import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/main-layout';
import { MetricCard } from '@/components/ui/metric-card';
import { Button } from '@/components/ui/button';
import { Building2, DollarSign, TrendingUp, Target, Plus, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's your portfolio overview.</p>
          </div>
          <Link to="/deals/new">
            <Button><Plus className="mr-2 h-4 w-4" />New Deal</Button>
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Active Deals" value="12" icon={<Building2 className="h-5 w-5" />} trend="up" trendValue="+3 this month" />
          <MetricCard title="Total Portfolio Value" value="$4.2M" icon={<DollarSign className="h-5 w-5" />} trend="up" trendValue="+12.5%" />
          <MetricCard title="Average DSCR" value="1.42" icon={<Target className="h-5 w-5" />} subtitle="Above 1.25 threshold" />
          <MetricCard title="Average Cap Rate" value="7.2%" icon={<TrendingUp className="h-5 w-5" />} trend="up" trendValue="+0.5%" />
        </div>

        {/* Recent Deals Section */}
        <div className="rounded-xl border bg-card">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold">Recent Deals</h2>
            <Link to="/deals" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all<ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="p-6">
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No deals yet. Create your first deal to get started.</p>
              <Link to="/deals/new">
                <Button className="mt-4" variant="outline"><Plus className="mr-2 h-4 w-4" />Create Deal</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
