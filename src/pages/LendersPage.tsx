import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, Search, Plus, Building2,
  Phone, Mail, Globe, Star, Check
} from 'lucide-react';

// Mock lender data
const mockLenders = [
  {
    id: '1',
    name: 'First National Bank',
    type: 'Traditional Bank',
    minDSCR: 1.25,
    maxLTV: 75,
    minLoanAmount: 100000,
    maxLoanAmount: 5000000,
    interestRateRange: '6.5% - 8.0%',
    loanTerms: [15, 20, 25, 30],
    propertyTypes: ['Single Family', 'Multi-Family', 'Commercial'],
    contactName: 'Sarah Johnson',
    contactEmail: 'sjohnson@fnb.com',
    contactPhone: '(555) 123-4567',
    website: 'www.firstnationalbank.com',
    rating: 4.8,
    responseTime: '24-48 hours',
    specialties: ['Investment Properties', 'Portfolio Loans'],
  },
  {
    id: '2',
    name: 'Velocity Capital',
    type: 'Private Lender',
    minDSCR: 1.0,
    maxLTV: 80,
    minLoanAmount: 75000,
    maxLoanAmount: 2000000,
    interestRateRange: '8.0% - 12.0%',
    loanTerms: [12, 24, 36],
    propertyTypes: ['Single Family', 'Multi-Family', 'Fix & Flip'],
    contactName: 'Michael Chen',
    contactEmail: 'mchen@velocitycap.com',
    contactPhone: '(555) 234-5678',
    website: 'www.velocitycapital.com',
    rating: 4.5,
    responseTime: '24 hours',
    specialties: ['Bridge Loans', 'DSCR Loans', 'Fast Closing'],
  },
  {
    id: '3',
    name: 'Metro Credit Union',
    type: 'Credit Union',
    minDSCR: 1.2,
    maxLTV: 80,
    minLoanAmount: 50000,
    maxLoanAmount: 1500000,
    interestRateRange: '6.0% - 7.5%',
    loanTerms: [15, 20, 30],
    propertyTypes: ['Single Family', 'Condo', 'Townhouse'],
    contactName: 'Lisa Martinez',
    contactEmail: 'lmartinez@metrocu.org',
    contactPhone: '(555) 345-6789',
    website: 'www.metrocreditunion.org',
    rating: 4.7,
    responseTime: '48-72 hours',
    specialties: ['First-Time Investors', 'Local Properties'],
  },
  {
    id: '4',
    name: 'Apex DSCR Lending',
    type: 'DSCR Specialist',
    minDSCR: 0.75,
    maxLTV: 85,
    minLoanAmount: 100000,
    maxLoanAmount: 3000000,
    interestRateRange: '7.5% - 10.0%',
    loanTerms: [5, 7, 10, 30],
    propertyTypes: ['Single Family', 'Multi-Family', '2-4 Units'],
    contactName: 'David Park',
    contactEmail: 'dpark@apexdscr.com',
    contactPhone: '(555) 456-7890',
    website: 'www.apexdscrlending.com',
    rating: 4.6,
    responseTime: '12-24 hours',
    specialties: ['No Income Verification', 'Entity Lending', 'Unlimited Properties'],
  },
];

export default function LendersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLender, setSelectedLender] = useState<typeof mockLenders[0] | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  const filteredLenders = mockLenders.filter(lender => {
    const matchesSearch = lender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lender.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || lender.type === filterType;
    return matchesSearch && matchesType;
  });

  const lenderTypes = [...new Set(mockLenders.map(l => l.type))];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Lenders</h1>
            <p className="text-muted-foreground mt-1">Manage your lender relationships and find financing</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Lender
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search lenders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType(null)}
            >
              All
            </Button>
            {lenderTypes.map(type => (
              <Button
                key={type}
                variant={filterType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lender List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredLenders.map((lender) => (
              <div
                key={lender.id}
                className={`bg-card rounded-xl border p-6 cursor-pointer transition-all hover:border-primary ${
                  selectedLender?.id === lender.id ? 'border-primary ring-2 ring-primary/20' : ''
                }`}
                onClick={() => setSelectedLender(lender)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{lender.name}</h3>
                      <p className="text-sm text-muted-foreground">{lender.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{lender.rating}</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Min DSCR</p>
                    <p className="font-semibold">{lender.minDSCR}x</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Max LTV</p>
                    <p className="font-semibold">{lender.maxLTV}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Loan Range</p>
                    <p className="font-semibold text-sm">
                      ${(lender.minLoanAmount / 1000)}K - ${(lender.maxLoanAmount / 1000000)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Rate Range</p>
                    <p className="font-semibold text-sm">{lender.interestRateRange}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {lender.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Lender Detail Panel */}
          <div className="lg:col-span-1">
            {selectedLender ? (
              <div className="bg-card rounded-xl border p-6 sticky top-4 space-y-6">
                <div className="text-center">
                  <div className="h-16 w-16 rounded-xl bg-primary mx-auto flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h2 className="mt-3 text-xl font-bold">{selectedLender.name}</h2>
                  <p className="text-muted-foreground">{selectedLender.type}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{selectedLender.rating}</span>
                    <span className="text-muted-foreground text-sm">• {selectedLender.responseTime}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Lending Criteria</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 rounded bg-muted/50">
                      <span className="text-sm text-muted-foreground">Minimum DSCR</span>
                      <span className="font-medium">{selectedLender.minDSCR}x</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-muted/50">
                      <span className="text-sm text-muted-foreground">Maximum LTV</span>
                      <span className="font-medium">{selectedLender.maxLTV}%</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-muted/50">
                      <span className="text-sm text-muted-foreground">Loan Amount</span>
                      <span className="font-medium text-sm">
                        ${selectedLender.minLoanAmount.toLocaleString()} - ${selectedLender.maxLoanAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-muted/50">
                      <span className="text-sm text-muted-foreground">Interest Rates</span>
                      <span className="font-medium">{selectedLender.interestRateRange}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Loan Terms</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedLender.loanTerms.map((term) => (
                      <span key={term} className="px-3 py-1 rounded-full text-sm bg-muted">
                        {term} {term >= 12 ? 'years' : 'months'}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Property Types</h3>
                  <div className="space-y-1">
                    {selectedLender.propertyTypes.map((type) => (
                      <div key={type} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        {type}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <h3 className="font-semibold">Contact</h3>
                  <div className="space-y-2">
                    <p className="font-medium">{selectedLender.contactName}</p>
                    <a 
                      href={`mailto:${selectedLender.contactEmail}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Mail className="h-4 w-4" />
                      {selectedLender.contactEmail}
                    </a>
                    <a 
                      href={`tel:${selectedLender.contactPhone}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Phone className="h-4 w-4" />
                      {selectedLender.contactPhone}
                    </a>
                    <a 
                      href={`https://${selectedLender.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Globe className="h-4 w-4" />
                      {selectedLender.website}
                    </a>
                  </div>
                </div>

                <Button className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Request Quote
                </Button>
              </div>
            ) : (
              <div className="bg-card rounded-xl border p-6 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Select a Lender</h3>
                <p className="text-sm text-muted-foreground">
                  Click on a lender to view detailed information and contact options
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
