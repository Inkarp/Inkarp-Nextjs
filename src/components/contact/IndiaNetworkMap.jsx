'use client';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { MdEmail, MdLocalPhone, MdLocationPin } from 'react-icons/md';
import { FiChevronDown, FiCrosshair, FiNavigation } from 'react-icons/fi';
import { branches, getScreenSize, parseBranchPhones, phoneHref } from '@/data/branches';
import { INDIA_STATES, nearestBranchForState, nearestBranchTo } from '@/data/indiaStates';
import { gmailComposeHref, siteConfig } from '@/data/siteConfig';
import { pushEvent } from '@/lib/analytics';
import RecTag from '@/components/home/RecTag';

const REGION_BY_CITY = {
  Delhi: 'North',
  Chandigarh: 'North',
  Mumbai: 'West',
  Ahmedabad: 'West',
  Pune: 'West',
  Vadodara: 'West',
  Bengaluru: 'South',
  Chennai: 'South',
  Thiruvananthapuram: 'South',
  Hyderabad: 'South',
  Visakhapatnam: 'South',
  Kolkata: 'East',
};

const REGIONS = ['All', 'North', 'South', 'East', 'West'];

// Registered head office — badged and listed first.
const HEAD_OFFICE = 'Hyderabad';
const HEAD_OFFICE_INDEX = branches.findIndex((b) => b.name === HEAD_OFFICE);

const actionClass =
  'inline-flex min-w-0 max-w-full items-center gap-1.5 border border-line-light bg-parchment-alt px-3 py-2 text-xs font-semibold text-ink transition-colors hover:border-red/40 hover:text-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/40';

/** Open-branch panel: one row per team (Sales / Service) with its numbers and email. */
function BranchDetails({ branch }) {
  // Emails are listed in the same order as the phone groups (sales, then service).
  const emails = branch.email.split(',').map((email) => email.trim());

  return (
    <div className="space-y-3 border-t border-line-light px-4 py-4">
      <p className="flex items-start gap-1.5 text-xs leading-relaxed text-ink-soft">
        <MdLocationPin aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-red" />
        {branch.address}
      </p>

      {/* One link per number: Delhi lists two sales numbers in one entry,
          which as a single tel: link ran together into an undiallable 20 digits. */}
      {parseBranchPhones(branch.phone).map(({ label, numbers }, groupIndex) => (
        <div className="flex flex-wrap items-center gap-2" key={label || groupIndex}>
          <span className="w-full text-[10px] font-bold uppercase tracking-wide text-ink-soft sm:w-14">{label}</span>
          {numbers.map((number) => (
            <a
              aria-label={`Call ${branch.name} ${label} ${number}`}
              className={actionClass}
              href={`tel:${phoneHref(number)}`}
              key={number}
              onClick={() => pushEvent('phone_clicked', { source: 'contact_branch', branch: branch.name, line: label })}
            >
              <MdLocalPhone aria-hidden="true" className="size-3.5 shrink-0 text-red" />
              {number}
            </a>
          ))}
          {emails[groupIndex] ? (
            <a
              aria-label={`Email ${branch.name} ${label} ${emails[groupIndex]}`}
              className={actionClass}
              href={gmailComposeHref(emails[groupIndex], `Enquiry for Inkarp ${branch.name}`)}
              onClick={() => pushEvent('email_clicked', { source: 'contact_branch', branch: branch.name, line: label })}
              rel="noopener noreferrer"
              target="_blank"
            >
              <MdEmail aria-hidden="true" className="size-3.5 shrink-0 text-red" />
              <span className="truncate">{emails[groupIndex]}</span>
            </a>
          ) : null}
        </div>
      ))}

      {branch.name === HEAD_OFFICE ? (
        <a
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red underline-offset-2 hover:underline"
          href={siteConfig.mapDirectionsUrl}
          onClick={() => pushEvent('directions_clicked', { source: 'contact_branch', branch: branch.name })}
          rel="noopener noreferrer"
          target="_blank"
        >
          <FiNavigation aria-hidden="true" className="size-3.5" />
          Get directions
        </a>
      ) : null}
    </div>
  );
}

