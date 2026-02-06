import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/ui/metric-card';
import { 
  Search, TrendingUp, Home, DollarSign, Users, Building2, 
  MapPin, ArrowUp, ArrowDown, Minus
} from 'lucide-react';

// Mock market data - in production this would come from an API
const mockMarketData: Record<string, {
  zipCode: string;
  city: string;
  state: string;
  medianHomePrice: number;
  medianRent: number;
  avgCapRate: number;
  populationGrowth: number;
  employmentGrowth: number;
  rentGrowth: number;
  priceGrowth: number;
  daysOnMarket: number;
  inventoryLevel: number;
}> = {
  '33131': {
    zipCode: '33131',
    city: 'Miami',
    state: 'FL',
    medianHomePrice: 650000,
    medianRent: 3200,
    avgCapRate: 5.9,
    populationGrowth: 2.1,
    employmentGrowth: 3.4,
    rentGrowth: 8.2,
    priceGrowth: 12.5,
    daysOnMarket: 28,
    inventoryLevel: 2.3,
  },
  '85281': {
    zipCode: '85281',
    city: 'Tempe',
    state: 'AZ',
    medianHomePrice: 420000,
    medianRent: 2100,
    avgCapRate: 6.0,
    populationGrowth: 1.8,
    employmentGrowth: 2.9,
    rentGrowth: 6.5,
    priceGrowth: 9.2,
    daysOnMarket: 35,
    inventoryLevel: 2.8,
  },
  '30301': {
    zipCode: '30301',
    city: 'Atlanta',
    state: 'GA',
    medianHomePrice: 380000,
    medianRent: 1950,
    avgCapRate: 6.2,
    populationGrowth: 1.5,
    employmentGrowth: 2.6,
    rentGrowth: 5.8,
    priceGrowth: 7.4,
    daysOnMarket: 32,
    inventoryLevel: 3.1,
  },
};

