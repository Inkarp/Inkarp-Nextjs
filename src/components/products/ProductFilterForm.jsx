"use client";

import { FiSearch } from "react-icons/fi";

function FilterSelect({ placeholder, name, options, value }) {
  return (
    <select
      className="h-9 cursor-pointer rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-700 outline-none transition hover:border-zinc-300 focus:border-[#BE0010] focus:ring-2 focus:ring-[#BE0010]/10"
      defaultValue={value}
      name={name}
      onChange={(event) => event.currentTarget.form?.requestSubmit()}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => {
        const item =
          typeof option === "string" ? { label: option, value: option } : option;
        return (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        );
      })}
    </select>
  );
}

export default function ProductFilterForm({ filters, options, productCount }) {
  const hasActiveFilters =
    filters.principal || filters.country || filters.industry || filters.application || filters.details;

  return (
    <form action="/products">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm">
        {/* Search input */}
        <div className="relative flex min-w-48 flex-1 items-center">
          <FiSearch className="pointer-events-none absolute left-3 text-sm text-zinc-400" />
          <input
            className="h-9 w-full rounded-lg bg-zinc-50 pl-8 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 hover:bg-zinc-100 focus:bg-white focus:ring-2 focus:ring-[#BE0010]/15"
            defaultValue={filters.q}
            name="q"
            placeholder="Search products, principals, industries…"
            type="search"
          />
        </div>

        <div className="h-5 w-px shrink-0 bg-zinc-200" />

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-1.5">
          <FilterSelect
            name="principal"
            options={options.principals}
            placeholder="Principal"
            value={filters.principal}
          />
          <FilterSelect
            name="country"
            options={options.countries}
            placeholder="Country"
            value={filters.country}
          />
          <FilterSelect
            name="industry"
            options={options.industries}
            placeholder="Industry"
            value={filters.industry}
          />
          <FilterSelect
            name="application"
            options={options.applications}
            placeholder="Application"
            value={filters.application}
          />
        </div>

        <div className="h-5 w-px shrink-0 bg-zinc-200" />

        {/* Details toggle */}
        <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900">
          <input
            className="size-3.5 accent-[#BE0010]"
            defaultChecked={filters.details}
            name="details"
            onChange={(event) => event.currentTarget.form?.requestSubmit()}
            type="checkbox"
            value="true"
          />
          With details
        </label>

        {/* Reset link */}
        {hasActiveFilters ? (
          <a
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-400 transition hover:text-[#BE0010]"
            href="/products"
          >
            Clear
          </a>
        ) : null}

        <div className="ml-auto shrink-0 rounded-lg bg-[#BE0010] px-3 py-1.5 text-xs font-bold text-white">
          {productCount} results
        </div>
      </div>
    </form>
  );
}
