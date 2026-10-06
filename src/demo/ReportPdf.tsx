import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { DEMO_PROPERTY, REPORT_ID, money, verdict, type DemoDeal } from './model';

const BLUE = '#2563eb';
const INK = '#0f172a';
const MUTED = '#64748b';
const LINE = '#e2e8f0';

const s = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', color: INK, fontSize: 10 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  brand: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 26, height: 26, borderRadius: 6, backgroundColor: BLUE, color: '#fff', fontSize: 11, fontFamily: 'Helvetica-Bold', textAlign: 'center', paddingTop: 7, marginRight: 8 },
  brandName: { fontSize: 15, fontFamily: 'Helvetica-Bold' },
  tag: { fontSize: 8, color: MUTED, textAlign: 'right' },
  h1: { fontSize: 22, fontFamily: 'Helvetica-Bold' },
  sub: { color: MUTED, marginTop: 3, marginBottom: 18 },
  hero: { flexDirection: 'row', marginBottom: 18 },
  scoreBox: { width: 120, backgroundColor: INK, borderRadius: 10, padding: 14, marginRight: 14, alignItems: 'center', justifyContent: 'center' },
  scoreNum: { fontSize: 44, fontFamily: 'Helvetica-Bold', color: '#fff' },
  scoreLbl: { fontSize: 8, color: '#94a3b8', letterSpacing: 1 },
  verdictBox: { flex: 1, border: `1pt solid ${LINE}`, borderRadius: 10, padding: 14, justifyContent: 'center' },
  verdictH: { fontSize: 14, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  grid: { flexDirection: 'row', marginBottom: 18 },
  cell: { flex: 1, border: `1pt solid ${LINE}`, borderRadius: 8, padding: 10, marginRight: 8 },
  cellLast: { marginRight: 0 },
  cellLbl: { fontSize: 8, color: MUTED, marginBottom: 4 },
  cellVal: { fontSize: 16, fontFamily: 'Helvetica-Bold' },
  sec: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: BLUE, marginBottom: 6, letterSpacing: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottom: `1pt solid ${LINE}` },
  rowL: { color: MUTED },
  bold: { fontFamily: 'Helvetica-Bold' },
  cols: { flexDirection: 'row' },
  col: { flex: 1 },
  gap: { width: 20 },
  badge: { marginTop: 18, padding: 10, borderRadius: 8, backgroundColor: '#eff6ff', color: BLUE, fontFamily: 'Helvetica-Bold', textAlign: 'center' },
  foot: { position: 'absolute', bottom: 24, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', fontSize: 8, color: MUTED },
});

export function ReportPdf({ deal }: { deal: DemoDeal }) {
  const { uw, score, inputs } = deal;
  const v = verdict(deal);
  const p = DEMO_PROPERTY;
  const e = uw.expenseBreakdown;
  return (
    <Document title={`Investor IQ Underwriting Report - ${p.address}`} author="Investor IQ">
      <Page size="LETTER" style={s.page}>
        <View style={s.top}>
          <View style={s.brand}>
            <Text style={s.logo}>IQ</Text>
            <Text style={s.brandName}>Investor IQ</Text>
          </View>
          <View>
            <Text style={s.tag}>UNDERWRITING REPORT</Text>
            <Text style={s.tag}>{REPORT_ID} · Demo data</Text>
          </View>
        </View>

        <Text style={s.h1}>{p.address}</Text>
        <Text style={s.sub}>
          {p.city}, {p.state} {p.zipCode} · {p.bedrooms} bd / {p.bathrooms} ba · {p.squareFootage.toLocaleString()} sqft · Built {p.yearBuilt}
        </Text>

        <View style={s.hero}>
          <View style={s.scoreBox}>
            <Text style={s.scoreNum}>{score.totalScore}</Text>
            <Text style={s.scoreLbl}>DEAL SCORE · GRADE {score.grade}</Text>
          </View>
          <View style={s.verdictBox}>
            <Text style={s.verdictH}>{v.headline}</Text>
            <Text style={{ color: MUTED }}>{v.sub}</Text>
          </View>
        </View>

        <View style={s.grid}>
          <View style={s.cell}><Text style={s.cellLbl}>NET OPERATING INCOME</Text><Text style={s.cellVal}>{money(uw.noi)}</Text></View>
          <View style={s.cell}><Text style={s.cellLbl}>DSCR</Text><Text style={s.cellVal}>{uw.dscr.toFixed(2)}x</Text></View>
          <View style={s.cell}><Text style={s.cellLbl}>CAP RATE</Text><Text style={s.cellVal}>{uw.capRate.toFixed(1)}%</Text></View>
          <View style={[s.cell, s.cellLast]}><Text style={s.cellLbl}>MONTHLY CASH FLOW</Text><Text style={s.cellVal}>{money(uw.monthlyCashFlow)}</Text></View>
        </View>

        <View style={s.cols}>
          <View style={s.col}>
            <Text style={s.sec}>DEAL TERMS</Text>
            <View style={s.row}><Text style={s.rowL}>Purchase price</Text><Text style={s.bold}>{money(inputs.price)}</Text></View>
            <View style={s.row}><Text style={s.rowL}>Loan (75% LTV)</Text><Text style={s.bold}>{money(deal.loan)}</Text></View>
            <View style={s.row}><Text style={s.rowL}>Rate / term</Text><Text style={s.bold}>{inputs.rate.toFixed(2)}% / {p.termYears} yr</Text></View>
            <View style={s.row}><Text style={s.rowL}>Cash invested</Text><Text style={s.bold}>{money(deal.cashInvested)}</Text></View>
            <View style={s.row}><Text style={s.rowL}>Cash on cash</Text><Text style={s.bold}>{uw.cashOnCash.toFixed(1)}%</Text></View>
          </View>
          <View style={s.gap} />
          <View style={s.col}>
            <Text style={s.sec}>ANNUAL OPERATIONS</Text>
            <View style={s.row}><Text style={s.rowL}>Effective gross income</Text><Text style={s.bold}>{money(uw.effectiveGrossIncome)}</Text></View>
            <View style={s.row}><Text style={s.rowL}>Taxes + insurance</Text><Text style={s.bold}>{money(e.propertyTaxes + e.insurance)}</Text></View>
            <View style={s.row}><Text style={s.rowL}>Maintenance + management</Text><Text style={s.bold}>{money(e.maintenance + e.propertyManagement)}</Text></View>
            <View style={s.row}><Text style={s.rowL}>Net operating income</Text><Text style={s.bold}>{money(uw.noi)}</Text></View>
            <View style={s.row}><Text style={s.rowL}>Debt service</Text><Text style={s.bold}>{money(uw.annualDebtService)}</Text></View>
          </View>
        </View>

        <Text style={s.badge}>
          {uw.isBankReady ? 'BANK-READY: DSCR meets the 1.25x lender threshold' : 'BELOW BANK THRESHOLD: DSCR under 1.25x'}
        </Text>

        <View style={s.foot} fixed>
          <Text>Demo data for illustration only. Not an offer of credit.</Text>
          <Text>Built by CSS Technology · Metrix</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function buildReportBlob(deal: DemoDeal): Promise<Blob> {
  return pdf(<ReportPdf deal={deal} />).toBlob();
}
