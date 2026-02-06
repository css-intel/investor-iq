import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { 
  FileText, Download, Plus, Calendar, Building2, 
  Eye, Trash2
} from 'lucide-react';

// Mock report data
const mockReports = [
  {
    id: '1',
    name: 'Investment Analysis - 123 Main St',
    type: 'Deal Analysis',
    dealName: '123 Main Street',
    createdAt: new Date('2026-02-01'),
    metrics: {
      dscr: 1.42,
      capRate: 6.8,
      noi: 52000,
      dealScore: 85,
    },
    status: 'ready',
  },
  {
    id: '2',
    name: 'Bank Submission Package - Oak Plaza',
    type: 'Bank Package',
    dealName: 'Oak Plaza Apartments',
    createdAt: new Date('2026-01-28'),
    metrics: {
      dscr: 1.35,
      capRate: 7.2,
      noi: 145000,
      dealScore: 78,
    },
    status: 'ready',
  },
  {
    id: '3',
    name: 'Portfolio Summary - Q4 2025',
    type: 'Portfolio Report',
    dealName: 'Multiple Properties',
    createdAt: new Date('2026-01-15'),
    metrics: {
      dscr: 1.38,
      capRate: 6.5,
      noi: 420000,
      dealScore: 82,
    },
    status: 'ready',
  },
  {
    id: '4',
    name: 'Due Diligence Report - Maple Heights',
    type: 'Due Diligence',
    dealName: 'Maple Heights Complex',
    createdAt: new Date('2026-02-03'),
    metrics: {
      dscr: 1.18,
      capRate: 5.9,
      noi: 78000,
      dealScore: 65,
    },
    status: 'draft',
  },
];

const reportTypes = [
  { id: 'deal', name: 'Deal Analysis', description: 'Complete underwriting analysis for a property' },
  { id: 'bank', name: 'Bank Package', description: 'Lender-ready submission package' },
  { id: 'portfolio', name: 'Portfolio Report', description: 'Summary of all your investments' },
  { id: 'diligence', name: 'Due Diligence', description: 'Detailed property inspection report' },
];

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showNewReport, setShowNewReport] = useState(false);

  const filteredReports = selectedType 
    ? mockReports.filter(r => r.type.toLowerCase().includes(selectedType.toLowerCase()))
    : mockReports;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground mt-1">Generate and manage investment analysis reports</p>
          </div>
          <Button onClick={() => setShowNewReport(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Report
          </Button>
        </div>

        {/* New Report Modal/Section */}
        {showNewReport && (
          <div className="bg-card rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create New Report</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowNewReport(false)}>
                Cancel
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportTypes.map((type) => (
                <button
                  key={type.id}
                  className="p-4 rounded-xl border text-left hover:border-primary hover:bg-primary/5 transition-colors"
                  onClick={() => {
                    alert(`Creating ${type.name}...`);
                    setShowNewReport(false);
                  }}
                >
                  <FileText className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold">{type.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedType === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType(null)}
          >
            All Reports
          </Button>
          <Button
            variant={selectedType === 'deal' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('deal')}
          >
            Deal Analysis
          </Button>
          <Button
            variant={selectedType === 'bank' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('bank')}
          >
            Bank Packages
          </Button>
          <Button
            variant={selectedType === 'portfolio' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('portfolio')}
          >
            Portfolio
          </Button>
          <Button
            variant={selectedType === 'diligence' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('diligence')}
          >
            Due Diligence
          </Button>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-card rounded-xl border overflow-hidden">
              {/* Report Header */}
              <div className="p-6 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                      report.status === 'ready' ? 'bg-green-500/10' : 'bg-yellow-500/10'
                    }`}>
                      <FileText className={`h-6 w-6 ${
                        report.status === 'ready' ? 'text-green-500' : 'text-yellow-500'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{report.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{report.type}</span>
                        {report.status === 'draft' && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500">Draft</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(report.metrics.dealScore)}`}>
                    {getScoreGrade(report.metrics.dealScore)}
                  </div>
                </div>
              </div>

              {/* Report Metrics */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Building2 className="h-4 w-4" />
                  {report.dealName}
                  <span className="mx-2">•</span>
                  <Calendar className="h-4 w-4" />
                  {report.createdAt.toLocaleDateString()}
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">DSCR</p>
                    <p className={`text-lg font-bold ${report.metrics.dscr >= 1.25 ? 'text-green-500' : 'text-yellow-500'}`}>
                      {report.metrics.dscr.toFixed(2)}x
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Cap Rate</p>
                    <p className="text-lg font-bold">{report.metrics.capRate}%</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">NOI</p>
                    <p className="text-lg font-bold">${(report.metrics.noi / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Score</p>
                    <p className={`text-lg font-bold ${getScoreColor(report.metrics.dealScore)}`}>
                      {report.metrics.dealScore}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <div className="text-center py-12 bg-card rounded-xl border">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Reports Found</h3>
            <p className="text-muted-foreground mb-4">
              {selectedType ? `No ${selectedType} reports yet.` : 'Create your first report to get started.'}
            </p>
            <Button onClick={() => setShowNewReport(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Report
            </Button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="bg-card rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Report Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold text-primary">{mockReports.length}</p>
              <p className="text-sm text-muted-foreground">Total Reports</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold text-green-500">
                {mockReports.filter(r => r.status === 'ready').length}
              </p>
              <p className="text-sm text-muted-foreground">Ready</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold text-yellow-500">
                {mockReports.filter(r => r.status === 'draft').length}
              </p>
              <p className="text-sm text-muted-foreground">Drafts</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold">
                {Math.round(mockReports.reduce((sum, r) => sum + r.metrics.dealScore, 0) / mockReports.length)}
              </p>
              <p className="text-sm text-muted-foreground">Avg Score</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
