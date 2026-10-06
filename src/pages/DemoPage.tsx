import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, animate, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, Check, Download, FileText, Loader2, PhoneCall, Send, Sparkles, ChevronLeft, RotateCcw, CalendarDays,
} from 'lucide-react';
import {
  DEFAULT_INPUTS, DEMO_PROPERTY, LENDERS, RENT_ESTIMATE, REPORT_ID, money, runDeal, verdict,
  type DemoDeal, type DemoInputs,
} from '@/demo/model';

/* ---------- config: edit before sharing ---------- */
const CONTACT_EMAIL = 'csstechsc@gmail.com';
const TIMELINE_WEEKS = '3';
const YES_HREF = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('YES - Investor IQ Phase 1')}&body=${encodeURIComponent("YES, let's start Phase 1 of Investor IQ.")}`;
const CALL_HREF = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Investor IQ - book a call')}&body=${encodeURIComponent('A good time for a 15 minute call:')}`;

const STEPS = ['Property', 'Underwrite', 'Score', 'Report', 'Lenders', 'Assistant', 'Start'] as const;

/* ---------- hooks ---------- */
function useCount(target: number, opts: { duration?: number; delay?: number; from?: number } = {}) {
  const reduce = useReducedMotion();
  const { duration = 1.4, delay = 0, from = 0 } = opts;
  const [val, setVal] = useState(reduce ? target : from);
  const prev = useRef(reduce ? target : from);
  useEffect(() => {
    if (reduce) { setVal(target); prev.current = target; return; }
    const c = animate(prev.current, target, {
      duration, delay, ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => { prev.current = v; setVal(v); },
    });
    return () => c.stop();
  }, [target, duration, delay, reduce]);
  return val;
}

function Count({ value, format, delay, duration, from }: { value: number; format: (n: number) => string; delay?: number; duration?: number; from?: number }) {
  const v = useCount(value, { delay, duration, from });
  return <span className="tabular-nums">{format(v)}</span>;
}

/* ---------- small UI ---------- */
function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const lg = size === 'lg';
  return (
    <div className="flex items-center gap-2.5">
      <div className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 font-extrabold text-white shadow-[0_0_24px_rgba(37,99,235,0.55)] ${lg ? 'h-11 w-11 text-lg' : 'h-9 w-9 text-sm'}`}>IQ</div>
      <span className={`font-bold tracking-tight text-white ${lg ? 'text-2xl' : 'text-xl'}`}>Investor IQ</span>
    </div>
  );
}

function Pill({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'green' | 'amber' | 'slate' }) {
  const tones = {
    blue: 'border-blue-400/30 bg-blue-500/10 text-blue-300',
    green: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
    amber: 'border-amber-400/30 bg-amber-500/10 text-amber-300',
    slate: 'border-white/10 bg-white/5 text-slate-300',
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${tones[tone]}`}>{children}</span>;
}

function Cta({ children, onClick, href, icon = true, variant = 'primary', disabled }: { children: ReactNode; onClick?: () => void; href?: string; icon?: boolean; variant?: 'primary' | 'ghost'; disabled?: boolean }) {
  const base = 'group inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl px-6 text-[17px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070b14] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50';
  const styles = variant === 'primary'
    ? 'bg-blue-600 text-white shadow-[0_8px_30px_rgba(37,99,235,0.45)] hover:bg-blue-500'
    : 'border border-white/15 bg-white/5 text-white hover:bg-white/10';
  const inner = <>{children}{icon && <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />}</>;
  if (href) return <a href={href} className={`${base} ${styles}`}>{inner}</a>;
  return <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>{inner}</button>;
}

function Slider({ id, label, value, min, max, step, format, onChange, hint }: { id: string; label: string; value: number; min: number; max: number; step: number; format: (n: number) => string; onChange: (n: number) => void; hint?: string }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium text-slate-300">{label}{hint && <span className="ml-2 text-xs font-normal text-slate-500">{hint}</span>}</label>
        <span className="text-xl font-bold tabular-nums text-white">{format(value)}</span>
      </div>
      <input
        id={id} type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="iq-range" style={{ ['--pct' as string]: `${pct}%` }}
        aria-valuetext={format(value)}
      />
    </div>
  );
}