// `as` lets the host page promote this to the page's h1.
export default function IndiaNetworkMap({ as: Heading = 'h2' }) {
  const [screenSize, setScreenSize] = useState('lg');
  const [region, setRegion] = useState('All');
  const [hovered, setHovered] = useState(null);
  // Head office starts open, so its contacts show without a click.
  const [expanded, setExpanded] = useState(HEAD_OFFICE_INDEX);
  const [finderState, setFinderState] = useState('');
  const [finderMessage, setFinderMessage] = useState('');

  useEffect(() => {
    const handleResize = () => setScreenSize(getScreenSize());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const regionCounts = useMemo(() => {
    const counts = {};
    branches.forEach((b) => {
      const r = REGION_BY_CITY[b.name] ?? 'Other';
      counts[r] = (counts[r] ?? 0) + 1;
    });
    return counts;
  }, []);

  // Head office first in the list. The original index is carried through so it
  // still matches the map pins, which render in the source data order.
  const orderedBranches = useMemo(
    () =>
      branches
        .map((branch, index) => ({ branch, index }))
        .sort(
          (a, b) =>
            Number(b.branch.name === HEAD_OFFICE) - Number(a.branch.name === HEAD_OFFICE)
        ),
    []
  );

  const isDimmed = (branch) => region !== 'All' && REGION_BY_CITY[branch.name] !== region;

  const focusBranch = (i) => {
    setExpanded((e) => (e === i ? null : i));
    setHovered(null);
  };

  // Open a branch found by the finder and bring its card into view — on
  // phones the list can run well past the finder.
  const showBranch = (branch, message) => {
    const index = branches.indexOf(branch);
    setRegion('All');
    setExpanded(index);
    setHovered(null);
    setFinderMessage(message);
    pushEvent('branch_finder_used', { branch: branch.name });
    window.requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document
        .getElementById(`branch-${index}`)
        ?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    });
  };

  const handleFinderState = (event) => {
    const state = event.target.value;
    setFinderState(state);
    const branch = nearestBranchForState(state);
    if (branch) showBranch(branch, `Nearest branch to ${state}: ${branch.name}`);
    else setFinderMessage('');
  };

  const locateVisitor = () => {
    if (!navigator.geolocation) {
      setFinderMessage("Location isn't available in this browser. Pick your state instead.");
      return;
    }
    setFinderMessage('Finding your location…');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const branch = nearestBranchTo({ lat: coords.latitude, lon: coords.longitude });
        setFinderState('');
        showBranch(branch, `Nearest branch to you: ${branch.name}`);
      },
      () => setFinderMessage("Couldn't get your location. Pick your state instead."),
      { maximumAge: 600000, timeout: 10000 }
    );
  };

  return (
    <section id="coverage-network" className="scroll-mt-16 border-b border-line-light bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <RecTag>Live coverage</RecTag>
            <Heading className="text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              Inkarp&apos;s network across India
            </Heading>
            <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
              {branches.length} branches spanning {REGIONS.length - 1} regions. Find the branch nearest you,
              or pick a region to narrow the network.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                aria-pressed={region === r}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                  region === r
                    ? 'border-red bg-red text-white'
                    : 'border-line-light bg-white text-ink-soft hover:border-red/40 hover:text-ink'
                }`}
              >
                {r}
                {r !== 'All' && <span className="ml-1 text-[10px] opacity-70">({regionCounts[r] ?? 0})</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Nearest-branch finder */}
        <div className="mb-6 flex flex-col gap-3 border border-line-light bg-parchment-alt p-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <label className="text-sm font-semibold text-ink" htmlFor="branch-finder-state">
            Find my nearest branch
          </label>
          <select
            className="min-h-11 border border-line-light bg-white px-3 text-sm font-medium text-ink outline-none focus:border-red/40 focus:ring-2 focus:ring-red/15 sm:w-64"
            id="branch-finder-state"
            onChange={handleFinderState}
            value={finderState}
          >
            <option value="">Select your state</option>
            {INDIA_STATES.map(({ name }) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <span className="hidden text-xs text-ink-soft sm:inline">or</span>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 border border-line-light bg-white px-4 text-sm font-semibold text-ink transition-colors hover:border-red/40 hover:text-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/40"
            onClick={locateVisitor}
            type="button"
          >
            <FiCrosshair aria-hidden="true" className="size-4 text-red" />
            Use my location
          </button>
          <p aria-live="polite" className="text-xs font-medium text-ink sm:ml-auto">
            {finderMessage}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          {/* Map card. Phones get the branch list first and a smaller map. */}
          <div className="relative order-2 mx-auto w-full max-w-sm rounded-2xl border border-line-light bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-6 lg:order-1 lg:max-w-none">
            {/* Must match IndiaMap.svg's own 1847x2000 viewBox. With a square
                frame the contained map only filled the middle 92.35% of the
                width, so pin percentages — which are relative to this box —
                drifted sideways, worst at the edges. Matching the ratio makes
                the map fill the frame exactly, so pin % == map %. */}
            <div className="relative aspect-[1847/2000] w-full rounded-xl bg-parchment/60">
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                <Image
                  alt="India network coverage map"
                  className="h-full w-full object-contain opacity-90"
                  fill
                  src="/assets/contact/IndiaMap.svg"
                />
              </div>

              {branches.map((branch, i) => {
                const [top, left] = branch.position[screenSize];
                const dimmed = isDimmed(branch);
                const active = hovered === i || expanded === i;

                return (
                  <button
                    key={branch.name}
                    type="button"
                    aria-label={`${branch.name} branch`}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered((h) => (h === i ? null : h))}
                    onClick={() => focusBranch(i)}
                    className={`group absolute -translate-x-1/2 -translate-y-1/2 outline-none transition-opacity duration-300 ${
                      dimmed ? 'opacity-20' : 'opacity-100'
                    }`}
                    style={{ left, top, zIndex: active ? 30 : 10 }}
                  >
                    <span className="relative flex size-6 items-center justify-center">
                      <span
                        className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red/30 motion-reduce:hidden"
                        style={{ animationDuration: '2.4s' }}
                      />
                      {/* Head office pin is larger with a white core so it
                          stands out from the branch pins. */}
                      <span
                        className={`relative inline-flex rounded-full bg-red transition-all duration-200 ${
                          active
                            ? 'size-4 ring-4 ring-red/20'
                            : branch.name === HEAD_OFFICE
                              ? 'size-3.5 ring-2 ring-white'
                              : 'size-2.5'
                        }`}
                      />
                    </span>

                    {active && (
                      <span className="pointer-events-none absolute left-1/2 top-full z-40 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-ink bg-ink px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg">
                        {branch.name}
                        {branch.name === HEAD_OFFICE ? ' · Head Office' : ''}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Branch list — no max height or inner scroll: all 12 branches are
              listed in full so nothing is hidden behind a scrollbar. */}
          <div className="order-1 flex flex-col gap-2.5 lg:order-2">
            {orderedBranches.map(({ branch, index: i }) => {
              const isOpen = expanded === i;
              const dimmed = isDimmed(branch);
              const isHeadOffice = branch.name === HEAD_OFFICE;

              return (
                <div
                  key={branch.name}
                  id={`branch-${i}`}
                  className={`scroll-mt-24 rounded-xl border bg-white transition-all duration-200 ${
                    isOpen
                      ? 'border-red shadow-md'
                      : isHeadOffice
                        ? 'border-red/50 shadow-sm'
                        : 'border-line-light hover:border-red/30'
                  } ${dimmed ? 'opacity-40' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => focusBranch(i)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  >
                    <span className="flex flex-wrap items-center gap-2.5">
                      <MdLocationPin className="size-4 shrink-0 text-red" />
                      <span className="text-sm font-semibold text-ink">{branch.name}</span>
                      {isHeadOffice ? (
                        <span className="rounded-full bg-red px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-parchment">
                          Head Office
                        </span>
                      ) : null}
                      <span className="rounded-full border border-line-light bg-parchment-alt px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
                        {REGION_BY_CITY[branch.name] ?? '—'}
                      </span>
                    </span>
                    <FiChevronDown
                      className={`size-4 shrink-0 text-ink-soft transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-red' : ''
                      }`}
                    />
                  </button>

                  {isOpen && <BranchDetails branch={branch} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
