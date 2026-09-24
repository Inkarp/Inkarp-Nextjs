'use client';
import { useMemo, useState } from 'react';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';
import LeadCaptureForm from './LeadCaptureForm';

const INR = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
// Photometric figures (Lux, Lux.hr) read in international grouping.
const EN = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });
// Limits quoted back in check sentences, written the way the content writes them.
const PLAIN = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1, useGrouping: false });

function money(value) {
  return `₹${INR.format(Math.max(0, Math.round(value || 0)))}`;
}

function count(value) {
  return INR.format(Math.max(0, Math.round(value || 0)));
}

/** Minutes as the unit a lab would actually say out loud. */
function duration(minutes) {
  const mins = Math.max(0, Math.round(minutes || 0));
  if (mins < 60) return `${mins} min`;
  const hours = mins / 60;
  if (hours < 10) return `${hours.toFixed(1).replace(/\.0$/, '')} hr`;
  return `${Math.round(hours)} hr`;
}

/** Fill `{value}` / `{limit}` placeholders in a content-supplied sentence. */
function fillTemplate(text, values) {
  return String(text ?? '').replace(/\{(\w+)\}/g, (match, key) => (values[key] ?? match));
}

/**
 * Optional checks the content can attach to a lookup: numeric inputs compared
 * with a published limit (fixed, or per chosen row via `limitFrom`), and
 * choices whose picked option supplies a card. A card with the same label as
 * an existing one replaces it.
 */
function applyChecks(cards, { nums, picks, data, row }) {
  const out = [...cards];
  const upsert = (card) => {
    const index = out.findIndex((item) => item.label === card.label);
    if (index >= 0) out[index] = card;
    else out.push(card);
  };
  (data?.checks ?? []).forEach((check) => {
    const value = nums[check.field];
    const limit = check.limitFrom ? row?.limits?.[check.limitFrom] : check.limit;
    if (value == null || limit == null) return;
    const ok = value <= limit;
    upsert({ label: check.label, value: fillTemplate(ok ? check.okText : check.overText, { value: PLAIN.format(value), limit: PLAIN.format(limit) }) });
  });
  (data?.choiceCards ?? []).forEach((choiceCard) => {
    const text = choiceCard.values?.[picks?.[choiceCard.key]];
    if (text) upsert({ label: choiceCard.label, value: text });
  });
  return out;
}

/**
 * Each entry turns the entered figures into the readout cards for one kind of
 * calculator. Every number shown is derived from what the visitor typed plus a
 * figure the product content states — nothing is invented here, which is why
 * rates and prices are inputs rather than constants.
 */