function scoreColor(n: number) {
  if (n >= 85) return '#10b981';
  if (n >= 70) return '#3b82f6';
  if (n >= 55) return '#f59e0b';
  if (n >= 40) return '#f97316';
  return '#ef4444';
}

function Dial({ score, grade }: { score: number; grade: string }) {
  const shown = useCount(score, { duration: 1.8, delay: 0.15 });
  const R = 100, C = 2 * Math.PI * R, ARC = C * 0.75;
  const color = scoreColor(shown);
  return (
    <div className="relative mx-auto aspect-square w-[min(58vw,300px)]" role="img" aria-label={`Deal score ${score} out of 100, grade ${grade}`}>
      <svg viewBox="0 0 240 240" className="h-full w-full -rotate-[225deg]">
        <circle cx="120" cy="120" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="16" strokeLinecap="round" strokeDasharray={`${ARC} ${C}`} />
        <circle cx="120" cy="120" r={R} fill="none" stroke={color} strokeWidth="16" strokeLinecap="round" strokeDasharray={`${(ARC * shown) / 100} ${C}`} style={{ filter: `drop-shadow(0 0 10px ${color}88)` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[64px] font-extrabold sm:text-[84px] leading-none tracking-tight text-white tabular-nums">{Math.round(shown)}</div>
        <div className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Deal Score</div>
        <div className="mt-2 rounded-full px-3 py-0.5 text-sm font-bold text-white" style={{ background: color }}>Grade {grade}</div>
      </div>
    </div>
  );
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-white/10 bg-white/[0.04] ${className}`}>{children}</div>;
}

/* ---------- steps ---------- */
function PropertyStep({ onNext }: { onNext: () => void }) {
  const p = DEMO_PROPERTY;
  const rent = useCount(DEFAULT_INPUTS.rent, { duration: 1.6, delay: 0.5 });
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">
        <h1 className="text-[34px] font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl">
          Underwrite any deal<br /><span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">in 10 seconds.</span>
        </h1>
        <p className="mt-3 text-base text-slate-400">Here is a real deal, already entered. One tap.</p>

        <Card className="mt-6 overflow-hidden">
          <div className="relative h-32 bg-gradient-to-br from-blue-600/30 via-blue-500/10 to-transparent">
            <svg viewBox="0 0 400 128" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
              <path d="M0 128V96l60-26 50 22 70-48 60 38 55-30 105 40v36z" fill="rgba(59,130,246,0.18)" />
              <path d="M0 128V108l80-20 70 18 90-30 160 32v20z" fill="rgba(15,23,42,0.8)" />
              <path d="M150 128V82l50-30 50 30v46z" fill="#1e3a8a" /><path d="M190 128V98h20v30z" fill="#60a5fa" />
            </svg>
            <div className="absolute left-4 top-4"><Pill tone="slate">Single family · 3 bd / 2 ba</Pill></div>
          </div>
          <div className="p-5">
            <div className="text-xl font-bold text-white">{p.address}</div>
            <div className="text-sm text-slate-400">{p.city}, {p.state} {p.zipCode} · {p.squareFootage.toLocaleString()} sqft · Built {p.yearBuilt}</div>
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500">Asking</div>
                <div className="text-2xl font-bold text-white tabular-nums">{money(DEFAULT_INPUTS.price)}</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs uppercase tracking-wider text-slate-500"><Sparkles className="h-3 w-3 text-blue-400" />AI rent estimate</div>
                <div className="text-2xl font-bold text-blue-300"><Count value={DEFAULT_INPUTS.rent} format={(n) => money(n)} delay={0.5} duration={1.6} />
                  <span className="text-sm font-medium text-slate-500">/mo</span></div>
                <div className="text-xs text-slate-500">{money(RENT_ESTIMATE.rentRange.low)} to {money(RENT_ESTIMATE.rentRange.high)}</div>
              </div>
            </div>
            <span className="sr-only">{Math.round(rent)}</span>
          </div>
        </Card>
      </div>
      <div className="mt-6"><Cta onClick={onNext}>Underwrite this deal</Cta></div>
    </div>
  );
}

function Metric({ label, children, tone, delay }: { label: string; children: ReactNode; tone?: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</div>
      <div className={`mt-1 text-[34px] font-extrabold leading-tight tracking-tight sm:text-[40px] ${tone ?? 'text-white'}`}>{children}</div>
    </motion.div>
  );
}

function UnderwriteStep({ deal, onNext }: { deal: DemoDeal; onNext: () => void }) {
  const { uw } = deal;
  const income = uw.effectiveGrossIncome;
  const parts = [
    { k: 'Operating costs', v: uw.totalOperatingExpenses, c: 'bg-slate-500' },
    { k: 'Loan payments', v: uw.annualDebtService, c: 'bg-blue-500' },
    { k: 'Your cash flow', v: Math.max(0, uw.noi - uw.annualDebtService), c: 'bg-emerald-500' },
  ];
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">
        <Pill>Live underwriting</Pill>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">Here is what the deal makes.</h2>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Metric label="Net operating income" delay={0}><Count value={uw.noi} format={(n) => money(n)} /></Metric>
          <Metric label="Monthly cash flow" delay={0.15} tone={uw.monthlyCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}><Count value={uw.monthlyCashFlow} format={(n) => money(n)} delay={0.15} /></Metric>
          <Metric label="DSCR" delay={0.3} tone={uw.isBankReady ? 'text-white' : 'text-amber-300'}><Count value={uw.dscr} format={(n) => n.toFixed(2) + 'x'} delay={0.3} /></Metric>
          <Metric label="Cap rate" delay={0.45}><Count value={uw.capRate} format={(n) => n.toFixed(1) + '%'} delay={0.45} /></Metric>
        </div>
        <Card className="mt-3 p-4">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400"><span>Where the rent goes, per year</span><span className="tabular-nums">{money(income)}</span></div>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/5">
            {parts.map((x, i) => (
              <motion.div key={x.k} className={x.c} initial={{ width: 0 }} animate={{ width: `${(x.v / income) * 100}%` }} transition={{ delay: 0.6 + i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-300">
            {parts.map((x) => <span key={x.k} className="inline-flex items-center gap-1.5"><i className={`h-2 w-2 rounded-full ${x.c}`} />{x.k} {money(x.v)}</span>)}
          </div>
        </Card>
      </div>
      <div className="mt-6"><Cta onClick={onNext}>Get the Deal Score</Cta></div>
    </div>
  );
}

function ScoreStep({ inputs, setInputs, deal, onNext }: { inputs: DemoInputs; setInputs: (i: DemoInputs) => void; deal: DemoDeal; onNext: () => void }) {
  const v = verdict(deal);
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-10">
          <div>
            <Dial score={deal.score.totalScore} grade={deal.score.grade} />
            <motion.div key={v.headline} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="mt-3 text-center">
              <div className="text-2xl font-extrabold tracking-tight text-white">{v.headline}</div>
              <div className="mt-1 text-sm text-slate-400" aria-live="polite">{v.sub}</div>
            </motion.div>
          </div>
          <Card className="mt-5 space-y-5 p-5 lg:mt-0">
            <div className="flex items-center justify-between"><span className="text-sm font-semibold text-white">Try it. Change the deal.</span><Pill tone="green">Live</Pill></div>
            <Slider id="price" label="Price" min={150000} max={350000} step={5000} value={inputs.price} format={(n) => money(n)} onChange={(price) => setInputs({ ...inputs, price })} />
            <Slider id="rent" label="Rent" hint="AI est." min={1500} max={3500} step={25} value={inputs.rent} format={(n) => money(n) + '/mo'} onChange={(rent) => setInputs({ ...inputs, rent })} />
            <Slider id="rate" label="Rate" min={4} max={10} step={0.125} value={inputs.rate} format={(n) => n.toFixed(2) + '%'} onChange={(rate) => setInputs({ ...inputs, rate })} />
            <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center">
              <div><div className="text-[11px] uppercase tracking-wider text-slate-500">DSCR</div><div className="text-lg font-bold text-white tabular-nums">{deal.uw.dscr.toFixed(2)}x</div></div>
              <div><div className="text-[11px] uppercase tracking-wider text-slate-500">Cap rate</div><div className="text-lg font-bold text-white tabular-nums">{deal.uw.capRate.toFixed(1)}%</div></div>
              <div><div className="text-[11px] uppercase tracking-wider text-slate-500">Cash flow</div><div className={`text-lg font-bold tabular-nums ${deal.uw.monthlyCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{money(deal.uw.monthlyCashFlow)}</div></div>
            </div>
          </Card>
        </div>
      </div>
      <div className="mt-6"><Cta onClick={onNext}>Build the bank-ready report</Cta></div>
    </div>
  );
}

function ReportStep({ deal, onNext }: { deal: DemoDeal; onNext: () => void }) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [size, setSize] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const p = DEMO_PROPERTY;
  const { uw, score } = deal;

  useEffect(() => {
    let dead = false;
    let url: string | null = null;
    setState('loading');
    const minWait = new Promise((r) => setTimeout(r, 1300));
    Promise.all([import('@/demo/ReportPdf').then((m) => m.buildReportBlob(deal)), minWait])
      .then(([blob]) => {
        if (dead) return;
        url = URL.createObjectURL(blob);
        setBlobUrl(url); setSize(blob.size); setState('ready');
      })
      .catch(() => { if (!dead) setState('error'); });
    return () => { dead = true; if (url) URL.revokeObjectURL(url); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  const color = scoreColor(score.totalScore);
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">
        <Pill tone="blue"><FileText className="h-3 w-3" />Bank-ready report</Pill>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">One page. Lender-ready.</h2>

        <div className="relative mx-auto mt-5 max-w-sm">
          <motion.div initial={{ opacity: 0, y: 24, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.6 }} className="overflow-hidden rounded-xl bg-white p-5 text-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.5)]" aria-label="Report preview">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-[10px] font-bold text-white">IQ</div><span className="text-sm font-bold">Investor IQ</span></div>
              <div className="text-right text-[9px] leading-tight text-slate-500">UNDERWRITING REPORT<br />{REPORT_ID} · Demo data</div>
            </div>
            <div className="mt-4 text-lg font-extrabold leading-tight">{p.address}</div>
            <div className="text-[11px] text-slate-500">{p.city}, {p.state} {p.zipCode} · {p.bedrooms} bd / {p.bathrooms} ba · Built {p.yearBuilt}</div>
            <div className="mt-3 flex gap-2">
              <div className="flex w-24 flex-col items-center justify-center rounded-lg bg-slate-900 py-2 text-white"><div className="text-3xl font-extrabold leading-none" style={{ color }}>{score.totalScore}</div><div className="mt-1 text-[8px] tracking-wider text-slate-400">DEAL SCORE · {score.grade}</div></div>
              <div className="flex-1 rounded-lg border border-slate-200 p-2.5"><div className="text-xs font-bold">{verdict(deal).headline}</div><div className="mt-0.5 text-[10px] text-slate-500">{verdict(deal).sub}</div></div>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1.5 text-center">
              {[['NOI', money(uw.noi)], ['DSCR', uw.dscr.toFixed(2) + 'x'], ['CAP', uw.capRate.toFixed(1) + '%'], ['CASH/MO', money(uw.monthlyCashFlow)]].map(([k, val]) => (
                <div key={k} className="rounded-md border border-slate-200 px-1 py-1.5"><div className="text-[8px] text-slate-500">{k}</div><div className="text-[11px] font-bold tabular-nums">{val}</div></div>
              ))}
            </div>
            <div className="mt-3 space-y-1 text-[10px]">
              {[['Purchase price', money(deal.inputs.price)], ['Loan (75% LTV)', money(deal.loan)], ['Rate / term', `${deal.inputs.rate.toFixed(2)}% / 30 yr`], ['Debt service / yr', money(uw.annualDebtService)]].map(([k, val]) => (
                <div key={k} className="flex justify-between border-b border-slate-100 pb-1"><span className="text-slate-500">{k}</span><span className="font-semibold tabular-nums">{val}</span></div>
              ))}
            </div>
            <div className={`mt-3 rounded-md py-1.5 text-center text-[10px] font-bold ${uw.isBankReady ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>{uw.isBankReady ? 'BANK-READY · DSCR meets 1.25x' : 'BELOW 1.25x BANK THRESHOLD'}</div>
            <div className="mt-2 text-center text-[8px] text-slate-400">Built by CSS Technology · Metrix</div>
          </motion.div>

          <AnimatePresence>
            {state === 'loading' && (
              <motion.div key="gen" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-[#070b14]/85 backdrop-blur-sm" role="status">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                <div className="text-base font-semibold text-white">Generating your PDF</div>
                <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full bg-blue-500" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.2, ease: 'easeInOut' }} /></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mx-auto mt-4 flex max-w-sm items-center justify-between gap-3">
          {state === 'ready' && <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400"><Check className="h-4 w-4" />PDF ready · 1 page · {Math.max(1, Math.round(size / 1024))} KB</span>}
          {state === 'error' && <span className="text-sm text-amber-300" role="alert">Could not build the PDF. <button type="button" className="underline" onClick={() => setAttempt((a) => a + 1)}>Try again</button></span>}
          {state === 'loading' && <span className="text-sm text-slate-400">Building preview…</span>}
          <a href={blobUrl ?? undefined} download="investor-iq-report.pdf" aria-disabled={state !== 'ready'} className={`inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 ${state !== 'ready' ? 'pointer-events-none opacity-40' : ''}`}><Download className="h-4 w-4" />Download</a>
        </div>
      </div>
      <div className="mt-6"><Cta onClick={onNext}>Send to lenders</Cta></div>
    </div>
  );
}

type Stage = 0 | 1 | 2 | 3;
const STAGE_LABEL = ['Queued', 'Sent', 'Under review', ''];

function LendersStep({ deal, onNext }: { deal: DemoDeal; onNext: () => void }) {
  const reduce = useReducedMotion();
  const [stages, setStages] = useState<Stage[]>(LENDERS.map(() => (reduce ? 3 : 0)));
  useEffect(() => {
    if (reduce) return;
    const timers: number[] = [];
    LENDERS.forEach((_, i) => {
      [1, 2, 3].forEach((st, j) => {
        timers.push(window.setTimeout(() => setStages((s) => s.map((x, k) => (k === i ? (st as Stage) : x))), 500 + i * 450 + j * 900));
      });
    });
    return () => timers.forEach(clearTimeout);
  }, [reduce]);
  const done = stages.every((s) => s === 3);
  const approved = LENDERS.filter((l) => deal.uw.dscr >= l.minDSCR).length;
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">
        <div className="flex flex-wrap gap-2"><Pill><Send className="h-3 w-3" />Lender pipeline</Pill><Pill tone="amber">Phase 3 preview</Pill></div>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">Send it. Track every answer.</h2>
        <p className="mt-2 text-sm text-slate-400">Each lender is matched on its DSCR minimum from the deal you just built.</p>
        <ul className="mt-5 space-y-3">
          {LENDERS.map((l, i) => {
            const st = stages[i];
            const ok = deal.uw.dscr >= l.minDSCR;
            return (
              <motion.li key={l.name} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="flex items-center gap-4 p-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${st === 3 ? (ok ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-300') : 'bg-blue-500/10 text-blue-300'}`}>
                    {st === 3 ? (ok ? <Check className="h-5 w-5" /> : <span className="text-lg font-bold">!</span>) : st === 0 ? <span className="h-2 w-2 rounded-full bg-slate-500" /> : <Loader2 className="h-5 w-5 animate-spin" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-white">{l.name}</div>
                    <div className="text-xs text-slate-500">{l.type} · min DSCR {l.minDSCR.toFixed(2)}x</div>
                  </div>
                  <div className="text-right text-sm font-semibold" aria-live="polite">
                    {st < 3 ? <span className="text-slate-300">{STAGE_LABEL[st]}</span> : ok ? <span className="text-emerald-400">Terms received</span> : <span className="text-amber-300">Needs {l.minDSCR.toFixed(2)}x</span>}
                  </div>
                </Card>
              </motion.li>
            );
          })}
        </ul>
        <div className="mt-4 h-6 text-center text-sm font-medium text-emerald-400" aria-live="polite">
          {done && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{approved} of {LENDERS.length} lenders can fund this deal.</motion.span>}
        </div>
      </div>
      <div className="mt-4"><Cta onClick={onNext}>Next</Cta></div>
    </div>
  );
}

function AssistantStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center text-center">
        <div className="mx-auto"><Pill tone="slate">Optional add-on · Automated Worx</Pill></div>
        <div className="relative mx-auto mt-8 flex h-28 w-28 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-blue-500/20" />
          <span className="absolute inset-3 rounded-full bg-blue-500/15" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 shadow-[0_0_40px_rgba(37,99,235,0.6)]"><PhoneCall className="h-9 w-9 text-white" /></div>
        </div>
        <h2 className="mt-8 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">An AI assistant that answers your investors' calls. 24/7.</h2>
        <p className="mt-3 text-base text-slate-400">Qualifies the lead, books the showing, never sleeps.</p>
      </div>
      <div className="mt-6"><Cta onClick={onNext}>Continue</Cta></div>
    </div>
  );
}

function CloseStep({ onRestart }: { onRestart: () => void }) {
  const weeks = [
    ['Week 1', 'Accounts, secure login and database'],
    ['Week 2', 'Saved deals and PDF reports'],
    ['Week 3', 'Launch on iq.metrix.build'],
  ];
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">
        <Pill tone="green">Phase 1</Pill>
        <h2 className="mt-3 text-[34px] font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl">This is Phase 1.<br /><span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Live in about {TIMELINE_WEEKS} weeks.</span></h2>
        <p className="mt-3 text-slate-400">The math you just used is already built. We add the real app around it: iq.metrix.build, with accounts, saved deals and PDF.</p>
        <ol className="mt-5 space-y-2.5">
          {weeks.map(([w, t], i) => (
            <motion.li key={w} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.12 }}>
              <Card className="flex items-center gap-4 px-4 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">{i + 1}</span>
                <div><div className="text-xs font-semibold uppercase tracking-wider text-blue-300">{w}</div><div className="font-semibold text-white">{t}</div></div>
              </Card>
            </motion.li>
          ))}
        </ol>
        <p className="mt-4 text-center text-xs text-slate-500">Then Phase 2: live rent data. Phase 3: lender connections.</p>
      </div>
      <div className="mt-5 space-y-3">
        <Cta href={YES_HREF}>Ready to start? Reply YES</Cta>
        <Cta href={CALL_HREF} variant="ghost" icon={false}><CalendarDays className="h-5 w-5" />Book a call</Cta>
        <button type="button" onClick={onRestart} className="mx-auto flex items-center gap-1.5 py-2 text-sm text-slate-500 transition hover:text-slate-300"><RotateCcw className="h-3.5 w-3.5" />Run it again</button>
      </div>
    </div>
  );
}

