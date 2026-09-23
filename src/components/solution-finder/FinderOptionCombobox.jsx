"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FiCheck, FiChevronDown, FiPlus, FiSearch } from "react-icons/fi";

// `initialLabel` shows a value chosen elsewhere (or pre-filled) when the field
// mounts; remount with a new `key` to apply a different one.
export default function FinderOptionCombobox({ dark = false, icon: Icon, initialLabel = "", label, onChange, placeholder, type, value }) {
  const listId = useId();
  const rootRef = useRef(null);
  const [query, setQuery] = useState(initialLabel);
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();
  const exactMatch = options.some((option) => option.label.toLowerCase() === normalizedQuery);

  const load = (search = "") => {
    setLoading(true);
    fetch(`/api/finder-options?type=${encodeURIComponent(type)}&q=${encodeURIComponent(search)}`)
      .then((response) => response.ok ? response.json() : Promise.reject(response))
      .then((data) => {
        const nextOptions = data.results ?? [];
        setOptions(nextOptions);
        const exact = nextOptions.find((option) => option.label.toLowerCase() === search.trim().toLowerCase());
        if (exact && search.trim()) choose(exact);
      })
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const close = (event) => { if (!rootRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const choose = (option) => {
    onChange(option.value, option);
    setQuery(option.label);
    setOpen(false);
  };

  const add = async () => {
    const customLabel = query.trim();
    if (customLabel.length < 2) return;
    setAdding(true);
    const response = await fetch("/api/finder-options", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, label: customLabel }),
    });
    const data = await response.json().catch(() => ({}));
    setAdding(false);
    if (response.ok && data.option) choose(data.option);
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const exact = options.find((option) => option.label.toLowerCase() === normalizedQuery);
    if (exact) choose(exact);
    else if (options.length === 1 && normalizedQuery) choose(options[0]);
    else add();
  };

  return (
    <div className="relative min-w-0 flex-1" ref={rootRef}>
      <div className={`flex h-12 items-center rounded-full px-4 transition ${dark ? "bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_6px_18px_rgba(8,4,24,.16)] backdrop-blur-md ring-1 ring-white/15 focus-within:bg-white/28 focus-within:ring-2 focus-within:ring-fuchsia-300/70" : "border border-line-light bg-white shadow-sm focus-within:border-red focus-within:ring-2 focus-within:ring-rose-100"}`}>
        {Icon ? <Icon className={`mr-2 shrink-0 ${dark ? "text-fuchsia-200" : "text-ink-soft"}`} /> : <FiSearch className={`mr-2 shrink-0 ${dark ? "text-fuchsia-200" : "text-ink-soft"}`} />}
        <input aria-autocomplete="list" aria-controls={listId} aria-expanded={open} aria-label={label} autoComplete="off" className={`min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none ${dark ? "text-white caret-fuchsia-200 placeholder:font-medium placeholder:text-white/65" : "text-ink placeholder:text-ink-soft/60"}`} onChange={(event) => { setQuery(event.target.value); onChange("", null); setOpen(true); load(event.target.value); }} onFocus={() => { setOpen(true); load(query); }} onKeyDown={handleKeyDown} placeholder={placeholder} role="combobox" value={query} />
        {loading || adding ? <span className={`size-4 animate-spin rounded-full border-2 ${dark ? "border-white/30 border-t-white" : "border-red/20 border-t-red"}`} /> : value ? <FiCheck className={dark ? "text-emerald-300" : "text-emerald-600"} /> : <FiChevronDown className={dark ? "text-white/65" : "text-ink-soft"} />}
      </div>
      {open ? (
        <div className={`absolute left-0 z-50 max-h-72 w-full min-w-[280px] overflow-auto rounded-2xl border border-rose-200 bg-white p-1.5 shadow-[0_18px_50px_rgba(15,23,42,0.2)] ${dark ? "top-[calc(100%+8px)]" : "bottom-[calc(100%+5px)]"}`} id={listId} role="listbox">
          {options.map((option) => <button aria-selected={option.value === value} className="flex w-full items-start justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-rose-50" key={option.value} onClick={() => choose(option)} role="option" type="button"><span><span className="block text-sm font-semibold text-ink">{option.label}</span>{option.description ? <span className="mt-0.5 block text-[11px] text-ink-soft">{option.description}</span> : null}</span>{option.userAdded ? <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] font-bold uppercase text-ink-soft">Community</span> : null}</button>)}
          {normalizedQuery.length >= 2 && !exactMatch ? <button className="mt-1 flex w-full items-center gap-2 border-t border-line-light px-3 py-3 text-left text-sm font-bold text-red hover:bg-rose-50" disabled={adding} onClick={add} type="button"><FiPlus /> Add “{query.trim()}” <span className="ml-auto text-[10px] font-medium uppercase tracking-wide text-ink-soft">or press Enter</span></button> : null}
          {!options.length && normalizedQuery.length < 2 && !loading ? <p className="px-3 py-3 text-sm text-ink-soft">Type to search or add a new option.</p> : null}
        </div>
      ) : null}
    </div>
  );
}