const FORMULAS = {
  // Cycles a static SPR screening run gets through in a working day.
  'screening-throughput': ({ nums, data }) => {
    const cycleMinutes = Math.max(1, Number(data?.cycleMinutes) || 10);
    const totalCycles = (nums.samples ?? 0) * (nums.cyclesPerSample ?? 0);
    const perDay = Math.floor(((nums.hoursPerDay ?? 0) * 60) / cycleMinutes);
    const days = totalCycles > 0 && perDay > 0 ? Math.ceil(totalCycles / perDay) : null;

    return {
      assumption: `Calculated at under ${cycleMinutes} minutes per cycle.`,
      cards: [
        { label: 'Conditions screened per day', value: count(perDay), primary: true,
          note: `At under ${cycleMinutes} minutes per cycle across the hours entered.` },
        { label: 'Total cycles in this batch', value: count(totalCycles) },
        { label: 'Working days to finish the batch', value: days ?? '-' },
      ],
    };
  },

  // Time recovered against whatever method the lab runs today.
  'time-saved': ({ nums, picks, data }) => {
    const option = (data?.choices?.[0]?.options ?? []).find((o) => o.val === picks.currentMethod);
    const factor = Math.max(1, Number(option?.speedFactor) || 1);

    const perSampleNow = nums.minutesPerSample ?? 0;
    const perSampleNew = perSampleNow / factor;
    const daily = nums.samplesPerDay ?? 0;

    const savedPerDay = Math.max(0, (perSampleNow - perSampleNew) * daily);

    return {
      assumption: option?.basis ?? '',
      cards: [
        { label: 'Time recovered per day', value: duration(savedPerDay), primary: true,
          note: option?.basis },
        { label: 'Per sample: now vs after', value: `${duration(perSampleNow)} → ${duration(perSampleNew)}` },
        { label: 'Time recovered per working week', value: duration(savedPerDay * 5) },
      ],
    };
  },

  // Runs collapsed when moisture, solids and ash come off one sample.
  'workload-consolidation': ({ nums }) => {
    const perWeek = nums.samplesPerWeek ?? 0;
    const runsEach = Math.max(1, nums.runsPerSampleNow ?? 1);
    const rate = nums.costPerRun ?? 0;

    const runsNow = perWeek * runsEach * 52;
    const runsAfter = perWeek * 52;
    const removed = Math.max(0, runsNow - runsAfter);

    return {
      cards: [
        { label: 'Runs removed per year', value: count(removed), primary: true,
          note: 'One linked sequence replaces the separate runs each sample needs today.' },
        { label: 'Runs per year: now vs after', value: `${count(runsNow)} → ${count(runsAfter)}` },
        { label: 'Cost carried by those runs', value: money(removed * rate),
          note: 'Based on the per-run cost entered above.' },
      ],
    };
  },

  // Reagent spend that disappears when the method needs no chemicals at all.
  'reagent-savings': ({ nums }) => {
    const monthly = nums.reagentCostPerMonth ?? 0;
    const perWeek = nums.samplesPerWeek ?? 0;
    const annual = monthly * 12;
    const perYear = perWeek * 52;

    return {
      cards: [
        { label: 'Annual reagent spend removed', value: money(annual), primary: true,
          note: 'Vapor Pro XL uses no chemical reagents, so this line goes to zero.' },
        { label: 'Samples per year', value: count(perYear) },
        { label: 'Reagent cost per sample today', value: perYear > 0 ? money(annual / perYear) : '-' },
      ],
    };
  },

  // Chamber/shelf load fit against published per-model per-shelf, per-shelf-count
  // and total weight limits. `data.modelLimits` (ordered smallest to largest)
  // supplies the limits so this stays reusable across any chamber-style
  // product rather than hard-coding one model's numbers here.
  'shelf-load-fit-check': ({ nums, picks, data }) => {
    const shelvesUsed = Math.max(0, nums.shelvesUsed ?? 0);
    const loadPerShelf = Math.max(0, nums.loadPerShelfKg ?? 0);
    const totalLoad = shelvesUsed * loadPerShelf;
    // Stacked height is only checked against models that publish an interior height.
    const spacing = Math.max(0, nums.shelfSpacingMm ?? 0);
    const heightNeeded = shelvesUsed * spacing;

    // A choice option may narrow the candidates via `allowedModels`, e.g.
    // only the photostability model when light exposure is required.
    let models = data?.modelLimits ?? [];
    (data?.choices ?? []).forEach((choice) => {
      const option = choice.options?.find((item) => item.val === picks?.[choice.key]);
      if (option?.allowedModels) models = models.filter((model) => option.allowedModels.includes(model.name));
    });
    const smallest = models[0];
    const widest = models[models.length - 1];
    const heightOk = (m) => !m.interiorHeightMm || heightNeeded <= m.interiorHeightMm;
    const shortfall = (m) => {
      if (loadPerShelf > m.maxLoadPerShelfKg) return 'perShelf';
      if (shelvesUsed > m.maxShelves) return 'shelves';
      if (totalLoad > m.maxLoadKg) return 'total';
      if (!heightOk(m)) return 'height';
      return null;
    };
    const fits = (m) => !shortfall(m);
    const preferred = models.find((model) => model.name === picks?.preferredModel);
    const fitting = preferred && fits(preferred) ? preferred : models.find(fits);

    // Why `m` cannot take this load; `next` is the model that can, if any.
    const shortfallText = (m, next) => {
      switch (shortfall(m)) {
        case 'perShelf':
          return next
            ? `${count(loadPerShelf)} kg exceeds ${count(m.maxLoadPerShelfKg)} kg/shelf on the ${m.shortName} but is within ${count(next.maxLoadPerShelfKg)} kg on the ${next.shortName}`
            : `${count(loadPerShelf)} kg/shelf exceeds the ${m.shortName}'s ${count(m.maxLoadPerShelfKg)} kg/shelf limit`;
        case 'shelves':
          return `${count(shelvesUsed)} shelves exceeds the ${m.shortName}'s ${count(m.maxShelves)}-shelf maximum${next ? `; the ${next.shortName} takes up to ${count(next.maxShelves)}` : ''}`;
        case 'total':
          return next
            ? `${count(totalLoad)} kg total exceeds the ${count(m.maxLoadKg)} kg limit of the ${m.shortName}`
            : `${count(totalLoad)} kg exceeds the ${count(m.maxLoadKg)} kg maximum of the ${m.shortName}`;
        case 'height':
          return `${count(shelvesUsed)} shelves at ${count(spacing)} mm need ${count(heightNeeded)} mm, more than the ${m.shortName}'s ${count(m.interiorHeightMm)} mm interior height${next?.interiorHeightMm ? `; the ${next.shortName} has ${count(next.interiorHeightMm)} mm` : ''}`;
        default:
          return '';
      }
    };

    let recommendedModel;
    let usableShelves;
    let loadCheck;
    let fitResult;

    if (fitting && smallest && fitting === smallest) {
      recommendedModel = smallest.name;
      usableShelves = `${count(shelvesUsed)} of up to ${count(smallest.maxShelves)}`;
      loadCheck = `Well within ${count(smallest.maxLoadPerShelfKg)} kg/shelf and ${count(smallest.maxLoadKg)} kg total`;
      fitResult = 'Fits comfortably';
    } else if (fitting && smallest && fits(smallest)) {
      // A larger model was picked as preferred although the smallest would do.
      recommendedModel = fitting.name;
      usableShelves = `${count(shelvesUsed)} of up to ${count(fitting.maxShelves)}`;
      loadCheck = `Within ${count(fitting.maxLoadPerShelfKg)} kg/shelf and ${count(fitting.maxLoadKg)} kg total`;
      fitResult = `Fits; the ${smallest.name} would also take this load`;
    } else if (fitting) {
      recommendedModel = fitting.name;
      usableShelves = `${count(shelvesUsed)} of up to ${count(fitting.maxShelves)}`;
      loadCheck = smallest ? shortfallText(smallest, fitting) : '';
      fitResult = `Step up to ${fitting.name} for headroom`;
    } else {
      recommendedModel = data?.beyondRangeLabel ?? 'Beyond TH3-E range';
      usableShelves = 'Not sufficient';
      loadCheck = widest ? shortfallText(widest, null) : '';
      fitResult = data?.beyondRangeFit ?? 'Split across two units or use a larger TH3 model';
    }

    return {
      assumption: data?.assumptionNote ?? '',
      cards: [
        { label: 'Recommended model', value: recommendedModel },
        { label: 'Usable shelves', value: usableShelves },
        { label: 'Load check', value: loadCheck },
        { label: 'Fit result', value: fitResult },
      ],
    };
  },

  // Manual refills a recirculating water supply removes over a test run —
  // pure arithmetic from the visitor's own current refill schedule, not a
  // manufacturer-published rate (there isn't one), so the disclaimer says so.
  // Tier thresholds (`data.tiers`) are Inkarp's own guidance, not JeioTech's.
  'water-refill-savings': ({ nums, data }) => {
    const testDays = Math.max(0, nums.testDurationDays ?? 0);
    const currentRefillsPerDay = Math.max(0, nums.currentRefillsPerDay ?? 0);
    const refillsAvoided = testDays * currentRefillsPerDay;

    const tiers = data?.tiers ?? [];
    const tier = tiers.find((t) => testDays <= t.maxDays) ?? tiers[tiers.length - 1];

    return {
      cards: [
        { label: 'Refills avoided', value: `About ${count(refillsAvoided)}`,
          note: 'Assumes recirculation covers the full run instead of the manual schedule entered above.' },
        { label: 'Unattended run time', value: tier?.unattendedRunTime ?? `${count(testDays)} day(s) without a top-up` },
        { label: 'Risk reduced', value: tier?.riskReduced ?? 'Low-water alarm prevents dry running' },
        { label: 'Recommended option', value: tier?.recommendedOption ?? 'Recirculation tank is sufficient' },
      ],
    };
  },

  // Confirms a setpoint sits inside the published operating envelope, then
  // interpolates heat-up/cool-down time between JeioTech's own stated
  // reference points (`data.heatAnchors`/`coolAnchors`, each an ambient
  // starting point) rather than inventing a physics curve — every anchor is
  // a figure JeioTech/Inkarp has already published, this just connects them.
  'chamber-envelope-check': ({ nums, picks, data }) => {
    const tempMin = data?.tempRange?.[0] ?? 0;
    const tempMax = data?.tempRange?.[1] ?? 90;
    const humidityMin = data?.humidityRange?.[0] ?? 35;
    const humidityMax = data?.humidityRange?.[1] ?? 85;
    const targetTemp = nums.targetTemp ?? 0;
    const targetHumidity = nums.targetHumidity ?? 0;
    const holdHours = Math.max(0, nums.holdHours ?? ((nums.holdDays ?? 0) * 24));
    const holdDays = holdHours / 24;
    const needsHumidity = (picks?.humidityControlNeeded ?? 'yes') === 'yes';
    const chamberModel = picks?.chamberModel ?? data?.choices?.find((choice) => choice.key === 'chamberModel')?.default;
    const selectedModel = data?.models?.find((model) => model.val === chamberModel);
    const ambient = data?.ambientTemp ?? 20;
    const tempFluctuation = data?.stability?.temp ?? '0.3';
    const humidityFluctuation = selectedModel?.humidityFluctuation ?? data?.stability?.humidity ?? '1';

    const tempOk = targetTemp >= tempMin && targetTemp <= tempMax;
    const humidityOk = !needsHumidity || (targetHumidity >= humidityMin && targetHumidity <= humidityMax);

    if (!tempOk) {
      const belowMin = targetTemp < tempMin;
      return {
        assumption: data?.assumptionNote ?? '',
        cards: [
          { label: 'Range check', value: belowMin ? `Out of range - below ${tempMin} C minimum` : `Out of range - exceeds ${tempMax} C maximum` },
          { label: 'Heating time', value: 'Not applicable' },
          { label: 'Cooling time', value: 'Not applicable' },
          { label: 'Water guidance', value: 'Not applicable' },
          { label: 'Stability note', value: belowMin ? `Raise the target to ${tempMin} C or above` : `Lower the target to ${tempMax} C or below` },
        ],
      };
    }
    // Some models only control humidity inside a narrower temperature window.
    const humidityTempRange = data?.humidityTempRange;
    if (needsHumidity && humidityTempRange && (targetTemp < humidityTempRange[0] || targetTemp > humidityTempRange[1])) {
      return {
        assumption: data?.assumptionNote ?? '',
        cards: [
          { label: 'Range check', value: `Out of range with humidity - humidity control runs from ${humidityTempRange[0]} to ${humidityTempRange[1]} C` },
          { label: 'Heating time', value: 'Not applicable' },
          { label: 'Cooling time', value: 'Not applicable' },
          { label: 'Water guidance', value: 'Not applicable' },
          { label: 'Stability note', value: `Turn humidity control off, or set ${humidityTempRange[0]} to ${humidityTempRange[1]} C` },
        ],
      };
    }
    if (!humidityOk) {
      return {
        assumption: data?.assumptionNote ?? '',
        cards: [
          { label: 'Range check', value: `Out of range — outside ${humidityMin}–${humidityMax} %RH` },
          { label: 'Heating time', value: 'Not applicable' },
          { label: 'Cooling time', value: 'Not applicable' },
          { label: 'Water guidance', value: 'Not applicable' },
          { label: 'Stability note', value: `Set humidity within ${humidityMin}–${humidityMax} %RH, or turn humidity control off` },
        ],
      };
    }

    const interpolate = (target, anchors = []) => {
      if (!anchors.length) return 0;
      if (target <= anchors[0][0]) return anchors[0][1];
      if (target >= anchors[anchors.length - 1][0]) return anchors[anchors.length - 1][1];
      for (let i = 0; i < anchors.length - 1; i += 1) {
        const [x0, y0] = anchors[i];
        const [x1, y1] = anchors[i + 1];
        if (target >= x0 && target <= x1) {
          return y0 + ((target - x0) / (x1 - x0)) * (y1 - y0);
        }
      }
      return anchors[anchors.length - 1][1];
    };

    const heatMinutes = Math.round(interpolate(targetTemp, data?.heatAnchors));
    const coolMinutes = Math.round(interpolate(targetTemp, data?.coolAnchors));
    let heating = `About ${count(heatMinutes)} minutes from ambient`;
    let cooling = `About ${count(coolMinutes)} minutes to ambient`;

    // Floor-standing models publish only full-span ramp figures per model, so
    // those are shown as stated (never scaled); sub-ambient targets on the
    // tabletop models interpolate between their stated cool-down examples.
    const reference = data?.rampReference;
    const belowAmbientAnchors = data?.belowAmbientCoolAnchors;
    if (reference) {
      const heatFull = selectedModel?.heatFullMin ?? reference.heatFullMin;
      const coolFull = selectedModel?.coolFullMin ?? reference.coolFullMin;
      if (targetTemp < ambient) {
        heating = 'Not applicable (cooling test)';
        cooling = targetTemp === tempMin
          ? `About ${count(coolFull)} minutes from ${ambient} C to ${tempMin} C`
          : `Up to about ${count(coolFull)} minutes from ${ambient} C (published ${ambient} to ${tempMin} C figure)`;
      } else if (targetTemp <= (reference.fewMinutesUpTo ?? 40)) {
        heating = 'A few minutes from ambient';
        cooling = 'A few minutes to ambient';
      } else if (targetTemp === tempMax) {
        heating = `About ${count(heatFull)} minutes from ${tempMin} C, less from ambient`;
        cooling = `About ${count(coolFull)} minutes back down`;
      } else {
        heating = `Up to about ${count(heatFull)} minutes (published ${tempMin} to ${tempMax} C figure), less from ambient`;
        cooling = `Up to about ${count(coolFull)} minutes back down`;
      }
    } else if (belowAmbientAnchors && targetTemp < ambient) {
      heating = 'Not applicable (cooling test)';
      cooling = `About ${count(Math.round(interpolate(targetTemp, belowAmbientAnchors)))} minutes from ambient to ${targetTemp} C`;
    }

    let rangeCheck = 'Within range - achievable';
    if (reference || belowAmbientAnchors) {
      if (targetTemp === tempMin) {
        rangeCheck = `Within range - reaches the ${tempMin} C minimum${data?.min50Hz != null ? ` (${data.min50Hz} C at 50 Hz)` : ''}`;
      } else if (data?.min50Hz != null && targetTemp < data.min50Hz) {
        rangeCheck = `Within range at 60 Hz only - the minimum is ${data.min50Hz} C at 50 Hz`;
      }
    }

    let waterGuidance;
    if (!needsHumidity) {
      const cold = (data?.coldWaterGuidance ?? []).find((tier) => targetTemp < tier.belowTemp);
      waterGuidance = cold?.text ?? 'No water needed';
    } else if (holdDays <= 7) {
      waterGuidance = selectedModel?.shortRunWaterGuidance ?? 'Refill tank is sufficient';
    } else {
      waterGuidance = 'Direct Water System recommended for the long hold';
    }

    return {
      assumption: data?.assumptionNote ?? '',
      cards: [
        { label: 'Range check', value: rangeCheck },
        { label: 'Heating time', value: heating },
        { label: 'Cooling time', value: cooling },
        { label: 'Water guidance', value: waterGuidance },
        { label: 'Stability note', value: `Holds within +/- ${tempFluctuation} C${needsHumidity ? ` and +/- ${humidityFluctuation} %RH` : ''}` },
      ],
    };
  },

  // Hours to reach a light dose: dose / (published rated output x the output
  // setting entered). Published uniformity gives the spread across positions.
  'photostability-exposure': ({ nums, picks, data }) => {
    const setting = Math.min(100, Math.max(1, nums.outputPercent ?? 100)) / 100;
    const uniformity = (data?.uniformityPercent ?? 0) / 100;
    const at = setting === 1 ? 'at rated output' : `at ${count(setting * 100)}% output`;
    const sources = {
      vis: { ...data?.visible, dose: Math.max(0, nums.visTarget ?? 0) },
      uva: { ...data?.uva, dose: Math.max(0, nums.uvaTarget ?? 0) },
    };
    const hoursFor = (source) => (source.ratedOutput > 0 ? source.dose / (source.ratedOutput * setting) : 0);
    const hrs = (value) => (value >= 10 ? count(value) : (Math.round(value * 10) / 10).toString());
    const dose = (value) => (value >= 1e6 && value % 1e5 === 0 ? `${value / 1e6} million` : EN.format(value));

    const lightType = picks?.lightType ?? 'vis';
    if (lightType === 'both') {
      const visHours = hoursFor(sources.vis);
      const uvaHours = hoursFor(sources.uva);
      return {
        assumption: data?.assumptionNote ?? '',
        cards: [
          { label: 'Sequence', value: `Run ${sources.vis.name} to ${dose(sources.vis.dose)} ${sources.vis.doseUnit}, then ${sources.uva.name} to ${dose(sources.uva.dose)} ${sources.uva.doseUnit}` },
          { label: 'Estimated time', value: `About ${hrs(visHours)} hr ${sources.vis.name} + ${hrs(uvaHours)} hr ${sources.uva.name} ${at}`, primary: true },
          { label: 'Uniformity', value: `+/- ${count(uniformity * 100)} % across the vertical area` },
          { label: 'Note', value: data?.combinedNote ?? '' },
        ],
      };
    }

    const source = sources[lightType] ?? sources.vis;
    const hours = hoursFor(source);
    return {
      assumption: data?.assumptionNote ?? '',
      cards: [
        { label: 'Rated output', value: setting === 1 ? source.ratedLabel : `${EN.format(Math.round(source.ratedOutput * setting * 10) / 10)} ${source.outputUnit} (${count(setting * 100)}% of ${source.ratedLabel})` },
        { label: 'Estimated time', value: `About ${hrs(hours)} hours ${at}`, primary: true },
        { label: 'Across sample positions', value: `About ${hrs(hours / (1 + uniformity))} to ${hrs(hours / (1 - uniformity))} hours within the +/- ${count(uniformity * 100)} % uniformity` },
        { label: 'Tracking', value: source.tracking ?? '' },
        { label: 'Auto lamp-off', value: source.lampOff ?? '' },
      ],
    };
  },

  // Target illuminance and CO2 against the chosen model's published limits;
  // the crop guidance is the product content's own text for that crop type.
  'growth-light-plan': ({ nums, picks, data }) => {
    const crops = data?.crops ?? [];
    const models = data?.models ?? [];
    const crop = crops.find((item) => item.val === picks?.cropType) ?? crops[0];
    const model = models.find((item) => item.val === picks?.chamberModel) ?? models[0];
    if (!crop || !model) return { cards: [] };
    const targetLux = Math.max(0, nums.targetLux ?? 0);
    const brighter = models.find((item) => item.maxLux >= targetLux && item.maxLux > model.maxLux);

    return {
      assumption: data?.assumptionNote ?? '',
      cards: [
        { label: 'Recommended light', value: crop.recommendedLight },
        {
          label: 'Light check',
          value: targetLux <= model.maxLux
            ? `${EN.format(targetLux)} Lux is within the ${model.name}'s 0 to ${EN.format(model.maxLux)} Lux range`
            : `${EN.format(targetLux)} Lux exceeds the ${model.name}'s ${EN.format(model.maxLux)} Lux maximum${brighter ? `; the ${brighter.name} reaches ${EN.format(brighter.maxLux)} Lux` : ''}`,
        },
        { label: 'Lamp setup', value: model.lampSetup },
        { label: 'CO2', value: picks?.co2 === 'yes' ? data?.co2OptionText ?? '' : crop.co2 },
        { label: 'Note', value: crop.note ?? model.note ?? '' },
      ],
    };
  },

  // A published row picked from a list (a block, a tray, a documented
  // scenario), with optional limit checks against what the visitor entered.
  'option-lookup': ({ nums, picks, data }) => {
    const options = data?.options ?? [];
    const row = options.find((item) => item.val === picks?.[data?.optionKey ?? 'option']) ?? options[0];
    if (!row) return { cards: [] };
    return { assumption: data?.assumptionNote ?? '', cards: applyChecks(row.cards ?? [], { nums, picks, data, row }) };
  },

  // Published vessel capacity (clamps, tubes, funnels...) per model or
  // platform, against the number the visitor needs; stacked units multiply it.
  'vessel-capacity': ({ nums, picks, data }) => {
    const rows = data?.rows ?? [];
    const row = rows.find((item) => item.val === picks?.[data?.rowKey ?? 'vesselSize']) ?? rows[0];
    const columns = data?.columns ?? [];
    if (!row || !columns.length) return { cards: [] };
    const needed = Math.max(0, nums.numberNeeded ?? 0);
    const units = Math.max(1, nums.units ?? 1);
    const baseUnit = row.unit ?? data?.unit ?? 'clamps';
    const unitFor = (n) => (n === 1 ? baseUnit.replace(/s$/, '') : baseUnit);
    const capacityOf = (column) => {
      const value = row.counts?.[column.key];
      return value == null ? null : value * units;
    };
    const cards = columns.map((column) => {
      const capacity = capacityOf(column);
      return {
        label: column.label,
        value: capacity == null
          ? (row.unsupportedText ?? 'Not supported')
          : `Up to ${count(capacity)} ${unitFor(capacity)}${units > 1 ? ` across ${count(units)} units` : ''}`,
      };
    });

    const fits = (column) => capacityOf(column) != null && capacityOf(column) >= needed;
    const preferred = columns.find((column) => column.key === picks?.preferredColumn);
    const fitting = preferred && fits(preferred) ? preferred : columns.find(fits);
    const largest = columns.reduce((best, column) => ((capacityOf(column) ?? 0) > (capacityOf(best) ?? 0) ? column : best), columns[0]);
    let fitResult;
    if (fitting) {
      fitResult = columns.length > 1
        ? `${count(needed)} x ${row.label} fit on the ${fitting.label} (up to ${count(capacityOf(fitting))})`
        : `${count(needed)} x ${row.label} fit in one run (up to ${count(capacityOf(fitting))})`;
    } else if (capacityOf(largest)) {
      const runs = Math.ceil(needed / capacityOf(largest));
      fitResult = `More than one run holds: about ${count(runs)} runs on the ${columns.length > 1 ? largest.label : 'platform'} (up to ${count(capacityOf(largest))} per run)`;
    } else {
      fitResult = data?.beyondText ?? 'Not supported - ask Inkarp for an alternative';
    }

    return {
      assumption: data?.assumptionNote ?? '',
      cards: applyChecks([...cards, { label: data?.fitLabel ?? 'Fit result', value: fitResult }, ...(row.cards ?? [])], { nums, picks, data, row }),
    };
  },

  // Achievable speed at a load, from the published load-speed ratings
  // (e.g. "10 kg at 500 rpm, 15 kg at 400 rpm"). Loads between ratings take
  // the next rating's lower speed rather than an invented in-between figure.
  'speed-at-load': ({ nums, picks, data }) => {
    const models = data?.models ?? [];
    const model = models.find((item) => item.val === picks?.model) ?? models[0];
    if (!model) return { cards: [] };
    const variant = data?.variantKey ? picks?.[data.variantKey] : null;
    const steps = model.stepsBy?.[variant] ?? model.steps ?? [];
    const cap = model.maxRpmBy?.[variant];
    const load = Math.max(0, nums.totalLoadKg ?? 0);
    const labels = { speed: 'Achievable speed', headroom: 'Load headroom', note: 'Note', ...data?.cardLabels };
    const rpmOf = (step) => (cap ? Math.min(step.rpm, cap) : step.rpm);
    const ratings = steps.map((step) => `${count(rpmOf(step))} rpm up to ${EN.format(step.maxKg)} kg`).join('; ');
    const tier = steps.find((step) => load <= step.maxKg);

    if (!tier) {
      const last = steps[steps.length - 1];
      return {
        assumption: data?.assumptionNote ?? '',
        cards: [
          { label: labels.speed, value: model.overloadSpeed ?? data?.overloadSpeed ?? 'Beyond the rated load' },
          { label: labels.headroom, value: `${EN.format(load)} kg exceeds the ${EN.format(last?.maxKg ?? 0)} kg rating of the ${model.name}` },
          { label: labels.note, value: data?.overloadNote ?? 'Reduce load or speed for stable operation' },
        ],
      };
    }
    const isTop = tier === steps[0];
    return {
      assumption: data?.assumptionNote ?? '',
      cards: [
        { label: labels.speed, value: isTop ? `Up to ${count(rpmOf(tier))} rpm` : `About ${count(rpmOf(tier))} rpm at ${EN.format(load)} kg` },
        { label: labels.headroom, value: `Within the ${EN.format(tier.maxKg)} kg rating at ${count(rpmOf(tier))} rpm` },
        { label: labels.note, value: `${model.name}: ${ratings}` },
      ],
    };
  },

  // Carboy shaking: achievable rpm read from the published holder table by
  // water weight (the next published column at or above the entered volume).
  'rpm-by-load-table': ({ nums, picks, data }) => {
    const rows = data?.rows ?? [];
    const row = rows.find((item) => item.model === picks?.model && item.holder === picks?.holder) ?? rows[0];
    if (!row) return { cards: [] };
    const litres = Math.max(0, nums.waterLitres ?? 0);
    const holderLabel = data?.holderLabels?.[row.holder] ?? row.holder;
    if (litres > row.maxLitres) {
      return {
        assumption: data?.assumptionNote ?? '',
        cards: [
          { label: 'Achievable rpm', value: 'Not applicable' },
          { label: 'Holder', value: holderLabel },
          { label: 'Note', value: `${EN.format(litres)} L exceeds the ${EN.format(row.maxLitres)} L this holder takes` },
        ],
      };
    }
    const column = (data?.columns ?? []).findIndex((max) => litres <= max);
    const rpm = row.rpm[column];
    const notes = data?.notes ?? {};
    let note = notes.default;
    if (litres === 0) note = notes.empty ?? note;
    else if (row.vessels > 1) note = notes.multiple ?? note;
    else if (column === row.rpm.length - 1) note = notes.largest ?? note;
    return {
      assumption: data?.assumptionNote ?? '',
      cards: [
        { label: 'Achievable rpm', value: `About ${count(rpm)} rpm`, note: `Published value for up to ${EN.format(data.columns[column])} L of water.` },
        { label: 'Holder', value: holderLabel },
        { label: 'Note', value: note ?? '' },
      ],
    };
  },

  // Plant height against each model's published interior height; the tray
  // count is spread over the levels that height allows. Humidity narrows the
  // candidates to the models with humidity control.
  'plant-fit-check': ({ nums, picks, data }) => {
    const trays = Math.max(0, nums.traysOrPots ?? 0);
    const plantHeight = Math.max(1, nums.plantHeightMm ?? 1);
    const needsHumidity = picks?.humidityNeeded === 'yes';
    const models = (data?.models ?? []).filter((model) => !needsHumidity || model.humidity);
    const heightOk = (model) => plantHeight <= model.interiorMm.h;
    const preferred = models.find((model) => model.name === picks?.preferredModel);
    const chosen = preferred && heightOk(preferred) ? preferred : models.find(heightOk);

    if (!chosen) {
      const tallest = Math.max(0, ...models.map((model) => model.interiorMm.h));
      return {
        assumption: data?.assumptionNote ?? '',
        cards: [
          { label: 'Recommended model', value: data?.beyondRangeLabel ?? 'Beyond chamber height' },
          { label: 'Usable shelves', value: 'Not sufficient' },
          { label: 'Height', value: `${count(plantHeight)} mm exceeds the tallest interior (${count(tallest)} mm)` },
          { label: 'Fit result', value: data?.beyondRangeFit ?? 'Ask Inkarp for a size-matched recommendation' },
        ],
      };
    }

    const { w, d, h } = chosen.interiorMm;
    const levels = Math.max(1, Math.min(chosen.maxShelves, Math.floor(h / plantHeight)));
    const perLevel = Math.ceil(trays / levels);
    const preferredNote = preferred && preferred !== chosen
      ? ` (${preferred.name} is ${needsHumidity && !preferred.humidity ? 'without humidity control' : 'too short'})`
      : '';

    return {
      assumption: data?.assumptionNote ?? '',
      cards: [
        { label: 'Recommended model', value: `${chosen.name}${preferredNote}` },
        {
          label: 'Usable shelves',
          value: levels === 1
            ? `Remove shelves for the full ${count(h)} mm interior height`
            : `About ${count(levels)} levels at this plant height (${chosen.shelvesLabel})`,
        },
        { label: 'Height', value: `${count(plantHeight)} mm plants fit the ${count(h)} mm interior height` },
        { label: 'Fit result', value: `About ${count(perLevel)} tray(s) or pot(s) per level on a ${count(w)} x ${count(d)} mm shelf area` },
      ],
    };
  },
};

