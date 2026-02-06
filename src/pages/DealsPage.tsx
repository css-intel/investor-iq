import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Building2, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function DealsPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Deals</h1>
            <p className="text-muted-foreground mt-1">Manage and track your investment deals.</p>
          </div>
          <Link to="/deals/new">
            <Button><Plus className="mr-2 h-4 w-4" />New Deal</Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search deals..." 
              className="pl-10"
            />
          </div>
        </div>

        {/* Deals List */}
        <div className="rounded-xl border bg-card">
          <div className="p-6">
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No deals yet</h3>
              <p className="mb-4">Get started by creating your first investment deal.</p>
              <Link to="/deals/new">
                <Button><Plus className="mr-2 h-4 w-4" />Create Your First Deal</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
