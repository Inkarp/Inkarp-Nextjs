"use client";

function FilterSelect({ label, name, options, value }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-zinc-700">
      {label}
      <select
        className="h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-[#BE0010] focus:ring-2 focus:ring-[#BE0010]/10"
        defaultValue={value}
        name={name}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
      >
        <option value="">All</option>
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
    </label>
  );
}

export default function ProductFilterForm({ filters, options }) {
  return (
    <form
      action="/products"
      className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
    >
      {filters.q ? <input name="q" type="hidden" value={filters.q} /> : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <FilterSelect
          label="Principal"
          name="principal"
          options={options.principals}
          value={filters.principal}
        />
        <FilterSelect
          label="Country"
          name="country"
          options={options.countries}
          value={filters.country}
        />
        <FilterSelect
          label="Industry"
          name="industry"
          options={options.industries}
          value={filters.industry}
        />
        <FilterSelect
          label="Application"
          name="application"
          options={options.applications}
          value={filters.application}
        />
        <FilterSelect
          label="Group"
          name="group"
          options={options.groups}
          value={filters.group}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700">
          <input
            className="size-4 accent-[#BE0010]"
            defaultChecked={filters.details}
            name="details"
            onChange={(event) => event.currentTarget.form?.requestSubmit()}
            type="checkbox"
            value="true"
          />
          Show products with complete detail pages only
        </label>

        <p className="text-sm text-zinc-500">
          Filters apply automatically when changed.
        </p>
      </div>
    </form>
  );
}