/* ---------- page ---------- */
export default function DemoPage() {
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState<DemoInputs>(DEFAULT_INPUTS);
  const deal = useMemo(() => runDeal(inputs), [inputs]);
  const reduce = useReducedMotion();

  useEffect(() => {
    document.title = 'Investor IQ · Demo';
    const m = document.createElement('meta');
    m.name = 'robots'; m.content = 'noindex, nofollow';
    document.head.appendChild(m);
    return () => { document.head.removeChild(m); };
  }, []);

  useEffect(() => { void import('@/demo/ReportPdf'); }, []); // warm the PDF chunk

  const go = useCallback((n: number) => { setStep(n); window.scrollTo({ top: 0 }); }, []);
  const next = () => go(Math.min(step + 1, STEPS.length - 1));

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#070b14] font-sans text-white">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.28),transparent_65%)]" />
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-xl flex-col px-4 pb-6 pt-5 sm:px-6 lg:max-w-4xl">
        <header className="flex items-center justify-between">
          {step > 0 ? (
            <button type="button" onClick={() => go(step - 1)} aria-label="Back" className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/5 hover:text-white"><ChevronLeft className="h-6 w-6" /></button>
          ) : <Logo size="lg" />}
          {step > 0 && <Logo />}
          <Pill tone="slate">Demo data</Pill>
        </header>

        <div className="mt-4 flex gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-label={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`}>
          {STEPS.map((s, i) => <span key={s} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= step ? 'bg-blue-500' : 'bg-white/10'}`} />)}
        </div>

        <main className="mt-6 flex flex-1 flex-col">
          <AnimatePresence mode="wait">
            <motion.div key={step} className="flex flex-1 flex-col" initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
              {step === 0 && <PropertyStep onNext={next} />}
              {step === 1 && <UnderwriteStep deal={deal} onNext={next} />}
              {step === 2 && <ScoreStep inputs={inputs} setInputs={setInputs} deal={deal} onNext={next} />}
              {step === 3 && <ReportStep deal={deal} onNext={next} />}
              {step === 4 && <LendersStep deal={deal} onNext={next} />}
              {step === 5 && <AssistantStep onNext={next} />}
              {step === 6 && <CloseStep onRestart={() => { setInputs(DEFAULT_INPUTS); go(0); }} />}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="mt-8 text-center text-xs text-slate-500">Built by CSS Technology · Metrix</footer>
      </div>
    </div>
  );
}