export default function MarketDataPage() {
  const [searchZip, setSearchZip] = useState('');
  const [selectedMarket, setSelectedMarket] = useState<typeof mockMarketData['33131'] | null>(null);

  const handleSearch = () => {
    const data = mockMarketData[searchZip];
    if (data) {
      setSelectedMarket(data);
    } else {
      // Show default Miami data for demo
      setSelectedMarket(mockMarketData['33131']);
    }
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (value < 0) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getMarketCondition = (daysOnMarket: number, inventoryLevel: number) => {
    if (daysOnMarket < 30 && inventoryLevel < 3) return { label: "Seller's Market", color: 'text-orange-500' };
    if (daysOnMarket > 45 || inventoryLevel > 5) return { label: "Buyer's Market", color: 'text-green-500' };
    return { label: 'Balanced Market', color: 'text-blue-500' };
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Market Data</h1>
          <p className="text-muted-foreground mt-1">Research local market conditions and investment metrics by ZIP code</p>
        </div>

        {/* Search */}
        <div className="bg-card rounded-xl border p-6">
          <div className="flex gap-4 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter ZIP code (try 33131, 85281, 30301)"
                value={searchZip}
                onChange={(e) => setSearchZip(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9"
              />
            </div>
            <Button onClick={handleSearch}>
              <MapPin className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        {/* Quick Markets */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Popular Markets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(mockMarketData).map((market) => (
              <button
                key={market.zipCode}
                onClick={() => setSelectedMarket(market)}
                className={`p-4 rounded-xl border text-left transition-colors hover:border-primary ${
                  selectedMarket?.zipCode === market.zipCode ? 'border-primary bg-primary/5' : 'bg-card'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{market.city}, {market.state}</p>
                    <p className="text-sm text-muted-foreground">{market.zipCode}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Avg Cap Rate</span>
                  <span className="font-medium text-green-500">{market.avgCapRate}%</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Market Details */}
        {selectedMarket && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedMarket.city}, {selectedMarket.state}</h2>
                  <p className="text-muted-foreground">ZIP Code: {selectedMarket.zipCode}</p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full font-medium ${
                getMarketCondition(selectedMarket.daysOnMarket, selectedMarket.inventoryLevel).color
              } bg-muted`}>
                {getMarketCondition(selectedMarket.daysOnMarket, selectedMarket.inventoryLevel).label}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                title="Median Home Price"
                value={`$${selectedMarket.medianHomePrice.toLocaleString()}`}
                icon={<Home className="h-5 w-5" />}
                subtitle={`${selectedMarket.priceGrowth > 0 ? '+' : ''}${selectedMarket.priceGrowth}% YoY`}
                trend={selectedMarket.priceGrowth > 0 ? 'up' : 'down'}
              />
              <MetricCard
                title="Median Rent"
                value={`$${selectedMarket.medianRent.toLocaleString()}`}
                icon={<DollarSign className="h-5 w-5" />}
                subtitle={`${selectedMarket.rentGrowth > 0 ? '+' : ''}${selectedMarket.rentGrowth}% YoY`}
                trend={selectedMarket.rentGrowth > 0 ? 'up' : 'down'}
              />
              <MetricCard
                title="Avg Cap Rate"
                value={`${selectedMarket.avgCapRate}%`}
                icon={<TrendingUp className="h-5 w-5" />}
                subtitle="Market Average"
              />
              <MetricCard
                title="Days on Market"
                value={selectedMarket.daysOnMarket.toString()}
                icon={<Building2 className="h-5 w-5" />}
                subtitle={selectedMarket.daysOnMarket < 30 ? 'Fast Moving' : 'Normal Pace'}
              />
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Growth Metrics */}
              <div className="bg-card rounded-xl border p-6">
                <h3 className="text-lg font-semibold mb-4">Growth Trends</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      {getTrendIcon(selectedMarket.populationGrowth)}
                      <span>Population Growth</span>
                    </div>
                    <span className={`font-semibold ${selectedMarket.populationGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {selectedMarket.populationGrowth > 0 ? '+' : ''}{selectedMarket.populationGrowth}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      {getTrendIcon(selectedMarket.employmentGrowth)}
                      <span>Employment Growth</span>
                    </div>
                    <span className={`font-semibold ${selectedMarket.employmentGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {selectedMarket.employmentGrowth > 0 ? '+' : ''}{selectedMarket.employmentGrowth}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      {getTrendIcon(selectedMarket.rentGrowth)}
                      <span>Rent Growth (YoY)</span>
                    </div>
                    <span className={`font-semibold ${selectedMarket.rentGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {selectedMarket.rentGrowth > 0 ? '+' : ''}{selectedMarket.rentGrowth}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      {getTrendIcon(selectedMarket.priceGrowth)}
                      <span>Price Growth (YoY)</span>
                    </div>
                    <span className={`font-semibold ${selectedMarket.priceGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {selectedMarket.priceGrowth > 0 ? '+' : ''}{selectedMarket.priceGrowth}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Investment Analysis */}
              <div className="bg-card rounded-xl border p-6">
                <h3 className="text-lg font-semibold mb-4">Investment Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Gross Rent Multiplier</span>
                      <span className="font-semibold">
                        {(selectedMarket.medianHomePrice / (selectedMarket.medianRent * 12)).toFixed(1)}x
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${Math.min((selectedMarket.medianHomePrice / (selectedMarket.medianRent * 12)) / 20 * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Price-to-Rent Ratio</span>
                      <span className="font-semibold">
                        {(selectedMarket.medianHomePrice / selectedMarket.medianRent).toFixed(0)}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${Math.min((selectedMarket.medianHomePrice / selectedMarket.medianRent) / 300 * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Inventory (Months of Supply)</span>
                      <span className="font-semibold">{selectedMarket.inventoryLevel} months</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-orange-500"
                        style={{ width: `${Math.min(selectedMarket.inventoryLevel / 6 * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      <strong>Analysis:</strong> {selectedMarket.avgCapRate >= 6 
                        ? 'This market shows strong cap rates suitable for cash flow investors.'
                        : selectedMarket.priceGrowth > 10 
                        ? 'Appreciation market - better suited for long-term wealth building.'
                        : 'Balanced market with moderate returns on both cash flow and appreciation.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedMarket && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Search for Market Data</h3>
            <p className="text-muted-foreground">Enter a ZIP code or select a popular market above to view detailed analytics</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