function cleanNumber(value, { min = 0, max } = {}) {
  const next = Math.round(Number(value));
  if (!Number.isFinite(next)) return min;
  if (max != null && next > max) return max;
  return Math.max(min, next);
}

function NumberInput({ field, onChange, value }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-black">{field.label}</span>
      <input
        className="mt-2 h-11 w-full border border-line-light bg-parchment-alt px-4 text-lg font-semibold tracking-tight text-ink outline-none transition focus:border-red focus:bg-parchment focus:ring-4 focus:ring-red/10"
        max={field.max}
        min={field.min ?? 0}
        onChange={(event) => onChange(cleanNumber(event.target.value, field))}
        step="1"
        type="number"
        value={value}
      />
    </label>
  );
}

function ChoiceInput({ field, onChange, value }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-black">{field.label}</span>
      <select
        className="mt-2 h-11 w-full border border-line-light bg-parchment-alt px-4 text-sm font-semibold text-ink outline-none transition focus:border-red focus:bg-parchment focus:ring-4 focus:ring-red/10"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {field.options.map((option) => (
          <option key={option.val} value={option.val}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

/**
 * Data-driven calculator: the content supplies the labels, defaults and which
 * `formula` to run; this component owns the arithmetic and the layout. Products
 * that only need a picker should use SuitabilityChecker or ConfigWizard instead.
 */
export default function MetricCalculator({ data, productName = 'this product' }) {
  const fields = data?.fields ?? [];
  const choices = data?.choices ?? [];
  const compute = FORMULAS[data?.formula];
  const requiresRun = Boolean(data?.requiresRun);

  const [nums, setNums] = useState(() =>
    Object.fromEntries(fields.map((field) => [field.key, field.default ?? 0]))
  );
  const [picks, setPicks] = useState(() =>
    Object.fromEntries(choices.map((choice) => [choice.key, choice.default ?? choice.options?.[0]?.val]))
  );
  const [runValues, setRunValues] = useState(null);

  const resetCalculator = () => {
    setNums(Object.fromEntries(fields.map((field) => [field.key, field.default ?? 0])));
    setPicks(Object.fromEntries(choices.map((choice) => [choice.key, choice.default ?? choice.options?.[0]?.val])));
    setRunValues(null);
  };

  const applyPreset = (preset) => {
    if (preset.nums) setNums((current) => ({ ...current, ...preset.nums }));
    if (preset.picks) setPicks((current) => ({ ...current, ...preset.picks }));
    setRunValues(null);
  };

  const results = useMemo(
    () => {
      if (!compute || (requiresRun && !runValues)) return null;
      return compute({
        nums: requiresRun ? runValues.nums : nums,
        picks: requiresRun ? runValues.picks : picks,
        data,
      });
    },
    [compute, data, nums, picks, requiresRun, runValues]
  );

  // A pure lookup can be driven by choices alone, with no numeric inputs.
  if (!compute || (!fields.length && !choices.length)) return null;

  const summary = [
    ...choices.map((choice) => {
      const picked = choice.options.find((option) => option.val === picks[choice.key]);
      return `${choice.label}: ${picked?.label ?? picks[choice.key]}`;
    }),
    ...fields.map((field) => `${field.label}: ${nums[field.key] ?? 0}`),
    '',
    ...(results?.cards ?? []).map((card) => `${card.label}: ${card.value}`),
  ].join('\n');

  return (
    <section
      className={`scroll-mt-32 border-b border-line-light px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16 ${data?.surface === 'alt' ? 'bg-parchment-alt' : 'bg-white'}`}
      id={data?.sectionId ?? 'calculator'}
    >
      <div className="relative mx-auto w-full max-w-[1180px]">
        <SectionHeader description={data?.description} eyebrow={data?.eyebrow} title={data?.title} />

        <div className="relative mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="min-w-0 border border-line-light bg-parchment p-4 sm:p-6">
            {data?.promptTitle ? (
              <h3 className="mb-4 text-lg font-semibold tracking-tight text-ink">{data.promptTitle}</h3>
            ) : null}
            {data?.presets?.length > 0 ? (
              <div className="mb-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">{data.presetsLabel ?? 'Try a common target'}</p>
                <div className="flex flex-wrap gap-2">
                  {data.presets.map((preset) => (
                    <button
                      className="border border-line-light bg-parchment-alt px-3 py-2 text-xs font-semibold text-ink transition hover:border-red hover:text-red"
                      key={preset.label}
                      onClick={() => applyPreset(preset)}
                      type="button"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="space-y-4">
              {choices.map((choice) => (
                <ChoiceInput
                  field={choice}
                  key={choice.key}
                  onChange={(next) => {
                    setPicks((current) => ({ ...current, [choice.key]: next }));
                    if (requiresRun) setRunValues(null);
                  }}
                  value={picks[choice.key] ?? ''}
                />
              ))}
              {fields.map((field) => (
                <NumberInput
                  field={field}
                  key={field.key}
                  onChange={(next) => {
                    setNums((current) => ({ ...current, [field.key]: next }));
                    if (requiresRun) setRunValues(null);
                  }}
                  value={nums[field.key] ?? 0}
                />
              ))}
            </div>

            {requiresRun && !results ? (
              <button
                className="mt-5 inline-flex w-full items-center justify-center border border-red bg-red px-5 py-3 text-sm font-semibold text-white transition hover:bg-red/90 sm:w-auto"
                onClick={() => setRunValues({ nums: { ...nums }, picks: { ...picks } })}
                type="button"
              >
                {data.runLabel ?? 'Run Calculation'}
              </button>
            ) : null}

            {data?.showRetry && results ? (
              <button
                className="mt-5 inline-flex items-center justify-center border border-line-light bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-red hover:text-red"
                onClick={resetCalculator}
                type="button"
              >
                {data.retryLabel ?? 'Retry with New Values'}
              </button>
            ) : null}

            {results?.assumption ? (
              <p className="mt-4 border border-line-light bg-parchment-alt px-4 py-3 text-xs leading-6 text-ink-soft">
                {results.assumption}
              </p>
            ) : null}

            {results && data?.ctaNote ? (
              <p className="mt-4 text-sm leading-6 text-black">{data.ctaNote}</p>
            ) : null}

            {results ? (
              <LeadCaptureForm
                className="mt-5 w-full"
                formType="metric-calculator"
                productName={productName}
                successMessage={(name) =>
                  `Thank you${name ? `, ${name}` : ''}. We have sent your numbers to our team.`
                }
                summary={summary}
                triggerLabel={data?.submitLabel ?? 'Get Configuration Support'}
              />
            ) : null}
          </div>

          <div className="min-w-0 space-y-3">
            {!results ? (
              <div className="flex min-h-[280px] items-center justify-center border border-dashed border-line-light bg-parchment-alt p-6 text-center">
                <div>
                  <p className="text-lg font-semibold text-ink">{data?.emptyTitle ?? 'Your test-cycle output will appear here'}</p>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">{data?.emptyText ?? 'Choose the conditions and chamber model, then run the test cycle.'}</p>
                </div>
              </div>
            ) : results.cards.map((card) => {
              // Short numeric/₹ readouts (most calculators) stay big and punchy.
              // A checker-style calculator can return a full phrase instead of a
              // number (e.g. "Within range — achievable") — that shouldn't blow
              // up to the same huge size, or it wraps awkwardly and overwhelms
              // the card, so long text drops to a smaller, wrap-friendly size.
              const isLongText = typeof card.value === 'string' && card.value.length > 20;
              const valueSizeClass = isLongText
                ? 'text-lg leading-snug sm:text-xl'
                : card.primary
                  ? 'text-4xl leading-none sm:text-5xl'
                  : 'text-2xl leading-none sm:text-3xl';

              return (
              <div
                className={`border border-line-light p-5 sm:p-6 ${card.primary ? 'bg-parchment-alt' : 'bg-parchment'}`}
                key={card.label}
              >
                <p className={`text-sm font-semibold ${card.primary ? 'text-ink-soft' : 'text-black'}`}>
                  {card.label}
                </p>
                <div
                  className={`mt-4 font-semibold tracking-tight ${valueSizeClass} ${
                    card.primary ? 'text-red' : 'text-ink'
                  }`}
                >
                  {card.value}
                </div>
                {card.note ? <p className="mt-3 text-sm leading-6 text-ink-soft">{card.note}</p> : null}
              </div>
              );
            })}
          </div>
        </div>

        <SectionDisclaimer>{data?.disclaimer}</SectionDisclaimer>
      </div>
    </section>
  );
}
