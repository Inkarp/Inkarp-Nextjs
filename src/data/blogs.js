// "Application Notes" was retired — those 21 posts are now Industry Insights.
// Only categories that actually have posts belong here, so the filter never
// offers an option that returns an empty list.
export const categories = ["All", "Industry Insights"];

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getFirstTextContent(post) {
  const firstText = post.sections?.find((section) => section.type === "text");
  return firstText?.content || "";
}

// Posts imported from the old site kept each paragraph's original line wrapping,
// so a sentence can carry on to the next line ("...are paramount for\nhigh-quality
// results"). A line that stops mid-sentence is joined to the next one when that
// carries on in lower case; real paragraph breaks and blank lines stay breaks.
export function toParagraphs(content = "") {
  const paragraphs = [];
  let joinable = false;
  for (const raw of content.split("\n")) {
    const line = raw.trim();
    if (!line) {
      joinable = false;
      continue;
    }
    const previous = paragraphs[paragraphs.length - 1];
    if (joinable && !/[.!?:;"”]$/.test(previous) && /^[a-z(]/.test(line)) {
      paragraphs[paragraphs.length - 1] = `${previous} ${line}`;
    } else {
      paragraphs.push(line);
    }
    joinable = true;
  }
  return paragraphs;
}

// The first paragraph (never a repeat of the title), cut at a word with "…".
function getExcerpt(post, maxLength = 220) {
  const first = toParagraphs(getFirstTextContent(post)).find((paragraph) => paragraph !== post.title) ?? "";
  return first.length <= maxLength ? first : `${first.slice(0, maxLength).replace(/\s+\S*$/, "")}…`;
}

const rawPosts = [
  {
    "id": 1,
    "title": "Revolutionizing Sample Preparation in Analytical Laboratories",
    "category": "Industry Insights",
    "date": "2025-07-19",
    "author": "Inkarp Applications Team",
    "readTime": "5 min read",
    "image": "/assets/images/productImages/Mettler/xpr205du.jpg",
    "tags": [
      "Gravimetric Dosing",
      "Sample Preparation",
      "Pharma QC"
    ],
    "sections": [
      {
        "type": "text",
        "content": "In pharmaceutical analysis, precision and error reduction are paramount for\nhigh-quality results. Traditional volumetric methods often introduce variability,\nleading to Out of Specification (OOS) results that disrupt analytical laboratory\nworkflows. Gravimetric sample preparation offers a transformative solution,\nenhancing weighing accuracy in labs, reducing laboratory errors, and improving\nefficiency. This blog explores how the gravimetric method addresses these\nchallenges, with insights from key figures and tables in the original document."
      },
      {
        "type": "text",
        "heading": "Understanding Gravimetric Sample Preparation",
        "content": "Gravimetric sample preparation involves weighing both the solid sample and the\nsolvent to achieve precise concentrations, unlike the volumetric method, which\nrelies on less accurate volume measurements using volumetric glassware. By\nleveraging gravimetric dosing mixing systems like Quantos powder, this approach\nminimizes variability, reduces OOS results, and streamlines laboratory processes."
      },
      {
        "type": "text",
        "heading": "The Impact of Out-of-Specification Results",
        "content": "OOS results have long challenged the pharmaceutical industry, notably since a 1993\ncourt ruling involving Barr Labs, which clarified that OOS results may stem from\nlaboratory errors rather than batch failures. The FDA’s 2006 guidelines emphasized\nthorough laboratory investigations to identify root causes. Figure 1 highlights\nsample processing and human error as the primary sources of OOS results, with\nsample processing consuming over 61% of laboratory time. Figure 2 illustrates the\nformal OOS investigation process, which can take days or months, costing\nthousands of dollars and generating complex Corrective and Preventative Actions\n(CAPAs) that complicate SOPs."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/revolutionizing-sample-preparation-in-analytical-laboratories/Sources-of-OOS-results-and-time-spent-in-laborator.JPG",
        "caption": "sources of OOS results and time spent in laboratory"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/revolutionizing-sample-preparation-in-analytical-laboratories/Formal-process-for-an-OOS-investigation.JPG"
      },
      {
        "type": "text",
        "heading": "Good Weighing Practice: Ensuring Accuracy",
        "content": "The Good Weighing Practice (GWP) standard provides a scientific foundation for\nweighing accuracy in labs, addressing measurement uncertainty and minimum\nweight requirements per USP General Chapter . Figure 3 shows how\nmeasurement uncertainty increases with smaller sample weights, emphasizing the\nneed for precise calibration balance procedures. A common misconception is that\ntare weight contributes to minimum weight compliance, but USP General Chapter\nclarifies that only the sample weight matters."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/revolutionizing-sample-preparation-in-analytical-laboratories/Figure-3.JPG",
        "caption": "Measurement Uncertainty: Absolute (green line) and relative (blue line) measurement uncertainty of a weighing instrument. The accuracy limit of the balance, the so-called minimum weight, is the intersection point between relative measurement uncertainty and the required weighing accuracy."
      },
      {
        "type": "text",
        "content": "To account for types of laboratory variability, such as environmental factors and\noperator inconsistencies, a safety factor is applied—typically 2 for manual weighing\nbut reduced to 1.5 for automated sample preparation systems like Quantos. Figure\n4 likely illustrates the application of this safety factor, showing how it compensates\nfor variability in weighing processes to ensure reliable results."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/revolutionizing-sample-preparation-in-analytical-laboratories/Figure-4.JPG",
        "caption": "Safety Factor: Variability of the relative measurement uncertainty due to changing environmental conditions and influences introduced by the operator. Weighing in the green area guarantees adherence to the weighing accuracy requirements (application of a safety factor)."
      },
      {
        "type": "text",
        "heading": "Challenges with Volumetric Methods",
        "content": "The volumetric method relies on volumetric glassware, introducing several error\nsources:"
      },
      {
        "type": "text",
        "content": "Figure 5 details a typical volumetric method workflow, outlining steps like gathering\nequipment and material, weighing, labeling, sonicating, and cleaning. This\nmulti-step process, often exceeding 40 steps for multiple samples, is prone to\nlaboratory errors. Figure 6 contrasts tuned and untuned sonicators, highlighting\ninconsistent energy distribution in mixing, a key source of variability. Manual labeling\nfurther risksNums OOS results due to identification errors, requiring solvent-based\nremoval that adds inefficiencies."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/revolutionizing-sample-preparation-in-analytical-laboratories/Simple-sample-preparation-workflow.JPG",
        "caption": "Simple sample preparation workflow"
      },
      {
        "type": "table",
        "columns": [
          "Pipettes",
          "Flasks"
        ],
        "rows": [
          [
            "Volume (mL)",
            "Relative % Error",
            "Volume (mL)",
            "Relative % Error"
          ],
          [
            "1",
            "0.60",
            "5",
            "0.40"
          ],
          [
            "2",
            "0.30",
            "10",
            "0.20"
          ],
          [
            "3",
            "0.33",
            "25",
            "0.12"
          ],
          [
            "4",
            "0.25",
            "50",
            "0.10"
          ],
          [
            "5",
            "0.20",
            "100",
            "0.08"
          ],
          [
            "10",
            "0.20",
            "200",
            "0.05"
          ]
        ]
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/revolutionizing-sample-preparation-in-analytical-laboratories/Foils-from-a-tuned-and-untuned-sonicator.JPG",
        "caption": "Foils from a tuned and untuned sonicator"
      },
      {
        "type": "text",
        "heading": "The Advantages of Gravimetric Sample Preparation",
        "content": "Gravimetric sample preparation, as per USP General Chapter , uses\nautomated sample preparation systems like the Quantos powder gravimetric\ndosing mixing system, depicted in Figure 7 . These systems, equipped with RFID\n(radio frequency identification) for process security, weigh solids and liquids into disposable vials, eliminating cross-contamination risk. volumetric glassware and reducing"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/revolutionizing-sample-preparation-in-analytical-laboratories/Mettler-Toledo-XPE205-Balance.jpg",
        "caption": "Mettler Toledo XPE205 Balance"
      },
      {
        "type": "text",
        "content": "Mettler Toledo XPE205 Balance"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/revolutionizing-sample-preparation-in-analytical-laboratories/Mettler-Toledo-XPE206DR-Balance.jpg",
        "caption": "Mettler Toledo XPE206DR Balance"
      },
      {
        "type": "text",
        "content": "Mettler Toledo XPE206DR Balance"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/revolutionizing-sample-preparation-in-analytical-laboratories/Gravimetric-dispensing-systems-XPE-balances-with-Quantos-powder-and-liquid-dosing-modules.JPG",
        "caption": "Gravimetric dispensing systems: XPE balances with Quantos powder and liquid dosing modules"
      },
      {
        "type": "table",
        "columns": [
          "Sample Preparation",
          "Volumetric",
          "Gravimetric"
        ],
        "rows": [
          [
            "Configuration",
            "XPE205 balance\nVolumetric flask",
            "XPE205 balance\nLiquid module",
            "XPE205 balance\nPowder module\nLiquid module",
            "XPE206DR balance\nPowder module\nLiquid module"
          ],
          [
            "Sample dispensed",
            "Manual\n(with spatula)",
            "Manual\n(with spatula)",
            "Automated or manual*",
            "Automated or manual*"
          ],
          [
            "Calculation of amount\nof diluent required",
            "Manual",
            "Automatic\n(based on actual sample weight)",
            "Automatic\n(based on actual sample weight)",
            "Automatic\n(based on actual sample weight)"
          ],
          [
            "Diluent dispensed",
            "Manual (with pipette)",
            "Automated",
            "Automated",
            "Automated"
          ],
          [
            "Diluent units",
            "mL",
            "g",
            "g",
            "g"
          ],
          [
            "Concentration units",
            "mg/mL",
            "mg/g",
            "mg/g",
            "mg/g"
          ],
          [
            "USP Minimum Weight**\n(0.10%, k = 2, 5% load)",
            "14 mg",
            "14 mg",
            "10 mg (automated)\n14 mg (manual)",
            "7 mg (automated)\n10 mg (manual)"
          ],
          [
            "Minimum Weight**\n(U=1.0%, k = 2, 5% load)",
            "1.4 mg",
            "1.4 mg",
            "1.0 mg (automated)\n1.4 mg (manual)",
            "0.7 mg (automated)\n1.0 mg (manual)"
          ]
        ]
      },
      {
        "type": "text",
        "heading": "Key Benefits of Gravimetric Sample Preparation",
        "content": "* = Automated powder dispensing for free-flowing powders; Manual dispensing for sticky powders, pastes, gels, liquid samples, etc."
      },
      {
        "type": "text",
        "content": "These automated gravimetric systems are being adopted by analytical and QA/QC laboratories in the pharmaceutical industry."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/revolutionizing-sample-preparation-in-analytical-laboratories/New-simplified-sample-prep-workflow-using-a-gravimetric-approach.JPG",
        "caption": "New simplified sample prep workflow using a gravimetric approach"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/revolutionizing-sample-preparation-in-analytical-laboratories/Comparison-of-volumetric-and-gravimetric-sample-preparation-on-the-amount-of-solvent-used.JPG",
        "caption": "Comparison of volumetric and gravimetric sample preparation on the amount of solvent used"
      },
      {
        "type": "table",
        "columns": [
          "Sample Preparation",
          "Manual Volumetric",
          "Automatic Gravimetric"
        ],
        "rows": [
          [
            "Configuration",
            "XPE205 balance\nVolumetric flask",
            "XPE205 balance\nLiquid module",
            "XPE205 balance\nPowder module\nLiquid module",
            "XPE206DR balance\nPowder module\nLiquid module"
          ],
          [
            "USP Minimum Weight*\n(0.10%, k = 2, 5% load)",
            "14 mg",
            "14 mg",
            "10 mg (automated)",
            "7 mg (automated)"
          ],
          [
            "Recommended safety\nfactor **",
            "2",
            "2",
            "1.5",
            "1.5"
          ],
          [
            "Lowest sample weighed\nout",
            "28 mg",
            "28 mg",
            "13.5 mg",
            "10.5 mg"
          ],
          [
            "Concentration prepared examples (mg/mL or mg/g)",
            "0.5",
            "1.0",
            "0.5",
            "1.0",
            "0.5",
            "1.0",
            "0.5",
            "1.0"
          ],
          [
            "Amount of solid dis-\npensed (mg)",
            "50",
            "50",
            "28",
            "28",
            "15",
            "15",
            "10.5",
            "10.5"
          ],
          [
            "Amount of diluent required\n(mL or g)",
            "100",
            "50",
            "56",
            "28",
            "30",
            "15",
            "21",
            "10.5"
          ],
          [
            "Substance savings compared to Manual method:",
            "44%",
            "70%",
            "79%"
          ]
        ]
      },
      {
        "type": "text",
        "content": "** = The safety factor quoted is that recommended for stable environments and trained operators. For unstable environmental conditions\nor insufficiently trained operators higher safety factors should be used."
      },
      {
        "type": "text",
        "heading": "Volumetric vs. Gravimetric: A Direct Comparison",
        "content": "Table 4 highlights how gravimetric sample preparation reduces determinate and\nindeterminate errors compared to the volumetric method. For a 0.25 mg/mL\nsolution, the volumetric method requires a 200 mL flask and 50 mg of material,\nwhile the gravimetric method uses significantly less. Table 5 details an experiment\nwhere a 0.603 mg/g standard was prepared with high precision using Quantos,\ncontrasted with Table 6, showing higher variability (0.60% RSD) in the volumetric\nmethod versus 0.40% for the gravimetric method. Table 7 summarizes these\nadvantages, emphasizing substance savings, reduced cross-contamination risk, and\nimproved accuracy."
      },
      {
        "type": "table",
        "columns": [
          "Step",
          "Volumetric",
          "Gravimetric"
        ],
        "rows": [
          [
            "Determinate Errors",
            "Indeterminate Errors",
            "Determinate Errors",
            "Indeterminate Errors"
          ],
          [
            "200 mL container",
            "0.05%",
            "Uncalibrated",
            "N/A – volumetric flasks are not required",
            ""
          ],
          [
            "Weigh 50 mg sample",
            "–",
            "0.1% balance\nOthers are accounted\nfor using a safety factor\nof 2 or higher",
            "–",
            "0.1% balance\nOthers are accounted\nfor using a safety factor\nof 1.5, if automated\n(in a controlled lab\nenvironment)"
          ],
          [
            "Sample transfer",
            "Re-weighing container",
            "Powder transfer",
            "N/A – transfer of sample to volumetric flask\nis not required"
          ],
          [
            "Fill to mark",
            "–",
            "Reading meniscus and\ntemperature effects",
            "N/A – no subjective reading of meniscus\nrequired with gravimetric method"
          ]
        ]
      },
      {
        "type": "text",
        "content": "Table 4 : Comparing errors in volumetric and gravimetric processes"
      },
      {
        "type": "table",
        "columns": [
          "# Solution",
          "Dose API\n(mg)",
          "Solvent\nadded (g)",
          "Solution\nConcentration\n(mg/g)",
          "Area",
          "Area\ncorrelated to\n0.6 mg/g",
          "Injector\nAccuracy\nSolution 1",
          "Area"
        ],
        "rows": [
          [
            "1",
            "10.105",
            "16.7481",
            "0.60299",
            "2596.8833",
            "2584.00634",
            "Inj. 1",
            "2593.06665"
          ],
          [
            "2",
            "10.320",
            "17.1048",
            "0.60298",
            "2595.35474",
            "2582.52818",
            "Inj. 2",
            "2604.43384"
          ],
          [
            "3",
            "10.140",
            "16.8063",
            "0.60298",
            "2597.53027",
            "2584.69296",
            "Inj. 3",
            "2604.12378"
          ],
          [
            "4",
            "10.125",
            "16.7815",
            "0.60298",
            "2595.5564",
            "2582.72885",
            "Inj. 4",
            "2604.89429"
          ],
          [
            "5",
            "10.250",
            "16.9885",
            "0.60299",
            "2597.12427",
            "2584.24611",
            "Inj. 5",
            "2607.99683"
          ],
          [
            "6",
            "10.200",
            "16.9058",
            "0.60298",
            "2596.04517",
            "2583.2152",
            "Inj. 6",
            "2605.37231"
          ],
          [
            "7",
            "10.130",
            "16.7895",
            "0.60299",
            "2602.42212",
            "2589.51769",
            "Inj. 7",
            "2602.29541"
          ],
          [
            "8",
            "10.040",
            "16.6408",
            "0.60297",
            "2609.64868",
            "2596.79455",
            "Inj. 8",
            "2608.33862"
          ],
          [
            "9",
            "10.275",
            "17.0297",
            "0.60299",
            "2604.74341",
            "2591.82747",
            "Inj. 9",
            "2593.23218"
          ],
          [
            "–",
            "–",
            "–",
            "–",
            "–",
            "–",
            "Inj. 10",
            "2601.73145"
          ],
          [
            "Mean",
            "10.176",
            "16.866",
            "0.603",
            "2599.479",
            "2586.617",
            "Mean",
            "2602.549"
          ],
          [
            "σ",
            "0.09092503",
            "0.150659114",
            "7.07107e-06",
            "5.000822667",
            "4.983629696",
            "σ",
            "5.37642343"
          ],
          [
            "RSD (%)",
            "0.894",
            "0.893",
            "0.001",
            "0.19",
            "0.19",
            "RSD (%)",
            "0.21"
          ]
        ]
      },
      {
        "type": "table",
        "columns": [
          "Manual Dose"
        ],
        "rows": [
          [
            "#",
            "Blend dosed\nmg",
            "Flask Size\nml",
            "Conc. achieved\nmg/ml"
          ],
          [
            "1",
            "12.920",
            "20",
            "0.646"
          ],
          [
            "2",
            "12.960",
            "20",
            "0.648"
          ],
          [
            "3",
            "12.860",
            "20",
            "0.643"
          ],
          [
            "4",
            "12.840",
            "20",
            "0.642"
          ],
          [
            "5",
            "13.060",
            "20",
            "0.653"
          ],
          [
            "6",
            "12.980",
            "20",
            "0.649"
          ],
          [
            "7",
            "12.860",
            "20",
            "0.643"
          ],
          [
            "8",
            "12.800",
            "20",
            "0.640"
          ],
          [
            "9",
            "12.860",
            "20",
            "0.643"
          ],
          [
            "10",
            "12.920",
            "20",
            "0.646"
          ],
          [
            "Mean",
            "12.906",
            "20",
            "0.645"
          ],
          [
            "σ",
            "0.078",
            "0.0",
            "0.004"
          ],
          [
            "% RSD",
            "0.60%",
            "0.0",
            "0.57%"
          ]
        ]
      },
      {
        "type": "table",
        "columns": [
          "",
          "Manual Volumetric",
          "Automated Gravimetric"
        ],
        "rows": [
          [
            "Substance saving",
            "Uses for more substance than necessary due to:\n– Higher minimum weight\n– Higher safety factor\n– Scaling up to appropriate size of volumetric flask",
            "– Smaller minimum weight = smaller sample sizes\n– Dispense directly into target vessel and avoid loss on transfer\n– No sample spillage or overshooting target weight\n– Eliminates need to prepare duplicate samples due to OOS weighing errors"
          ],
          [
            "Diluent addition accuracy",
            "Manual volumetric method has many\npotential error risks:\n– Meniscus reading is subjective\n– Temperature deviation of contents compared to calibrated temperature\n– Cross-contamination risk\n– Incorrect pour/drain times\n– Dishwasher damage\n– Up to 50% failure rates to comply with Class A specifications\n– Recalibration recommended every 10 years",
            "Automated gravimetric method is\nhighly accurate:\n– Amount of liquid needed is calcu- lated automatically based on the actual weight of solid which.\n– Eliminates manual calculation errors\n– Eliminates human error in choice of pipette\n– Eliminates human error in choice of flask\n– The amount of solvent dispensed gravimetrically is far above the mini- mum weight therefore measurement uncertainty of this step is negligible"
          ]
        ]
      },
      {
        "type": "table",
        "columns": [
          "",
          "Manual Volumetric",
          "Automated Gravimetric"
        ],
        "rows": [
          [
            "Process and data security",
            "– Requires hand transcription\n– Relies on diligence of analyst",
            "– Automated data transcription\n– Labels/documentation generated automatically\n– Integrated RFID chip stores and tracks substance information and eliminates risk of sample confusion\n– Data is electronically recorded and fully traceable"
          ],
          [
            "Potential for cross-contamination",
            "Volumetric flasks are re-used. They have to be rinsed before and after each use.",
            "– Disposable dosing head is used for a single substance only which elimi- nates cross contamination\n– The dosing head is stored in a trans- port container which protects it from the atmosphere\n– Each solvent has a unique liquid dosing head. There are no valves or washing of lines is necessary.\n– Disposable vial used to prepare samples."
          ],
          [
            "User Safety",
            "Manual weighing of solids and sample preparation involves close contact for user.",
            "Automated dispensing reduces user\nexposure:– The powder is contained in the dosing head– The dosing head is a closed system\n– Only the required amount of powder is released from the dosing head\n– An optional safety enclosure is avail- able"
          ]
        ]
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "Gravimetric sample preparation revolutionizes analytical laboratory workflows by\naddressing the root causes of OOS results. Using automated sample preparation\nsystems like Quantos, laboratories achieve superior weighing accuracy, eliminate\nvolumetric glassware errors, and enhance efficiency. These systems reduce\nlaboratory errors, minimize waste, and improve compliance through automated\ndata management. For laboratories seeking precision and reliability, the gravimetric\nmethod is a critical advancement."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments ,\na trusted supplier and service provider for\nMettler Toledo\nproducts in India, offers cutting-edge scientific solutions customized to meet the\nevolving demands of modern research. Committed to excellence and dependability,\nwe equip researchers nationwide with innovative technology and expert support to\ndrive advancements and achieve groundbreaking discoveries."
      },
      {
        "type": "text",
        "content": "1. United States of America v. Barr Laboratories, Inc., 812 F Supp 458 (DNJ 1993)."
      },
      {
        "type": "text",
        "content": "2. U.S. Food and Drug Administration. Guidance for Industry: Investigating\nout-of-specification (OOS) test results for pharmaceutical production. FDA. Available\nat:\nwww.fda.gov/downloads/Drugs/GuidanceCompli-anceRegulatoryInformation/Guida\nnces/UCM070287.pdf."
      },
      {
        "type": "text",
        "content": "3. Majors, R.E. LC/GC Magazine, 1991, 1997, 2002"
      },
      {
        "type": "text",
        "content": "4. General Chapter “Weights and Balances”, US Pharmacopeia USP34 – NF29,\nRockville, Maryland, 2013, Online-Edition"
      },
      {
        "type": "text",
        "content": "5. GWP® - Good Weighing PracticeTM – A Risk-Based Approach to Select and Test\nWeighing Instruments, White Paper, Mettler-Toledo AG, Greifensee, Switzerland, July\n2009."
      },
      {
        "type": "text",
        "content": "6. Reichmuth A., Fritsch K., Good Weighing Practices in the Pharmaceutical Industry – Risk-Based Qualifica- tion and Life Cycle Management of Weighing Systems,\nPharmaceutical Engineering, Volume 29, Number 6, ISPE, Tampa FL, USA, 2009."
      },
      {
        "type": "text",
        "content": "7. Fritsch K., Quenot J.-L., Good Weighing Practices – Avoid OOS Results with Proper\nWeighing, Pharmaceuti- cal Formulation & Quality, Volume 14, Number 1,\nWiley-Blackwell, Hoboken, NJ, USA, 2012."
      },
      {
        "type": "text",
        "content": "8. Evaluation of Measurement Data – Guide to the Expression of Uncertainty in\nMeasurement (GUM), JCGM 100:2008, Bureau International des Poids et Mesures,\nSèvres, France, 2008. Available at www.bipm.org."
      }
    ],
    "comments": [],
    "slug": "revolutionizing-sample-preparation-in-analytical-laboratories",
    "excerpt": "In pharmaceutical analysis, precision and error reduction are paramount for"
  },
  {
    "id": 2,
    "title": "Advanced Application of Differential Scanning Calorimetry (DSC) in the Lithium-ion Battery Manufacturing Industry",
    "category": "Industry Insights",
    "date": "2025-07-19",
    "author": "Inkarp Applications Team",
    "readTime": "11 min read",
    "image": "/assets/images/productImages/Hitachi/differential-scanning-calorimeter-dsc-nexta-dsc-series.jpg",
    "tags": [
      "DSC",
      "Lithium-ion Batteries",
      "Thermal Analysis"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Lithium-ion (Li-ion) batteries represent the cornerstone of modern energy storage systems, spanning applications from consumer electronics to electric vehicles (EVs) and grid-scale storage. As their utilization continues to expand, there is a corresponding escalation in the demand for improved performance metrics, extended cycle life, and, critically, enhanced operational safety. Central to achieving these objectives is the in-depth understanding of the thermal behaviour of individual battery components. Differential Scanning Calorimetry (DSC) emerges as a pivotal technique in this context, offering quantitative and qualitative insights into the enthalpic and thermodynamic transitions occurring in battery materials under controlled heating or cooling conditions."
      },
      {
        "type": "text",
        "content": "DSC measures the difference in heat flow between a sample and a reference as a function of time or temperature. It allows for the detection of a range of thermal events, including melting, crystallization, glass transitions, polymorphic transformations, decomposition reactions, and changes in heat capacity. These thermal fingerprints are invaluable in the assessment of battery component stability, compatibility, and phase behaviour, which directly influence battery safety and efficiency."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/advanced-application-of-differential-scanning-calorimetry-dsc-in-the-lithium-ion-battery-manufacturing-industry/Simultaneous-Thermogravimetric-Analyzers-NEXTA-DSC.webp",
        "caption": "Hitachi NEXTA DSC200"
      },
      {
        "type": "text",
        "content": "Hitachi NEXTA DSC200"
      },
      {
        "type": "text",
        "heading": "2.1 Cathode Materials",
        "content": "Layered transition metal oxides such as LiCoO₂, LiNiMnCoO₂ (NMC), and LiNiCoAlO₂ (NCA) are commonly employed as cathode materials due to their high energy density. However, at elevated temperatures, particularly beyond 200 °C, these materials can undergo exothermic decomposition associated with oxygen release from the crystal lattice. This oxygen can subsequently react with the electrolyte, leading to thermal runaway—a self-propagating failure mechanism."
      },
      {
        "type": "text",
        "content": "DSC provides critical data such as the onset temperature of thermal decomposition (Tonset), the peak temperature of maximum heat release (Tmax), and the enthalpy of the exothermic event (ΔH). These parameters are essential for comparing the thermal stability of cathode chemistries. For example, NMC811, with a high Ni content, shows decomposition onset around 230 °C with a ΔH exceeding 1800 J/g, whereas NMC622 exhibits slightly higher thermal stability with lower associated heat release. Such data are indispensable in the design of safer battery packs, especially for EVs where passive propagation resistance is paramount."
      },
      {
        "type": "text",
        "heading": "2.2 Anode Materials",
        "content": "While graphite, the conventional anode material, exhibits relatively stable thermal behaviour, emerging alternatives such as silicon-based composites and lithium metal introduce significant thermal challenges. Lithiated graphite, for instance, can undergo exothermic reactions with electrolyte components upon heating, posing safety concerns. DSC enables the quantification of such reactions by capturing exothermic events either post-cycling or following controlled artificial lithiation in laboratory settings. The onset temperature, intensity, and enthalpy of these exothermic peaks provide valuable indicators of thermal reactivity and the potential for thermal propagation under extreme operating conditions. This makes DSC an essential diagnostic tool for assessing the safety margins of advanced anode systems."
      },
      {
        "type": "text",
        "heading": "3. Electrolyte and Solvent Thermal Profiling",
        "content": "The electrolyte system in Li-ion batteries typically comprises a lithium salt (e.g., LiPF₆) dissolved in a mixture of organic carbonates such as ethylene carbonate (EC), dimethyl carbonate (DMC), and diethyl carbonate (DEC). These solvents have low flash points and are susceptible to exothermic degradation at elevated temperatures, often catalyzed by trace moisture or impurities."
      },
      {
        "type": "text",
        "content": "DSC enables the identification of critical parameters such as glass transition temperature (Tg), melting points (Tm), and decomposition onset temperatures. These transitions are significant for both lowtemperature performance and high-temperature safety. For instance, the Tg of EC:DMC mixtures can range from -60 °C to -40 °C depending on salt concentration and solvent ratio, affecting ionic conductivity at sub-zero temperatures. Moreover, the decomposition of LiPF₆-based electrolytes can occur around 150–180 °C, releasing HF and triggering secondary reactions. DSC profiles help formulate thermally robust electrolytes and screen additives (such as flame retardants or stabilizers) for enhanced safety."
      },
      {
        "type": "text",
        "heading": "4. Separator Melting and Shrinkage Behaviour",
        "content": "Polyolefin separators such as polyethylene (PE) and polypropylene (PP) are widely used due to their chemical inertness and mechanical strength. However, these materials melt at relatively low temperatures (~120–170 °C), compromising their dimensional stability and increasing the risk of internal short circuits under thermal stress. DSC is employed to precisely measure the melting points and thermal shrinkage behaviour of separator films."
      },
      {
        "type": "text",
        "content": "For example, PP typically shows a sharp endothermic melting peak around 165 °C, whereas PE melts near 130 °C. Modified separators, such as those coated with ceramic layers (e.g., Al₂O₃ or SiO₂), exhibit delayed or suppressed melting signals, indicating improved thermal stability. DSC thus serves as a rapid screening tool for separator selection and development, especially when evaluating separators for use in high-temperature or high-power applications."
      },
      {
        "type": "text",
        "heading": "5. Evaluation of Binders and Electrode Formulation Components",
        "content": "Electrode binders such as polyvinylidene fluoride (PVDF), styrene-butadiene rubber (SBR), and carboxymethyl cellulose (CMC) contribute to electrode mechanical integrity and process ability. Their thermal behaviour during electrode drying and cell formation influences coating adhesion and interfacial stability. DSC allows the determination of the melting point, glass transition temperature, and thermal decomposition characteristics of these polymers."
      },
      {
        "type": "text",
        "content": "For instance, PVDF shows a melting endotherm around 170–180 °C and degrades above 300 °C. Identifying these transitions ensures that the binder remains stable during processing and storage. Furthermore, additives like conductive carbon or functional polymers can be analyzed for thermal interactions with active materials or solvents. Any shift in thermal events indicates possible incompatibilities or synergistic interactions, which can be harnessed or mitigated accordingly."
      },
      {
        "type": "text",
        "heading": "6. Solid-State and Polymer Electrolyte Systems",
        "content": "With the rise of all-solid-state lithium batteries (ASSLBs), the characterization of inorganic and polymeric electrolytes has become increasingly important. DSC is indispensable for evaluating phase transitions such as crystallization, melting, or glass transition in these solid electrolytes. For example, polyethylene oxide (PEO)-based polymer electrolytes exhibit semi-crystalline behaviour with melting around 60 °C and a Tg near -60 °C. The degree of crystallinity and the thermal transitions influence ionic conductivity and mechanical properties."
      },
      {
        "type": "text",
        "content": "Similarly, inorganic solid electrolytes like Li₇La₃Zr₂O₁₂ (LLZO) or NASICON-type materials may undergo phase transitions that affect their stability and performance. DSC can detect these subtle transitions, which are often correlated with ionic mobility and electrode–electrolyte interfacial resistance. Understanding these thermophysical properties enables the rational design of hybrid and composite electrolytes for next-generation solid-state cells."
      },
      {
        "type": "text",
        "heading": "7. Degradation Analysis",
        "content": "DSC also plays a crucial role in degradation analysis, especially when evaluating thermophysical changes in aged or cycled battery components. By comparing the thermal profiles of pristine versus aged materials, variations in crystallinity, heat flow, and decomposition behaviour can be identified. For instance, increased exothermicity in a cathode after extended cycling may indicate structural degradation or elevated surface reactivity. Likewise, the absence or shift of characteristic melting peaks in the electrolyte region may reflect salt decomposition or solvent loss."
      },
      {
        "type": "text",
        "content": "In SEI (solid electrolyte interphase) characterization, DSC provides indirect evidence of SEI formation and evolution, especially when coupled with other techniques such as TGA or MS. Such thermal fingerprinting is useful in lifetime prediction, thermal tolerance assessment, and warranty analytics."
      },
      {
        "type": "text",
        "heading": "8. Thermal Safety Profiling",
        "content": "Battery safety evaluation under thermal, mechanical, or electrical stress conditions necessitates preliminary screening of material thermal sensitivity. DSC is routinely employed as a first-line technique prior to more advanced and resource-intensive methods such as Accelerating Rate Calorimetry (ARC). DSC offers critical early-stage data, including exothermic onset temperatures, total heat release, and thermal stability thresholds under both inert and oxidative environments."
      },
      {
        "type": "text",
        "content": "Advanced DSC methods, including temperature modulated DSC (TM-DSC), enable deconvolution of overlapping thermal events, allowing for precise attribution of transitions. This is critical in constructing thermal propagation models for battery management systems (BMS), fire risk assessment, and compliance with regulatory standards (e.g., UN 38.3, IEC 62133, UL 1642)."
      },
      {
        "type": "text",
        "heading": "9. Testimonials",
        "content": "DSC has emerged as a central tool for characterizing thermal events in lithium-ion battery materials. Zhang et al.1 explored mono- and bi-salt ether-based electrolytes for high-loading lithium-metal batteries and employed DSC to probe their thermal characteristics. The DSC analysis revealed Tg ranging from –61 °C to –53 °C, depending on the salt type and concentration, with no observable melting or crystallization peaks between –90 °C and 50 °C. This absence of phase transitions indicated a fully amorphous electrolyte system, critical for uniform ion conduction and thermal stability. Additionally, exothermic decomposition onsets were detected at 160 °C and 180 °C, correlating with enhanced thermal resilience of the electrolyte formulations. The DSC data provided valuable insight into the electrolyte's segmental dynamics and decomposition thresholds, essential for the design of safe, high-performance lithium-metal batteries."
      },
      {
        "type": "text",
        "content": "Kimura et al.2 investigated a highly-concentrated poly(ethylene carbonate) (PEC)-based solid polymer electrolyte containing 80 wt% lithium bis(fluorosulfonyl)imide (LiFSI) supported by a 3D macroporous polyimide matrix. The Tg was observed at –47 °C, with no detectable crystallization or melting transitions in the –70 °C to 110 °C range. The preserved amorphous nature of the electrolyte, despite high salt loading, indicated effective suppression of chain ordering, which is critical for maintaining ionic conductivity and mechanical flexibility. The DSC utilized in this study provided critical insights into the thermal phase behaviour and segmental mobility of the polymer matrix, confirming the stability and amorphous character essential for room-temperature ion conduction. These results confirm that the pore-filled hybrid membrane retained its thermodynamic integrity and segmental mobility, enabling stable ion transport at room temperature in solid-state Li-ion cells."
      },
      {
        "type": "text",
        "content": "Aldawsari et al.3 studied the thermal integrity of novel holey reduced graphene oxide/polystyrene (HRGO/PS) anode composites. The DSC thermogram revealed a broad endothermic baseline without distinct melting peaks up to 250 °C, indicating exceptional thermal stability and an absence of lowtemperature crystallization. An exothermic onset corresponding to polymer degradation was observed at ~305 °C, corroborating the material’s high-temperature resilience. The post-annealed HRGO/PS composite exhibited a 37% reduction in degradation enthalpy compared to pristine PS, evidencing enhanced thermal performance due to HRGO inclusion. These DSC insights substantiate the composite’s potential for high-temperature Li-ion battery applications."
      },
      {
        "type": "text",
        "content": "Grewal et al.4 investigated the thermal transitions of bifunctional PEG-based cross-linked polymer electrolytes for all-solid-state Li-ion batteries. DSC analysis revealed distinct Tg ranging from –29.2 °C to –8.2 °C, depending on the [EO]/[Li⁺] ratio, with no observable melting or crystallization peaks up to 100 °C. The complete suppression of crystallinity confirmed the formation of an amorphous crosslinked network structure. An increase in Tg with rising Li⁺ concentration indicated restricted chain mobility due to transient coordination between lithium ions and PEG ether oxygens, enhancing thermal stability critical for electrolyte performance."
      },
      {
        "type": "text",
        "content": "In their study, Xie et al.5 employed DSC to investigate the thermal behaviour of PVDF nanofiberreinforced solid polymer electrolytes (SPEs) for all-solid-state lithium-ion batteries. The DSC thermograms revealed Tm of the composite SPE increased from 149.6 °C (pristine) to 157.2 °C after incorporating crystalline PVDF nanofibers, indicating enhanced polymer crystallinity. Moreover, the exothermic decomposition onset temperature shifted from 215.3 °C to 231.8 °C, reflecting improved thermal stability and delayed degradation kinetics. The enthalpy of melting (ΔHm) also increased from 28.4 J/g to 35.7 J/g, suggesting better packing order and structural reinforcement within the polymer matrix. These thermal enhancements directly correlate with improved morphological and mechanical integrity of the SPE, emphasizing DSC's role as a precise diagnostic tool for screening thermally resilient battery electrolytes."
      },
      {
        "type": "text",
        "content": "**All the thermal measurements were conducted using\nHitachi High-Tech Differential Scanning Calorimeters."
      },
      {
        "type": "text",
        "heading": "10. Conclusion",
        "content": "DSC serves as a vital analytical technique within the lithium-ion battery manufacturing and research ecosystem. Its ability to precisely resolve thermal transitions in complex, multi-component systems enables in-depth evaluation of material compatibility, phase stability, and thermal decomposition thresholds. From optimizing separator compositions to enhance thermal tolerance, to screening cathode materials for resistance to exothermic runaway reactions, and evaluating the thermal stability of electrolyte formulations, DSC provides critical thermodynamic data essential for the rational design of safe and high-performance battery systems. As the field advances toward solid-state configurations and next-generation chemistries, the strategic importance of DSC continues to expand—cementing its role as a cornerstone of advanced materials characterization in battery innovation."
      },
      {
        "type": "text",
        "heading": "DSC – A standard thermal profiling Tool to build safer and performance-oriented powerful next-gen batteries",
        "content": "1. J. Lee, J. Park, J.W. Park, et al., Supramolecular gels with high strength by tuning of calix[4]arene-derived networks, Nat. Commun. 6 (2015) 6650. https://doi.org/10.1038/ncomms7650."
      },
      {
        "type": "text",
        "content": "2. . K. Kimura, M. Yajima, Y. Tominaga, A highly-concentrated poly(ethylene carbonate)based electrolyte for all-solid-state Li battery working at room temperature, Electrochem. Commun. 63 (2016) 46–49. https://doi.org/10.1016/j.elecom.2016.02.002."
      },
      {
        "type": "text",
        "content": "3. Y. Aldawsari, Y. Mussa, F. Ahmed, M. Arsalan, E. Alsharaeh, Novel synthesis of holey reduced graphene oxide/polystyrene nanocomposites by microwave irradiation as anodes for high-temperature lithium-ion batteries, Mater. Today Proc. 12(14) (2019) 2248. https://doi.org/10.3390/ma12142248."
      },
      {
        "type": "text",
        "content": "4.M.S. Grewal, M. Tanaka, H. Kawakami, Bifunctional PEG-based cross-linked network polymers as electrolytes for all-solid-state lithium-ion batteries, Polym. Int. (2024). https://doi.org/10.1002/pi.5750."
      },
      {
        "type": "text",
        "content": "5. L. Xie, Q. Wu, H. Liu, F. He, X. Huang, J. Peng, Y. Zhang, G. He, Enhancing lithium ion conductivity and all-solid-state secondary battery performance via crystalline PVDF nanofibers, Solid State Ionics 370 (2021) 115095. https://doi.org/10.1016/j.ssi.2021.115095."
      }
    ],
    "comments": [],
    "slug": "advanced-application-of-differential-scanning-calorimetry-dsc-in-the-lithium-ion-battery-manufacturing-industry",
    "excerpt": "Lithium-ion (Li-ion) batteries represent the cornerstone of modern energy storage systems, spanning applications from consumer electronics to electric vehicles (EVs) and grid-scale storage. As their utilization continues"
  },
  {
    "id": 3,
    "title": "Precision Hydrogen Content in Crude Oil Analysis with NMR Spectroscopy",
    "category": "Industry Insights",
    "date": "2025-07-04",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/Nanalysis/60mhz-powerful-benchtop-nmr.jpeg",
    "tags": [
      "NMR Spectroscopy",
      "Crude Oil Analysis",
      "Petroleum Testing"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Precision Hydrogen Content in Crude Oil Analysis with NMR Spectroscopy\n\nDetermining the hydrogen content in crude oil is vital for assessing petroleum quality testing and optimizing the uses of crude oils in refining and combustion processes. Nuclear magnetic resonance (NMR spectroscopy analysis) offers a robust, efficient alternative to traditional methods like ASTM D5291, enabling precise hydrogen analysis of paraffins, naphthenes, and aromatics. This blog explores how Nanalysis’ High-performance 60 MHz 1H NMR Spectroscopy simplifies crude oil analysis."
      },
      {
        "type": "text",
        "heading": "Importance of Hydrogen Analysis in Crude Oils",
        "content": "The hydrogen content in crude oil, typically ranging from 9–16 wt% per ASTM D5291, directly influences combustion efficiency, making it a critical parameter in petroleum quality testing. Traditional ASTM D5291 methods rely on elemental analyzers, requiring compressed gases and frequent maintenance, which increase costs and complexity (Table 1). In contrast, 1H NMR spectroscopy provides a quantitative, non-destructive approach to hydrogen analysis, capturing signals from paraffins, naphthenes, and aromatics in a single spectrum. This method’s simplicity and in-house applicability reduce operational costs and turnaround times, enhancing efficiency in crude oil analysis."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/precision-hydrogen-content-in-crude-oil-analysis-with-nmr-spectroscopy/Nanalysis-60-Benchtop-NMR-Spectrometer.png",
        "caption": "Nanalysis 60 Benchtop NMR Spectrometer"
      },
      {
        "type": "text",
        "content": "Nanalysis 60 Benchtop NMR Spectrometer"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/precision-hydrogen-content-in-crude-oil-analysis-with-nmr-spectroscopy/Gas-flow-rates-as-described-in-ASTM-D5291.JPG",
        "caption": "Gas flow rates as described in ASTM D5291"
      },
      {
        "type": "text",
        "heading": "Method: NMR Spectroscopy Analysis with Internal Calibrant HMDSO (Figure 1, Table 2)",
        "content": "Using a Nanalysis 60 PRO instrument at 60.73 MHz, 1H NMR spectroscopy was applied to measure hydrogen content in crude oil analogs, 1-octene and undecane. The method employed hexamethyldisiloxane (Internal Calibrant HMDSO) as a reference for quantitative integration. Spectra were acquired at 32°C with a spectral width of 40 ppm, 8 scans, and a 23-second interscan delay. Integration regions for the sample and HMDSO were used to calculate hydrogen content via a specific equation (Figure 1). Results for 1-octene (average 14.33%) and undecane (average 15.84%) closely matched theoretical values (14.37% and 15.47%, respectively), with relative standard deviations (RSD) of 0.6% and 0.5% (Table 2). This demonstrates the accuracy and reproducibility of High-performance 60 MHz 1H NMR Spectroscopy for hydrogen analysis."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/precision-hydrogen-content-in-crude-oil-analysis-with-nmr-spectroscopy/HMDSO.JPG"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/precision-hydrogen-content-in-crude-oil-analysis-with-nmr-spectroscopy/Precision-Figure-1.JPG"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/precision-hydrogen-content-in-crude-oil-analysis-with-nmr-spectroscopy/Precision-Figure-2.JPG"
      },
      {
        "type": "text",
        "content": "Figure 1 Representative 1H NMR spectrum of 1-octene (top) and undecane (bottom) in CDCl3. The integration regions used in the equation above, namely I (Sample) and I (HMDSO), are highlighted."
      },
      {
        "type": "table",
        "columns": [
          "",
          "Hydrogen Content (%)"
        ],
        "rows": [
          [
            "1-Octene",
            "Undecane"
          ],
          [
            "Run 1",
            "14.39",
            "15.81"
          ],
          [
            "Run 2",
            "14.38",
            "15.93"
          ],
          [
            "Run 3",
            "14.23",
            "15.78"
          ],
          [
            "Average (A)",
            "14.33",
            "15.84"
          ],
          [
            "Theoretical (B)",
            "14.37",
            "15.47"
          ],
          [
            "Difference (A-B)",
            "-0.04",
            "0.37"
          ],
          [
            "RSD",
            "0.6",
            "0.5"
          ]
        ]
      },
      {
        "type": "text",
        "heading": "Conclusion: Advancing Crude Oil Analysis with NMR",
        "content": "Nuclear magnetic resonance using 1H NMR spectroscopy revolutionizes hydrogen content in crude oil determination, offering a faster, cost-effective alternative to ASTM D5291. The Nanalysis High-performance 60 MHz 1H NMR Spectroscopy system, with Internal Calibrant HMDSO, ensures precise crude oil analysis of paraffins, naphthenes, and aromatics, supporting petroleum quality testing and optimizing uses of crude oils. Its benchtop design enables in-house testing, reducing reliance on external labs."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments\nacts as a reliable distributor and service provider\nHitachi products in India, offering advanced scientific solutions tailored to the dynamic requirements of modern research. With a commitment to excellence and trustworthiness, we enable researchers across India with state-of-the-art technology and dedicated support to advance innovation and discovery."
      },
      {
        "type": "text",
        "content": "[1] All, I.; Basit, M. A. Int. J. Hydrogen Energy 1993, 18, 1009-1011."
      },
      {
        "type": "text",
        "content": "[2] Drews, A. W. Manual on Hydrocarbon Analysis (ASTM D5291): 6th Edition; American Society for Testing and Materials, 1998, 852-856."
      },
      {
        "type": "text",
        "content": "[3] Mondal, S.; Kumar, R.; Bansal, V.; Patel, M. B. J. Anal. Sci. Technol. 2015, 6, 1-10."
      },
      {
        "type": "text",
        "content": "[4] Bharti, S. K.; Roy, R. Trends Anal. Chem. 2012, 35, 5-26."
      }
    ],
    "comments": [],
    "slug": "precision-hydrogen-content-in-crude-oil-analysis-with-nmr-spectroscopy",
    "excerpt": "Precision Hydrogen Content in Crude Oil Analysis with NMR Spectroscopy"
  },
  {
    "id": 4,
    "title": "Advancing Cancer Diagnostics with Precision CTC Analysis",
    "category": "Industry Insights",
    "date": "2025-07-02",
    "author": "Inkarp Applications Team",
    "readTime": "6 min read",
    "image": "/assets/blogs/BlogFour/cytefinder-ii.jpg",
    "tags": [
      "Circulating Tumor Cells",
      "Oncology Diagnostics",
      "Cell Dispensing"
    ],
    "sections": [
      {
        "type": "text",
        "content": "The field of cancer diagnostics is rapidly evolving, with a growing emphasis on technologies that can detect and analyze rare cells in the bloodstream, such as circulating tumor cells (CTCs). These cells, which are shed from tumors and circulate in the blood, hold immense potential for non-invasive cancer detection and treatment monitoring. However, their extreme rarity—often just one CTC per 10 billion red blood cells—presents significant challenges for accurate detection. To address this, innovative solutions like RareCyte’s AccuCyte and CyteFinder Instrument, combined with Cellenion’s cellenONE for CTC analysis, are revolutionizing rare cell analysis technology by enabling precise and reproducible validation of CTC assays."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/advancing-cancer-diagnostics-with-precision-ctc-analysis/a-rarecyte-cytefinder-II.jpg",
        "caption": "RarecytCye teFinder® II"
      },
      {
        "type": "text",
        "content": "RarecytCye teFinder® II"
      },
      {
        "type": "text",
        "heading": "A Novel Approach to CTC Validation",
        "content": "The rarity of CTCs demands technologies that combine high sensitivity with robust reproducibility. RareCyte, a leader in circulating tumor cell analysis, has developed the AccuCyte-CyteFinder system, which offers an end-to-end workflow for CTC enumeration and biomarker expression analysis in cancers such as breast cancer, prostate cancer, and lung cancer. To ensure the accuracy required for clinical trials and phases, rigorous assay validation is critical. This involves creating surrogate blood samples with known quantities of model CTCs (mCTCs) at levels close to the assay’s limit of detection."
      },
      {
        "type": "text",
        "content": "Traditional methods like serial dilution or flow cytometry often fall short in delivering the precision needed for such low cell counts. To overcome this, RareCyte partnered with Cellenion to leverage the circulating tumor cell spike-in method using the cellenONE instrument. The cellenONE is a single-cell isolation and dispensing technology that uses automated image recognition to ensure each dispensed droplet contains exactly one cell. Originally designed for single-cell analyses and cell line development, this cell dispenser has been adapted for CTC assay validation, offering unmatched accuracy and precision."
      },
      {
        "type": "text",
        "heading": "The Validation Workflow",
        "content": "The collaboration between RareCyte and Cellenion resulted in a tailored workflow for CTC assay validation, as outlined in Figure 1. A customized sample deck was designed for the cellenONE, enabling precise deposition of cells onto microscope slides or into RareCyte’s AccuCyte Blood Collection Tubes (BCTs) containing 7.5 ml of whole blood. The cellenONE was programmed to dispense 100 cells per slide or 5–8 cells per BCT. These Cellenion samples were then processed using the AccuCyte system, stained with the RarePlex Enumeration Panel Kit, and analyzed with the CyteFinder Instrument to count CTCs."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/advancing-cancer-diagnostics-with-precision-ctc-analysis/RareCyte-AccuCyte-Blood.jpg",
        "caption": "RarecytCye teFinder® II"
      },
      {
        "type": "text",
        "content": "Figure 1 5-step CTC enumeration validation workflow. Dispense cells with cellenONE onto slides and into BCT;\nprocess BCT to slides with AccuCyte system; stain slides with RarePlex® Enumeration Panel Kit; image and analyze with\nCyteFinder Instrument to count CTCs."
      },
      {
        "type": "text",
        "content": "This five-step workflow ensures that rarecyte circulating tumor cell assays are validated with a high degree of standardization, critical for clinical applications. The ability to deposit precise numbers of mCTCs, such as HAP1 cell and SW900 cell lines, into blood samples allows researchers to mimic the clinical scarcity of CTCs, making validation studies both accurate and reproducible."
      },
      {
        "type": "text",
        "heading": "Impressive Results with High Recovery Rates",
        "content": "The results of this circulating tumor cell spike-in method are remarkable, as shown in Tables 1 and 2. Table 1 demonstrates the accuracy of the cellenONE system when printing 100 mCTCs directly onto slides. Across eight replicates, a total of 800 cells were dispensed, with 797 recovered, yielding an impressive recovery rate of 99%. This near-perfect accuracy confirms the reliability of the cellenONE for high-throughput applications."
      },
      {
        "type": "table",
        "columns": [
          "Replicate",
          "Print #",
          "mCTC Count"
        ],
        "rows": [
          [
            "1",
            "100",
            "100"
          ],
          [
            "2",
            "100",
            "100"
          ],
          [
            "3",
            "100",
            "100"
          ],
          [
            "4",
            "100",
            "100"
          ],
          [
            "5",
            "100",
            "99"
          ],
          [
            "6",
            "100",
            "99"
          ],
          [
            "7",
            "100",
            "100"
          ],
          [
            "8",
            "100",
            "99"
          ],
          [
            "Total",
            "800",
            "797"
          ],
          [
            "Recovery",
            "",
            "0.99"
          ]
        ]
      },
      {
        "type": "text",
        "content": "Table 1 mCTC count for slides printed with 100 mCTCs."
      },
      {
        "type": "table",
        "columns": [
          "Replicate",
          "Spike-in #",
          "mCTC Count"
        ],
        "rows": [
          [
            "1",
            "8",
            "8"
          ],
          [
            "2",
            "5",
            "5"
          ],
          [
            "3",
            "5",
            "5"
          ],
          [
            "4",
            "5",
            "4"
          ],
          [
            "5",
            "5",
            "5"
          ],
          [
            "6",
            "5",
            "4"
          ],
          [
            "7",
            "5",
            "5"
          ],
          [
            "8",
            "5",
            "5"
          ],
          [
            "9",
            "6",
            "6"
          ],
          [
            "Total",
            "49",
            "47"
          ],
          [
            "Recovery",
            "",
            "0.96"
          ]
        ]
      },
      {
        "type": "text",
        "content": "Table 2 mCTC count from deposition of 5-8 cells per BCT."
      },
      {
        "type": "text",
        "content": "Table 2 further highlights the precision of the system when spiking 5–8 mCTCs into BCTs. Across nine replicates, 49 cells were spiked, with 47 recovered, resulting in a 96% recovery rate. These high recovery rates underscore the effectiveness of\ncombining RareCyte’s AccuCyte and cellenONE technologies for preparing Cellenion samples that closely mimic clinical conditions."
      },
      {
        "type": "text",
        "content": "Figure 2 provides visual confirmation of the assay’s specificity. It shows images of mCTCs from HAP1 cell and SW900 cell spike-in assays, identified by the presence of a nucleus, localization of Cytokeratin (CK) to the cytoplasm or Epithelial Cell Adhesion Molecule (EpCAM) to the cell membrane, and the absence of CD45. These markers ensure accurate identification of CTCs, even at low concentrations. Figure 3 further illustrates the precision of the cellenONE, showcasing an image of 100 mCTCs printed onto a slide, a testament to the system’s ability to handle single-cell deposition with consistency."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/advancing-cancer-diagnostics-with-precision-ctc-analysis/advancing-mCTCs.jpg",
        "caption": "mCTC images"
      },
      {
        "type": "text",
        "content": "Figure 2\nmCTC images from cellenONE spike-in assay.\nCTCs are identified by the presence of a nucleus,\nlocalization of Cytokeratin (CK) to the cytoplasm or\nEpithelial Cell Adhesion Molecule (EpCAM) to the cell\nmembrane, and absence of CD45 localization. A. HAP-1\nmCTC spike-in assay. B. SW900 mCTC spike-in assay. Scale\nbar represents 5 μm."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/advancing-cancer-diagnostics-with-precision-ctc-analysis/100-mCTCs.jpg",
        "caption": "Image of 100 mCTCs printed to a slide"
      },
      {
        "type": "text",
        "content": "Figure 3 Image of 100 mCTCs printed to a slide."
      },
      {
        "type": "text",
        "heading": "Transforming Cancer Diagnostics",
        "content": "The integration of cellenONE into RareCyte’s validation workflow has set a new standard for circulating tumor cell analysis. Unlike flow cytometry or serial dilution, which struggle with low cell counts, the cellenONE delivers unparalleled accuracy and reproducibility. This makes it an essential tool for rare cell analysis technology, particularly in the context of clinical trials and phases where precision is non-negotiable."
      },
      {
        "type": "text",
        "content": "By enabling the creation of standardized samples with known mCTC counts, the cellenONE ensures that RareCyte’s CTC assays meet the stringent requirements of cancer diagnostics. This technology not only enhances the reliability of CTC enumeration but also supports biomarker expression analysis, paving the way for personalized treatment strategies in breast cancer, prostate cancer, and lung cancer."
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "The work at Cardiff University highlights the transformative potential of chemical synthesis in addressing environmental challenges. By leveraging the Radleys Reactor-Ready system for polymer scale production and developing recyclable, glowing polymers, researchers are redefining the possibilities in the plastics recycling industry. These materials science innovations not only solve critical recycling challenges but also open new avenues for creating advanced, sustainable materials. As this technology scales, it promises to reshape how we produce, use, and recycle polymers, fostering a more sustainable and innovative future."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments\nstands as a trusted distributor and service provider of\nRareCyte’s advanced scientific solutions in India, delivering cutting-edge technology tailored to the dynamic needs of modern research. Committed to excellence, we empower researchers across the nation with innovative tools and unparalleled expertise, fostering breakthroughs and driving progress in scientific discovery."
      },
      {
        "type": "text",
        "content": "References: RareCyte"
      }
    ],
    "comments": [],
    "slug": "advancing-cancer-diagnostics-with-precision-ctc-analysis",
    "excerpt": "The field of cancer diagnostics is rapidly evolving, with a growing emphasis on technologies that can detect and analyze rare cells in the bloodstream, such as circulating tumor cells (CTCs). These cells, which are shed "
  },
  {
    "id": 5,
    "title": "Advancing Polymer Synthesis for a Sustainable Future",
    "category": "Industry Insights",
    "date": "2025-06-25",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/radleys/reactor-ready-flex-lab-reactor.jpg",
    "tags": [
      "Polymer Synthesis",
      "Sustainability",
      "Reactor Technology"
    ],
    "sections": [
      {
        "type": "text",
        "content": "prompting innovative solutions in polymer synthesis and recycling. Researchers are now focusing on creating polymers that can be chemically recycled, addressing limitations in traditional plastic recycling methods, such as the inability to remove colorants. At Cardiff University, groundbreaking work using the Radleys Reactor-Ready system has led to the development of single-component, colored polymers that can be depolymerized and remade into colorless materials, offering a promising path toward sustainability. This article explores how these advancements in chemical synthesis and reactor technology are revolutionizing the plastics recycling industry and paving the way for materials science innovations."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/advancing-polymer-synthesis-for-a-sustainable-future/E3-RR-Glowing-Polymers.jpg",
        "caption": "E3 RR Glowing Polymers"
      },
      {
        "type": "text",
        "heading": "Developing Colored Polymers with Chromophore Integration",
        "content": "In the realm of organic chemistry, researchers at Cardiff University have pioneered a method to synthesize glowing polymers using epoxide-anhydride ring-opening copolymerization (ROCOP). By incorporating chromophore-containing monomers, they create highly colored polymers with covalent bonding of dyes, requiring only minimal dopant levels. This approach ensures that the polymers retain the properties of the base material while exhibiting vibrant coloration and luminescence, critical for applications in fluorescent polymer research and advanced materials development. The result is a versatile polymer with tailored optical properties, suitable for various industrial polymer applications."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/advancing-polymer-synthesis-for-a-sustainable-future/Polymers-ChemDraw.png",
        "caption": "Polymers ChemDraw"
      },
      {
        "type": "text",
        "heading": "Scaling Synthesis with Reactor-Ready Technology",
        "content": "The synthesis of these innovative polymers was conducted on a laboratory scale using a Radleys Reactor-Ready 2-litre Jacketed Lab Reactor, equipped with a Hei-TORQUE stirrer and a Huber Ministat for precise temperature control. This lab reactor enabled the production of 280–320 grams of material in a single reaction, demonstrating its capability for polymer scale synthesis. The use of an external PT1000 temperature probe with the Huber Ministat allowed researchers to monitor and control reaction temperatures effectively, mitigating the risks of exothermic reactions common in large-scale epoxide homopolymerizations. This setup ensures safety and consistency, making it ideal for scaling up chemical reactions in research settings."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/advancing-polymer-synthesis-for-a-sustainable-future/Radleys-Reactor-Ready-Flex-Lab-Reactor.JPG",
        "caption": "Radleys Reactor-Ready™Flex Lab Reactor"
      },
      {
        "type": "text",
        "content": "Radleys Reactor-Ready™Flex Lab Reactor"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/advancing-polymer-synthesis-for-a-sustainable-future/E3-RR-14.jpg",
        "caption": "E3 RR 14"
      },
      {
        "type": "text",
        "heading": "Revolutionizing Plastic Recycling",
        "content": "A key breakthrough in this research is the ability to chemically recycle colored polymers back to their parent acid or alcohol, removing the chromophore to produce colorless, pure polymers. Unlike traditional plastic recycling, which struggles with persistent colorants, this method allows for the complete regeneration of base monomers, which can then be repolymerized into high-quality, color-free materials. This innovation addresses a critical challenge in the plastics recycling industry, offering a sustainable solution that supports a circular economy. The strategy’s f lexibility also allows for the integration of various dopants, enabling the creation of polymers with customized properties for diverse applications."
      },
      {
        "type": "text",
        "heading": "Impact on Materials Science and Industry",
        "content": "The advancements achieved through this research have far-reaching implications for materials science innovations and industrial polymer applications. By enabling the production of recyclable, functional polymers with tailored properties, this approach supports the development of sustainable materials for industries ranging from packaging to electronics. The ability to scale up polymer synthesis using advanced reactor systems like the Radleys Reactor-Ready ensures that these innovations can transition from the lab to industrial settings, driving progress toward a more sustainable future."
      },
      {
        "type": "text",
        "heading": "Conclusion: A Path to Sustainable Polymer Production",
        "content": "The work at Cardiff University highlights the transformative potential of chemical synthesis in addressing environmental challenges. By leveraging the Radleys Reactor-Ready system for polymer scale production and developing recyclable, glowing polymers, researchers are redefining the possibilities in the plastics recycling industry. These materials science innovations not only solve critical recycling challenges but also open new avenues for creating advanced, sustainable materials. As this technology scales, it promises to reshape how we produce, use, and recycle polymers, fostering a more sustainable and innovative future."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments\nis a trusted distributor and service provider of Radleys\nproducts in India, delivering advanced scientific solutions tailored to the needs of contemporary research. Committed to excellence, we empower scientists across the country with innovative technology and expert support to advance discovery and innovation."
      }
    ],
    "comments": [],
    "slug": "advancing-polymer-synthesis-for-a-sustainable-future",
    "excerpt": "prompting innovative solutions in polymer synthesis and recycling. Researchers are now focusing on creating polymers that can be chemically recycled, addressing limitations in traditional plastic recycling methods, such "
  },
  {
    "id": 6,
    "title": "Revolutionizing Semiconductor Failure Analysis with NenoVision's LiteScope AFM-in-SEM",
    "category": "Industry Insights",
    "date": "2025-05-30",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/Nanovision/litescope-afm.png",
    "tags": [
      "AFM-in-SEM",
      "Semiconductor Failure Analysis",
      "Dopant Profiling"
    ],
    "sections": [
      {
        "type": "text",
        "content": "As semiconductor devices continue to shrink in size and grow in complexity, the demand for precise and efficient Semiconductor Failure Analysis has never been greater. Identifying defects at the nanoscale level is critical to ensuring the performance, reliability, and yield of modern electronics, from NAND flash memory to advanced transistors. Nenovision’s LiteScope, an innovative Atomic Force Microscope (AFM) integrated into a Scanning Electron Microscope (SEM), offers a transformative solution. By combining Hybrid imaging for semiconductor analysis with a seamless in-situ workflow, LiteScope empowers researchers and engineers to address failure analysis challenges with unparalleled accuracy and speed."
      },
      {
        "type": "text",
        "heading": "The Power of Hybrid Imaging for Semiconductor Analysis",
        "content": "The LiteScope combines the strengths of Atomic Force Microscopy and Scanning Electron Microscopy within a FIB/SEM environment, offering a seamless workflow for Semiconductor inspection tools. This hybrid approach delivers high-resolution conductivity mapping and dopant profiling without compromising sample integrity. By merging sample preparation and analysis, it eliminates the risks of surface oxidation and contamination, ensuring accurate results. The system is compatible with SEM systems from leading manufacturers such as Thermo Fisher Scientific, TESCAN, ZEISS, Hitachi, and JEOL, making it a versatile addition to existing failure analysis workflows."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/revolutionizing-semiconductor-failure-analysis-with-nenovision-s-litescope-afm-in-sem/NenoVision-LiteScope.png",
        "caption": "NenoVision LiteScope"
      },
      {
        "type": "text",
        "content": "NenoVision LiteScope"
      },
      {
        "type": "text",
        "heading": "Applications in Semiconductor Failure Analysis",
        "content": "The LiteScope is designed for critical applications such as NAND failure analysis, SRAM and logic circuits, transistors (FinFET, CMOS), and thin films. For instance, in NAND failure analysis, the system identifies specific vias in a NAND structure, performs sequential delayering using Plasma-Focused Ion Beam (PFIB), and conducts electrical analysis via Conductive AFM (C-AFM) and I/V Spectroscopy. This in-situ approach allows real-time monitoring of the delayering process, ensuring precise targeting and revealing electrical failures at various depths."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/revolutionizing-semiconductor-failure-analysis-with-nenovision-s-litescope-afm-in-sem/In-situ-electrical-failure-analysis-of-NAND-structures.JPG",
        "caption": "In-situ electrical failure analysis of NAND structures"
      },
      {
        "type": "text",
        "content": "Fig 1 In-situ electrical failure analysis of NAND structures"
      },
      {
        "type": "text",
        "heading": "Scanning Spreading Resistance Microscopy for Dopant Analysis",
        "content": "A standout feature of the LiteScope is its ability to perform Scanning Spreading Resistance Microscopy (SSRM) for dopant concentration analysis. By correlating SEM imaging with local electrical properties, SSRM provides nanoscale precision in mapping variations in doping levels, which are critical for device performance and reliability. For SiC MOSFET transistors, this technique enables detailed characterization of doped layers and junctions, analyzing their shape, size, and depth to ensure optimal conductivity and minimal losses."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/revolutionizing-semiconductor-failure-analysis-with-nenovision-s-litescope-afm-in-sem/SITE-S-1.JPG"
      },
      {
        "type": "text",
        "content": "Fig 2 Site-Specific Dopant Concentration Analysis of MOSFET Transistor"
      },
      {
        "type": "text",
        "heading": "Workflow for Comprehensive Failure Analysis",
        "content": "The Failure Analysis with AFM-in-SEM LiteScope begins with site-specific sample preparation using FIB to expose defect areas. The AFM tip is then navigated to the region of interest for high-resolution electrical characterization, such as C-AFM or SSRM. Results are correlated with SEM imaging, and calibration is performed using reference resistance measurements on samples with known dopant concentration levels. This calibration ensures accurate dopant profiling, providing a comprehensive understanding of failure mechanisms."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/revolutionizing-semiconductor-failure-analysis-with-nenovision-s-litescope-afm-in-sem/Failure-analysis-workflow-with-AFM-in-FI-sEM.JPG",
        "caption": "Failure analysis workflow with AFM-in-FIB/SEM"
      },
      {
        "type": "text",
        "content": "Fig 3 Failure analysis workflow with AFM-in-FIB/SEM"
      },
      {
        "type": "text",
        "heading": "Enhancing Device Performance and Reliability",
        "content": "By combining AFM-in-SEM techniques like C-AFM, SSRM, and complementary SEM methods (e.g., EBIC, EBAC), the LiteScope enhances defect detection and accelerates failure diagnostics. This integrated approach significantly reduces time-to-result, improves manufacturing yield, and supports the development of more reliable semiconductor devices."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/revolutionizing-semiconductor-failure-analysis-with-nenovision-s-litescope-afm-in-sem/NenoVision-LiteScope-Setup.JPG",
        "caption": "NenoVision LiteScope Setup"
      },
      {
        "type": "text",
        "content": "Fig4 NenoVision LiteScope Setup"
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "In an era where semiconductor innovation drives technological progress, Nenovision’s LiteScope stands out as a game-changer in Nanoscale metrology for chips. By integrating AFM-in-SEM capabilities, it offers a robust solution for Semiconductor Failure Analysis, delivering precise conductivity mapping, dopant profiling, and enhanced device performance and reliability. With its ability to streamline workflows, reduce costs, and provide actionable insights, LiteScope empowers manufacturers to overcome the challenges of modern semiconductor design."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments\nis a top distributor and reliable service partner for\nNenoVision products in India. Driven by a commitment to innovation and excellence, Inkarp offers advanced scientific instruments along with professional support, enabling researchers across the country to push the boundaries of scientific discovery."
      },
      {
        "type": "text",
        "content": "References: NenoVision"
      }
    ],
    "comments": [],
    "slug": "revolutionizing-semiconductor-failure-analysis-with-nenovision-s-litescope-afm-in-sem",
    "excerpt": "As semiconductor devices continue to shrink in size and grow in complexity, the demand for precise and efficient Semiconductor Failure Analysis has never been greater. Identifying defects at the nanoscale level is critic"
  },
  {
    "id": 7,
    "title": "Streamlining Bacterial Culture Standardization with McFarland Standards and Implen OD600",
    "category": "Industry Insights",
    "date": "2025-06-20",
    "author": "Inkarp Applications Team",
    "readTime": "4 min read",
    "image": "/assets/images/productImages/Implen/nanophotometer-od600.jpg",
    "tags": [
      "McFarland Standards",
      "OD600",
      "Microbiology"
    ],
    "sections": [
      {
        "type": "text",
        "content": "In microbiology, achieving consistent and accurate bacterial culture standardization is critical for reliable experimental outcomes. McFarland standards provide a trusted method for estimating bacterial culture concentrations by measuring turbidity, while the Implen OD600 device enhances this process with precise optical density 600 nm (OD600) measurements. This blog explores how McFarland standards, paired with the Implen OD600 device, revolutionize microbial inoculum preparation, ensuring quality control in applications like antibiotic susceptibility testing and microbial enumeration. We'll dive into the protocols, McFarland app features, and the science behind OD600 absorbance, drawing from a detailed application note."
      },
      {
        "type": "text",
        "heading": "Understanding McFarland Standards",
        "content": "McFarland standards are turbidity-based references used to standardize the concentration of bacterial cultures. By mixing barium chloride and sulfuric acid, these standards create a barium sulfate precipitate with defined turbidity levels, expressed as McFarland Units (MFU). For example, a 0.5 McFarland unit corresponds to approximately 1.5 × 10⁸ colony-forming units (CFU) per mL, a benchmark widely used in microbiology for microbial inoculum preparation. Higher MFU values (e.g., 1 to 5) represent increasing bacterial density, up to 15 × 10⁸ cells/mL. These standards are essential for applications such as:"
      },
      {
        "type": "table",
        "columns": [
          "MFU Value",
          "Approximate Cell Density (cells/mL)"
        ],
        "rows": [
          [
            "0.5 MFU",
            "1.5 × 10⁸"
          ],
          [
            "1 MFU",
            "3.0 × 10⁸"
          ],
          [
            "2 MFU",
            "6.0 × 10⁸"
          ],
          [
            "3 MFU",
            "9.0 × 10⁸"
          ],
          [
            "4 MFU",
            "12 × 10⁸"
          ]
        ]
      },
      {
        "type": "text",
        "heading": "The Role of Visual Assessment and Its Limitations",
        "content": "Traditionally, McFarland standards are assessed visually by comparing the turbidity of a bacterial culture to a standard, such as the 0.5 McFarland unit, against a Wickerham card. This method, while simple, is subjective and prone to variability due to factors like ambient light, observer experience, and standard quality. Such inconsistencies can compromise quality control in critical experiments."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/streamlining-bacterial-culture-standardization-with-mcfarland-standards-and-implen-od600/implen-OD600-precision-in-bacterial-quantification.JPG"
      },
      {
        "type": "text",
        "heading": "Implen OD600: Precision in Bacterial Quantification",
        "content": "The Implen OD600 device addresses these limitations by providing a spectrophotometer-based approach to measure OD600 absorbance, offering superior OD600 reader accuracy. The device’s McFarland app features convert absorbance readings at 600 nm into MFU values using a McFarland calibration curve, eliminating subjective bias. The Implen OD600 supports various sample containers (e.g., 16 mm test tubes, cuvettes) without adapters, enhancing versatility. Its default calibration curve, based on ProLab McFarland standards (Serial Number 395123, traceable to SD2350, February 27, 2024), ensures reliable measurements, with the option to create custom curves for specific tube types."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/streamlining-bacterial-culture-standardization-with-mcfarland-standards-and-implen-od600/implen-OD600-spectrophotometer.JPG",
        "caption": "Implen OD600® Spectrophotometer"
      },
      {
        "type": "text",
        "content": "Implen OD600® Spectrophotometer"
      },
      {
        "type": "text",
        "heading": "Protocol for Preparing a 0.5 MFU Bacterial Culture",
        "content": "The Implen OD600 simplifies McFarland tube preparation with a user-friendly protocol:"
      },
      {
        "type": "text",
        "content": "This protocol ensures precise bacterial culture standardization, critical for applications like antimicrobial susceptibility testing."
      },
      {
        "type": "text",
        "heading": "Creating a McFarland Calibration Curve",
        "content": "To ensure OD600 reader accuracy, the Implen OD600 allows users to create custom McFarland calibration curves tailored to their setup. The process, adapted from a protocol by SMILE (Johns Hopkins University), involves:"
      },
      {
        "type": "text",
        "content": "This calibration ensures accurate conversion of OD600 absorbance to MFU, enhancing reliability across experiments."
      },
      {
        "type": "table",
        "columns": [
          "Standard",
          "1% BaCl₂ (volume in mL)",
          "1% H₂SO₄ (volume in mL)",
          "Number of Bacteria/ mL/(10⁸) represented"
        ],
        "rows": [
          [
            "0.5",
            "0.5",
            "99.5",
            "1.5"
          ],
          [
            "1",
            "1.0",
            "99.0",
            "3"
          ],
          [
            "2",
            "2.0",
            "98.0",
            "6"
          ],
          [
            "3",
            "3.0",
            "97.0",
            "9"
          ],
          [
            "4",
            "4.0",
            "96.0",
            "12"
          ],
          [
            "5",
            "5.0",
            "95.0",
            "15"
          ]
        ]
      },
      {
        "type": "text",
        "heading": "Advantages of the Implen OD600 McFarland App",
        "content": "The McFarland app features streamline workflows with an intuitive interface, secure storage of calibration values, and seamless data export. The device’s glove-compatible touchscreen and compatibility with various tube sizes make it ideal for diverse lab environments, including biosafety hoods and anaerobic conditions. By leveraging the Beer-Lambert Law, the Implen OD600 ensures precise optical density 600 nm measurements, accounting for light scattering by bacterial cells."
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "The combination of McFarland standards and the Implen OD600 device transforms bacterial culture standardization, offering unmatched precision and efficiency. By replacing subjective visual assessments with spectrophotometer-based OD600 absorbance measurements, the Implen OD600 ensures consistent microbial inoculum preparation for critical applications. Whether in clinical microbiology, biotechnology, or quality control, this technology empowers researchers to achieve reliable, reproducible results, advancing scientific discovery."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments\nis a reliable supplier and service provider for\nImplen products in India, delivering advanced scientific solutions tailored to the changing needs of contemporary research. With a steadfast dedication to quality and reliability, we empower researchers across the country with innovative technology and specialized expertise to foster progress and breakthroughs"
      },
      {
        "type": "text",
        "content": "1. Implen OD600® User Manual:\n\nhttps://www.implen.de/downloads/#od600"
      },
      {
        "type": "text",
        "content": "2. YouTube video about a McFarland measurement:\n\nhttps://www.youtube.com/watch?v=yjiLk9_ZC1I"
      },
      {
        "type": "text",
        "content": "3. Implen Webpage:\n\nhttps://www.implen.de/implen-od600/mcfarland-application/"
      },
      {
        "type": "text",
        "content": "4. How to create your own McFarland standards:\n\nhttps://microbenotes.com/mcfarland-standards/"
      },
      {
        "type": "text",
        "content": "5. Preparation of McFarland Standards (Protocol from SMILE, Johns Hopkins University, Baltimore, MD, USA):\n\nhttps://www.researchgate.net/profile/Jayedul- Hassan/post/what_is_the_best_McFarland_standard_machine/attachment/59d632ccc49f47 8072ea1c83/AS%3A273636756262916%401442251495264/download/MacFarland+Standard .doc"
      }
    ],
    "comments": [],
    "slug": "streamlining-bacterial-culture-standardization-with-mcfarland-standards-and-implen-od600",
    "excerpt": "In microbiology, achieving consistent and accurate bacterial culture standardization is critical for reliable experimental outcomes. McFarland standards provide a trusted method for estimating bacterial culture concentra"
  },
  {
    "id": 8,
    "title": "Advancing Nanoscale Research with WaveMode NMA Technology",
    "category": "Industry Insights",
    "date": "2025-05-30",
    "author": "Inkarp Applications Team",
    "readTime": "5 min read",
    "image": "/assets/images/productImages/Nanosurf/driveafm.jpg",
    "tags": [
      "AFM",
      "WaveMode NMA",
      "Nanomechanics"
    ],
    "sections": [
      {
        "type": "text",
        "content": "The ability to characterize material properties at the nanoscale is pivotal for breakthroughs in material science applications, soft matter and life-science applications, and emerging fields like photothermal therapy. Nanosurf’s WaveMode NMA, a cutting-edge advancement in Atomic Force Microscopy (AFM), sets a new standard for High-speed nanomechanical mapping. By leveraging photothermal actuation and the intuitive Nanosurf Studio software, WaveMode NMA delivers rapid, precise, and quantitative Nanomechanical analysis, empowering researchers to explore nanomechanical systems with unparalleled efficiency. This blog explores the principles, features, and applications of WaveMode NMA, highlighting its transformative role in afm analysis."
      },
      {
        "type": "text",
        "content": "The Innovation of WaveMode NMA\n\nWaveMode NMA is the cornerstone of Nanosurf’s nanomechanical characterization suite for the DriveAFM, combining photothermal actuation with off-resonance tapping for High-speed nanomechanical mapping. As the fastest commercial method for Force curve acquisition, it offers exceptional temporal resolution and force sensitivity, enabling comprehensive Nanomechanical analysis across large sample areas in significantly reduced timeframes compared to traditional force mapping methods (see Figure 1, which illustrates the nanomechanics portfolio selection guide, plotting WaveMode NMA, Modular Force Spectroscopy, and Viscoelastic Analysis against sample stiffness and measurement frequency)."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/advancing-nanoscale-research-with-wavemode-nma-technology/Nanosurf-DriveAFM.jpg",
        "caption": "Nanosurf DriveAFM"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/advancing-nanoscale-research-with-wavemode-nma-technology/frequency.JPG",
        "caption": "Frequency"
      },
      {
        "type": "text",
        "content": "[Figure 1: Nanosurf nanomechanics portfolio selection guide. The graph displays three complementary methods (classical force spectroscopy, viscoelastic analysis, and WaveMode NMA) plotted against sample stiffness and measurement frequency. Shaded regions indicate the optimal application range for each technique. To select the appropriate method, identify your sample's stiffness range and required measurement frequency, then choose the technique whose shaded area encompasses that point. WaveMode NMA offers the fastest force-curve acquisition across a wide range of sample stiffnesses.]"
      },
      {
        "type": "text",
        "content": "By operating off-resonance, WaveMode NMA eliminates the speed limitations of piezo-driven approaches, delivering direct, quantitative measurements of material properties. This quasi-static operation simplifies data interpretation, making it ideal for material science applications and soft matter and life-science applications, including photothermal therapy research."
      },
      {
        "type": "text",
        "heading": "Calibration and Operation",
        "content": "Calibration for WaveMode NMA is seamlessly integrated into Nanosurf Studio software’s automatic cantilever calibration procedure, requiring only a hard reference sample like silicon, glass, or sapphire (see Figure 2, showing the calibration widget and live oscilloscope for parameter selection). This streamlined process enhances user experience and minimizes setup time. The workflow mirrors classical WaveMode imaging, ensuring a minimal learning curve for researchers transitioning to high speed afm."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/advancing-nanoscale-research-with-wavemode-nma-technology/WaveMode-NMA.JPG",
        "caption": "WaveMode NMA in Nanosurf Studio"
      },
      {
        "type": "text",
        "content": "[Figure 2: WaveMode NMA in Nanosurf Studio. Upper widget: The WaveMode NMA calibration process is fully incorporated in the Cantilever Calibration procedure (available from Nanosurf Studio 14 on). Lower widget: The live oscilloscope supports the user selecting appropriate WaveMode parameters.]"
      },
      {
        "type": "text",
        "content": "In WaveMode NMA, the tip is modulated sinusoidally via photothermal actuation, ensuring a reliable trajectory. The deflection signal measures tip-sample interactions both out-of-contact and in-contact, with the cantilever’s bending shape accounting for accurate analysis. The oscillation frequency is capped at 10% of the cantilever’s resonance frequency to avoid resonance effects, enabling high speed afm and simplified data interpretation. Force-distance curves are evaluated using contact mechanics models (Hertz, Sneddon, DMT) to extract mechanical properties, as shown in Figure 3, which displays an interaction curve on an SBS sample with a DMT model fit and analysis parameters."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/advancing-nanoscale-research-with-wavemode-nma-technology/Analysis-Tab-in-Studio.JPG",
        "caption": "Analysis Tab in Studio"
      },
      {
        "type": "text",
        "content": "[Figure 3: Analysis Tab in Studio. A WaveMode NMA nteraction curve measured on an SBS sample (25 kHz WaveMode frequency) is shown together with the DMT Model fit. A selection of analysis parameters is shown on the right-hand side.]"
      },
      {
        "type": "text",
        "heading": "Specialized Probes for Diverse Applications",
        "content": "Nanosurf offers probes optimized for WaveMode NMA, each tailored to specific sample stiffness ranges and applications (see Figure 4a, illustrating photothermal frequency sweeps and operational ranges):"
      },
      {
        "type": "text",
        "content": "These probes enable WaveMode NMA to address a wide range of research needs, from photothermal therapy studies to advanced materials development."
      },
      {
        "type": "text",
        "heading": "Real-World Applications",
        "content": "WaveMode NMA excels in diverse applications. For example, a micro-phase separated polymer blend (PS-SBS) was mapped using a WM0.8PTD probe, producing a Young’s modulus range of 0.1–3.2 GPa over a 6 µm scan at 19 kHz (see Figure 4c, showing a 3D topography with Young’s modulus overlay, and Figure 4b, a histogram of Young’s modulus values). Similarly, a Sn63Pb37 solder alloy was analyzed with a WM20PTD probe, achieving an 18–112 GPa range over a 2 µm scan at 20 kHz (see Figure 4d). These examples highlight WaveMode NMA’s capability for detailed Nanomechanical analysis across material science applications."
      },
      {
        "type": "text",
        "content": "The Nanosurf Studio software enhances these results with live analysis, evaluating parameters like indentation depth and adhesion force in real-time, supporting Viscoelastic Analysis for diverse sample types."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/advancing-nanoscale-research-with-wavemode-nma-technology/Youngs-Modulus.JPG",
        "caption": "Photothermal"
      },
      {
        "type": "text",
        "content": "[Figure 4: a) Photothermal frequency sweeps of selected WaveMode probes are shown in the upper graph. The shaded areas highlight the typical WaveMode frequency range for the respective probes. b) The histogram of the distribution of Young’s Modulus values obtained from image c). c) Micro-phase separated polymer blend of polystyrene and styrene-butadiene-styrene copolymer (PS-SBS) acquired using a WM0.8PTD probe (6 um scan size, 19 kHz WaveMode frequency, 0.1 -3.2 GPa log color scale); d) Sn63Pb37 solder alloy acquired with a WM20PTD probe (2 um scan size, 20 kHz WaveMode frequency, 18 -112 GPa log color scale). WaveMode NMA maps in c) and d) are displayed as 3-dimensional topography with a Young’s Modulus overlay.]"
      },
      {
        "type": "text",
        "heading": "Advantages Over Traditional Methods",
        "content": "Compared to classical WaveMode imaging and traditional force curve-based approaches, WaveMode NMA leverages photothermal actuation to achieve high speed afm, overcoming speed limitations and enabling rapid dataset collection. The Nanosurf Studio software provides real-time insights via live analysis, making WaveMode NMA a versatile tool for academic research, industrial R&D, and quality control in nanomechanical systems."
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "Nanosurf’s WaveMode NMA redefines Atomic Force Microscopy by delivering High-speed nanomechanical mapping and precise Nanomechanical analysis for applications ranging from soft matter and life-science applications to material science applications. With photothermal actuation, specialized probes, and Nanosurf Studio software, it offers unmatched speed, accuracy, and ease of use, enabling researchers to explore nanomechanical systems with deeper insights. Whether advancing photothermal therapy or characterizing high elastic moduli materials, WaveMode NMA is a game-changer."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments\ns is a leading distributor and trusted service provider for\nNanosurf products in India. With a strong dedication to innovation and quality, Inkarp delivers high-precision scientific instruments and expert support, empowering researchers nationwide to explore new frontiers in science."
      },
      {
        "type": "text",
        "content": "References: Nanosurf"
      }
    ],
    "comments": [],
    "slug": "advancing-nanoscale-research-with-wavemode-nma-technology",
    "excerpt": "The ability to characterize material properties at the nanoscale is pivotal for breakthroughs in material science applications, soft matter and life-science applications, and emerging fields like photothermal therapy. Na"
  },
  {
    "id": 9,
    "title": "Exploring the Thermal Properties and Crystallinity of Polylactic Acid (PLA) through Advanced Analysis",
    "category": "Industry Insights",
    "date": "2025-06-23",
    "author": "Inkarp Applications Team",
    "readTime": "4 min read",
    "image": "/assets/images/productImages/Hitachi/differential-scanning-calorimeter-dsc-nexta-dsc-series.jpg",
    "tags": [
      "DSC",
      "TG/DTA",
      "Polylactic Acid"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Polylactic acid is a biodegradable plastic synthesized from plant-based materials like corn or sugarcane, offering an environmentally friendly alternative to traditional petroleum-based plastics. Its crystallinity affects mechanical strength, impact resistance, transparency, and biodegradability, making it a key consideration in applications such as packaging, fibers, and medical implants. PLA’s monomer, lactic acid, contains optical isomers (levo-rotatory [L] and dextro-rotatory [D]), which, along with molecular weight, influence crystallinity and heat transfer resistance. Understanding these properties through thermal analysis is essential for tailoring PLA’s performance during polymer molding manufacturing."
      },
      {
        "type": "text",
        "heading": "Thermal Analysis Techniques: DSC and TG/DTA",
        "content": "The study employed Differential Scanning Calorimetry (DSC) and Thermogravimetric Analysis (TG/DTA) to investigate PLA’s thermal behavior. DSC measures heat flow to detect transitions like glass transition, cold crystallization, and melting, while TG/DTA evaluates heat transfer resistance and thermal decomposition. Four PLA samples (a, b, c, and c') were analyzed, with samples a, b, and c having similar molecular weights but varying L/D ratios (a"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/exploring-the-thermal-properties-and-crystallinity-of-polylactic-acid-pla-through-advanced-analysis/exploring-Hitachi-NEXTA-DSC200.JPG",
        "caption": "Hitachi NEXTA DSC200"
      },
      {
        "type": "text",
        "content": "Hitachi NEXTA DSC200"
      },
      {
        "type": "text",
        "heading": "Crystallinity and Cooling Rate Effects",
        "content": "Crystallinity in polylactic acid is heavily influenced by the cooling rate during processing. DSC results revealed:"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/exploring-the-thermal-properties-and-crystallinity-of-polylactic-acid-pla-through-advanced-analysis/figure-1-dsc-results-after-cooling-at-0-1-c-min.JPG",
        "caption": "DSC results after cooling at 0.1 °C/min"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/exploring-the-thermal-properties-and-crystallinity-of-polylactic-acid-pla-through-advanced-analysis/figure-2-dsc-results-after-quench-cooling.JPG",
        "caption": "DSC results after quench cooling"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/exploring-the-thermal-properties-and-crystallinity-of-polylactic-acid-pla-through-advanced-analysis/figure-3-dsc-results-for-sample-a.JPG",
        "caption": "DSC results for Sample a"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/exploring-the-thermal-properties-and-crystallinity-of-polylactic-acid-pla-through-advanced-analysis/figure-4-dsc-results-for-sample-b.JPG",
        "caption": "DSC results for Sample b"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/exploring-the-thermal-properties-and-crystallinity-of-polylactic-acid-pla-through-advanced-analysis/figure-5-dsc-results-for-sample-c.JPG",
        "caption": "DSC results for Sample c"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/exploring-the-thermal-properties-and-crystallinity-of-polylactic-acid-pla-through-advanced-analysis/figure-6-dsc-results-for-sample-c.JPG",
        "caption": "DSC results for Sample c'"
      },
      {
        "type": "text",
        "content": "▬ ▬ ▬ ▪ After quench cooling"
      },
      {
        "type": "text",
        "content": "───────── After cooling at 10 °C/min"
      },
      {
        "type": "text",
        "content": "─ ▬ ▬ ─ After cooling at 5 °C/min"
      },
      {
        "type": "text",
        "content": "░░░░░░░░ After cooling at 1 °C/min"
      },
      {
        "type": "text",
        "content": "─ ▬ ─ ▬ After cooling at 0.5 °C/min"
      },
      {
        "type": "text",
        "content": "─ ▬ ▬ ─ ▬ After cooling at 0.1 °C/min"
      },
      {
        "type": "text",
        "content": "The heat of fusion, a measure of the energy required to melt crystalline regions, was used to calculate relative crystallinity, with sample c' at 0.1°C/min set as the reference (value of 1). Higher L ratios correlated with increased crystallinity, while molecular weight influenced crystallinity at faster cooling rates, with lower molecular weight samples (c') showing higher crystallinity due to enhanced chain mobility."
      },
      {
        "type": "table",
        "columns": [
          "Rate/Sample",
          "0.1",
          "0.5",
          "1",
          "5",
          "10",
          "Quench\ncooling"
        ],
        "rows": [
          [
            "a",
            "–",
            "–",
            "–",
            "–",
            "–",
            "–"
          ],
          [
            "b",
            "0.303",
            "0.015",
            "0.005",
            "0",
            "0",
            "0"
          ],
          [
            "c",
            "0.981",
            "0.625",
            "0.164",
            "0.009",
            "0.003",
            "0.001"
          ],
          [
            "c'",
            "1",
            "0.708",
            "0.273",
            "0.033",
            "0.007",
            "0.006"
          ]
        ]
      },
      {
        "type": "text",
        "content": "* The heat of fusion of Sample c′ after cooling at 0.1°C/min was set as 1."
      },
      {
        "type": "text",
        "heading": "Cold Crystallization and Molecular Weight",
        "content": "Cold crystallization temperature, observed around 140°C in quench-cooled samples, was more pronounced in sample c' compared to c, reflecting the impact of lower molecular weight on chain rearrangement. This indicates that molecular weight not only affects crystallinity but also the kinetics of crystallization during rapid cooling, critical for manufacturing processes like injection molding."
      },
      {
        "type": "text",
        "heading": "Heat Resistance and Activation Energy",
        "content": "TG/DTA analysis assessed PLA’s heat transfer resistance and thermal decomposition. No significant differences in thermal decomposition were observed between samples b and c, suggesting comparable stability at the tested heating rates (1–10°C/min). However, kinetic analysis using the Ozawa method revealed differences in activation energy for thermal degradation:"
      },
      {
        "type": "text",
        "content": "These results indicate that samples with higher L ratios (c) have greater heat transfer resistance, while lower molecular weight (c') leads to faster degradation, as reflected in the Arrhenius plot for sample c. This underscores the interplay of optical isomers and molecular weight in determining PLA’s thermal stability."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/exploring-the-thermal-properties-and-crystallinity-of-polylactic-acid-pla-through-advanced-analysis/figure-7.JPG",
        "caption": "TG results for Sample b and c"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/exploring-the-thermal-properties-and-crystallinity-of-polylactic-acid-pla-through-advanced-analysis/figure-8.JPG",
        "caption": "Arrhenius plot results for Sample c"
      },
      {
        "type": "table",
        "columns": [
          "Sample",
          "ΔE [kJ/mol]",
          "Constant Temperature\nDegradation Time (Life Time) (hr.)"
        ],
        "rows": [
          [
            "b",
            "144",
            "15.4"
          ],
          [
            "c",
            "155",
            "21.6"
          ],
          [
            "c′",
            "136",
            "10.9"
          ]
        ]
      },
      {
        "type": "text",
        "content": "* 230 °C, 10% reaction"
      },
      {
        "type": "text",
        "heading": "Implications for PLA Applications",
        "content": "The findings highlight the importance of tailoring cooling rate and optical isomer ratios during polymer molding manufacturing to achieve desired crystallinity and heat transfer resistance. For applications requiring high strength and transparency (e.g., packaging), slow cooling and higher L ratios enhance crystallinity. Conversely, amorphous PLA (like sample a) may suit applications prioritizing flexibility or biodegradability. The thermal analysis of polylactic acid provides actionable insights for optimizing processing conditions, ensuring renewable polymer materials like PLA meet performance requirements in diverse applications."
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "Polylactic acid stands out as a versatile biodegradable plastic, with its crystallinity and heat transfer resistance shaped by optical isomers, molecular weight, and cooling rate. Differential Scanning Calorimetry and Thermogravimetric Analysis reveal how these factors influence glass transition, cold crystallization temperature, heat of fusion, and activation energy, guiding the design of PLA-based products. By leveraging TG/DTA analysis and the Ozawa method, manufacturers can fine-tune PLA’s properties, advancing the adoption of renewable polymer materials in sustainable technologies."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments is a trusted distributor and service provider of\nHitachi products in India, providing cutting-edge solutions crafted to address the dynamic requirements of modern research. With a firm commitment to quality and integrity, we enable researchers nationwide with innovative tools and expert support to advance discovery and innovation."
      }
    ],
    "comments": [],
    "slug": "exploring-the-thermal-properties-and-crystallinity-of-polylactic-acid-pla-through-advanced-analysis",
    "excerpt": "Polylactic acid is a biodegradable plastic synthesized from plant-based materials like corn or sugarcane, offering an environmentally friendly alternative to traditional petroleum-based plastics. Its crystallinity affect"
  },
  {
    "id": 10,
    "title": "Accurate Determination of Casein Content in Milk Using the Kjeldahl Method",
    "category": "Industry Insights",
    "date": "2025-05-30",
    "author": "Inkarp Applications Team",
    "readTime": "4 min read",
    "image": "/assets/images/productImages/Buchi/K-375.webp",
    "tags": [
      "Kjeldahl Method",
      "Casein",
      "Dairy Quality Control"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Casein proteins in milk are the predominant class of proteins found\nin cow milk, accounting for approximately 80% of the total protein\ncontent. These proteins are not carried into the whey during processing and\nare thus integral to the production of cheese and other dairy-based\nproducts. Beyond food applications, casein proteins are also widely\nused in\npharmaceuticals, cosmetics, adhesives, paints, and as technical binders."
      },
      {
        "type": "text",
        "content": "The determination of casein in milk experiments plays a crucial role\nin\npharmaceutical and food quality control. The analytical technique\nemployed\nfor\nthis purpose must reliably quantify the total nitrogen and\ndifferentiate\nnon-casein\nnitrogen (NCN) fractions to assess the casein content\naccurately. The\nKjeldahl\nmethod, recognized for its precision in analysis of nitrogen,\nremains a gold\nstandard."
      },
      {
        "type": "text",
        "content": "This method involves the precipitation of casein using a solution\nof acetic acid, followed by filtration. The filtrate,\nwhich\ncontains non-casein\nnitrogen, is digested with sulfuric acid and kjeldahl\ncatalyst\ntablets,\nconverting organic nitrogen to ammonium sulfate. After\nalkalinization using\nsodium hydroxide, ammonia is distilled with distillation steam\ninto a boric\nacid receiver and quantified by boric acid titration using\nhydrochloric\nacid. The difference between total nitrogen and non-casein\nnitrogen provides\nthe casein content, calculated using the appropriate protein factor."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/accurate-determination-of-casein-content-in-milk-using-the-kjeldahl-method/Buchi-SpeedDigester-K-436.webp",
        "caption": "Buchi SpeedDigester K-436"
      },
      {
        "type": "text",
        "heading": "Equipment and Materials",
        "content": "Buchi KjelFlex K-360"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/accurate-determination-of-casein-content-in-milk-using-the-kjeldahl-method/Buchi-SpeedDigester-K-439.jpg",
        "caption": "Buchi SpeedDigester K-439"
      },
      {
        "type": "text",
        "content": "Buchi SpeedDigester K-439"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/accurate-determination-of-casein-content-in-milk-using-the-kjeldahl-method/Buchi-KjelFlex-K-360.jpg",
        "caption": "Buchi KjelFlex K-360"
      },
      {
        "type": "text",
        "content": "Buchi KjelFlex K-360"
      },
      {
        "type": "text",
        "heading": "Procedure",
        "content": "Casein = Protein factor × (Total\nnitrogen − Non-casein nitrogen)"
      },
      {
        "type": "text",
        "heading": "Digestion Method for Casein\nAnalysis in Milk",
        "content": "To accurately measure casein content, the samples undergo a detailed\ndigestion\nprocess:"
      },
      {
        "type": "text",
        "content": "Note:\nFor this method, the volumes and sample weights used up to the\nfiltration\nstep have been doubled compared to the official method. This adjustment\nensures\nsufficient filtrate for digestion with both K-436 and K-439 systems.\nHowever, the\nsample-to-reagent ratio remains consistent with the standard protocol."
      },
      {
        "type": "table",
        "columns": [
          "",
          "K-439",
          "K-436"
        ],
        "rows": [
          [
            "Step",
            "Temp. [°C]",
            "Time [min]",
            "Level",
            "Time [min]"
          ],
          [
            "Preheat",
            "350",
            "-",
            "6",
            "10"
          ],
          [
            "1",
            "550",
            "35",
            "9.5",
            "35"
          ],
          [
            "2",
            "490",
            "45",
            "8.5",
            "45"
          ],
          [
            "Cooling",
            "-",
            "30",
            "-",
            "30"
          ]
        ]
      },
      {
        "type": "text",
        "content": "Note: Placing the tubes in the designated cooling position will reduce the\ncooling\ntime to approximately 30 minutes. If left inside the heating chamber,\ncooling can\ntake 60 minutes or more."
      },
      {
        "type": "text",
        "heading": "Distillation and Titration",
        "content": "Distill the samples according to the parameters outlined in Table 2 using\nthe KjelFlex\nK-360 , which was connected to a Schott TitroLine easy for\nautomated\ntitration and\nprecise nitrogen determination."
      },
      {
        "type": "table",
        "columns": [
          "KjelFlex K-360",
          "Schott TitroLine easy"
        ],
        "rows": [
          [
            "Water",
            "80 ml",
            "Titration Solution",
            "HCl 0.1 mol/l"
          ],
          [
            "NaOH",
            "80 ml",
            "Internal Method",
            "pH fast strong"
          ],
          [
            "Boric acid 4%",
            "50 ml",
            "Endpoint",
            "pH 4.6"
          ],
          [
            "Reaction Time",
            "5 s",
            "",
            ""
          ],
          [
            "Steam Power",
            "100%",
            "",
            ""
          ],
          [
            "Dist. Time",
            "240 s",
            "",
            ""
          ],
          [
            "Titration Start",
            "240 s",
            "",
            ""
          ],
          [
            "Titration Type",
            "Boric Acid",
            "",
            ""
          ],
          [
            "Stirrer Sp. Dist.",
            "5",
            "",
            ""
          ],
          [
            "Stirrer Sp. Titr.",
            "7",
            "",
            ""
          ]
        ]
      },
      {
        "type": "text",
        "heading": "Calculation of Casein Content",
        "content": "The non-casein nitrogen (NCN) is calculated using titration volume,\nblank\nvolume,\nand the sample weight. The total nitrogen and NCN are used in the\nfollowing\nequations:\n\nWNCN = ((V sample -\nV Blank ). z\n.c.\nf. M N .\nF. V Flask ) / m Sample .1000\n\n— (1)\n\n%NCN = W NCN . 100%\n\n— (2)\n\n%Casein = 6.38 (%N - %NCN)\n\n— (3)"
      },
      {
        "type": "text",
        "heading": "Casein determination in milk:",
        "content": "The results of the casein determination in milk are summarized in Tables 4\nand 5."
      },
      {
        "type": "table",
        "columns": [
          "Whole Milk",
          "Sample Mass (g)",
          "Sample Volume (ml)",
          "% NCN",
          "Casein [%]"
        ],
        "rows": [
          [
            "Sample 1",
            "20.3366",
            "4.1",
            "0.104",
            "2.65"
          ],
          [
            "Sample 2",
            "20.1807",
            "4.01",
            "0.102",
            "2.66"
          ],
          [
            "Sample 3",
            "20.2356",
            "4.02",
            "0.102",
            "2.66"
          ],
          [
            "Sample 4",
            "20.2655",
            "4.05",
            "0.103",
            "2.65"
          ],
          [
            "Average",
            "-",
            "-",
            "0.103",
            "2.65"
          ],
          [
            "RSD [%]",
            "-",
            "-",
            "0.77",
            "0.19"
          ]
        ]
      },
      {
        "type": "text",
        "content": "The mean blank volume for this sample\nwas 0.298 ml (n = 4)."
      },
      {
        "type": "table",
        "columns": [
          "Partial Skimmed Milk",
          "Sample Mass (g)",
          "Sample Volume (ml)",
          "% NCN",
          "Casein [%]"
        ],
        "rows": [
          [
            "Sample 1",
            "20.1807",
            "4.01",
            "0.103",
            "2.63"
          ],
          [
            "Sample 2",
            "20.1835",
            "3.98",
            "0.102",
            "2.64"
          ],
          [
            "Sample 3",
            "20.2192",
            "3.96",
            "0.101",
            "2.64"
          ],
          [
            "Sample 4",
            "20.2779",
            "3.99",
            "0.102",
            "2.64"
          ],
          [
            "Average",
            "-",
            "-",
            "0.102",
            "2.64"
          ],
          [
            "RSD [%]",
            "-",
            "-",
            "0.64",
            "0.16"
          ]
        ]
      },
      {
        "type": "text",
        "content": "The mean blank volume for this sample was 0.298 ml (n = 4)."
      },
      {
        "type": "text",
        "heading": "Casein determination in milk:",
        "content": "The results of the casein determination in milk are summarized in Tables 6\nand 7"
      },
      {
        "type": "table",
        "columns": [
          "Whole Milk",
          "Sample Mass (g)",
          "Sample Volume (ml)",
          "% NCN",
          "Casein [%]"
        ],
        "rows": [
          [
            "Sample 1",
            "20.3366",
            "4.08",
            "0.102",
            "2.66"
          ],
          [
            "Sample 2",
            "20.1807",
            "4.07",
            "0.102",
            "2.66"
          ],
          [
            "Sample 3",
            "20.2356",
            "4.09",
            "0.103",
            "2.66"
          ],
          [
            "Sample 4",
            "20.2655",
            "4.11",
            "0.103",
            "2.65"
          ],
          [
            "Average",
            "-",
            "-",
            "0.102",
            "2.66"
          ],
          [
            "RSD [%]",
            "-",
            "-",
            "0.48",
            "0.12"
          ]
        ]
      },
      {
        "type": "text",
        "content": "The mean blank volume for this sample\nwas 0.363 ml (n = 4)."
      },
      {
        "type": "table",
        "columns": [
          "Partial Skimmed Milk",
          "Sample Mass (g)",
          "Sample Volume (ml)",
          "% NCN",
          "Casein [%]"
        ],
        "rows": [
          [
            "Sample 1",
            "20.1807",
            "4.03",
            "0.101",
            "2.64"
          ],
          [
            "Sample 2",
            "20.1835",
            "4.07",
            "0.102",
            "2.63"
          ],
          [
            "Sample 3",
            "20.2192",
            "4.04",
            "0.101",
            "2.64"
          ],
          [
            "Sample 4",
            "20.2779",
            "4.05",
            "0.101",
            "2.64"
          ],
          [
            "Average",
            "-",
            "-",
            "0.102",
            "2.64"
          ],
          [
            "RSD [%]",
            "-",
            "-",
            "0.51",
            "0.13"
          ]
        ]
      },
      {
        "type": "text",
        "content": "The mean blank volume for this sample was 0.363 ml (n = 4)."
      },
      {
        "type": "text",
        "heading": "Comparison to Official\nMethods",
        "content": "This application aligns with the VDLUFA VI C30.4 standard, using equivalent\nratios of\nchemicals despite scaled volumes for comparative instrument testing. The\nchoice of\ncatalyst, sample size, and water volumes are optimized for the equipment but\ndo not\nimpact final results."
      },
      {
        "type": "table",
        "columns": [
          "Parameter",
          "This Application Note",
          "Standard Method",
          "Notes / Impact"
        ],
        "rows": [
          [
            "Catalyst",
            "10 g Tablets containing:\n\n- 47.7% K₂SO₄\n\n- 47.7% Na₂SO₄\n\n- 2.8% TiO₂\n\n- 1.8% CuSO₄",
            "10 g K₂SO₄ +\n0.25 g CuSO₄",
            "Easy to handle, especially in\nroutine analytics. The choice of catalyst does\nnot influence the result."
          ],
          [
            "Water",
            "80 ml",
            "150 ml",
            "The K-360 generates steam in a separate vessel;\ntherefore, less water is needed compared to the\nstandard method."
          ],
          [
            "Volumes and Weights",
            "All volumes and weights up to the filtration\nstep were doubled to obtain enough filtrate to\ndigest the same sample with the K-436 and K-439.\nThe ratio between sample and chemicals is equal\nto the official method."
          ]
        ]
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "The determination of casein in milk using the Kjeldahl method in combination\nwith SpeedDigester K-436, SpeedDigester K-439, and KjelFlex K-360 provides a\nhighly reliable and reproducible method for protein determination in dairy\nproducts. The low relative standard deviation values confirm the method’s\nprecision. Furthermore, the use of boric acid titration, steam distillation,\nand\nmodern instrumentation ensures accuracy and compliance with official\nmethodologies."
      },
      {
        "type": "text",
        "content": "This robust protocol is ideal for routine milk protein analysis in quality\ncontrol and\nresearch laboratories and demonstrates the continued relevance of the\nKjeldahl\nmethod in modern nitrogen analysis workflows."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments\nis a leading distributor and trusted service partner for\nBuchi\nproducts in India. Committed to innovation and excellence, Inkarp provides\ncutting-edge scientific instruments and dependable expert support,\nempowering\nresearchers nationwide"
      },
      {
        "type": "text",
        "content": "2. Souci Fachmann Kraut, CRC Press, 7th edition, 2008"
      },
      {
        "type": "text",
        "content": "Operation manual of SpeedDigester K-425 / K-436"
      },
      {
        "type": "text",
        "content": "Operation manual of SpeedDigester K-439"
      },
      {
        "type": "text",
        "content": "Operation manual of Scrubber B-414"
      },
      {
        "type": "text",
        "content": "Operation manual of KjelFlex K-360"
      },
      {
        "type": "text",
        "content": "Operation manual of TitroLine easy (Schott)"
      }
    ],
    "comments": [],
    "slug": "accurate-determination-of-casein-content-in-milk-using-the-kjeldahl-method",
    "excerpt": "Casein proteins in milk are the predominant class of proteins found"
  },
  {
    "id": 11,
    "title": "Dynamic Viscoelastic Analysis of Polypropylene Homopolymer and Block Copolymer",
    "category": "Industry Insights",
    "date": "2025-05-30",
    "author": "Inkarp Applications Team",
    "readTime": "4 min read",
    "image": "/assets/images/productImages/Hitachi/thermomechanical-analyzer-tma7000-series.jpg",
    "tags": [
      "DMA",
      "Polypropylene",
      "Viscoelasticity"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Polypropylene (PP) is a general-purpose resin widely used in industries for manufacturing everyday products such as automobile parts and household electrical goods. Three common types of PP utilized as industrial materials include polypropylene homopolymer (made of propylene only), polypropylene block copolymer (with ethylene), and random copolymer (with ethylene). Each type possesses distinct properties, and their application depends on the desired characteristics of the final product."
      },
      {
        "type": "text",
        "content": "Figure 1 illustrates the molecular structures of these PP types. In addition to block PP, the polypropylene block copolymer incorporates polypropylene homopolymer, ethylene propylene rubber (EPR), and PE copolymer. The block copolymer features a sea-island structure, with a continuous matrix phase of PP and a dispersed phase of EPR and PE copolymer domains."
      },
      {
        "type": "text",
        "content": "This brief focuses on dynamic viscoelastic measurement of polypropylene homopolymer and polypropylene block copolymer to evaluate their viscoelastic properties of polypropylene."
      },
      {
        "type": "text",
        "heading": "Experiment",
        "content": "The samples consisted of a commercially available polypropylene homopolymer and a polypropylene block copolymer containing approximately 6% ethylene. Measurements were conducted using the DMA200 Dynamic Mechanical Analyser and the measurement conditions included five frequencies (0.5, 1, 2, 5, and 10 Hz), a temperature range from low temperature (-120°C) to 150°C, and a heating rate of 2°C/min."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/dynamic-viscoelastic-analysis-of-polypropylene-homopolymer-and-block-copolymer/nexta-dma200.webp",
        "caption": "Hitachi NEXTA® DMA200"
      },
      {
        "type": "text",
        "content": "Hitachi NEXTA® DMA200"
      },
      {
        "type": "text",
        "content": "Homopolymer: −P−P−P−P−P−P−P−"
      },
      {
        "type": "text",
        "content": "Block Copolymer: −P−P−P−P−E−E−E−"
      },
      {
        "type": "text",
        "content": "(The compound comprises the following components):"
      },
      {
        "type": "text",
        "content": "−P−P−P−P−P−P−P− (Polypropylene homopolymer)"
      },
      {
        "type": "text",
        "content": "−P−P−P−P−E−E−E− (Block PP)"
      },
      {
        "type": "text",
        "content": "−P−P−E−P−E−P−E− (Ethylene propylene rubber)"
      },
      {
        "type": "text",
        "content": "−E−E−E−E−P−E−E− (PE Copolymer)"
      },
      {
        "type": "text",
        "content": "Random Copolymer: −P−P−P−E−P−P−E−"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/dynamic-viscoelastic-analysis-of-polypropylene-homopolymer-and-block-copolymer/Experiment.JPG",
        "caption": "Experiment"
      },
      {
        "type": "text",
        "heading": "Measurement Results",
        "content": "Figures 2 and 3 present the Dynamic viscoelasticity spectrum of homopolymer and Dynamic viscoelasticity spectrum of copolymer, respectively. These results reflect simultaneous measurements of temperature and frequency dispersion in polymers, displaying Storage modulus (E’), Loss modulus (E”), and tanδ curves across five frequencies (0.5 to 10 Hz)."
      },
      {
        "type": "text",
        "content": "The polypropylene homopolymer results (Figure 2) reveal three dispersions: α (crystal relaxation), β (glass transition temperature), and γ (local mode relaxation). In contrast, the polypropylene block copolymer results (Figure 3) exhibit an additional peak between -50°C and -30°C on the E” and tanδ curves, likely corresponding to the glass transition temperature of ethylene propylene rubber in the block PP."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/dynamic-viscoelastic-analysis-of-polypropylene-homopolymer-and-block-copolymer/Figure-2-Dynamic-viscoelasticity-spectrum.JPG",
        "caption": "Dynamic viscoelasticity spectrum of homopolymer"
      },
      {
        "type": "text",
        "content": "Figure 2 Dynamic viscoelasticity spectrum of homopolymer"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/dynamic-viscoelastic-analysis-of-polypropylene-homopolymer-and-block-copolymer/Figure-3-Dynamic-viscoelasticity-spectrum-of-copolymer.JPG",
        "caption": "Dynamic viscoelasticity spectrum of homopolymer"
      },
      {
        "type": "text",
        "content": "Figure 3 Dynamic viscoelasticity spectrum of copolymer"
      },
      {
        "type": "text",
        "content": "Figures 4 and 5 display the apparent activation energy derived from the tanδ dispersion peaks in Figures 2 and 3. Similar values were obtained for α-dispersion (crystal relaxation) and β-dispersion (glass transition temperature) for the PP component in both polypropylene homopolymer and polypropylene block copolymer. Additionally, the apparent activation energy of the dispersion peak between -50°C and -30°C in the block copolymer was 292.5 kJ/mol, supporting the attribution to the glass transition temperature of ethylene propylene rubber"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/dynamic-viscoelastic-analysis-of-polypropylene-homopolymer-and-block-copolymer/Figure-4-apparent-Activation-Energy-dispersion.JPG",
        "caption": "Apparent Activation Energy for α- and β-dispersion of homopolymer"
      },
      {
        "type": "text",
        "content": "Figure 4 . Apparent Activation Energy for α- and β-dispersion of homopolymer"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/dynamic-viscoelastic-analysis-of-polypropylene-homopolymer-and-block-copolymer/Figure-5-apparent-Activation-Energy.JPG",
        "caption": "Apparent Activation Energy for α- and β-dispersion of copolymer"
      },
      {
        "type": "text",
        "content": "Figure 5 . Apparent Activation Energy for α- and β-dispersion of copolymer"
      },
      {
        "type": "text",
        "content": "Figure 6 compares the E’ and tanδ curves at 10 Hz for polypropylene homopolymer and polypropylene block copolymer. Below -80°C, both exhibit similar Storage modulus transitions. However, post-EPR dispersion, the Storage modulus of the block copolymer is lower than that of the homopolymer, likely due to the influence of ethylene propylene rubber and PE copolymer domains. Additionally, the tanδ curves indicate higher vibrational absorption in the block copolymer at low temperature below the PP dispersion, attributed to the EPR and PE copolymer domains."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/dynamic-viscoelastic-analysis-of-polypropylene-homopolymer-and-block-copolymer/Figure-6-comparison-of-E-and-tan-Curves-for-homopolymer-copolymer.JPG",
        "caption": "Comparison of E’ and tanδ Curves for homopolymer and copolymer"
      },
      {
        "type": "text",
        "content": "Figure 6 . Comparison of E’ and tanδ Curves for homopolymer and copolymer\n\nFrequency: 1Hz\n\n: homopolymer\n\n: copolymer"
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "This application note demonstrates dynamic viscoelastic measurement of polypropylene homopolymer and polypropylene block copolymer to assess their viscoelastic properties of polypropylene. The polypropylene block copolymer results reveal the glass transition temperature of ethylene propylene rubber alongside the inherent relaxation of PP. Notably, differences in vibrational absorption were observed, particularly at low temperature, highlighting the impact of EPR and PE copolymer domains in enhancing vibrational absorption in block copolymers compared to homopolymers."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments\nis a leading distributor and trusted service partner for Hitachi products in India. Committed to innovation and excellence, Inkarp provides cutting-edge scientific instruments backed by expert support, empowering researchers nationwide to advance their work with confidence."
      },
      {
        "type": "text",
        "content": "1. Yasaku. Wada, “Solid Properties of Polymers”, Baihukan (1971)"
      },
      {
        "type": "text",
        "content": "2. N. Okubo, Application Brief DMS No.7, SII NanoTechnology (1990)"
      }
    ],
    "comments": [],
    "slug": "dynamic-viscoelastic-analysis-of-polypropylene-homopolymer-and-block-copolymer",
    "excerpt": "Polypropylene (PP) is a general-purpose resin widely used in industries for manufacturing everyday products such as automobile parts and household electrical goods. Three common types of PP utilized as industrial materia"
  },
  {
    "id": 12,
    "title": "Advancing Edible Oil Quality Control with FT-NIR Spectroscopy",
    "category": "Industry Insights",
    "date": "2025-05-29",
    "author": "Inkarp Applications Team",
    "readTime": "6 min read",
    "image": "/assets/images/productImages/Bruker/matrix-f-ii-banner-bruker.png",
    "tags": [
      "FT-NIR",
      "Edible Oil",
      "Process Analytical Technology"
    ],
    "sections": [
      {
        "type": "text",
        "content": "In the food industry, ensuring the quality and safety of edible oils is critical for meeting consumer expectations and regulatory standards. From seed oil to finished products like sunflower oil, canola oil, and soybean oil, producers face challenges in maintaining consistent quality. Traditional analytical methods are often slow and involve hazardous chemicals. Bruker Optics revolutionizes edible oil quality testing with FT-NIR spectroscopy, a non-destructive testing method that delivers rapid, accurate results. This blog explores how FT-NIR analyzers enhance quality control across the entire edible oil production chain, from seed reception to by-product analysis, ensuring efficiency, safety, and compliance."
      },
      {
        "type": "text",
        "content": "This experiment aims to perform the Kolbe-Schmitt reaction on resorcinol\n(1,3-dihydroxybenzene) to yield β-resorcylic acid (2,4-hydroxybenzoic acid) through\ncarboxylation in an aqueous sodium bicarbonate solution. The product is\nsubsequently analyzed using benchtop NMR spectroscopy, including HSQC NMR\nexperiments, to elucidate molecular structure and couplings in aromatic\ncompounds. This experiment provides students with hands-on experience in spectral\nanalysis and dynamic insights into the behavior of organic compounds through\nspectroscopy."
      },
      {
        "type": "text",
        "heading": "The Power of FT-NIR Spectroscopy in Edible Oil Analysis",
        "content": "Near-infrared spectroscopy is a well-established technique in agriculture, and its adoption in the food industry is growing. FT-NIR spectroscopy, pioneered by Bruker Optics, offers a non-destructive testing solution for analyzing both liquid and solid samples. Unlike traditional wet-chemical or chromatographic methods, which are time-consuming and require hazardous solvents, FT-NIR analyzers provide a safer, faster alternative. These systems deliver precise results without sample preparation, reducing costs and environmental impact, making them ideal for the edible oil industry."
      },
      {
        "type": "text",
        "heading": "Quality Control Across the Production Chain",
        "content": "FT-NIR spectroscopy supports quality control at every stage of edible oil production, from seed reception to by-product utilization. Bruker Optics’ solutions ensure optimal quality and process efficiency"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/advancing-edible-oil-quality-control-with-ft-nir-spectroscopy/Production-Chain.jpeg",
        "caption": "Production Chain"
      },
      {
        "type": "text",
        "heading": "Seed Reception",
        "content": "Analyzing incoming oilseeds, such as sunflower seed oil, rapeseed, canola oil, soybeans, and sesame seed, at the reception bay is crucial for quality control and fair pricing. Traditional methods often involve sending samples to external laboratories, causing delays. FT-NIR analyzers enable rapid, on-site analysis, allowing tight quality control before seeds are discharged, ensuring only high-quality seeds proceed to processing."
      },
      {
        "type": "text",
        "heading": "Storage",
        "content": "Proper storage of oilseeds is essential to prevent bacterial, fungal, or mold growth, which can render seed oil unfit for consumption and lead to profit losses. FT-NIR spectroscopy monitors moisture content and storage conditions, ensuring optimal seed quality for processing. Regular analysis also supports drying processes, maintaining seed integrity over extended storage periods."
      },
      {
        "type": "text",
        "heading": "Oil Extraction",
        "content": "Cleaning, drying, dehulling, and flaking maximize oil yield from seeds. FT-NIR spectroscopy monitors moisture and oil levels in seeds and expeller cakes, providing quick insights into extraction efficiency. It also analyzes crude oil for parameters like free fatty acids, phospholipids, and waxes, optimizing conditions for the subsequent refining process."
      },
      {
        "type": "text",
        "heading": "Oil Refining",
        "content": "Refining removes undesirable substances like free fatty acids and colors but may eliminate valuable components like antioxidants. FT-NIR analyzers enable close monitoring of refining processes and final product testing, both in the lab and through real-time, online process analytical technology. This eliminates delays and costly rework, ensuring high-quality oils."
      },
      {
        "type": "text",
        "heading": "Fat Modification",
        "content": "Natural oils often require modification through fractionation, interesterification, or hydrogenation to meet food industry demands. FT-NIR spectroscopy monitors physical and chemical properties, including fatty acid profile, free fatty acids, trans fatty acids, iodine value, and solid fat content (SFC), ensuring the modified oils meet nutritional and functional requirements."
      },
      {
        "type": "text",
        "heading": "By-Products",
        "content": "By-products like hulls and expeller cakes are valuable for industries such as animal feed. FT-NIR analyzers assess parameters like moisture, oil, protein, fiber, and ash content in under a minute, helping determine market value and ensuring quality for secondary applications."
      },
      {
        "type": "text",
        "heading": "Quality Control of Finished Edible Oils",
        "content": "Edible oils, including sunflower oil, canola oil, soybean oil, corn oil, fish oil, tallow, and lard, require rigorous quality assessment. FT-NIR analyzers measure critical parameters such as free fatty acids, trans fatty acids, iodine value, peroxide value, anisidine value, fatty acid profile, triglyceride profile, SEC screening, saturation, and color. These measurements align with standards set by the American Oil Chemists’ Society (AOCS) and the German Society for Fat Science, replacing slow traditional methods with rapid, reliable results."
      },
      {
        "type": "text",
        "heading": "Olive Oil Authentication: Ensuring Liquid Gold",
        "content": "Extra virgin olive oil, produced through cold-pressing without chemicals, is prone to adulteration due to its premium value. FT-NIR spectroscopy provides a robust solution for olive oil authentication, monitoring the production process and detecting low-quality or adulterated oils, ensuring consumer trust and brand integrity."
      },
      {
        "type": "text",
        "heading": "Optimizing Best Frying Oil Quality",
        "content": "The quality of best frying oil significantly affects the taste, color, and safety of fried foods. FT-NIR spectroscopy monitors frying oil degradation, analyzing parameters like free fatty acids, total polar compounds, polymerized triglycerides, and anisidine value. Recognized by the German Society for Fat Science in their 2013 Standard Method, FT-NIR analyzers deliver accurate, rapid results, enabling consistent quality in fast-food and large-scale frying operations."
      },
      {
        "type": "text",
        "heading": "Process Analytical Technology for Real-Time Control",
        "content": "FT-NIR spectroscopy is integral to process analytical technology (PAT) in food processing technology. The Bruker Optics MATRIX-F spectrometer supports online process control for solid and liquid samples, using contact and non-contact sensors, including fiber optic probes that withstand temperatures up to 260°C. This enables continuous monitoring in industrial deep-fat frying, ensuring optimal oil quality, reducing waste, and enhancing economic efficiency."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/advancing-edible-oil-quality-control-with-ft-nir-spectroscopy/matrix-f-ii-banner-bruker-l.png",
        "caption": "Bruker MATRIX-F II FT-NIR Spectrometer"
      },
      {
        "type": "text",
        "content": "Bruker MATRIX-F II FT-NIR Spectrometer"
      },
      {
        "type": "text",
        "heading": "State-of-the-Art Technology for Reliable Results",
        "content": "Bruker Optics’ FT-NIR analyzers feature the RockSolid interferometer with cube corner mirrors, resistant to vibration and thermal effects. This ensures stability and reliability in harsh factory environments. The pre-aligned, user-replaceable light source minimizes downtime, and precise wavelength accuracy supports calibration transfer, making these analyzers ideal for both lab and production settings."
      },
      {
        "type": "text",
        "heading": "Advanced Software Solutions",
        "content": "The OPUS software suite enhances FT-NIR analyzers with tools for calibration development, raw material identification, and conformity testing. The Multi Evaluation (ME) function automates hierarchical analyses, combining identification, quantification, and conformity tests. OPUS/LAB offers an intuitive interface for routine operators, while OPUS/PROCESS supports automated process control with integration options like Profibus DP, Modbus, and OPC. The software ensures data security with GMP/GLP compliance, 21 CFR Part 11 conformity, and permanent online diagnostics."
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "FT-NIR spectroscopy from Bruker Optics transforms edible oil quality testing by providing a rapid, non-destructive testing solution across the production chain—from sunflower seed oil reception to olive oil authentication and by-product analysis. By integrating process analytical technology, producers achieve real-time control, reduce costs, and meet stringent standards. With robust technology, intuitive software, and comprehensive support, FT-NIR analyzers empower the edible oil industry to deliver high-quality products consistently. Embrace the future of food processing technology with Bruker Optics to elevate quality control to new heights."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments is a premier distributor and dependable service partner for\nBruker products in India. Committed to innovation and excellence, Inkarp supplies advanced scientific instruments along with expert support, enabling researchers across the country to drive groundbreaking discoveries."
      }
    ],
    "comments": [],
    "slug": "advancing-edible-oil-quality-control-with-ft-nir-spectroscopy",
    "excerpt": "In the food industry, ensuring the quality and safety of edible oils is critical for meeting consumer expectations and regulatory standards. From seed oil to finished products like sunflower oil, canola oil, and soybean "
  },
  {
    "id": 13,
    "title": "Analytical Validation of an Immunofluorescence Assay for ARv7 Protein Expression on Circulating Tumor Cells Using the RareCyte Platform",
    "category": "Industry Insights",
    "date": "2025-05-06",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/blogs/BlogFour/cytefinder-ii.jpg",
    "tags": [
      "Immunofluorescence",
      "ARv7",
      "Liquid Biopsy"
    ],
    "sections": [
      {
        "type": "text",
        "content": "In the realm of precision oncology, the characterization of circulating tumor cells\n(CTCs) through non-invasive methods like liquid biopsy has gained significant\ntraction. These advancements offer real-time insights into tumor heterogeneity,\ntherapy resistance, and potential biomarker identification in various cancers,\nparticularly prostate cancer. A growing area of focus is the detection of the\nandrogen receptor splice variant ARv7, which has been associated with resistance to\nanti androgen therapies. This document outlines the analytical validation of an\nimmunofluorescence assay developed to detect ARv7 protein expression on CTCs\nusing the RareCyte Platform, thus providing a powerful tool for assessing treatment\nefficacy and guiding therapeutic decisions."
      },
      {
        "type": "text",
        "heading": "Study Background",
        "content": "CTCs represent a valuable diagnostic resource by enabling blood sample analysis for\nassessing drug target expression and disease progression without invasive\nprocedures. The presence of ARv7 in tumor cells derived from prostate cancer\npatients is linked to poor response to second-generation anti androgen therapies.\nThis study aimed to validate a robust immunofluorescence-based assay to detect\nand quantify ARv7 expression using the RareCyte Platform, with the potential to\nrefine treatment strategies and monitor patient response through liquid biopsy."
      },
      {
        "type": "text",
        "heading": "Methods",
        "content": "The study utilized blood samples from healthy donors, spiked with prostate cancer\ncell lines representing a range of ARv7 expression levels: 22RV1 (high), LNCAP (low),\nand BT-474 (negative). Sample preparation was executed using the AccuCyte\nSample Preparation System."
      },
      {
        "type": "text",
        "content": "Staining was conducted with an automated slide staining system, using the\nRarePlex ARv7 CTC Panel Kit. This panel incorporates:"
      },
      {
        "type": "text",
        "content": "Slides were then imaged using the CyteFinder Instrument, and CTC detection was\nperformed via a machine learning-based algorithm followed by expert review. For\nquantification, mean fluorescence intensity (MFI) was used as a measure of ARv7\nprotein levels, providing an objective readout of expression."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/analytical-validation-of-an-immunofluorescence-assay-for-arv7-protein-expression-on-circulating-tumor-cells-using-the-rarecyte-platform/rarecyte-cytefinder-II.jpg",
        "caption": "Rarecyte CyteFinder II"
      },
      {
        "type": "text",
        "content": "Rarecyte CyteFinder II"
      },
      {
        "type": "text",
        "heading": "Results",
        "content": "The study successfully established an ARv7 MFI threshold that reliably distinguished\nARv7-positive from ARv7-negative cells. The assay identified 83% of 22RV1 cells as\npositive and 98% of BT-474 cells as negative, demonstrating an overall accuracy of\n90%. Importantly, ARv7-positive staining in clinical prostate cancer samples was\nappropriately localized to the nucleus, confirming the assay’s biological relevance."
      },
      {
        "type": "text",
        "content": "When compared with a standard CTC detection assay, recovery rates using the ARv7\nassay were at least equivalent, validating its efficiency. Furthermore, the ARv7 assay\nallowed for precise single cell analysis, contributing to a deeper understanding of\ntumor heterogeneity."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/analytical-validation-of-an-immunofluorescence-assay-for-arv7-protein-expression-on-circulating-tumor-cells-using-the-rarecyte-platform/figure-01.JPG",
        "caption": "The RareCyte ARv7 CTC assay workflow."
      },
      {
        "type": "table",
        "columns": [
          "",
          "ARv7−",
          "ARv7+"
        ],
        "rows": [
          [
            "BT-474",
            "22Rv1",
            "LNCaP"
          ],
          [
            "Test Positive (MFI > 100)",
            "24",
            "832",
            "245"
          ],
          [
            "Test Negative (MFI ≤ 100)",
            "976",
            "168",
            "755"
          ],
          [
            "Specificity",
            "0.976",
            "",
            ""
          ],
          [
            "Sensitivity",
            "",
            "0.832",
            "0.245"
          ],
          [
            "Accuracy",
            "",
            "0.904",
            "0.611"
          ]
        ]
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/analytical-validation-of-an-immunofluorescence-assay-for-arv7-protein-expression-on-circulating-tumor-cells-using-the-rarecyte-platform/figure-02.JPG",
        "caption": "Sensitivity/specificity of ARv7 detection on cell lines"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/analytical-validation-of-an-immunofluorescence-assay-for-arv7-protein-expression-on-circulating-tumor-cells-using-the-rarecyte-platform/figure-03.JPG",
        "caption": "Accuracy of ARv7 detection on cell lines by stainer run"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/analytical-validation-of-an-immunofluorescence-assay-for-arv7-protein-expression-on-circulating-tumor-cells-using-the-rarecyte-platform/table-2.JPG",
        "caption": "Inter-stainer run mean and CV"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/analytical-validation-of-an-immunofluorescence-assay-for-arv7-protein-expression-on-circulating-tumor-cells-using-the-rarecyte-platform/figure-04.JPG",
        "caption": "mCTC stained for ARv7"
      },
      {
        "type": "table",
        "columns": [
          "Patient",
          "Indication",
          "Gold Standard",
          "ARv7 Assay"
        ],
        "rows": [
          [
            "1",
            "Prostate",
            "1",
            "1"
          ],
          [
            "2",
            "Prostate",
            "0",
            "0"
          ],
          [
            "3",
            "Prostate",
            "3",
            "4"
          ],
          [
            "Total",
            "",
            "4",
            "5"
          ]
        ]
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/analytical-validation-of-an-immunofluorescence-assay-for-arv7-protein-expression-on-circulating-tumor-cells-using-the-rarecyte-platform/figure-05.JPG",
        "caption": "Clinical CTC stained for ARv7"
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "This analytical validation confirms that the ARv7 immunofluorescence assay is a sensitive, specific, and reproducible method for detecting ARv7 expression in CTCs from blood samples. The assay performed robustly in differentiating ARv7-positive from negative cells, and its performance was on par with existing CTC detection technologies."
      },
      {
        "type": "text",
        "content": "In clinical samples, both ARv7-positive and ARv7-negative CTCs were successfully\nidentified, demonstrating its potential utility in early and advanced clinical study\nstages. However, a larger cohort is necessary to establish a definitive clinical\nthreshold for ARv7 positivity."
      },
      {
        "type": "text",
        "content": "Crucially, this assay facilitates androgen receptor status monitoring in a non-invasive\nmanner and can serve as a predictive tool for therapeutic response. As ARv7 has\nbeen implicated in resistance to anti androgen therapies, the ability to track its\nexpression through liquid biopsy holds promise for personalized treatment\nplanning."
      },
      {
        "type": "text",
        "content": "The ARv7 assay is also compatible with the RarePlex 488 Developer Kit, allowing\nresearchers to incorporate an additional biomarker for multiplexing, thereby\nbroadening the scope of fluorescence intensity-based analysis in\nimmunofluorescence assays."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments is India’s leading distributor and trusted service partner for\nRarecyte products. Driven by a commitment to innovation and excellence, Inkarp\ndelivers state-of-the-art scientific equipment and dependable support to researchers\nacross the nation."
      }
    ],
    "comments": [],
    "slug": "analytical-validation-of-an-immunofluorescence-assay-for-arv7-protein-expression-on-circulating-tumor-cells-using-the-rarecyte-platform",
    "excerpt": "In the realm of precision oncology, the characterization of circulating tumor cells"
  },
  {
    "id": 14,
    "title": "Optimizing the Lyophilisation Process for Banana Slices Using BUCHI Lyovapor™ L-200",
    "category": "Industry Insights",
    "date": "2025-05-05",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/Buchi/L-200-pro.webp",
    "tags": [
      "Freeze Drying",
      "Lyophilisation",
      "Food Processing"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Freeze drying, also known as the lyophilisation process, is a highly\nefficient and\ngentle food drying technology used for preserving delicate food items\nwithout\naltering their taste, texture, or nutritional value. In this application,\nthe focus is on the\nfreeze drying of banana slices using advanced laboratory freeze drying\nequipment.\nThis method involves freezing the food and then removing water through\nsublimation under reduced pressure. The freeze dried food obtained retains\nits\noriginal structure and is ideal for long-term storage.\nCommonly used in the production of freeze dried food products such as\ncoffee,\nfruits, and vegetables, freeze drying offers distinct advantages in quality\npreservation.\nThis study demonstrates the banana lyophilization process using the BUCHI\nLyovapor™ L-200 Pro and evaluates the results using moisture analysis."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/optimizing-the-lyophilisation-process-for-banana-slices-using-buchi-lyovapor-l-200/buchi-lyovapor-tm-l-200.jpg",
        "caption": "BUCHI LyovaporTM L-200"
      },
      {
        "type": "text",
        "heading": "Equipment Used",
        "content": "BUCHI LyovaporTM L-200"
      },
      {
        "type": "text",
        "heading": "1. Sample Preparation",
        "content": "Fresh bananas were sliced\ninto uniform pieces approximately 5 mm thick. A total of\neleven slices were evenly arranged on a stainless steel tray and placed into\na deep\nfreezer at -40°C (tritec HANNOVER) overnight to ensure thorough freezing. An\nalternative storage temperature of -20°C may also be used, depending on\navailable\ninfrastructure."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/optimizing-the-lyophilisation-process-for-banana-slices-using-buchi-lyovapor-l-200/figure-1.JPG"
      },
      {
        "type": "text",
        "heading": "2. Freeze Drying with BUCHI\nLyovapor™ L-200 Pro",
        "content": "After 24 hours of deep freezing, the frozen banana slices were transferred\ninto the\nLyovapor™ L-200, a high-performance lyophilisation machine designed for\nprecise\nfood drying technology applications. Using the Lyovapor™ Software, both the\nprimary and secondary drying phases were programmed."
      },
      {
        "type": "table",
        "columns": [
          "Drying chamber type",
          "Standard",
          "Safety temperature below collapse\n[°C]",
          "Inactivated"
        ],
        "rows": [
          [
            "Sample collapse temperature [°C]",
            "Inactivated",
            "Gas type",
            "Ambient air"
          ]
        ]
      },
      {
        "type": "text",
        "content": "During primary drying, water removal from banana occurs via sublimation, while secondary drying eliminates adsorbed moisture. The shelf temperature was maintained below 25°C throughout the process to avoid sample collapse. Ambient air was used as the drying gas."
      },
      {
        "type": "table",
        "columns": [
          "Step",
          "",
          "1",
          "2"
        ],
        "rows": [
          [
            "Phase",
            "",
            "Primary Drying",
            "Secondary Drying"
          ],
          [
            "Time",
            "hh:mm",
            "12:00",
            "03:00"
          ],
          [
            "Temperature set point",
            "°C",
            "25.0",
            "25.0"
          ],
          [
            "Temperature gradient",
            "°C/min",
            "0.07",
            "0.00"
          ],
          [
            "Pressure type",
            "",
            "Regulated",
            "Regulated"
          ],
          [
            "Pressure set point",
            "mbar",
            "0.370",
            "0.100"
          ],
          [
            "Safety pressure",
            "mbar",
            "1.500",
            "1.500"
          ],
          [
            "Safety pressure duration",
            "sec",
            "10",
            "10"
          ]
        ]
      },
      {
        "type": "text",
        "heading": "3. Halogen Moisture\nAnalysis",
        "content": "Post freeze drying banana slices, residual moisture content was measured to\ndetermine drying efficiency. Three banana slices were ground and quickly\ntransferred (within 30 seconds) into the Mettler Toledo HR73 Halogen\nMoisture\nAnalyser, a reliable instrument for moisture analysis of dried fruits. The\nanalysis\nwas conducted at 110°C, using a switch-off criterion of 5 (defined as a\nchange of less\nthan 1 mg in 140 seconds)."
      },
      {
        "type": "table",
        "columns": [
          "switch-off criterion",
          "5"
        ],
        "rows": [
          [
            "Drying temperature [°C]",
            "110"
          ]
        ]
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/optimizing-the-lyophilisation-process-for-banana-slices-using-buchi-lyovapor-l-200/figure-2.JPG"
      },
      {
        "type": "text",
        "heading": "1.Visual Evaluation",
        "content": "As shown in comparative images, the freeze dried banana slices maintained\ntheir\noriginal shape, color, and size, indicating minimal structural change during\nthe\nprocess. This confirms the effectiveness of the BUCHI Lyovapor™ L-200 in\npreserving physical properties of the sample."
      },
      {
        "type": "text",
        "heading": "2. Moisture Content\nDetermination",
        "content": "Moisture analysis results are summarized in the table below: All samples\nexhibited\nmoisture contents below 3.14%, with an average water removal from banana of\nover\n95.92%. The initial moisture content of the fresh banana was 76.97 ± 1.24%."
      },
      {
        "type": "table",
        "columns": [
          "Banana slice",
          "Weight of freeze dried sample [g]",
          "Weight of halogen dried sample [g]",
          "Moisture content [%]"
        ],
        "rows": [
          [
            "1",
            "0.606",
            "0.587",
            "3.14"
          ],
          [
            "2",
            "0.843",
            "0.818",
            "2.97"
          ],
          [
            "3",
            "0.794",
            "0.770",
            "3.02"
          ]
        ]
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "This study illustrates that the banana lyophilization process, when carried\nout using\nthe BUCHI Lyovapor™ L-200 Pro, results in highly efficient water removal\nfrom\nbanana slices while maintaining structural integrity. Supported by accurate\nmeasurements from the Mettler Toledo HR73 Halogen Moisture Analyser, the\nprocess ensures superior-quality freeze dried food products. The integration\nof the\nBUCHI Lyovapor™ Software provides precise control and reproducibility,\nmaking\nthis method ideal for both research and industrial applications in food\ndrying\ntechnology."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments is India’s leading\ndistributor and trusted service partner for\nBuchi\nproducts. Driven by a commitment to innovation and excellence, Inkarp\ndelivers\ncutting-edge scientific equipment and dependable support to researchers\nnationwide."
      },
      {
        "type": "text",
        "content": "1. G. W. Oetjen; Freeze drying; Ullmann's Encyclopedia of Industrial\nChemistry\n(2004)."
      },
      {
        "type": "text",
        "content": "2. https://nuts.com/driedfruit/freeze dried/"
      },
      {
        "type": "text",
        "content": "3. http://www.chaucerfreezedried.com/"
      },
      {
        "type": "text",
        "content": "4. https://www.northbaytrading.com/dried-fruit/freeze dried-fruit/"
      },
      {
        "type": "text",
        "content": "5. H. Tse-Chao Hua, L. Bao-Lin, Z. Hua; Freeze drying of Pharmaceutical and\nFood\nProducts, Woodhead Publishing Series in Food Science, Technology and\nNutrition,\npages 141–169 (2010)."
      }
    ],
    "comments": [],
    "slug": "optimizing-the-lyophilisation-process-for-banana-slices-using-buchi-lyovapor-l-200",
    "excerpt": "Freeze drying, also known as the lyophilisation process, is a highly"
  },
  {
    id: 15,
    title: "Chemspeed FLEX AUTOPLANT: Driving Innovation in Polymer Recycling",
    category: "Industry Insights",
    date: "2025-10-22",
    author: "Inkarp Applications Team",
    readTime: "6 min read",
    image: "/assets/images/productImages/Chemspeed/Flex-autoplant.png",
    tags: [
      "Chemspeed",
      "Polymer Recycling",
      "Automation",
    ],
    sections: [
      {
        type: "image",
        imageUrl: "/assets/images/productImages/Chemspeed/Flex-autoplant.png",
        caption: "Chemspeed FLEX AUTOPLANT — Automated Synthesis Platform",
      },
      {
        type: "text",
        heading: "The Challenge",
        content: "Recycling PET into valuable monomers is a cornerstone of circular plastics. Yet researchers face a long-standing trade-off: homogeneous catalysts deliver excellent efficiency but are hard to recover, while heterogeneous systems simplify handling but often sacrifice performance. Developing catalysts that combine both benefits requires rapid synthesis, precise control, and systematic testing — something traditional lab workflows struggle to deliver.",
      },
      {
        type: "text",
        heading: "The Chemspeed Advantage",
        content: "To overcome this bottleneck, researchers turned to Chemspeed's automation platforms. The ASW 2000 automated parallel synthesizer enabled high-throughput RAFT polymerizations, producing a library of thermo-responsive polymer catalysts with consistent quality. The FORMAX platform allowed parallel PET glycolysis reactions, with each reactor independently controlled for temperature, stirring, and reagent dosing. Integrated gravimetric dispensing and multi-needle liquid handling ensured reproducibility while minimizing operator time.",
      },
      {
        type: "text",
        heading: "The Breakthrough",
        content: "Researchers achieved over 91% PET depolymerization conversion with more than 90% selectivity for the desired monomer (BHET), and demonstrated programmable, thermo-responsive polymer catalysts capable of switching between homogeneous and heterogeneous modes. This reduced manual setup time and experimental variability, freeing researchers to focus on scientific discovery instead of repetitive tasks.",
      },
      {
        type: "text",
        heading: "The Impact",
        content: "This case study shows how Chemspeed's automation backbone accelerates sustainable innovation. By merging parallel synthesis with automated application testing, researchers developed catalysts that push the boundaries of recycling technology — pointing toward a future of fully circular materials and processes.",
      },
      {
        type: "text",
        heading: "Conclusion",
        content: "The Chemspeed FLEX AUTOPLANT redefines how researchers approach complex process R&D and preparative synthesis. By combining high-throughput parallel synthesis with automated testing, it enables breakthroughs like PET depolymerization with unprecedented efficiency and precision.\n\nInkarp Instruments is proud to be the authorized distributor and service provider of Chemspeed FLEX AUTOPLANT in India, delivering not only cutting-edge automation platforms but also comprehensive consultation, installation, and nationwide technical support. Together, Chemspeed and Inkarp empower scientists and industries to innovate faster, smarter, and more sustainably.",
      },
      {
        type: "faq",
        heading: "FAQs",
        content: [
          {
            q: "What is the Chemspeed FLEX AUTOPLANT?",
            a: "The Chemspeed FLEX AUTOPLANT is a fully automated platform for process R&D and preparative synthesis. It integrates synthesis, formulation, and testing into one streamlined system, enabling researchers to accelerate discovery and scale-up. Its automation backbone reduces manual workload, enhances reproducibility, and supports high-throughput polymer, chemical, and material innovation projects.",
          },
          {
            q: "How does FLEX AUTOPLANT support polymer recycling research?",
            a: "FLEX AUTOPLANT enables researchers to run multiple PET depolymerization reactions in parallel with precise control of temperature, stirring, and dosing. By automating repetitive tasks, it ensures reproducibility while reducing setup time, allowing rapid testing of catalysts and conditions, leading to breakthroughs in circular plastic recycling and efficient recovery of monomers such as BHET from PET waste.",
          },
          {
            q: "What breakthrough was achieved using Chemspeed automation?",
            a: "Using Chemspeed's automated platforms, researchers achieved over 91% PET depolymerization with more than 90% selectivity for BHET. They also developed programmable, thermo-responsive polymer catalysts that can switch between homogeneous and heterogeneous modes, demonstrating how automation accelerates catalyst development and supports sustainable recycling innovation in materials science.",
          },
          {
            q: "Why is automation important in catalyst development?",
            a: "Catalyst development requires testing numerous variables like composition, temperature, and reaction time. Manual workflows are slow and prone to error. Automation platforms like FLEX AUTOPLANT ensure high-throughput, reproducible experiments with integrated liquid handling and gravimetric dispensing, accelerating discovery and reducing variability.",
          },
          {
            q: "How does FLEX AUTOPLANT improve sustainability in polymer research?",
            a: "By automating catalyst synthesis and PET depolymerization, FLEX AUTOPLANT reduces experimental waste, ensures reproducibility, and speeds up the discovery of greener solutions, helping researchers design catalysts that enable efficient recycling of plastics into valuable monomers and supporting circular economy goals.",
          },
          {
            q: "What industries benefit from Chemspeed FLEX AUTOPLANT?",
            a: "FLEX AUTOPLANT serves a wide range of industries, including polymers, specialty chemicals, pharmaceuticals, food science, and materials research. Its automation capabilities accelerate product development, improve scale-up efficiency, and enhance reproducibility, from PET recycling to drug discovery.",
          },
          {
            q: "How does Chemspeed automation handle parallel synthesis?",
            a: "Chemspeed's automation allows multiple reactions to be performed simultaneously under independently controlled conditions. The ASW 2000 synthesizer can run parallel RAFT polymerizations, while the FORMAX platform manages parallel glycolysis reactions, enabling faster catalyst screening and efficient workflows.",
          },
          {
            q: "Can FLEX AUTOPLANT reduce manual setup time in labs?",
            a: "Yes, integrated modules handle gravimetric dispensing, multi-needle liquid handling, and reagent dosing automatically, minimizing human error and freeing researchers from repetitive preparation tasks to focus on higher-value scientific exploration.",
          },
          {
            q: "Why choose Inkarp Instruments for Chemspeed FLEX AUTOPLANT?",
            a: "Inkarp Instruments is the authorized Chemspeed FLEX AUTOPLANT distributor and service provider in India, offering consultation, professional installation, operator training, preventive maintenance, and nationwide technical support to help labs unlock the full potential of Chemspeed automation.",
          },
          {
            q: "How does FLEX AUTOPLANT contribute to the circular plastics economy?",
            a: "By enabling reproducible catalyst development and scalable PET depolymerization workflows, FLEX AUTOPLANT accelerates the creation of solutions that close the plastics loop, transforming waste PET into valuable monomers like BHET with high efficiency.",
          },
        ],
      },
    ],
    comments: [],
  },
  {
    id: 16,
    title: "RotaChrom CPC Modeler: Enabling Scalable Oligonucleotide Isolation",
    category: "Industry Insights",
    date: "2025-10-22",
    author: "Inkarp Applications Team",
    readTime: "7 min read",
    image: "/assets/blogs/BlogSixteen/rotachrom-cpc-modeler.jpg",
    tags: [
      "Centrifugal Partition Chromatography",
      "Oligonucleotide Purification",
      "RotaChrom",
    ],
    sections: [
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogSixteen/rotachrom-cpc-modeler.jpg",
        caption: "RotaChrom — Centrifugal Partition Chromatography systems",
      },
      {
        type: "text",
        content: "The starting material was a 20-mer single-stranded unmodified oligonucleotide (dT), with 88.5% purity (Figure 1).",
      },
      {
        type: "text",
        content: "There is a growing need for simple, rapid, and scalable chromatographic purification methods for oligonucleotides. While ion-exchange (IEX) chromatography has growing potential, liquid-liquid techniques such as centrifugal partition chromatography (CPC) offer cost-effective alternatives without the need for expensive ion-exchange resins.\n\nIn this study, we demonstrate the effectiveness of our CPC platform for oligonucleotide purification. Our two-phase solvent system consisted of ethyl acetate/n-butanol/nuclease-free water in a defined composition. The cationic compound (used as the exchanger molecule) was dissolved in the stationary phase to retain the oligonucleotides, while sodium hydroxide and sodium chloride in the mobile phase facilitated elution. The 600 mg sample was dissolved in 10 mL of mobile phase and injected via an injection loop at a flow rate of 10 mL/min.",
      },
      {
        type: "table",
        columns: [
          "Parameter",
          "Specification",
        ],
        rows: [
          [
            "Instrument",
            "CPC Modeler",
          ],
          [
            "Rotor volume",
            "225 mL",
          ],
          [
            "Rotation speed",
            "2200 rpm",
          ],
          [
            "Injected sample",
            "600 mg / 10 mL SS lower phase via loop",
          ],
          [
            "Flow rate",
            "10 mL/min",
          ],
          [
            "Mode",
            "Descending (85 min)",
          ],
          [
            "Fraction collection",
            "0.5 min (5 mL)",
          ],
          [
            "Stationary phase",
            "SS upper phase, 60 mM cationic exchanger",
          ],
          [
            "Mobile phase",
            "SS lower phase, 10 mM NaOH, NaCl",
          ],
        ],
        caption: "Table 1: Measurement parameters on the CPC Modeler",
      },
      {
        type: "text",
        content: "The experiment was performed on RotaChrom's Benchtop CPC, part of the CPC Modeler platform — a compact, desktop-sized unit with mg to g/cycle loading capacity and high-purity output. It also includes the CPC Simulator tool, which helps identify optimal purification methods using partition coefficients, crude composition, and a digital method library.\n\nThe resulting fractions demonstrated impressive performance: fractions 36-51 achieved 96.6% purity with a calculated yield of 94.5%, while fractions 38-49 achieved 98% purity with a 74.5% calculated yield. Fractions were lyophilized to remove organic solvents, followed by alcohol precipitation to eliminate salts and residual additives. This study confirms that CPC enables high-purity, high-yield purification of oligonucleotides in a single step — without requiring a solid stationary phase.",
      },
      {
        type: "text",
        heading: "Results",
        content: "The purity and calculated yield differed depending on whether a wider or narrower pool of the collected fractions was examined. Fractions 36-51 achieved 96.6% purity with 94.5% calculated yield, while the narrower pool of fractions 38-49 achieved a higher 98% purity but a lower 74.5% calculated yield. Purity remained above 95% in all cases, allowing a choice between higher purity and higher yield.\n\nCPC can produce a high-purity, high-yield product without the use of expensive solid stationary phase, in a single purification step. The CPC Modeler allows validation of digital purification setups with the provided semi-preparative partition chromatographic equipment, and the Benchtop CPC allows testing of purification methods and fine-tuning of operational parameters for optimal performance.",
      },
      {
        type: "text",
        heading: "Conclusion",
        content: "The RotaChrom CPC Modeler proves to be a game-changing platform for scalable oligonucleotide purification, offering both high purity and high yield in a single chromatographic step. By eliminating the need for costly solid stationary phases and integrating digital simulation tools, the CPC Modeler simplifies method development and ensures reproducibility from mg to g scale.\n\nInkarp Instruments is the authorized distributor and service provider of RotaChrom CPC Modeler in India, delivering advanced chromatographic solutions along with expert consultation, installation, and nationwide technical support. With RotaChrom and Inkarp, laboratories gain access to cutting-edge CPC technology and reliable service, enabling them to accelerate discoveries in life sciences, pharmaceuticals, and beyond.",
      },
      {
        type: "faq",
        heading: "FAQs",
        content: [
          {
            q: "What is the RotaChrom CPC Modeler?",
            a: "The RotaChrom CPC Modeler is a benchtop centrifugal partition chromatography system designed for method development and small-scale purification. It allows researchers to validate digital purification setups and optimize conditions for high-purity separations, with mg to g loading capacity, offering a cost-effective solution for developing scalable purification methods without relying on expensive solid stationary phases.",
          },
          {
            q: "How does the CPC Modeler purify oligonucleotides?",
            a: "The CPC Modeler uses a liquid-liquid partitioning technique where the stationary phase contains a cationic exchanger to retain oligonucleotides, while the mobile phase with NaOH and NaCl elutes them. This process separates impurities and produces high-purity oligonucleotide fractions, with this case study reaching up to 98% purity.",
          },
          {
            q: "What makes CPC a better choice than traditional ion-exchange chromatography?",
            a: "Ion-exchange chromatography relies on expensive resins and can be limited in scalability, while CPC avoids solid phases altogether. The CPC Modeler uses immiscible liquid phases, making purification more cost-efficient and flexible, with high reproducibility and the ability to achieve both high purity and yield in a single step.",
          },
          {
            q: "What were the results of the oligonucleotide purification study?",
            a: "Fractions 36-51 delivered 96.6% purity with 94.5% yield, while a narrower pool of fractions 38-49 reached 98% purity with 74.5% yield. These results demonstrate that CPC offers flexibility between maximizing yield or prioritizing purity, with all collected fractions exceeding 95% purity.",
          },
          {
            q: "Can CPC purification be scaled up for production?",
            a: "Yes, the RotaChrom CPC platform is designed for scalability. The CPC Modeler allows researchers to validate purification methods at benchtop scale before transferring them to larger, industrial CPC systems, maintaining consistency in purity, yield, and reproducibility from lab scale to manufacturing scale.",
          },
          {
            q: "What type of samples can be purified with a CPC Modeler?",
            a: "While this case study focused on oligonucleotides, the CPC Modeler can purify a wide range of biomolecules and small molecules, including natural products, peptides, cannabinoids, alkaloids, and fine chemicals, making it versatile for pharmaceutical, biotechnology, food, and nutraceutical applications.",
          },
          {
            q: "How does the CPC Simulator work with the CPC Modeler?",
            a: "The CPC Modeler comes with a CPC Simulator tool that helps researchers design optimal purification methods digitally before execution, using partition coefficients, crude sample composition, and an extensive method library to predict separation performance and reduce trial-and-error in labs.",
          },
          {
            q: "What are the key advantages of the RotaChrom CPC Modeler?",
            a: "The CPC Modeler offers high-purity outputs, scalability from mg to g/cycle, cost efficiency by avoiding resins, reproducibility through automation, and flexibility in solvent systems, enabling both rapid method optimization and real experimental validation.",
          },
          {
            q: "Why choose Inkarp for RotaChrom CPC Modeler in India?",
            a: "Inkarp Instruments is the authorized distributor and service provider of RotaChrom CPC Modeler in India, providing expert consultation, installation, operator training, and preventive maintenance, with a strong nationwide support network.",
          },
          {
            q: "How does CPC support sustainability in oligonucleotide purification?",
            a: "CPC eliminates the need for expensive and disposable resins, reducing waste and lowering operational costs. The liquid-liquid separation approach also minimizes the use of solid-phase consumables, supporting sustainable oligonucleotide purification aligned with green chemistry principles.",
          },
        ],
      },
    ],
    comments: [],
  },
  {
    id: 17,
    title: "Small Scale Peptide and Impurity Isolation Using Waters ACQUITY UPLC H-Class and Fraction Manager System",
    category: "Industry Insights",
    date: "2025-11-20",
    author: "Inkarp Applications Team",
    readTime: "9 min read",
    image: "/assets/images/productImages/Waters/alliance-hplc-system.jpg",
    tags: [
      "UPLC",
      "Peptide Isolation",
      "Fraction Collection",
    ],
    sections: [
      {
        type: "image",
        imageUrl: "/assets/images/productImages/Waters/alliance-hplc-system.jpg",
        caption: "Waters Alliance HPLC System",
      },
      {
        type: "text",
        heading: "Introduction",
        content: "As peptides become more popular in the development of new therapeutics, it is increasingly important to quickly optimize the synthetic and cleavage processes by isolating and identifying both the target peptide and its related impurities. Collecting and analyzing closely eluting impurities while isolating the target peptide saves time and effort, and provides additional information about steps that can be taken to improve the quality and yield of the peptide product.\n\nWhile peptide isolation is routine for groups involved in synthesis and cleavage, it is also useful for scientists in research and discovery groups studying how these complex molecules affect the body, are metabolized, or are isolated from naturally occurring sources, where only small amounts are required for initial experiments.\n\nThis application illustrates the utility of the ACQUITY UPLC H-Class and Waters Fraction Manager-Analytical (WFM-A) Systems for the analysis and isolation of a synthetic peptide and its closely eluting impurities. This instrument configuration can be adapted for the isolation of constituents from complex synthetic, metabolic, or natural product mixtures at small scale.",
      },
      {
        type: "text",
        heading: "Experimental",
        content: "Analytical column: XBridge Peptide BEH C18, 4.6 × 50 mm, 5 μm. Flow rate: 1.46 mL/min. Mobile phase A: 0.1% trifluoroacetic acid in water. Mobile phase B: 0.1% trifluoroacetic acid in acetonitrile. Wash solvent: 7:2:1 acetonitrile/methanol/water. Purge solvent: 9:1 water/methanol. Wavelength: 280 nm. Column temperature: 30°C. Sample: crude synthetic peptide comprised of 16 amino acid residues (7 polar, 6 nonpolar, 1 acidic, 2 basic), 56% purity by HPLC.",
      },
      {
        type: "text",
        heading: "Instrumentation",
        content: "System: ACQUITY UPLC H-Class System with an ACQUITY UPLC PDA Detector and Empower 3 Software. Fraction collection: Waters Fraction Manager-Analytical (WFM-A).",
      },
      {
        type: "text",
        heading: "Results and Discussion",
        content: "The principles of scaling chromatography remain the same whether the objective is to increase the amount of sample isolated at one time on a large column, or to decrease the amount of product based on the immediate need for material to perform experiments quickly. For these studies, a new aliquot of the crude synthetic peptide sample was isolated using the same optimized and focused gradient, this time at a much smaller scale — on a 4.6 × 50 mm XBridge Peptide BEH C18 Column using the ACQUITY UPLC H-Class System configured with a WFM-A fraction collector.\n\nThe crude peptide (2.4 mg) was dissolved in dimethylsulfoxide (DMSO) and filtered using a 13 mm Acrodisc GHP syringe filter. Whereas 10 μL was the maximum injection volume that maintained resolution between the peptide and its impurities on the 4.6 × 100 mm XBridge C18 Column used in previous work, geometric scaling to the shorter 4.6 × 50 mm column reduced the injection volume to 5 μL.\n\nThe reduction in column length automatically reduced the gradient run time from 18 minutes on the 100 mm column to 9 minutes on the 50 mm column. With the target peptide peak and its closely eluting impurities eluting well before 36% B, the gradient conditions were adjusted to run from 28-32% B in 5 minutes, saving time in the method. Because of the complexity of crude synthetic peptide samples, shallow focused gradients with slopes of about 0.2-0.3% change per column volume are useful for resolving more sample constituents. In this configuration, the ACQUITY UPLC H-Class and WFM-A Systems provide sharp peaks, high resolution, and efficient fraction collection — ideal for small-scale peptide and impurity isolation.",
      },
      {
        type: "text",
        content: "The ACQUITY UPLC H-Class System, with its low system dispersion, exact control of solvent composition, and accurate sample injection scheme, provided excellent chromatographic reproducibility, illustrated by an overlay of five peptide injections that matched exactly. The Waters Fraction Manager-Analytical (WFM-A) was specifically designed to minimize peak dispersion during collection, emphasizing the benefit of low peak dispersion in the fraction collection valve compared with a traditional collector.",
      },
      {
        type: "text",
        content: "Narrow, concentrated peaks are easily identified and collected with higher recovery when peaks are clearly defined. Fractions can be collected by time, slope, threshold, or any combination of the three. While collection starting and ending times may be manually entered in the WFM-A method editor if desired, it is also possible to populate the WFM-A method automatically using processed results from an analytical injection.",
      },
      {
        type: "text",
        content: "With the collection method developed, the peptide and two closely eluting impurities were isolated from the crude sample in a total of ten injections. Because the ACQUITY UPLC H-Class System is so reproducible, all sample purification chromatograms were essentially identical. The fraction volumes were essentially identical for each compound in each isolation (impurity 1, 0.29 mL; peptide, 0.55 mL; impurity 2, 0.33 mL). All fractions of each type were pooled, and an aliquot of each pool was immediately analyzed using two different gradients.",
      },
      {
        type: "text",
        content: "The peptide product purity was 100% as determined by both the fast gradient and the shallower focused gradients used for fraction analysis. While the fast gradient (3.38% change per column volume) showed impurity 1 to be about 83% pure, the shallow focused gradient (0.30% change per column volume) resolved yet another coeluting peak and reduced the estimated purity to about 77%. Impurity 2 had a purity of 98% using the fast gradient and 80% using the focused gradient, again due to better resolution of compound constituents. If higher purity contaminant fractions were required for subsequent studies, further method development would likely be needed.",
      },
      {
        type: "text",
        heading: "Conclusion",
        content: "The Waters ACQUITY UPLC H-Class System combined with the Waters Fraction Manager-Analytical (WFM-A) enables precise, small-scale peptide and impurity isolation with unmatched reproducibility and efficiency. Its low dispersion design, accurate solvent control, and optimized fraction collection allow researchers to recover narrow, concentrated peaks with confidence, saving valuable time, resources, and sample material.\n\nInkarp Instruments is the authorized distributor and service provider for Waters in India, delivering advanced chromatographic solutions along with expert consultation, installation, and nationwide technical support. Partnering with Waters and Inkarp empowers laboratories to achieve higher productivity, better reproducibility, and accelerated innovation in peptide and small-molecule research.\n\nReferences:\n1. Uhlig T, Kyprianou T, Martinelli FG, et al. The emergence of peptides in the pharmaceutical business: From exploration to exploitation. EuPA Open Proteomics 4 (2014) 58-69.\n2. Aubin A, Jablonski J. Prep 150 LC System: Considerations for Analytical to Preparative Scaling. Waters Application Note 720005458EN. July 2015.\n3. Jablonski J, Aubin A. Peptide Isolation Using the Prep 150 LC System. Waters Application Note 720005455EN. July 2015.\n4. Jablonski J, Wheat T, Diehl D. Developing Focused Gradients for Isolation and Purification. Waters Technical Note 720002955EN. September 2009.",
      },
      {
        type: "faq",
        heading: "FAQs",
        content: [
          {
            q: "What is the Waters ACQUITY UPLC H-Class System?",
            a: "The Waters ACQUITY UPLC H-Class System is a versatile ultra-performance liquid chromatography (UPLC) platform designed for high-resolution separations. It provides low dispersion, precise solvent control, and reproducible injections, making it ideal for complex sample analysis such as peptide isolation, impurity profiling, and small molecule research.",
          },
          {
            q: "How does the Waters Fraction Manager-Analytical (WFM-A) improve peptide isolation?",
            a: "The WFM-A minimizes peak dispersion during collection, allowing researchers to isolate narrow, concentrated peaks with higher recovery. It supports collection by time, slope, or threshold, and can automatically populate collection methods using processed chromatographic data.",
          },
          {
            q: "Why is small-scale peptide isolation important?",
            a: "Small-scale peptide isolation is essential in research and early drug discovery, where only minimal amounts of material are required for initial experiments. It allows scientists to quickly gain insights into sample composition, synthesis, and cleavage quality.",
          },
          {
            q: "What was demonstrated in this peptide isolation study?",
            a: "The ACQUITY UPLC H-Class System with WFM-A was used to isolate a synthetic peptide and two closely eluting impurities, delivering highly reproducible chromatograms, narrow peaks, and efficient fraction recovery. The peptide product achieved 100% purity.",
          },
          {
            q: "How does low dispersion benefit peptide purification?",
            a: "Low system dispersion ensures sharper peaks, higher resolution, and better recovery during fraction collection, allowing isolation of target peptides with minimal contamination and preserving integrity and concentration when working with limited samples.",
          },
          {
            q: "What is the role of shallow gradients in peptide isolation?",
            a: "Shallow focused gradients, typically with slopes of 0.2-0.3% per column volume, are useful in resolving complex peptide mixtures by slowing the separation process, allowing more constituents to be distinguished and collected accurately.",
          },
          {
            q: "How reproducible is the ACQUITY UPLC H-Class System?",
            a: "The ACQUITY UPLC H-Class provides excellent reproducibility due to its precise solvent control and accurate injection system. Five peptide injections in the study produced identical chromatograms, confirming consistency for fraction collection.",
          },
          {
            q: "Why choose Inkarp Instruments for Waters systems in India?",
            a: "Inkarp Instruments is the authorized distributor and service provider for Waters in India, providing expert consultation, installation, operator training, preventive maintenance, and nationwide support for Waters ACQUITY UPLC H-Class and Fraction Manager systems.",
          },
        ],
      },
    ],
    comments: [],
  },
  {
    id: 19,
    title: "IIT Delhi Develops an AI Lab Assistant That Can Run AFM Experiments on Its Own",
    category: "Industry Insights",
    date: "2026-01-21",
    author: "Inkarp Applications Team",
    readTime: "5 min read",
    image: "/assets/images/productImages/Nanosurf/driveafm.jpg",
    tags: [
      "AI in Research",
      "AFM Automation",
      "IIT Delhi",
    ],
    sections: [
      {
        type: "text",
        content: "Researchers at the Indian Institute of Technology Delhi have demonstrated something that quietly changes how experimental science can be done. Their research group has developed AILA, an Artificially Intelligent Lab Assistant that can autonomously operate an Atomic Force Microscope (AFM). This work has been led by the group of Dr. Nitya Nand Goswami, along with Dr. N. M. Anoop Krishnan, and has been published in Nature Communications.",
      },
      {
        type: "text",
        heading: "Why This Matters",
        content: "Running an AFM is not a push-button task. It requires judgement — choosing parameters, interpreting noisy signals, adjusting feedback, and deciding when something is wrong and what to do next. Most of this depends on experience built over years of hands-on work. AILA is designed to take on that responsibility: it can plan experiments, run AFM measurements, make decisions in real time, analyse the data, and adapt the next steps without human involvement. Tasks that earlier took several hours, or sometimes a full day, can now be completed in minutes. This is not simple automation — it is an intelligent loop where decisions, experiments, and interpretation are tightly connected.",
      },
      {
        type: "text",
        heading: "A Shift from Assisting Science to Doing Science",
        content: "Until now, most AI tools in research helped after the experiment was done — analysing data, generating plots, or assisting with writing. AILA moves into a very different space: it interacts directly with real laboratory hardware, controls the instrument, responds to what it observes, and learns from outcomes to adjust its behaviour. Operating an AFM demands an understanding of nanoscale physics and real-time feedback control, so the fact that an AI system can handle this autonomously marks an important shift in how we think about experimentation itself.",
      },
      {
        type: "text",
        heading: "What This Enables",
        content: "Autonomous experimental systems like AILA open the door to faster discovery, better reproducibility, and more efficient use of high-value instruments. They reduce dependence on manual trial and error and allow researchers to explore larger experimental spaces in a structured way. This has clear implications for materials science, nanotechnology, surface science, tribology, and other areas where AFM is a core tool — pointing to a future where laboratories do not stop when people leave for the day, and where every experiment feeds learning back into the system.",
      },
      {
        type: "text",
        heading: "Inkarp Perspective",
        content: "At Inkarp, we pay close attention to developments where artificial intelligence meets real laboratory instrumentation. Work like this from IIT Delhi shows where advanced research labs are heading. As instruments become more intelligent and workflows become more autonomous, the role of technology in shaping research outcomes will only grow, and this work is a strong example of that direction.",
      },
      {
        type: "text",
        heading: "Credits and Source",
        content: "Mandal, I.; Soni, J.; Zaki, M.; Smedskjaer, M. M.; Wondraczek, K.; Wondraczek, L.; Gosvami, N. N.; Krishnan, N. M. A. Evaluating Large Language Model Agents for Automation of Atomic Force Microscopy. Nature Communications 2025, 16 (1). https://doi.org/10.1038/s41467-025-64105-7\n\nAll credit for the scientific work belongs to the original authors.",
      },
    ],
    comments: [],
  },
  {
    id: 20,
    title: "The New Standard for Surface Roughness Measurement in Semiconductor Wafers",
    category: "Industry Insights",
    date: "2026-01-27",
    author: "Inkarp Applications Team",
    readTime: "6 min read",
    image: "/assets/images/productImages/Nanosurf/driveafm.jpg",
    tags: [
      "AFM",
      "Semiconductor Wafers",
      "WaveMode",
    ],
    sections: [
      {
        type: "text",
        content: "Semiconductor research and manufacturing are inseparable from silicon wafers, and one of their most critical characteristics is surface roughness. Even minute irregularities can significantly influence device performance. Excessive roughness can reduce the mobility of electrons and holes, directly affecting electrical efficiency and reliability. Its impact goes far beyond electrical behavior, influencing adhesion, photolithography precision, optical properties, and overall device durability throughout the manufacturing process.\n\nA rough wafer surface can scatter charge carriers, increasing resistance and reducing efficiency in high-performance CPUs, GPUs, and memory chips. It also affects thin-film adhesion, compromises photolithography accuracy, and can degrade optical performance in LEDs and solar cells. In addition, surface irregularities may introduce cracks and defects that reduce yield and long-term reliability.\n\nFor this reason, semiconductor manufacturers continuously monitor wafer roughness, defined as the root mean square (RMS) of height deviations from the mean surface, typically measured in the sub-nanometer (angstrom) range. Atomic Force Microscopy (AFM) is the natural choice for such measurements. However, traditional dynamic modes have long been limited by slow scanning speeds. This limitation is now overcome with Nanosurf's WaveMode, available on the DriveAFM and the industrial Alphacen 300 Drive systems. WaveMode operates up to 15 times faster than conventional dynamic modes, establishing a new reference for sub-nanometer roughness measurements and positioning DriveAFM as the future standard in semiconductor metrology.",
      },
      {
        type: "text",
        content: "WaveMode is enabled by CleanDrive technology, which uses a second laser to excite the cantilever photothermally off-resonance. Unlike other off-resonance implementations, WaveMode does not require or depend on subtracting parasitic background signals. This photothermal excitation overcomes the typical f/Q limitation associated with dynamic mode operation.\n\nBy incorporating the Fast Scanning option, which includes an additional piezo capable of rapidly following surface topography, the system achieves significantly faster response times and higher scanning speeds. In semiconductor production environments, this translates directly into increased throughput.\n\nAnother important advantage of WaveMode is the precise control of the tip-sample interaction, minimizing the risk of damage to both the wafer surface and the probe tip. Maintaining tip condition allows repeated measurements over extended periods without frequent replacement, lowering operational costs. As a result, WaveMode delivers highly reproducible measurements; in datasets collected over nine consecutive days, the distribution of roughness values remained stable, confirming preserved tip quality and low-noise measurement performance from start to finish.",
      },
      {
        type: "text",
        content: "Compared to traditional AFM dynamic modes, WaveMode is also notably easier to operate. In dynamic mode, the interaction regime — attractive or repulsive — depends heavily on parameters such as oscillation amplitude and setpoint, which determine the force between the tip and the sample. Minor changes in these parameters can easily shift the system between regimes, leading to unstable interactions. WaveMode, by contrast, can be configured in just a few simple steps through an intuitive procedure, and it provides visual feedback on the applied force, giving users clear control and confidence during measurements.\n\nSource: Nanosurf Website",
      },
      {
        type: "faq",
        heading: "FAQs",
        content: [
          {
            q: "Why is surface roughness critical in semiconductor wafer manufacturing?",
            a: "Surface roughness at the angstrom and sub-nanometer level directly affects how semiconductor devices perform. Even tiny irregularities can reduce electron and hole mobility, increasing resistance and lowering efficiency in CPUs, GPUs, and memory chips. Rough surfaces also impact thin-film adhesion, photolithography precision, and optical behavior in LEDs and solar cells, and over time can introduce micro-cracks and defects that reduce yield and device reliability.",
          },
          {
            q: "How is surface roughness of silicon wafers measured accurately?",
            a: "Surface roughness of silicon wafers is commonly defined as the root mean square (RMS) of height deviations from the mean surface. Atomic Force Microscopy (AFM) is widely used for this purpose because it provides nanometer and sub-nanometer resolution. Advanced modes like WaveMode improve measurement speed and stability without sacrificing resolution.",
          },
          {
            q: "What limitations do traditional AFM dynamic modes have in wafer analysis?",
            a: "Traditional AFM dynamic modes are often slow and sensitive to parameter changes such as oscillation amplitude and setpoint. Small adjustments can shift the tip-sample interaction from attractive to repulsive regimes, causing instability. Conventional dynamic modes are also limited by the f/Q factor, restricting response time and scan speed.",
          },
          {
            q: "How does Nanosurf WaveMode improve AFM roughness measurements?",
            a: "WaveMode uses CleanDrive photothermal excitation to drive the cantilever off-resonance with a second laser. This removes the need for parasitic background subtraction and overcomes the f/Q limitations of traditional dynamic modes, enabling scanning up to 15 times faster while maintaining sub-nanometer accuracy.",
          },
          {
            q: "What is the advantage of Fast Scanning in semiconductor wafer metrology?",
            a: "The Fast Scanning option adds a high-speed piezo that rapidly follows the wafer surface topography, enabling faster response times and significantly higher scanning speeds without compromising data quality, translating directly into higher throughput on production lines.",
          },
          {
            q: "How does WaveMode ensure reproducible roughness measurements over time?",
            a: "WaveMode precisely controls the tip-sample interaction, reducing wear on both the wafer surface and the probe tip. Studies over nine consecutive days have shown consistent roughness values across different wafer locations, demonstrating excellent reproducibility and long-term measurement stability.",
          },
          {
            q: "How fast can AFM measure wafer roughness using WaveMode?",
            a: "With WaveMode, a silicon wafer surface can be imaged at a 15 Hz line rate, acquiring a full high-resolution image in less than 34 seconds — significantly faster than traditional AFM modes, which can take several minutes for similar scans.",
          },
          {
            q: "How does easy operation of WaveMode benefit semiconductor engineers?",
            a: "Unlike traditional dynamic modes that require careful tuning of multiple parameters, WaveMode can be set up in a few intuitive steps and provides visual feedback on applied forces, reducing operator dependency and shortening training time.",
          },
        ],
      },
    ],
    comments: [],
  },
  {
    id: 21,
    title: "Metal Alloys from a New Perspective",
    category: "Industry Insights",
    date: "2026-01-27",
    author: "Inkarp Applications Team",
    readTime: "6 min read",
    image: "/assets/images/productImages/Nanosurf/driveafm.jpg",
    tags: [
      "AFM",
      "Metal Alloys",
      "Nanomechanics",
    ],
    sections: [
      {
        type: "image",
        imageUrl: "/assets/images/productImages/Nanosurf/driveafm.jpg",
        caption: "Nanosurf DriveAFM — Atomic Force Microscope",
      },
      {
        type: "text",
        content: "Transportation, energy production, healthcare, electronics — it is difficult to find any field untouched by material science. Metallurgy, in particular, has accompanied human progress for thousands of years. Bronze marked an entire age of human civilization. Steel powered the Industrial Revolution. Today, metal alloys continue to form the backbone of modern technology, especially in the semiconductor and electronics industries.\n\nBehind every silicon chip lies a network of carefully engineered metal alloys. Aluminum-silicon-copper interconnects ensure signal transmission, while titanium and tantalum barriers prevent atomic diffusion and improve reliability. Semiconductor materials themselves are evolving through alloy engineering, with silicon-germanium and III-V compounds such as gallium arsenide, indium phosphide, and aluminum gallium arsenide enabling faster, more efficient devices for the digital era.",
      },
      {
        type: "text",
        heading: "Understanding Alloy Behavior at Micro and Nanoscale",
        content: "Modern alloy design requires careful control of structure and properties. Mechanical metamaterials with nano- and micro-architected structures demonstrate properties that arise primarily from geometry rather than composition. Advances in fabrication now allow creation of both periodic and disordered architectures, enabling mechanical behaviors rarely seen in natural materials.\n\nAtomic Force Microscopy (AFM) allows researchers to investigate these properties at micro- and nanoscale dimensions. The structure of an alloy strongly influences its mechanical performance: grain boundaries and phase boundaries restrict dislocation movement and directly affect plastic deformation. Therefore, understanding the arrangement, dominant orientations, and phase separation scale is essential to predict alloy performance.\n\nNanoindentation is commonly used to investigate metallic surfaces, but it is often slow. Nanosurf's DriveAFM, equipped with CleanDrive photothermal excitation and FastScanning, can scan a 1 μm x 1 μm area in under 35 seconds per frame (line rate 15 Hz) at high resolution (512 x 512 pixels) using WaveMode — the fastest off-resonance AFM technique. With WaveMode NMA, quantitative elasticity values can be obtained alongside topography, allowing direct visualization of phase-dependent mechanical variations.",
      },
      {
        type: "text",
        heading: "Advancing Quantitative Nanomechanics of Metal Alloys",
        content: "WaveMode NMA extends the capabilities of AFM into quantitative measurements on metal alloys, as reported in the peer-reviewed journal Small. Measuring high elasticity ranges in metal alloys requires stiff probes, which are more challenging to drive through photothermal excitation, since photothermal actuation depends on a second laser heating the cantilever, and stiffer probes require higher laser power for bending.\n\nThis challenge was addressed through collaboration with a research partner that developed a specialized cantilever coating. The study demonstrated how heat propagation along the cantilever influences its bending behavior. Variations in heat distribution lead to different bending patterns, determining the vertical motion of the probe over time. Understanding this behavior enables fast, quantitative nanomechanics without adding complexity.\n\nNanosurf's Studio software integrates all necessary tools for high-resolution, fast, and quantitative measurements, including WaveMode NMA controls, analysis tools, and a one-click calibration workflow within an intuitive and customizable interface.\n\nSource: Nanosurf Website",
      },
      {
        type: "faq",
        heading: "FAQs",
        content: [
          {
            q: "How is Atomic Force Microscopy (AFM) used to analyze metal alloys at the nanoscale?",
            a: "AFM enables high-resolution surface characterization of metal alloys at nanometer and sub-nanometer levels, physically tracing the surface with a sharp probe to visualize grain boundaries, phase separations, and nanoscale structures. With advanced modes like WaveMode, AFM can also measure mechanical properties such as elasticity alongside topography.",
          },
          {
            q: "Why is nanoscale characterization important in modern alloy design?",
            a: "Modern alloys are engineered to meet highly specific performance requirements across aerospace, electronics, healthcare, and energy. Grain boundaries, phase distributions, and nanostructures influence strength, plasticity, fatigue resistance, and conductivity, and nanoscale characterization helps scientists understand these structural features.",
          },
          {
            q: "What advantages does WaveMode AFM offer over traditional nanoindentation for metal analysis?",
            a: "Nanoindentation is widely used but often slow and limited to point measurements. WaveMode AFM provides a faster, high-resolution alternative by scanning entire surfaces while simultaneously capturing topography and quantitative elasticity data, minimizing tip wear and providing stable, repeatable results.",
          },
          {
            q: "How does WaveMode NMA measure quantitative elasticity in metal alloys?",
            a: "WaveMode NMA combines high-speed AFM imaging with photothermal excitation to measure mechanical properties such as elasticity directly during scanning, allowing researchers to identify different phases in an alloy based on mechanical contrast.",
          },
          {
            q: "What role do grain and phase boundaries play in alloy performance?",
            a: "Grain boundaries and phase boundaries restrict dislocation movement, affecting plastic deformation, strength, and fatigue resistance. AFM imaging with WaveMode allows clear visualization of these structural features at the nanoscale, enabling prediction of real-world alloy performance.",
          },
          {
            q: "Why is photothermal excitation important in AFM for alloy studies?",
            a: "Photothermal excitation, used in WaveMode AFM, involves using a secondary laser to actuate the cantilever off-resonance, providing cleaner, faster, and more stable probe motion compared to traditional excitation methods, especially important when using stiff probes required for measuring hard metal surfaces.",
          },
          {
            q: "What makes DriveAFM suitable for high-resolution alloy surface analysis?",
            a: "DriveAFM, equipped with CleanDrive photothermal excitation and FastScanning, enables high-speed, high-resolution imaging of metal surfaces, scanning a 1 μm x 1 μm area in under 35 seconds while maintaining 512 x 512 pixel resolution, combined with WaveMode NMA for both topographical and mechanical insights in a single scan.",
          },
          {
            q: "How does AFM contribute to the development of advanced alloys for electronics and semiconductors?",
            a: "Metal alloys play a crucial role in semiconductor reliability, from interconnect materials to diffusion barriers. AFM enables detailed surface and mechanical analysis of these materials, helping researchers understand how nanoscale features influence electrical and mechanical performance.",
          },
        ],
      },
    ],
    comments: [],
  },
  {
    "id": 22,
    "title": "Kolbe-Schmitt Carboxylation of Resorcinol: A Benchtop NMR Spectroscopy Approach",
    "category": "Industry Insights",
    "date": "2025-04-25",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/Nanalysis/100mhz-powerful-benchtop-nmr.png",
    "tags": [
      "NMR Spectroscopy",
      "Kolbe-Schmitt Reaction",
      "Organic Chemistry"
    ],
    "sections": [
      {
        "type": "text",
        "heading": "Introduction",
        "content": "The Kolbe-Schmitt reaction is a fundamental carboxylation method widely used in\norganic chemistry for the synthesis of hydroxybenzoic acids. This process involves the\nreaction of phenolic compounds with carbon dioxide under basic conditions. Initially\ndeveloped by Kolbe as a solid-gas reaction to synthesize salicylic acid, Schmitt later\nimproved the methodology by employing elevated pressures to reduce phenol\nlosses, increasing overall efficiency. Beyond industrial applications, the Kolbe-Schmitt\nreaction remains essential in laboratory-scale organic chemistry experiments and is a\nkey reaction in organic chemistry training."
      },
      {
        "type": "text",
        "content": "This experiment aims to perform the Kolbe-Schmitt reaction on resorcinol\n(1,3-dihydroxybenzene) to yield β-resorcylic acid (2,4-hydroxybenzoic acid) through\ncarboxylation in an aqueous sodium bicarbonate solution. The product is\nsubsequently analyzed using benchtop NMR spectroscopy, including HSQC NMR\nexperiments, to elucidate molecular structure and couplings in aromatic\ncompounds. This experiment provides students with hands-on experience in spectral\nanalysis and dynamic insights into the behavior of organic compounds through\nspectroscopy."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/kolbe-schmitt-carboxylation-of-resorcinol-a-benchtop-nmr-spectroscopy-approach/scheme-1.JPG"
      },
      {
        "type": "text",
        "content": "Scheme 1. Carboxylation of resorcinol with sodium bicarbonate and hydrochloric acid to obtain β-resorcylic acid."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/kolbe-schmitt-carboxylation-of-resorcinol-a-benchtop-nmr-spectroscopy-approach/nanalysis-100-benchtop-nmr-spectrometer.jpeg",
        "caption": "Nanalysis -100 Benchtop NMR Spectrometer"
      },
      {
        "type": "text",
        "heading": "Instrumentation",
        "content": "Nanalysis -100 Benchtop NMR Spectrometer"
      },
      {
        "type": "text",
        "heading": "Recrystallization of β-Resorcylic Acid",
        "content": "The crude product was dissolved in minimal hot water in a 50 mL Erlenmeyer flask.\nUpon cooling, recrystallization was induced by placing the flask in an ice bath. The\npurified crystals were collected by vacuum filtration, yielding 3.30 g (40%) of\nβ-resorcylic acid as a white solid."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/kolbe-schmitt-carboxylation-of-resorcinol-a-benchtop-nmr-spectroscopy-approach/kolbe-figure-1.JPG"
      },
      {
        "type": "text",
        "heading": "Discussion",
        "content": "The experiment successfully demonstrated the Kolbe-Schmitt reaction for\ncarboxylation of resorcinol, yielding β-resorcylic acid as confirmed through spectral\nanalysis. The proton NMR spectra exhibited expected couplings for an aromatic\nsystem, with well-resolved 3JHH, 4JHH, and 5JHH interactions. The HSQC\nexperiments further provided insight into proton-carbon connectivity."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/kolbe-schmitt-carboxylation-of-resorcinol-a-benchtop-nmr-spectroscopy-approach/kolbe-figure-2.JPG"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/kolbe-schmitt-carboxylation-of-resorcinol-a-benchtop-nmr-spectroscopy-approach/kolbe-figure-3.JPG"
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "This organic chemistry experiment effectively integrates synthesis, carboxylation, and\nadvanced spectral analysis using benchtop NMR spectroscopy. The successful\nformation of β-resorcylic acid was confirmed through proton and HSQC NMR spectra,\nhighlighting the relevance of coupling interactions in aromatic compounds. The\nKolbe-Schmitt reaction remains a versatile and green approach, as it produces\nminimal waste and allows for scalable synthesis. Moreover, this study provides\nvaluable hands-on experience in dynamic mechanical analysis and organic\nspectroscopy, making it a crucial addition to undergraduate organic chemistry\ntraining."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments is a trusted distributor and service provider of Nanalysis products\nin India, delivering advanced scientific solutions tailored to modern research needs.\nDriven by a steadfast commitment to quality and trust, we empower scientists across\nthe country with high-performance instruments and expert support to accelerate\ntheir breakthroughs."
      },
      {
        "type": "text",
        "content": "1. Krtschil, U.; Hessel, V.; Kost, H. J.; and Reinhard, D. Chem. Eng. Technol. 2013 36, 1010-1016."
      },
      {
        "type": "text",
        "content": "2. Kolbe, H. J. Pratt. Chem. 1874, 10, 89"
      },
      {
        "type": "text",
        "content": "3. Schmitt, R. J. Pratt. Chem. 1885, 31, 397"
      },
      {
        "type": "text",
        "content": "4. The Aromatic Region, University of Calgary (Chapter 13: Spectroscopy) (accessed January 30, 2025)"
      },
      {
        "type": "text",
        "content": "5. Carboxylation of resorcinol (Synthesis) by Random Experiments Int. Experiments and Syntheses (accessed January 28, 2025)"
      },
      {
        "type": "text",
        "content": "6. Coupling Constants Identify Coupled Protons, LibreTexts Chemistry (accessed February 24, 2025)"
      },
      {
        "type": "text",
        "content": "7. Spin-Spin Splitting: J-Coupling, Reich. H. J. University of Wisconsin (accessed February 24, 2025)"
      }
    ],
    "comments": [],
    "slug": "kolbe-schmitt-carboxylation-of-resorcinol-a-benchtop-nmr-spectroscopy-approach",
    "excerpt": "The Kolbe-Schmitt reaction is a fundamental carboxylation method widely used in"
  },
  {
    "id": 23,
    "title": "Evaluation of Oxidative Stability in Polyethylene Using Differential Scanning Calorimetry",
    "category": "Industry Insights",
    "date": "2025-04-23",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/Hitachi/differential-scanning-calorimeter-dsc-nexta-dsc-series.jpg",
    "tags": [
      "DSC",
      "Oxidation Induction Time",
      "Polyethylene"
    ],
    "sections": [
      {
        "type": "text",
        "heading": "Introduction",
        "content": "Polymer materials, such as Polyethylene (PE), are susceptible to oxidative\ndegradation when exposed to oxygen, leading to a decline in mechanical strength\nand electrical properties. The oxidative stability of polymers is a critical factor in\napplications such as wire coating materials, where prolonged durability is required.\nUnlike thermal decomposition, which typically occurs around 400°C in an inert gas\nenvironment (e.g., nitrogen), oxidation-induced degradation can begin at\nsignificantly lower temperatures, often below 200°C, in the presence of oxygen."
      },
      {
        "type": "text",
        "content": "To enhance polymer stability, antioxidant additives are incorporated into PE\nformulations to prevent premature degradation. The effectiveness of these additives\ncan be evaluated using Oxidation Induction Time (OIT), a parameter measured via\nDifferential Scanning Calorimetry (DSC). The DSC curve provides insights into\ntemperature dependence, the impact of catalyst effects (e.g., copper influence),\nand polymer aging."
      },
      {
        "type": "text",
        "content": "The OIT measurement follows a standardized process:"
      },
      {
        "type": "text",
        "content": "This study aims to assess the oxidative stability of PE by measuring its OIT at\ndifferent isothermal temperatures, evaluating the catalyst effect of copper, and\ncomparing different grades of PE."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/evaluation-of-oxidative-stability-in-polyethylene-using-differential-scanning-calorimetry/oxidation-induction-time-measurement-result-for-PE-at-205.JPG"
      },
      {
        "type": "text",
        "content": "Figure 1 Oxidation induction time measurement result for PE at 205°C"
      },
      {
        "type": "text",
        "heading": "Experimental Method",
        "content": "A DSC200 instrument was used for all measurements. The experimental parameters\nwere as follows:"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/evaluation-of-oxidative-stability-in-polyethylene-using-differential-scanning-calorimetry/hitachi-nexta-dsc200.jpeg",
        "caption": "Hitachi NEXTA DSC200"
      },
      {
        "type": "text",
        "content": "Hitachi NEXTA DSC200"
      },
      {
        "type": "text",
        "heading": "1. Temperature Dependence of Oxidation Induction Time",
        "content": "Figure 1 presents the DSC curve of PE at 205°C. Following the gas switch from\nnitrogen to oxygen, no significant changes were observed for 17 minutes, indicating\nthe presence of antioxidant additives. However, beyond this point, an exothermic\npeak appeared due to oxidation, marking the OIT at 17.2 minutes."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/evaluation-of-oxidative-stability-in-polyethylene-using-differential-scanning-calorimetry/temperature-dependence-of-oxidation-induction-time-for-PE.JPG"
      },
      {
        "type": "text",
        "content": "Figure 2 Temperature dependence of oxidation induction time for PE"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/evaluation-of-oxidative-stability-in-polyethylene-using-differential-scanning-calorimetry/cu-influences-on-the-oxidation-induction-time-for-pe.JPG"
      },
      {
        "type": "text",
        "content": "Figure 3 Cu influences on the oxidation induction time for PE\nIsothermal temperature: 205°C"
      },
      {
        "type": "text",
        "content": "Figure 2 shows the OIT measurements at different isothermal temperatures\n(200°C, 205°C, 210°C, and 215°C). The results demonstrate that higher temperatures\nlead to shorter oxidation induction times, confirming the temperature dependence\nof the oxidation process."
      },
      {
        "type": "text",
        "heading": "2. Influence of Copper as a Catalyst",
        "content": "Figure 3 illustrates the catalyst effect of copper (Cu) on the oxidation induction\ntime of PE. When Cu was in contact with PE, the OIT was significantly reduced from\n17 minutes to 6 minutes, indicating that Cu accelerates oxidation reactions. This\nresult is particularly relevant for wire coating materials, where Cu conductors may\ndirectly interact with the polymer insulation, affecting polymer aging and long-term\npolymer stability."
      },
      {
        "type": "text",
        "heading": "3. Comparison of Different Polyethylene Grades",
        "content": "Figure 4 compares the OIT of three different PE grades. The order of oxidative\nstability was found to be C > B > A, highlighting the variation in polymer stability\nacross different formulations. This demonstrates the usefulness of OIT analysis for\nmaterial evaluation and quality control in industrial applications."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/evaluation-of-oxidative-stability-in-polyethylene-using-differential-scanning-calorimetry/measurement-results-of-three-different-grades-of-pe.JPG"
      },
      {
        "type": "text",
        "content": "Figure 4 Measurement results of three different grades of PE\nIsothermal temperature: 205°C"
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "The oxidation induction time (OIT) of Polyethylene (PE) was successfully measured\nusing Differential Scanning Calorimetry (DSC). This method provides a reliable\napproach for assessing oxidative stability, the influence of temperature\ndependence, the catalyst effect of copper, and variations among different PE\ngrades. The DSC curve serves as an essential tool for evaluating polymer aging,\noptimizing antioxidant additives, and ensuring the long-term performance of wire\ncoating materials and other polymer-based products."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments\nis a reliable distributor and service provider of\nHitachi products in\nIndia, offering state-of-the-art scientific solutions designed to meet the evolving\ndemands of modern research. With a strong commitment to excellence and trust,\nwe support scientists nationwide with cutting-edge technology and dedicated\nexpertise to drive innovation and discovery."
      }
    ],
    "comments": [],
    "slug": "evaluation-of-oxidative-stability-in-polyethylene-using-differential-scanning-calorimetry",
    "excerpt": "Polymer materials, such as Polyethylene (PE), are susceptible to oxidative"
  },
  {
    "id": 24,
    "title": "Optimizing Laboratory Water Solutions for HPLC-Based Cannabis Testing",
    "category": "Industry Insights",
    "date": "2025-04-22",
    "author": "Inkarp Applications Team",
    "readTime": "5 min read",
    "image": "/assets/images/productImages/Sotorius/arium-mini-plus-lab-water-purification-system.png",
    "tags": [
      "HPLC",
      "Laboratory Water",
      "Cannabis Testing"
    ],
    "sections": [
      {
        "type": "text",
        "content": "High-performance liquid chromatography (HPLC) and ultra-high-performance liquid\nchromatography (UHPLC) demand consistently high laboratory water quality,\nespecially during mobile phase preparation. The purity of water used directly\nimpacts instrument sensitivity, reliability, and accuracy—particularly in critical\napplications like cannabis potency testing."
      },
      {
        "type": "text",
        "content": "Traditionally, laboratories have relied on HPLC-grade bottled water for such\npurposes. However, generating ultrapure water in-house using a robust water\npurification system offers a cost-effective and sustainable alternative. This study\nexplores the use of the Arium® mini-plus in-house water purification system\n(producing ASTM Type 1 water) compared with commercial HPLC-grade bottled\nwater for cannabinoid analysis in cannabis samples."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/optimizing-laboratory-water-solutions-for-hplc-based-cannabis-testing/lt-arium-min-6059.jpg",
        "caption": "Arium® Mini Ultrapure Water Systems"
      },
      {
        "type": "text",
        "content": "Arium® Mini Ultrapure Water Systems"
      },
      {
        "type": "text",
        "content": "Both water sources were used to prepare aqueous mobile phases containing 5 mM\nammonium formate and 0.1% formic acid. These mobile phases were then evaluated\nthrough HPLC analysis of cannabis extracts to assess the effectiveness of each water\ntype in terms of analyte quantification and interference."
      },
      {
        "type": "text",
        "heading": "Materials and Methods",
        "content": "Cannabinoid reference standards and the internal standard (ISTD) phencyclidine\n(PCP) were obtained from Cerilliant (Round Rock, TX) as individual substances. Ricca\nACS Reagent Grade and HPLC-grade water were sourced from Quartzy, while\nultrapure water ASTM Type 1 was produced using the Arium® mini plus system on\nthe day of use. HPLC analysis was performed using a Shimadzu Nexera-i LC2040L 3D\nPlus system, equipped with a Restek Rapture ARC-18 column (100 mm×3.0 mm\nID×1.80 μm) and a Restek UltraShield pre-column filter (0.2 μm frit), set at 30°C. The\nsystem operated in isocratic mode with a mobile phase of 25% aqueous (Water, 5 mM\nammonium formate, 0.1% formic acid) and 75% organic (Acetonitrile, 0.1% formic acid)\nat a flow rate of 1 mL/min. A sample volume of 1 μL was injected and detected using\nphotodiode array detection across the 190-400 nm wavelength range."
      },
      {
        "type": "text",
        "content": "A stock solution containing 17 cannabinoids and the ISTD at 100 μg/mL in methanol\nwas prepared. This solution was serially diluted to create calibrators. Another stock\nsolution of the same cannabinoids was prepared for use as a positive control. A\n4-constituent control from a different reference standard source was included as a\nhigh control. A matrix methanol solution was prepared by grinding 20 mg of stinging\nnettle leaf (Urtica dioica) and extracting it with 20 mL methanol, followed by\nsonication, vortexing, centrifugation, and filtration, which was stored for calibrators,\ncontrols, and blanks."
      },
      {
        "type": "text",
        "content": "Cannabis samples were processed by placing 1-2 grams of cannabis in a 50 mL\ncentrifuge tube with a grinding ball and freezing it for 1 hour. The tube was then\nplaced on a Geno Grinder for 1 minute at 1600 rpm. A 0.2-gram portion of ground\ncannabis was placed in a separate tube with 20 mL methanol for extraction, which\nwas repeated three times using vortexing for 1 minute and sonication for 5 minutes.\nA 1 mL aliquot was removed, filtered, and ultra-centrifuged for 5 minutes at 14,000\nrpm. After filtering, 100 μL of undiluted and diluted samples were added to 150 μL\nauto-sampler vials, internal standard was added, and the samples were analyzed by\nHPLC."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/optimizing-laboratory-water-solutions-for-hplc-based-cannabis-testing/optimizing-laboratory-figure-1.JPG"
      },
      {
        "type": "text",
        "content": "A calibration curve, blanks, and controls were prepared to determine acceptance and\ntolerance limits. The cannabis samples were analyzed against the calibration curve’s\nlinear dynamic range and reported in μg/mL. A total of 60 samples were tested, with\neach water type analyzed using a blank, positive control, and cannabis sample,\nrepeated 10 times across the 17 cannabinoids (as shown in Table 1)."
      },
      {
        "type": "table",
        "columns": [
          "Mobile Phase",
          "Samples",
          "Replicates"
        ],
        "rows": [
          [
            "Bottled water",
            "Blank",
            "10"
          ],
          [
            "Bottled water",
            "Positive Control",
            "10"
          ],
          [
            "Bottled water",
            "Cannabis Sample",
            "10"
          ],
          [
            "Arium® water",
            "Blank",
            "10"
          ],
          [
            "Arium® water",
            "Positive Control",
            "10"
          ],
          [
            "Arium® water",
            "Cannabis Sample",
            "10"
          ]
        ]
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/optimizing-laboratory-water-solutions-for-hplc-based-cannabis-testing/optimizing-laboratory-figure-2.JPG"
      },
      {
        "type": "text",
        "heading": "Results and Discussion",
        "content": "Figure 3A demonstrates that all positive controls, regardless of the water source,\nwere quantified within the expected range. No interfering peaks were detected in\nthe blanks (Figure 3B), confirming the purity of both bottled and ultrapure water."
      },
      {
        "type": "text",
        "content": "Among the 17 tested cannabinoids, 7 analytes (CBDV-A, CBG-A, CBG, THCV-A, Delta-9\nTHC, THCA-A, and CBC-A) were consistently above the limit of quantification (LOQ)\nand used for further comparison. Quantitative analysis showed no statistically\nsignificant differences in analyte concentration when using Arium® ultrapure water compared to commercial bottled water (Figure 4). These findings validate the use of\nin-house water purification systems for critical lab water solutions in regulated\nenvironments."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/optimizing-laboratory-water-solutions-for-hplc-based-cannabis-testing/optimizing-laboratory-figure-3.JPG"
      },
      {
        "type": "text",
        "content": "Figure 3A: All positive controls quantify within the expected range.\n\nFigure 3B: No interfering compounds were detected We used two different water sources 'HPLC grade bottled water' and 'ultra-pure Arium® water Type 1' to prepare the mobile phase (isocratic 25% water, 75% acetonitrile, 0.1% formic acid) for cannabinoid analysis using HPLC. Both water sources are pure and suitable for HPLC in cannabis analytics."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/optimizing-laboratory-water-solutions-for-hplc-based-cannabis-testing/optimizing-laboratory-figure-4.JPG"
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "This study confirms that laboratory-generated ultrapure water from the Arium®\nmini-plus water purification system is comparable in performance to commercial\nHPLC-grade bottled water for mobile phase preparation in cannabis potency\ntesting using HPLC."
      },
      {
        "type": "text",
        "content": "Implementing an in-house filtration water system offers significant advantages:"
      },
      {
        "type": "text",
        "content": "For laboratories conducting water analysis, cannabinoid quantification, or any\nHPLC-based application, adopting a modern water purification system ensures\nconsistent results, operational efficiency, and long-term value."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments is proud to be India's premier distributor and trusted service\nprovider for Sartorius products. Committed to innovation and excellence, Inkarp\ndelivers cutting-edge scientific equipment and dependable support to researchers\nthroughout the country."
      },
      {
        "type": "text",
        "content": "Reference :\n\nSartorius"
      }
    ],
    "comments": [],
    "slug": "optimizing-laboratory-water-solutions-for-hplc-based-cannabis-testing",
    "excerpt": "High-performance liquid chromatography (HPLC) and ultra-high-performance liquid"
  },
  {
    "id": 26,
    "title": "The Role of Phosphorylation in Post-Translational Modification: Activating Akt/PKB",
    "category": "Industry Insights",
    "date": "2025-03-29",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/blogs/BlogTwentySix/hawk-violet-3-qf-pro.jpg",
    "tags": [
      "QF-Pro",
      "Akt/PKB",
      "Biomarker Analysis"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Clear cell renal cell carcinoma (ccRCC) is the most prevalent and aggressive subtype of cell renal cell carcinoma, presenting significant therapeutic challenges due to its radioresistance, chemoresistance, and genetic variability. With a five-year mortality rate of 40%, there is an urgent need for reliable prognostic biomarkers to facilitate personalized treatment approaches. Recent research suggests that monitoring oncoprotein activation states, specifically Akt/PKB (Protein Kinase B) and STAT3 activation, using QF-Pro® technology may offer a promising diagnostic tool with prognostic significance."
      },
      {
        "type": "text",
        "heading": "Current Limitations in ccRCC Biomarker Assessment",
        "content": "Traditional diagnostic techniques primarily rely on immunohistochemistry (IHC) analysis to evaluate protein expression levels. While effective, IHC analysis fails to provide insights into protein activation states and their functional relevance in disease progression. QF-Pro® technology overcomes these limitations by enabling biomarker analysis of oncoprotein activation through fluorophore-labelled antibodies, providing a more detailed and reliable analysis of biomarker functionality in cell renal cell carcinoma."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/the-role-of-phosphorylation-in-post-translational-modification-activating-akt-pkb/Hawk.jpeg",
        "caption": "Hawk Biosystems Violet 3.0, integrated with QF-Pro® Technology"
      },
      {
        "type": "text",
        "content": "Hawk Biosystems Violet 3.0, integrated with QF-Pro® Technology"
      },
      {
        "type": "text",
        "heading": "Principles of QF-Pro®",
        "content": "QF-Pro® analysis is based on Förster Resonance Energy Transfer (FRET)-Fluorescence Lifetime Imaging Microscopy (FRET-FLIM), a non-radiative energy transfer technique occurring between fluorophores when within a 1-10 nanometer proximity. This two-site amplified FRET-FLIM approach enhances specificity by reducing false positives and allowing for precise quantitative measurements of protein kinase B (Akt/PKB activation)."
      },
      {
        "type": "text",
        "content": "In this study, QF-Pro® technology was used to assess Akt/PKB activation and STAT3 activation in ccRCC samples by targeting phosphorylation-specific antibodies at key activation sites. This technique enables real-time visualization of oncoprotein activation, offering a critical advantage over traditional methodologies."
      },
      {
        "type": "text",
        "heading": "Sample Preparation and Analysis",
        "content": "Formalin-fixed, paraffin-embedded (FFPE) tissue microarrays (TMAs) from primary and metastatic ccRCC samples were analyzed. Secondary QF-Pro® probes tagged with ATTO 488 (donor) and Alexa594 (acceptor) fluorophores were used to detect activation state scores for each patient sample."
      },
      {
        "type": "text",
        "heading": "Akt/PKB Activation Upon EGF Stimulation",
        "content": "Akt/PKB activation dynamics were assessed using growth factor (EGF) stimulation. QF-Pro® activation maps revealed marked differences between basal and stimulated conditions."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/the-role-of-phosphorylation-in-post-translational-modification-activating-akt-pkb/Illustration-of-QF-Pro-A-B.JPG",
        "caption": "Illustration of QF Pro A-B"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/the-role-of-phosphorylation-in-post-translational-modification-activating-akt-pkb/Quantitative-QF-Pro-C.JPG",
        "caption": "QF-Pro® Analysis.JPG"
      },
      {
        "type": "text",
        "heading": "Akt/PKB Activation in ccRCC Progression",
        "content": "QF-Pro® analysis of renal control tissues, primary tumors, and metastatic ccRCC samples demonstrated clear differences in Akt/PKB activation states:"
      },
      {
        "type": "text",
        "content": "These results highlight Akt/PKB signaling pathway as a potential biomarker for assessing tumor progression and aggressiveness in cell renal cell carcinoma."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/the-role-of-phosphorylation-in-post-translational-modification-activating-akt-pkb/Primary-ccRCC-Metastatic-ccRCC.JPG",
        "caption": "Primary ccRCC & Metastatic ccRCC"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/the-role-of-phosphorylation-in-post-translational-modification-activating-akt-pkb/Akt-activation-state.JPG",
        "caption": "Akt activation state"
      },
      {
        "type": "text",
        "heading": "Prognostic Precision of QF-Pro® vs. IHC",
        "content": "QF-Pro® technology demonstrated superior prognostic accuracy compared to IHC analysis, particularly in assessing Akt/PKB activation states:"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/the-role-of-phosphorylation-in-post-translational-modification-activating-akt-pkb/QF-Pr-Analysis.JPG",
        "caption": "QF-Pro® Analysis"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/the-role-of-phosphorylation-in-post-translational-modification-activating-akt-pkb/IHC-Analysis.JPG",
        "caption": "IHC Analysis"
      },
      {
        "type": "text",
        "content": "A) QF-Pro® analysis revealed significantly poorer survival for patients in the upper quartile compared to the lower three quartiles."
      },
      {
        "type": "text",
        "content": "B) No significant survival difference was observed using conventional IHC."
      },
      {
        "type": "text",
        "heading": "STAT3 Activation Dynamics",
        "content": "STAT3 activation (Tyr705 phosphorylation) was assessed across renal control tissues, primary ccRCC tumors, and metastatic samples:"
      },
      {
        "type": "text",
        "content": "These findings suggest STAT3 activation as a potential biomarker for ccRCC prognosis, correlating increased activation with advanced disease stages and poor patient outcomes."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/the-role-of-phosphorylation-in-post-translational-modification-activating-akt-pkb/STAT3-Activation-State-in-ccRCC.JPG",
        "caption": "STAT3 Activation State in ccRCC"
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "QF-Pro® technology represents a significant advancement in biomarker analysis by measuring protein activation states, rather than just expression levels. This marks a paradigm shift from traditional IHC analysis, which is limited in detecting post-translational modifications (PTM)."
      },
      {
        "type": "text",
        "content": "With its ability to measure functional protein states and monitor therapeutic responses, QF-Pro® analysis overcomes the limitations of conventional diagnostic methods, paving the way for more precise and individualized cancer care in ccRCC."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments is a trusted distributor and service provider of\nHawk Biosystems products in India, offering innovative scientific solutions. With a focus on quality and reliability, we equip researchers across the country with advanced products and dedicated support."
      },
      {
        "type": "text",
        "content": "1. Miles J, Applebee CJ, Leboucher P, et al. Time resolved amplified FRET identifies protein kinase B activation state as a marker for poor prognosis in clear cell renal cell carcinoma. BBA Clin. 2017;8:97-102. doi:10.1016/j.bbacli.2017.10.002"
      },
      {
        "type": "text",
        "content": "2. Veeriah S, Leboucher P, de Naurois J, et al. High-throughput time-resolved FRET reveals Akt/PKB activation as a poor prognostic marker in breast cancer. Cancer Res. 2014;74(18):4983-4995. doi:10.1158/0008-5472.CAN-13-3382"
      }
    ],
    "comments": [],
    "slug": "the-role-of-phosphorylation-in-post-translational-modification-activating-akt-pkb",
    "excerpt": "Clear cell renal cell carcinoma (ccRCC) is the most prevalent and aggressive subtype of cell renal cell carcinoma, presenting significant therapeutic challenges due to its radioresistance, chemoresistance, and genetic va"
  },
  {
    "id": 27,
    "title": "Unraveling the Dynamic Viscoelastic Properties of Polytetrafluoroethylene (PTFE)",
    "category": "Industry Insights",
    "date": "2025-03-26",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/Hitachi/thermomechanical-analyzer-tma7000-series.jpg",
    "tags": [
      "DMA",
      "PTFE",
      "Viscoelasticity"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Polytetrafluoroethylene (PTFE), widely known as Teflon, is a high-performance polymer\ncelebrated for its exceptional chemical resistance, low friction, and thermal stability. But what\ntruly sets PTFE apart is its complex viscoelastic properties, which dictate how the material\nbehaves under different stress, temperature, and frequency conditions. Understanding this\nbehavior is crucial for optimizing PTFE’s performance across industries, from aerospace to\nmedical devices. Let’s dive deep into the science behind PTFE’s dynamic viscoelasticity and\nwhat it means for real-world applications."
      },
      {
        "type": "text",
        "heading": "Dynamic Viscoelasticity: The Science Behind PTFE’s Flexibility and\nStrength",
        "content": "PTFE’s viscoelastic nature means it exhibits both elastic and viscous behavior, making it\ncapable of storing and dissipating mechanical energy. Dynamic Mechanical Analysis (DMA),\nfacilitated by Hitachi’s NEXTA® DMA200, is the key technique used to explore these\nproperties, measuring critical parameters like the storage modulus, loss modulus, and\ncomplex modulus:"
      },
      {
        "type": "text",
        "heading": "Complex modulus (E):",
        "content": "The loss factor (tanδ), which is the ratio of E” to E’, reveals crucial information about damping\ncharacteristics, highlighting how PTFE can absorb and dissipate energy — a key feature for\napplications involving vibrations or dynamic loads."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/unraveling-the-dynamic-viscoelastic-properties-of-polytetrafluoroethylene-ptfe/Hitachis-NEXTA-DMA200.jpeg",
        "caption": "Hitachi’s NEXTA® DMA200"
      },
      {
        "type": "text",
        "content": "Hitachi’s NEXTA® DMA200"
      },
      {
        "type": "text",
        "heading": "Transition Temperatures and Molecular Mobility",
        "content": "Understanding PTFE’s behavior requires studying how its mechanical properties change with\ntemperature. The study identified three key transitions that reveal the polymer’s molecular\ndynamics:"
      },
      {
        "type": "table",
        "columns": [
          "",
          "Transition Temperature (°C)",
          "ΔEa (kJ/mol)",
          "Comments"
        ],
        "rows": [
          [
            "α Transition",
            "123 (1Hz)",
            "347",
            "Glass Transition"
          ],
          [
            "β Transition",
            "21 (1Hz)",
            "286",
            "*1"
          ],
          [
            "γ Transition",
            "-99 (1Hz)",
            "93",
            "Local mode relaxation"
          ]
        ]
      },
      {
        "type": "text",
        "heading": "γ Transition (Local Mode Relaxation):",
        "content": "*1 Polytetrafluoroethylene is showing crystal polymorphism, 2 types of crystal transitions are observable at this"
      },
      {
        "type": "text",
        "content": "These transitions define PTFE’s rheological behavior, influencing the stress-strain\nrelationship, creep and relaxation, and its ability to maintain structural integrity under varying\nloads and temperatures."
      },
      {
        "type": "text",
        "heading": "Thermal Stability and Rheological Behavior",
        "content": "PTFE’s thermal performance is another cornerstone of its versatility. Using Differential Scanning Calorimetry (DSC), researchers mapped PTFE’s crystallization and melting points:"
      },
      {
        "type": "text",
        "heading": "Melting temperature (Tm):",
        "content": "This remarkable thermal stability, combined with insights from mechanical spectroscopy, helps engineers\npredict PTFE’s shear modulus, complex modulus, and overall behavior in extreme environments."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/unraveling-the-dynamic-viscoelastic-properties-of-polytetrafluoroethylene-ptfe/Polytetrafluoroet-ylene-PTFE--1.jpeg",
        "caption": "Polytetrafluoroethylene (PTFE)"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/unraveling-the-dynamic-viscoelastic-properties-of-polytetrafluoroethylene-ptfe/Polytetrafluoroethylene-PTFE--2.jpeg",
        "caption": "Polytetrafluoroethylene (PTFE)"
      },
      {
        "type": "text",
        "heading": "Real-World Applications: Why This Matters",
        "content": "Understanding PTFE’s dynamic viscoelastic properties unlocks enormous potential for advanced applications:"
      },
      {
        "type": "text",
        "heading": "The Future of PTFE Research",
        "content": "Although the original data on PTFE dates back to 1989, its foundational insights remain invaluable. Modern advancements, such as time-temperature superposition and dynamic mechanical analysis, have further refined our understanding, enabling the development of next-generation materials with even greater precision and reliability."
      },
      {
        "type": "text",
        "content": "Instruments like the Hitachi NEXTA DMA200, distributed and serviced by Inkarp Instruments across India, play a crucial role in this progress by facilitating advanced dynamic mechanical analysis. These technological advancements not only enhance research capabilities but also drive innovation in material science, ensuring continuous improvements in performance and application."
      },
      {
        "type": "text",
        "content": "1. SII Nanotechnology Inc.,RBM Tsukiji Bldg, Shintomi 2-15-5, Chuo-ku, Tokyo 104-0041, Japan"
      }
    ],
    "comments": [],
    "slug": "unraveling-the-dynamic-viscoelastic-properties-of-polytetrafluoroethylene-ptfe",
    "excerpt": "Polytetrafluoroethylene (PTFE), widely known as Teflon, is a high-performance polymer"
  },
  {
    "id": 28,
    "title": "Metallic Grain Structures and Their Microscopic Analysis",
    "slug": "metallic-grain-structures-and-their-microscopic-analysis",
    "category": "Industry Insights",
    "date": "2025-03-31",
    "author": "Inkarp Applications Team",
    "readTime": "17 min read",
    "image": "/assets/images/productImages/Zeiss/axioscope-5-fl_axiocam-208-color.webp",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Metallic materials are interpreted in terms of their inner structure – known as the grain structure – in addition to a wide range of other chemical and physical properties. This inner structure is referred to as the “macro- structure” or “microstructure” depending on the size of the elements being observed. The grain structure is typically adapted to the technical application of the material and can be viewed with conventional light micro- scopes, provided that the specimen being examined has been appropriately prepared."
      },
      {
        "type": "text",
        "content": "This preparation process is also referred to as “metallographic preparation.” Depending on the composition of the metal, its processing history (e.g. heat treatments and forming processes) and the expected structural properties (e.g. grain size, content of nonmetallic inclusions), this metallographic preparation involves selecting the mechanical or electro-lytic processing procedure as well as the subsequent chemical and microscopic contrasting and enlargement."
      },
      {
        "type": "text",
        "content": "This text is intended to provide a practical and readily comprehensible insight into this topic."
      },
      {
        "type": "text",
        "heading": "What is a grain structure and why should it be examined with a microscope?",
        "content": "A metallic grain structure consists of individual, typically microscopic crystalline areas known as “grains.” Macroscopic grains are less common and, depending on the base metal, are more frequently found in nonferrous materials (e.g., aluminum, cop- per, zinc). Grain structures with details that can be seen with the naked eye or a magnifying glass are referred to as macro-structures. If, on the other hand, a microscope (stereo, reflected light or digital) is required to assess the material, the term microstructures is used."
      },
      {
        "type": "text",
        "content": "These grains form from the molten material when it solidifies, interact with one another and with “foreign elements” (phases, contamination), and of course also react to subsequent external influences – such as chemical processes (corrosion), chemical and/or physical influences (e.g. heat treatment processes) or purely mechanical influences, such as downstream forming processes. The structure, size and orientation of the grains result from the material composition (alloy) used and the way the material is made (forging, casting, or additive manufacturing)."
      },
      {
        "type": "text",
        "content": "Once metallographic preparation is complete, visible light can interact with the prepared structural grains and their crystal shapes and boundaries under a light microscope, making them visible. This typically occurs at magnifications of 25x to 1000x, which corresponds to the limits of traditional light microscopy. Lattice defects, structures and elements at the sub-microscopic level ("
      },
      {
        "type": "text",
        "content": "Based on the microscopic image, it is then possible to draw conclusions regarding the characteristics of the material or the workpiece (materials that are part of an overall system). For example, the grain size and general microstructure can be used to determine the degree of hardness and resilience; certain phases may cause the material to become brittle or influence its resistance to corrosion. As a result, assessments of a material’s microstructure are not only a means of evaluating characteristics for the design and processing stages, but also play a significant role in assessing cases where damage has occurred."
      },
      {
        "type": "text",
        "content": "Structural elements that can be evaluated using a light microscope include (Fig. 1):"
      },
      {
        "type": "text",
        "content": "Based on all of this information, it is then possible to create a comprehensive description of the microstructure (of the grain structure) and draw conclusions regarding its potential characteristics."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/metallic-grain-structures-and-their-microscopic-analysis/1-13.jpeg",
        "caption": "Schematic grain structure of a ferrous material"
      },
      {
        "type": "text",
        "content": "Fig. 1: Schematic grain structure of a ferrous material"
      },
      {
        "type": "text",
        "content": "The materials used in practical applications today are a mixture of various chemical elements sometimes also referred to as “alloys.” Steel and cast iron are essentially alloys based on iron (Fe) with carbon (C) alloying additions, which are responsible for the hardness of the ferrous material. The carbon may take the form of a pure element (lamellar and globular graphite in cast iron, Figs. 2 and 3) or may be present as an intermetallic phase, which is also referred to as iron carbide Fe3C or cementite."
      },
      {
        "type": "text",
        "content": "In the case of soft, low-carbon ferritic steels, the hard cementite is typically precipitated along the boundaries of the ferritic grain in the form of tertiary cementite or as a small proportion of pearlite (Fig. 4). Iron carbide Fe3C occurs as a lamella in the harder structural element pearlite and this lamellar structure is made visible following etching. This banding, along with lower reflection of light, make the pearlite appear darker than the ferrite (Figs. 2 and 5)."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/metallic-grain-structures-and-their-microscopic-analysis/1-14.jpeg",
        "caption": "Pearlitic cast iron with lamellar graphite, etched with nital. The carbon is primarily present as graphite in a lamellar form, which results in reduced strength. The pearlitic matrix itself exhibits a sufficiently high degree of hardness."
      },
      {
        "type": "text",
        "content": "Fig. 2: Pearlitic cast iron with lamellar graphite, etched with nital. The carbon is primarily present as graphite in a lamellar form, which results in reduced strength. The pearlitic matrix itself exhibits a sufficiently high degree of hardness."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/metallic-grain-structures-and-their-microscopic-analysis/1-15.jpeg",
        "caption": "Ferritic cast iron with spheroidal graphite, etched with nital. The carbon is primarily present as graphite in a spherical form. The spherical form results in improved strength in comparison to lamellar cast iron, but the hardness of the material is lower due to the lack of cementite in the purely ferritic matrix."
      },
      {
        "type": "text",
        "content": "Fig. 3: Ferritic cast iron with spheroidal graphite, etched with nital. The carbon is primarily present as graphite in a spherical form. The spherical form results in improved strength in comparison to lamellar cast iron, but the hardness of the material is lower due to the lack of cementite in the purely ferritic matrix."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/metallic-grain-structures-and-their-microscopic-analysis/1-16.jpeg",
        "caption": "Ferritic steel with approx. 0.1 % C, etched with nital. The carbon is primarily present in the form of cementite and as a low proportion of pearlite between the ferritic grains. The matrix, which is therefore nearly purely ferritic, has a low degree of hardness but very good resilience."
      },
      {
        "type": "text",
        "content": "Fig. 4: Ferritic steel with approx. 0.1 % C, etched with nital. The carbon is primarily present in the form of cementite and as a low proportion of pearlite between the ferritic grains. The matrix, which is therefore nearly purely ferritic, has a low degree of hardness but very good resilience."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/metallic-grain-structures-and-their-microscopic-analysis/1-17.jpeg",
        "caption": "Ferritic-pearlitic steel with approx. 0.2 % C, etched with nital. The carbon is primarily present as a cementite lamella in a harder proportion of pearlite adjacent to the ferritic grains. This causes the cementite to appear streaky. The pearlitic grain reflects less light than the ferritic grain and thus appears darker. A matrix of this type has a higher degree of hardness than\nthe steel in image 4, but a lower resilience."
      },
      {
        "type": "text",
        "content": "Fig. 5: Ferritic-pearlitic steel with approx. 0.2 % C, etched with nital. The carbon is primarily present as a cementite lamella in a harder proportion of pearlite adjacent to the ferritic grains. This causes the cementite to appear streaky. The pearlitic grain reflects less light than the ferritic grain and thus appears darker. A matrix of this type has a higher degree of hardness than\nthe steel in image 4, but a lower resilience."
      },
      {
        "type": "text",
        "content": "Other alloying elements may include metals such as aluminum (Al), chromium (Cr), manganese (Mn), vanadium (V), nickel (Ni), molybdenum (Mo) and silicon (Si), which through their inclusion cause the iron lattice to have certain properties. Other nonmetal elements such as nitrogen (N), hydrogen (H), oxygen (O), phosphorus (P) and sulfur (S) are frequently undesirable “steel parasites,” as they typically negatively impact the properties of the metal. Their products (e.g. oxide and sulfide) are often analyzed in the course of determining the NMI (determination of non metallic inclusions, also frequently referred to as determination of steel purity). However, within certain limits they can also serve as desirable alloying elements."
      },
      {
        "type": "text",
        "heading": "How is this matrix made visible?",
        "content": "Metallographic preparation tailored to the material forms the basis for the correct depiction of the grain structure. A wide range of preparation methods can be used depending on the material composition and the question being addressed. There is sufficient literature available regarding metallographic preparations. Furthermore, manufacturers of metallographic preparation equipment and consumables provide procedural documentation on their websites, which can be viewed and downloaded as a guide when getting started."
      },
      {
        "type": "text",
        "content": "Metallography is a type of destructive physical testing. The component undergoing metallographic testing is destroyed in nearly all cases (as in the production of metallographic specimens) or at least slightly damaged. However, it may still be possible to use the component in some cases – such as in the case of on-site component testing. The following section briefly describes the steps involved in producing a specimen for metallographic examination."
      },
      {
        "type": "text",
        "content": "The first step is taking the sample. To this end, a wet abrasive cutting process is used to take a representative sample from the workpiece being examined. A thin, rapidly rotating disc containing an abrasive is used for this purpose (Fig. 6). This sample is intended to represent the structural condition of the entire component or a specified area of its structure (welding seam, joints, heat-treated areas). This naturally means that the cutting process should be designed to treat the sample with care, so that it is not subjected to any damage that modifies its structure. This is achieved through the structural design of the cutting discs and equipment, which are tailored to the material and application scenario in question."
      },
      {
        "type": "text",
        "content": "The cutting process establishes the surface that will be subsequently examined under the microscope. Next, an embedding process is used to fix the cut pieces so they can be handled more easily and to standardize their dimensions (Fig. 7). Epoxy or acrylic resin is typically used to fix the pieces; cold (up to approx. 100 °C, at atmospheric pressure or in a vacuum) or warm (at max. 350 bar and 180 °C) embedding press machines can be selected for this step."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/metallic-grain-structures-and-their-microscopic-analysis/1-18.jpeg",
        "caption": "Wet abrasive cutting machine with clamped gear wheel for taking a sample of a section of a gear tooth. This section, which is typically induction- or case-hardened, will be examined with respect to its structure and hardness and thus needs to be separated from the component."
      },
      {
        "type": "text",
        "content": "Fig. 6: Wet abrasive cutting machine with clamped gear wheel for taking a sample of a section of a gear tooth. This section, which is typically induction- or case-hardened, will be examined with respect to its structure and hardness and thus needs to be separated from the component."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/metallic-grain-structures-and-their-microscopic-analysis/1-19.jpeg",
        "caption": "Variety of embedded samples of varying shapes. Performing embedding with various synthetic resins ensures a good preparation process out come and makes this procedure efficient."
      },
      {
        "type": "text",
        "content": "Fig. 7: Variety of embedded samples of varying shapes. Performing embedding with various synthetic resins ensures a good preparation process out come and makes this procedure efficient."
      },
      {
        "type": "text",
        "content": "While the prerequisites for an ideal preparation and therefore a good representation of the structure are established during the cutting and embedding steps, the grinding and polishing process is likely the most important step in terms of the microscope examination. During this process, the macroscopic roughness of the cut surface is reduced to the point of attaining a reflective surface. If the intention is only to make the macrostructure visible, a few coarser grinding steps and contrasting with acidic or alkaline solutions are sufficient. A reflective surface is not required for this, as the specimen will typically be examined using a stereo microscope (Fig. 8)."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/metallic-grain-structures-and-their-microscopic-analysis/1-20.jpeg",
        "caption": "Welding seam ground on two levels of SiC film, followed by macro etching with 5 % aqueous nitric acid."
      },
      {
        "type": "text",
        "content": "Fig. 8: Welding seam ground on two levels of SiC film, followed by macro etching with 5 % aqueous nitric acid."
      },
      {
        "type": "text",
        "content": "Nonetheless, the mirror finish is required to make the microscopic elements of the structure visible under a reflected-light microscope. It is achieved by gently milling the surface with fine to very fine abrasives following surface grinding. Milling continues until nearly all damaged areas are removed from the surface, typically using diamond, aluminum oxide or colloidal silicon dioxide on appropriate polishing cloths and discs. The success of the preparation can typically be checked early on using the differential interference contrast (DIC), which shows even the slightest deformations in the surface (Fig. 9). If DIC is not available, observing the specimen under brightfield conditions is sufficient in most cases."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/metallic-grain-structures-and-their-microscopic-analysis/1-21.jpeg",
        "caption": "Ferritic steel with titanium carbide and oxide inclusions following mechanical preparation to 1 µm diamond. Fine traces of deformations can still be observed in the differential interference contrast image. The sample has not been etched."
      },
      {
        "type": "text",
        "content": "Fig. 9: Ferritic steel with titanium carbide and oxide inclusions following mechanical preparation to 1 µm diamond. Fine traces of deformations can still be observed in the differential interference contrast image. The sample has not been etched."
      },
      {
        "type": "text",
        "content": "The sample should only be etched after this step. The etching process enhances contrasts that are invisible or only visible to a limited extent under brightfield conditions and allows the microstructure to be examined with a high degree of accuracy. Typically, only weak acids are used for this step. Weak nitric acids with an alcohol content of 1–3 % (nital) are very often used for unalloyed and low-alloyed carbon steel (cf. Figs. 2–5). Corrosion-resistant steel requires special etching processes, such as color etching, which influences the interference of the microscope’s light on the surface, or electrolytic etching (Figs. 10 and 11)."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/metallic-grain-structures-and-their-microscopic-analysis/1-22.jpeg",
        "caption": "Corrosion-resistant austenitic steel after final polishing with OP-S and subsequent Lichtenegger and Bloech color etching. Austenite grains with twins and ghost lines in the direction of deformation become visible."
      },
      {
        "type": "text",
        "content": "Fig. 10: Corrosion-resistant austenitic steel after final polishing with OP-S and subsequent Lichtenegger and Bloech color etching. Austenite grains with twins and ghost lines in the direction of deformation become visible."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/metallic-grain-structures-and-their-microscopic-analysis/1-23.jpeg"
      },
      {
        "type": "text",
        "content": "Fig. 11: Corrosion-resistant austenitic-ferritic steel (duplex) following electrolytic etching in 20 % sodium hydroxide solution. The austenite grains (light brown) are embedded in the bluish-brown ferritic matrix."
      },
      {
        "type": "text",
        "content": "Please note: The desired structures only become visible when there is an ideally coordinated interplay between the preparation technique, the appropriate chemical or electrochemical etching process and the microscopic contrasting technique (brightfield, DIC, polarization) as well as the desired resolution (of the smallest discernible feature)."
      },
      {
        "type": "text",
        "heading": "Which Contrasting Techniques Can We Now Use to Characterize the Structural Properties of Metals?",
        "content": "The option of using different contrasts on a light microscope enhances the analysis of metallic structures. This type of contrasting, which can take place either on its own or in conjunction with preceding chemical or electrolytic contrasting procedures, is also referred to as “optical etching.” The following section discusses the most common contrasting techniques used for routine analysis of structures and provides examples of several typical applications."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/metallic-grain-structures-and-their-microscopic-analysis/1-24.jpeg",
        "caption": "Examples of applying contrasting techniques for examining metallic structures"
      },
      {
        "type": "text",
        "content": "The brightfield is a standard technique for all types of material analyses. Fissures and pores, nonmetal phases and oxidation products are first observed in an unetched condition, as they typically exhibit different reflective behavior than the base metal material. The location of fissures and pores in relation to other structural characteristics, on the other hand, can typically only be evaluated if appropriate chemical etching has been carried out (Fig. 12)."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/metallic-grain-structures-and-their-microscopic-analysis/1-25.jpeg",
        "caption": "Laser welding seam on high-alloy steels with fissures and pores following electrolytic etching. These are also visible in the unetched condition, but the intercrystalline course of the fissures can only be evaluated after\netching has been completed."
      },
      {
        "type": "text",
        "content": "Fig. 12: Laser welding seam on high-alloy steels with fissures and pores following electrolytic etching. These are also visible in the unetched condition, but the intercrystalline course of the fissures can only be evaluated after\netching has been completed."
      },
      {
        "type": "text",
        "content": "The darkfield technique is used less frequently in metallurgical microscopy than it is in the microscopy of nonmetal materials. However, this contrasting technique also offers several advantages for metals, as well as when evaluating colored structures such as layers of lacquer or plastic coatings on metal substrates. This contrast can also be used to evaluate corrosion products (Fig. 13). Darkfield microscopy can be used to show very fine scratches on polished samples as a method of examining the grinding quality."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/metallic-grain-structures-and-their-microscopic-analysis/1-26.jpeg",
        "caption": "Corroded area on a brass pipe, unetched. Reflective areas appear dark (metal substrate) under the darkfield microscope, while the corrosion products can be observed in their own color."
      },
      {
        "type": "text",
        "content": "Fig. 13: Corroded area on a brass pipe, unetched. Reflective areas appear dark (metal substrate) under the darkfield microscope, while the corrosion products can be observed in their own color."
      },
      {
        "type": "text",
        "content": "The differential interference contrast is a useful tool for analyzing very fine deformations that may still be present in the surface after polishing (cf. Fig. 9). Checking the quality of polishing prior to the etching process can prevent additional effort being required during preparation. DIC can also be used to distinguish hard and soft structural elements, as hard phases are removed to a lesser extent than softer ones during the final polishing process. They therefore “protrude” from the surface (Figs. 14 and 15)."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/metallic-grain-structures-and-their-microscopic-analysis/1-27.jpeg",
        "caption": "Copper alloy after final polishing. Due to their reflectivity, the various phases appear to have different colors under a brightfield microscope."
      },
      {
        "type": "text",
        "content": "Fig. 14: Copper alloy after final polishing. Due to their reflectivity, the various phases appear to have different colors under a brightfield microscope."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/metallic-grain-structures-and-their-microscopic-analysis/1-28.jpeg",
        "caption": "Copper alloy like that in Fig. 14. Due to their ablation behavior, the phases of varying hardnesses have varying heights, which are only visible in DIC microscopy. This enables a qualitative distinction between their hardnesses. At the same time, the grain structure can already be made visible in the unetched condition."
      },
      {
        "type": "text",
        "content": "Fig. 15: Copper alloy like that in Fig. 14. Due to their ablation behavior, the phases of varying hardnesses have varying heights, which are only visible in DIC microscopy. This enables a qualitative distinction between their hardnesses. At the same time, the grain structure can already be made visible in the unetched condition."
      },
      {
        "type": "text",
        "content": "This minimal difference is not typically visible under a brightfield microscope, but can be seen in DIC. As such, this contrast can be used to make a qualitative distinction between the hardness of different phases. A further key advantage is the possibility of making grain structures such as grain boundaries visible even in an unetched condition (Fig. 15). The structure can therefore be evaluated prior to etching, so chemicals that pose a risk to health do not need to be used on materials that are difficult to etch (corrosion-resistant materials). However, a perfect final polish is required in this case."
      },
      {
        "type": "text",
        "content": "The polarization contrast is primarily used in the analysis of materials with a hexagonal lattice structure. This includes titanium, zinc and magnesium in particular, as well as a range of other materials (Fig. 16). However, aluminum and its alloys can also be analyzed under polarized light after being etched appropriately. This requires electrolytic etching with tetrafluoroboric acid, which is known as Barker etching (Fig 17)."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/metallic-grain-structures-and-their-microscopic-analysis/1-29.jpeg",
        "caption": "Technically pure titanium (Grade 1) following mechanical polishing, seen under a polarization contrast microscope. Unetched surface. The polarized light is enhanced or eliminated on the crystal faces due to the hexagonal lattice structure, which manifests itself as a contrast between light and dark. The image appears in color due to a so-called λ/4 plate."
      },
      {
        "type": "text",
        "content": "Fig. 16: Technically pure titanium (Grade 1) following mechanical polishing, seen under a polarization contrast microscope. Unetched surface. The polarized light is enhanced or eliminated on the crystal faces due to the hexagonal lattice structure, which manifests itself as a contrast between light and dark. The image appears in color due to a so-called λ/4 plate."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/metallic-grain-structures-and-their-microscopic-analysis/1-30.jpeg",
        "caption": "Aluminum welding seam following electrolytic etching with tetrafluoroboric acid (Barker etching), seen under a polarization contrast microscope. The etching creates a layer of oxide of varying thickness depending on the orientation of the crystals; the polarized light can interfere in this oxide layer. This also results in elimination and enhancement effects."
      },
      {
        "type": "text",
        "content": "Fig. 17: Aluminum welding seam following electrolytic etching with tetrafluoroboric acid (Barker etching), seen under a polarization contrast microscope. The etching creates a layer of oxide of varying thickness depending on the orientation of the crystals; the polarized light can interfere in this oxide layer. This also results in elimination and enhancement effects."
      },
      {
        "type": "text",
        "content": "Fluorescence is a further contrasting technique that can be used in metal and material microscopy. This method exploits the fact that certain materials that are excited at a certain wavelength emit visible light at another wavelength. These f luorescent powders (e.g., Epodye) are mixed with the embedding agent (typically transparent epoxy resin) during the embedding process and, together with it, penetrate existing and open pores and fissures. This procedure is supported by vacuum impregnation. Following curing and preparation, the microscope’s light in the blue spectrum excites the fluorescent dye, which then emits light in the yellow-green spectrum. The filled pores or fissures are illuminated in yellow-green (Figs. 18 and 19)."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/metallic-grain-structures-and-their-microscopic-analysis/1-31.jpeg",
        "caption": "Pore and fissure between a WSC coating and the steel to which it is applied. This is illuminated in yellow-green in the corresponding microscope contrast because the fissure was penetrated by embedding agent with fluorescent powder. The fissure was therefore present prior to embedding and may have arisen during fabrication; however, it could theoretically also have\noccurred during the cutting process and be a preparation artifact."
      },
      {
        "type": "text",
        "content": "Fig. 18: Pore and fissure between a WSC coating and the steel to which it is applied. This is illuminated in yellow-green in the corresponding microscope contrast because the fissure was penetrated by embedding agent with fluorescent powder. The fissure was therefore present prior to embedding and may have arisen during fabrication; however, it could theoretically also have\noccurred during the cutting process and be a preparation artifact."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/metallic-grain-structures-and-their-microscopic-analysis/1-32.jpeg",
        "caption": "Fissures in a carbon fiber composite material"
      },
      {
        "type": "text",
        "content": "Fig. 19: Fissures in a carbon fiber composite material"
      },
      {
        "type": "text",
        "heading": "The Light Microscope Equipment",
        "content": "Reflected-light microscopes are used to visualize structures in the range from mm to approx. 1 μm (10x/20x/50x/100x objectives are typical for the material microscope. Fig. 20). The design can be either upright or inverted, which is advantageous for large specimens or when viewing clamped specimens in specimen holders. High-definition stereo microscopes, on the other hand, are used less frequently for structural interpretations. The image generated by the microscope must be rendered faithfully and be suitable for integration into current documentation systems."
      },
      {
        "type": "text",
        "content": "Because the illumination and contrasting of the reflective samples is performed by the imaging optics – the microscope objective – special requirements apply to the design and light guide. Furthermore, the objective must exhibit precise field f lattening characteristics for object measurement. These types of objectives, which are specially optimized for reflected light specimens, can be recognized by the abbreviation “EPI” (e.g.,the ZEISS 50x EC EPIPLAN # 422070-9961-000)."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/metallic-grain-structures-and-their-microscopic-analysis/1-33.jpeg",
        "caption": "Versions of light microscopes for structural analyses. In addition to inverted and upright material microscopes (such as the A ZEISS Axiovert.A1 MAT and ZEISS AxioLab.A1 MAT), digital microscopes such as the ZEISS Smartzoom 5 are increasingly becoming an alternative."
      },
      {
        "type": "text",
        "content": "Fig. 20: Versions of light microscopes for structural analyses. In addition to inverted and upright material microscopes (such as the A ZEISS Axiovert.A1 MAT and ZEISS AxioLab.A1 MAT), digital microscopes such as the ZEISS Smartzoom 5 are increasingly becoming an alternative."
      },
      {
        "type": "text",
        "content": "Among other things, special antireflection coatings reduce the reflections from the object and the optical calculation does not provide for a cover glass. The digital camera requirements for metallic samples must be optimized for measuring and documentation purposes. A highly dynamic imaging camera chip displays metal surfaces and their high levels of contrast in an ideal way. Special industrial software packages (such as “ZEN core” and its material modules) are available to provide assistance in using a camera of this type (for example, the ZEISS Axiocam 305) in practical settings. Microscopes for beginners, such as the “ZEISS Primotech,” include the most common contrasting techniques and can also be used with simplified ”MATSCOPE” software and tablet solutions (”MATSCOPE” or iPads)."
      },
      {
        "type": "text",
        "content": "The rapid optical development of the “digital microscope” is also making it an increasingly interesting tool for structural analyses. These devices are becoming increasingly significant thanks to their ease of use and their combination of the advantages of stereomicroscopy with those of reflected light microscopy."
      },
      {
        "type": "text",
        "content": "They therefore also cover a relatively broad magnification and application range. In particular, reflected-light microscopes do not offer the same opportunity to digitally post-process images with a wide range of measuring tasks. However, digital microscopes are unable to keep pace with the good resolution offered by reflected-light microscopes, which is a drawback when working with very small structural elements (cf. also Figs. 3 and 4)."
      },
      {
        "type": "text",
        "content": "Please note: Special optics must be used, as the excitation and object lighting are directed through the same optical system. These are denoted by the abbreviation “EPI.” Cameras must be capable of processing high contrast values."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments is a trusted distributor and service provider of Zeiss products in India, offering innovative scientific solutions. With a focus on quality and reliability, we support researchers across the country with premium products and exceptional service."
      },
      {
        "type": "text",
        "content": "1) Schumann/Oettel: Metallografie [Metallography]. 14th edition. WILEY-VCH Verlag GmbH & Co. KGaA, Weinheim. ISBN 3-527-30679-X"
      },
      {
        "type": "text",
        "content": "2) Petzow: Metallographisches, Keramographisches und Plastographisches Ätzen [Metallographic, ceramographic and plastographic etching]."
      },
      {
        "type": "text",
        "content": "6th edition. Gebrüder Borntraeger, Stuttgart 1994. ISBN 3-443-23014-8"
      },
      {
        "type": "text",
        "content": "3) ZEISS – Lichtmikroskopie, Bibliothek der Technik [ZEISS – Light microscopy, library of technology]. ISBN 978-3-86236-088-8"
      },
      {
        "type": "text",
        "content": "4) Mikroskopische Betrachtungen zum Eisen Kohlenstoffdiagramm [Microscopic observations of the iron carbon diagram], tbd"
      },
      {
        "type": "text",
        "content": "5) Domke, 10th edition, “Werkstoffkunde und Werkstoffprüfung” [Materials science and materials testing]"
      },
      {
        "type": "text",
        "content": "6) Application note: DE_42_013_151_Applications_of_microscopy_in_additive_manufacturing.pdf"
      }
    ],
    "comments": []
  },
  {
    "id": 29,
    "title": "Advancing Biomarker Discovery Through Circulating Tumor Cells Analysis",
    "slug": "advancing-biomarker-discovery-through-circulating-tumor-cells-analysis",
    "category": "Industry Insights",
    "date": "2025-03-24",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/blogs/BlogFour/cytefinder-ii.jpg",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Biomarker discovery is crucial in understanding cancer progression, identifying tumor-specific markers,\nand evaluating drug target expression for personalized treatment. One of the most promising areas of research in oncology\nis the study of circulating tumor cells (CTCs), which provide insights into tumor heterogeneity and response to therapy.\nThese cells, shed from primary or metastatic tumors into the bloodstream, offer a minimally invasive method for cancer\nmonitoring and treatment decision-making."
      },
      {
        "type": "text",
        "content": "RareCyte’s Developer Kit technology plays a significant role in advancing CTC enumeration and single cell analysis,\nallowing researchers to examine molecular characteristics and phenotypic heterogeneity at an unprecedented level.\nThis study explores the application of RareCyte Developer technology in breast cancer patients, lung cancers,\nand other malignancies through circulating tumor cells blood tests."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/advancing-biomarker-discovery-through-circulating-tumor-cells-analysis/RareCyte-workflow-fo--CTC-Analysis.jpeg",
        "caption": "RareCyte Workflow for CTC analysis"
      },
      {
        "type": "text",
        "heading": "Methods",
        "content": "To evaluate the effectiveness of circulating tumor cells tests,\nblood samples were spiked with both positive and negative model circulating tumor cells\n(mCTC-positive and mCTC-negative). These samples were processed using the AccuCyte®\nSample Preparation System, ensuring high recovery and purity of CTCs."
      },
      {
        "type": "text",
        "content": "The staining process involved the RarePlex® CTC Panel Kit, which employs a three-channel detection method:"
      },
      {
        "type": "text",
        "content": "Furthermore, RareCyte’s Developer Kit technology was utilized to investigate\nadditional tumor-specific markers including HER2, ER, PR, EGFR, Ki67, AR, ARv7,\nand PSMA. The stained slides were imaged using CyteFinder® Instrument, and CTC\nidentification was performed through machine learning-based algorithms with manual\nconfirmation via CyteHub® software."
      },
      {
        "type": "text",
        "heading": "Results",
        "content": "The study successfully demonstrated the efficiency of\nRareCyte Developer Kits in detecting a wide range of biomarkers\nin both control and clinical samples. The results highlighted the following key\nfindings:"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/advancing-biomarker-discovery-through-circulating-tumor-cells-analysis/Fig1-Clone-specificity-evaluation-by-mCTC-positive-and-mCTC-negative-cell-lines.jpeg",
        "caption": "Clone specificity evaluation by mCTC-positive and mCTC-negative cell lines."
      },
      {
        "type": "text",
        "content": "Fig1: Clone specificity evaluation by mCTC-positive and mCTC-negative cell lines."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/advancing-biomarker-discovery-through-circulating-tumor-cells-analysis/Fig-2-MFI-comparison-for-mCTCs-with-a-range-of-HER2-expression..jpeg",
        "caption": "MFI comparison for mCTCs with a range of HER2 expression."
      },
      {
        "type": "text",
        "content": "Fig 2: MFI comparison for mCTCs with a range of HER2 expression."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/advancing-biomarker-discovery-through-circulating-tumor-cells-analysis/Fig3-mCTCs-staining.jpeg",
        "caption": "mCTCs staining with expected subcellular localization using the base epithelial CTC detection assay and two additional biomarkers."
      },
      {
        "type": "text",
        "content": "Fig 3: mCTCs staining with expected subcellular localization using the base epithelial CTC detection assay and two additional biomarkers."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/advancing-biomarker-discovery-through-circulating-tumor-cells-analysis/Fig-4-Clinical-samples-stained.jpeg",
        "caption": "Clinical samples stained using the base epithelial CTC detection assay and two additional biomarkers."
      },
      {
        "type": "text",
        "content": "Fig 4: Clinical samples stained using the base epithelial CTC detection assay and two additional biomarkers."
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "The integration of RareCyte Developer technology with CTC\nenumeration and single-cell retrieval has significantly enhanced the ability\nto conduct molecular analysis on circulating tumor cells. This advancement has profound\nimplications for cancer research, particularly in assessing drug target expression,\nmonitoring response to therapy, and improving early detection strategies."
      },
      {
        "type": "text",
        "content": "With the growing awareness of breast cancer and its impact on patients worldwide,\ncirculating tumor cells blood tests provide a valuable tool for personalized medicine,\nallowing for targeted treatment approaches based on individual tumor cells characteristics.\nAs research progresses, the continued development of thermoanalytical methods and customized\nbiomarker assays will further enhance our ability to combat cancer with precision and\nefficiency."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments is a reliable distributor and service provider of\nRarecyte products in India, delivering innovative scientific solutions. Dedicated to quality and dependability, we empower researchers across the country with premium products and outstanding support."
      },
      {
        "type": "text",
        "content": "1. Campton et al., (2019).Custom biomarker investigation of circulating tumor cells using RarePlex®Developer Kits. Univ of Washington, RareCyte, Seattle."
      }
    ],
    "comments": []
  },
  {
    "id": 30,
    "title": "TG/DTA Analysis: Evaluating Decomposition Temperature in Pharmaceuticals",
    "slug": "tg-dta-analysis-evaluating-decomposition-temperature-in-pharmaceuticals",
    "category": "Industry Insights",
    "date": "2025-03-21",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/Hitachi/simultaneous-thermogravimetric-analyzer-nexta-sta-series.jpg",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Thermal analysis plays a crucial role in the pharmaceutical industry, serving applications that range from\nresearch and development to pharmaceutical quality control. Pharmaceuticals are composed of complex organic and\ninorganic materials, and their thermal behavior must be well understood to ensure product stability and effectiveness."
      },
      {
        "type": "text",
        "content": "One of the primary thermoanalytical methods used in pharmaceutical studies is thermogravimetric analysis (TGA),\nfacilitated by Hitachi’s NEXTA STA200. This helps determine thermal stability, decomposition temperature,\nand moisture content analysis of various compounds. By employing thermogravimetric measurement,\nresearchers can evaluate the thermal properties of materials and gain insights into their stability.\nThis is particularly important in the study of digestive medicine, where thermal behavior can impact the efficacy\nand safety of digestive problems medicine formulations."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/tg-dta-analysis-evaluating-decomposition-temperature-in-pharmaceuticals/Hitachi-NEXTA-STA200.jpeg",
        "caption": "Hitachi NEXTA STA200"
      },
      {
        "type": "text",
        "content": "Hitachi NEXTA STA200"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/tg-dta-analysis-evaluating-decomposition-temperature-in-pharmaceuticals/Figure-1-TGDTA-Measurement-Results-for-Digestive-Medicine.jpeg"
      },
      {
        "type": "text",
        "heading": "Measurements and Results",
        "content": "A TG/DTA analysis was conducted on four types of digestive medicine (labeled A~D) to assess their thermal behavior.\nThe samples, each weighing 15mg, were heated in an air environment at a rate of 20°C/min."
      },
      {
        "type": "text",
        "heading": "Key Observations:",
        "content": "This indicates shared components, whereas unique decomposition points suggest differences in formulation."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/tg-dta-analysis-evaluating-decomposition-temperature-in-pharmaceuticals/Figure-2-DTA-TG-and-DTG-Curves-for-Four-Types-of-Digestive-Medicine-2.jpeg.jpeg",
        "caption": "figure 2"
      },
      {
        "type": "text",
        "heading": "Importance of Thermoanalytical Methods in Pharmaceuticals",
        "content": "Thermal analysis techniques such as thermogravimetry, differential thermal analysis provide\nvaluable insights into drug composition and behavior under thermal stress. This is essential for\npharmaceutical quality control, ensuring that medications maintain their effectiveness and stability\nthroughout their shelf life."
      },
      {
        "type": "text",
        "content": "For digestive medicine, such studies help in identifying active ingredients and excipients\nthat may degrade at certain temperature ranges, allowing manufacturers to optimize formulations accordingly.\nBy analyzing thermal properties of materials, pharmaceutical scientists can improve product stability and\nenhance therapeutic outcomes."
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "The application of thermogravimetric measurement and differential thermal analysis in the pharmaceutical\nindustry is vital for maintaining the integrity and effectiveness of drugs. Through TG/DTA analysis,\nusing advanced instruments like Hitachi NEXTA STA200, researchers can evaluate thermal stability,\ndetermine decomposition temperatures, and perform moisture content analysis, ensuring that medications,\nparticularly those used in digestive problems medicine, meet stringent quality standards. The use of advanced\nthermoanalytical methods will continue to enhance pharmaceutical formulations and ensure safe and effective\ntreatments for consumers."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments is a trusted distributor and service provider of Hitachi products in India,\noffering cutting-edge scientific solutions. With a strong focus on quality and reliability,\nwe equip researchers nationwide with top-tier products and exceptional support."
      },
      {
        "type": "text",
        "content": "1. Campton et al., (2019).Custom biomarker investigation of circulating tumor cells using RarePlex®Developer Kits. Univ of Washington, RareCyte, Seattle."
      }
    ],
    "comments": []
  },
  {
    "id": 31,
    "title": "Automated Mineral Classification and Measurement Using Machine Learning and Image Analysis",
    "slug": "automated-mineral-classification-and-measurement-using-machine-learning-and-image-analysis",
    "category": "Industry Insights",
    "date": "2025-02-27",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/Zeiss/axioscan7_colibri_prev.webp",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "ZEN Intellesis plus ZEN Image Analysis modules offer machine learning image segmentation and classification, with image analysis and object measurements, for the light microscope. Available for use with the range of ZEISS light microscopes, from the operator-driven Axiolab 5 to the fully automated Axioscan 7 Geo, the modules offer automated identification, classification, measurement, and quantification of minerals."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/automated-mineral-classification-and-measurement-using-machine-learning-and-image-analysis/Zeiss-Zen-Intellesis-Module.jpg",
        "caption": "Zeiss Zen Intellesis Module"
      },
      {
        "type": "text",
        "content": "Zeiss Zen Intellesis Module"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/automated-mineral-classification-and-measurement-using-machine-learning-and-image-analysis/Zeiss-Zen-Image-Analysis-Module.jpg",
        "caption": "Zeiss Zen Image Analysis Module"
      },
      {
        "type": "text",
        "content": "Zeiss Zen Image Analysis Module"
      },
      {
        "type": "text",
        "heading": "Automated Sample Analysis",
        "content": "Light microscopes are used daily in the evaluation of mining samples to assess the performance of the recovery process, and during exploration for new resources. Operators must perform a rigorous and accurate evaluation of samples daily,\n\na task that can prove arduous and consume a reasonable proportion of the day. With ZEN Intellesis, and ZEN Image Analysis, the classification and measurement of the mineralogy is automatically performed, thus freeing the operator to concentrate on the interpretation of the data and their other tasks."
      },
      {
        "type": "text",
        "content": "ZEN Intellesis in combination with ZEN Image Analysis offer advanced machine learning, trainable on site, to differentiate mineralogy for object classification and measurement; resulting in faster time to results and efficiency improvements."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/automated-mineral-classification-and-measurement-using-machine-learning-and-image-analysis/ziess-4.jpg",
        "caption": "Figure 1 Reflected light image acquired with ZEISS Axiolab 5. Sample of milled\ncopper ore mounted in a resin block and previously prepared for SEM analysis.\nRemnants of a carbon coating remain on some surfaces"
      },
      {
        "type": "text",
        "heading": "Consistent Sample Evaluation",
        "content": "Quality monitoring is a continuous process reliant on feeding data into an information loop from which operational decisions are made. Evidence gathered over time forms the basis for strategic planning. Reliable, consistent data is imperative in such a situation. Unlike human operators, the ZEN Intellesis and Image Analysis modules do not tire on long days and promise consistent results sample after sample."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/automated-mineral-classification-and-measurement-using-machine-learning-and-image-analysis/ziess-1.jpg",
        "caption": "Figure 2:Artificial color map following Intellesis classification. Despite the\nchallenges presented by sample preparation, e.g., the impossibility of obtaining\na transmitted light image, surface scratches, and gauges, Intellesis automatically\nclassifies the individual constituents of this image. Resin in light grey, gangue in\ndark grey, pyrite in brown, chalcopyrite in orange, and chalcocite in blue"
      },
      {
        "type": "table",
        "columns": [
          "Region Class Name",
          "Count (#)",
          "Area Percentage (%)",
          "ID"
        ],
        "rows": [
          [
            "Statistics Background",
            "995",
            "54.13",
            "1"
          ],
          [
            "Statistics Gangue",
            "1314",
            "30.05",
            "997"
          ],
          [
            "Statistics Pyrite",
            "381",
            "14.6",
            "2312"
          ],
          [
            "Statistics Chalcopyrite",
            "274",
            "0.76",
            "2694"
          ],
          [
            "Statistics Chalcocite",
            "443",
            "0.47",
            "2969"
          ]
        ]
      },
      {
        "type": "table",
        "columns": [
          "Id",
          "Region Class Name",
          "Feret Maximum (µm)",
          "Feret Minimum (µm)",
          "Area (µm²)"
        ],
        "rows": [
          [
            "A",
            "B",
            "C",
            "D",
            "G"
          ],
          [
            "1",
            "Background",
            "43.68",
            "31.24",
            "804.3"
          ],
          [
            "2",
            "Background",
            "57.5",
            "7.21",
            "246.71"
          ],
          [
            "3",
            "Background",
            "9.32",
            "5.95",
            "37.06"
          ],
          [
            "4",
            "Background",
            "42.31",
            "13.9",
            "299.26"
          ],
          [
            "5",
            "Background",
            "14.29",
            "9.12",
            "59.74"
          ],
          [
            "6",
            "Background",
            "6.13",
            "2.23",
            "9.96"
          ],
          [
            "7",
            "Background",
            "48.18",
            "11.72",
            "245.05"
          ],
          [
            "8",
            "Background",
            "5.41",
            "1.49",
            "7.19"
          ],
          [
            "9",
            "Background",
            "32.93",
            "3.08",
            "55.87"
          ],
          [
            "10",
            "Background",
            "24.21",
            "4.15",
            "55.32"
          ],
          [
            "11",
            "Background",
            "8.32",
            "1.49",
            "11.06"
          ],
          [
            "12",
            "Background",
            "9.41",
            "2.67",
            "13.83"
          ],
          [
            "13",
            "Background",
            "35.08",
            "9.67",
            "243.95"
          ],
          [
            "14",
            "Background",
            "52.82",
            "11.98",
            "427.6"
          ],
          [
            "15",
            "Background",
            "169.41",
            "20.36",
            "1099.69"
          ],
          [
            "16",
            "Background",
            "137.77",
            "8.63",
            "437.55"
          ],
          [
            "17",
            "Background",
            "69.02",
            "7.92",
            "243.95"
          ],
          [
            "18",
            "Background",
            "1.05",
            "0.74",
            "0.55"
          ],
          [
            "18",
            "Background",
            "7.44",
            "4.73",
            "20.47"
          ],
          [
            "19",
            "Background",
            "32.29",
            "10.34",
            "222.37"
          ],
          [
            "20",
            "Background",
            "11.62",
            "4.21",
            "29.32"
          ]
        ]
      },
      {
        "type": "text",
        "content": "The breadth of information that can be garnered by the fully automated Axioscan 7 Geo lends itself to more detailed analyses of the sample matter. Axioscan 7 Geo captures images using several contrast methods, and multiple angles of polarization, providing a high density of pixel information that can be interrogated and interpreted by artificial intelligence (AI) methods. For example, once Intellesis segmentation and image analysis have been implemented, the results can be further analyzed using the Petrography Analysis Toolbox (PetPAT). PetPAT accesses the wealth of data captured in Axioscan 7 Geo images to provide outputs including the angle of extinction relative to the analyzer, the position of grain boundaries, grain size distribution, grain orientation, and textural information."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/automated-mineral-classification-and-measurement-using-machine-learning-and-image-analysis/Img-7.jpg"
      },
      {
        "type": "text",
        "content": "Inkarp Instruments is a leading distributor and service provider of Zeiss products in India, delivering advanced scientific solutions. Committed to quality and reliability, we support researchers across the country with superior products and outstanding service."
      }
    ],
    "comments": []
  },
  {
    "id": 32,
    "title": "Investigating Thermal History Effects on PET Glass Transition and Melting Behavior Using Differential Scale Calorimetry",
    "slug": "investigating-thermal-history-effectsonpet-glass-transition-and-melting-behavior-using-differential-scale-calorimetry",
    "category": "Industry Insights",
    "date": "2025-02-26",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/Hitachi/differential-scanning-calorimeter-dsc-nexta-dsc-series.jpg",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Understanding the thermal history of polymers is essential for comprehending the relationship between the internal structure and processing conditions of polymer materials. This brief presents an example of Differential Scanning Calorimetry (DSC) measurement conducted on polyethylene terephthalate (PET)."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/investigating-thermal-history-effectsonpet-glass-transition-and-melting-behavior-using-differential-scale-calorimetry/Hitachi-NEXTA-DSC.jpeg",
        "caption": "Hitachi NEXTA® DSC"
      },
      {
        "type": "text",
        "heading": "Effects of Cooling Rate on Glass Transition",
        "content": "PET samples were subjected to various cooling rates from temperatures above the glass transition temperature to investigate the effects of cooling rate on the glass transition. The results, as shown in Figure 1, indicate that there was minimal difference in heat capacity before and after the glass transition across all DSC curves. However, with the exception of the quenched PET sample, the curves displayed distinctive endothermic peaks at the end of the glass transition phase. Furthermore, higher cooling rates resulted in smaller endothermic peaks. The thermal history near the glass transition can be deduced from the characteristics of these endothermic peaks."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/investigating-thermal-history-effectsonpet-glass-transition-and-melting-behavior-using-differential-scale-calorimetry/Graph-img-1.jpg",
        "caption": "Figure 1:The Effects of Cooling Rate on Glass Transition"
      },
      {
        "type": "text",
        "heading": "Changes in Melting Peaks Due to Different Thermal Processing",
        "content": "PET samples were thermally processed at various temperatures after being cooled from a molten state to examine the effects on melting peaks. As observed in Figure 2, except for the quenched PET sample, the DSC curves revealed small endothermic peaks just before the melting peak at temperatures slightly higher than the thermal processing temperatures. The nature of these endothermic peaks varied depending on the thermal processing conditions. The thermal history of the samples can be inferred from the shapes of these melting peaks."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/investigating-thermal-history-effectsonpet-glass-transition-and-melting-behavior-using-differential-scale-calorimetry/Graph-img-2.jpg",
        "caption": "Figure 2:Changes In Melting Peaks by Different Thermal Processing"
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "This study highlights the importance of thermal history in determining the relationship between the internal structure and processing conditions of polymers. Through DSC measurements on polyethylene terephthalate (PET), it was observed that cooling rates and thermal processing conditions significantly influence the glass transition and melting peaks. The presence of endothermic peaks and their characteristics provide valuable insight into the thermal history and processing history of the material. This understanding can be leveraged to optimize processing conditions for better material performance and quality control in polymer manufacturing."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments stands as India's premier distributor and service provider for Hitachi products, delivering state-of-the-art scientific solutions. Committed to excellence, we ensure top-tier products and reliable support, empowering researchers nationwide."
      },
      {
        "type": "text",
        "content": "References\n- Hitachi"
      }
    ],
    "comments": []
  },
  {
    "id": 33,
    "title": "Algae-Based Phosphate Removal: A Sustainable Approach to Wastewater Treatment",
    "slug": "algae-based-phosphate-removal-a-sustainable-approach-to-wastewater-treatment",
    "category": "Industry Insights",
    "date": "2025-02-25",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/radleys/reactor-ready-flex-lab-reactor.jpg",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Wastewater contamination with phosphates poses significant environmental challenges, primarily due to human and animal excretion, as well as residues from fertilizers and cleaning agents. These phosphates act as fertilizers in water bodies, contributing to the phenomenon of eutrophication—an excessive accumulation of nutrients that triggers harmful plant and algae growth. Consequently, phosphate removal is a critical step in wastewater treatment to maintain ecological balance."
      },
      {
        "type": "text",
        "heading": "Phosphate Removal Methods",
        "content": "In wastewater treatment plants, the removal of phosphorus is traditionally achieved through a chemical process known as phosphate precipitation. During this process, metal salts are added to bind the dissolved phosphates, which then precipitate as insoluble compounds. These compounds can subsequently be separated from the water. However, many of the precipitating agents used are by-products or waste materials from industrial processes, which may contain heavy metals. These metals can accumulate in sewage sludge, presenting an undesirable side effect."
      },
      {
        "type": "text",
        "content": "An alternative to this chemical method is the use of biological processes, such as algae-based phosphate removal. Algae have the ability to absorb phosphates as nutrients and metabolize them for growth. Rather than creating sedimented metal phosphates, this biological approach generates biomass, which can be separated and processed through the sewage sludge. The advantage of this method lies in its potential for producing valuable biomass instead of harmful by-products."
      },
      {
        "type": "text",
        "heading": "Research on Algae in Wastewater Treatment",
        "content": "At the competence center for sustainable engineering and environmental systems (ZEuUS) at the Technical University of Mittelhessen, Prof. Ulf Theilen and his team are exploring the potential of algae in wastewater treatment, focusing on both nutrient elimination and the further use of the biomass produced. Two doctoral projects, led by Ms. Tatjana Lorenz and Mr. Nils Hasport, are investigating algae’s role in removing nutrients from wastewater and the material and energetic uses of the resulting biomass."
      },
      {
        "type": "text",
        "content": "The researchers are particularly interested in reusing the algae biomass as fertilizer or generating biogas. Due to their rapid growth, algae offer a biogas production potential comparable to that of maize, the current primary substrate for biogas production."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/algae-based-phosphate-removal-a-sustainable-approach-to-wastewater-treatment/E4-Reactor-Ready-Flex-RY-Animation-flex-group-shot.webp",
        "caption": "Reactor-Ready™ Flex Lab Reactor"
      },
      {
        "type": "text",
        "content": "Reactor-Ready™ Flex Lab Reactor"
      },
      {
        "type": "text",
        "heading": "Experimental Setup and Findings",
        "content": "To assess the biogas potential of algae, 24 reactors, each with an 8-liter capacity, are operated at the university using Heidolph laboratory stirrers (RZR 2102 control and 2041*). These reactors are designed to simulate the conditions necessary for algae cultivation and biogas production. The cultivation process is also conducted on a laboratory scale using Heidolph overhead stirrers. In these so-called open pond systems, the natural flow of water is mimicked using a paddle driven by the agitator, ensuring optimal conditions for algae growth."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/algae-based-phosphate-removal-a-sustainable-approach-to-wastewater-treatment/E5-Algae-for-wastewater-treatment-1.webp",
        "caption": "Experimental Setup"
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "The research conducted by Prof. Theilen and his team highlights the significant potential of algae as an alternative to traditional phosphate removal methods in wastewater treatment. By utilizing algae for nutrient elimination, and converting the resulting biomass into valuable resources like biogas or fertilizer, this approach offers a sustainable and environmentally friendly solution to phosphate pollution. The f indings from these studies could lead to the development of more efficient and eco-conscious wastewater treatment methods in the future."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments is India's trusted leader in distributing and servicing Radleys products, providing cutting-edge scientific solutions. With a commitment to quality and reliability, we deliver top-tier products and unwavering support to researchers across the country."
      },
      {
        "type": "text",
        "content": "References\n- Radleys"
      }
    ],
    "comments": []
  },
  {
    "id": 34,
    "title": "Automated Water Sample Concentration: Optimizing Radionuclide and Heavy Metal Analysis Using Large-Scale Rotary Evaporation",
    "slug": "automated-water-sample-concentration-optimizing-radionuclide-and-heavy-metal-analysis-using-large-scale-rotary-evaporation",
    "category": "Industry Insights",
    "date": "2025-02-18",
    "author": "Inkarp Applications Team",
    "readTime": "4 min read",
    "image": "/assets/images/productImages/heidolph/hei-vap-industrial-rotary-evaporator.webp",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Water is a critical source of hydration and serves as the primary medium for the intake of chemotoxic and radiotoxic substances. Given its significance, water quality is rigorously monitored, which demands significant efforts. Radionuclides and heavy metals are analyzed in various water sources, including surface water, drinking water, groundwater, wastewater, and rainwater, primarily as part of nuclear power plant monitoring. Continuous monitoring is conducted for β-emitters such as tritium, 14C, and 90Sr, as well as β-emitting isotopes of uranium, plutonium, americium, and curium, and γ-emitters like 137Cs and 60Co."
      },
      {
        "type": "text",
        "content": "The detection limits for these substances often require concentration procedures, typically followed by radiochemical purification, to minimize interference across measurement techniques such as radiometry, mass spectrometry, and others. Radionuclide analysis is also carried out for research purposes, where the required detection limits are generally even stricter."
      },
      {
        "type": "text",
        "content": "Evaporation is an effective method for concentrating radionuclides and heavy metals from large aqueous samples. Alternatively, sorbents or flocculating agents can be used, although these methods are less effective when analyzing samples containing chemically diverse radionuclides such as 137Cs, 90Sr, and plutonium isotopes."
      },
      {
        "type": "text",
        "content": "Gentle concentration through evaporation in open vessels has traditionally been used, but it becomes time-consuming and impractical for larger sample volumes. For samples starting at around 10 liters, the use of large-scale rotary evaporators provides a more efficient solution. Additionally, distillation offers the advantage of simplifying the purification of tritium, which is found in aqueous samples as HTO (tritiated water). The distillate from a rotary evaporator can be directly used for activity measurement, such as through liquid scintillation counting for tritium analysis."
      },
      {
        "type": "text",
        "content": "Conventional evaporators, however, require frequent manual refilling of the evaporation flask, leading to ongoing personnel involvement during normal working hours, which interrupts other tasks. Outside of operating hours, these evaporators must be shut down, significantly extending the evaporation process."
      },
      {
        "type": "text",
        "heading": "Achieving Automated Efficiency in Water Sample Concentration",
        "content": "To automate the concentration of water samples using a large-scale rotary evaporator with an automatic module."
      },
      {
        "type": "text",
        "content": "The automated Hei-VAP Industrial large-scale evaporator, equipped with the Distimatic automatic module from Heidolph, can overcome the limitations of traditional rotary evaporators. The level of sample concentrate in the evaporation f lask is monitored by a capacitive fill-level sensor. When the sensor detects insufficient media, water is automatically added via a PTFE tube from a sample storage tank. The automatic module detects when the storage tank is empty and stops the operation, thereby ensuring that the evaporator can run overnight. With appropriately sized storage tanks, operation over the weekend is also possible."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/automated-water-sample-concentration-optimizing-radionuclide-and-heavy-metal-analysis-using-large-scale-rotary-evaporation/Hei-VAP-Industrial.jpeg",
        "caption": "Hei-VAP Industrial"
      },
      {
        "type": "text",
        "content": "In this case, the customer sought to replace the conventional large-scale evaporator with an automated system to increase efficiency. The goal was to evaporate up to 70 liters of rainwater to about 1 liter within one day. The pH of the rainwater samples was adjusted to 1 using nitric acid, and pre-filtered with a 63 μm filter before the evaporation process."
      },
      {
        "type": "text",
        "heading": "Method and Results",
        "content": "Using the Distimatic Industrial Platinum 8 Package, the system achieved a distillation rate of 4.6 liters per hour (l/h) with the recirculation chiller set to 5°C, a rotational speed of 115 rpm, a vacuum value of 30 mbar, and a heating bath temperature of 65°C. The resulting concentrated rainwater is shown in Fig. 2."
      },
      {
        "type": "text",
        "content": "The customer’s requirements were successfully met, and the sample volume could even be increased. The automated system saved approximately one technician work hour per day compared to conventional rotary evaporators. Since the system can run overnight, the entire evaporation process is completed much more efficiently, reducing the time required."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/automated-water-sample-concentration-optimizing-radionuclide-and-heavy-metal-analysis-using-large-scale-rotary-evaporation/ImageForArticle-1.webp",
        "caption": "Fig. 1: Hei-VAP Industrial with Distimatic test Setup"
      },
      {
        "type": "text",
        "content": "Fig. 1: Hei-VAP Industrial with Distimatic test Setup"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/automated-water-sample-concentration-optimizing-radionuclide-and-heavy-metal-analysis-using-large-scale-rotary-evaporation/ImageForArticle.webp",
        "caption": "fig.2: Concentrated rainwater"
      },
      {
        "type": "text",
        "content": "Fig. 2: Concentrated rainwater"
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "This case demonstrates that Heidolph products enable the automation of rainwater evaporation, significantly improving efficiency by ensuring continuous operation during overnight and weekend shifts. The automation process leads to faster results with a smaller workforce, achieving the same outcome as conventional evaporators with identical technical designs but in a reduced timeframe."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments, is recognized as India's leading distributor and service provider for Heidolph products. Dedicated to offering cutting-edge scientific solutions, Inkarp guarantees top-quality products and dependable support for researchers across the country."
      },
      {
        "type": "text",
        "content": "References\n: Heidolph"
      }
    ],
    "comments": []
  },
  {
    "id": 35,
    "title": "Accurate Optical Density Measurements for Cell Growth Analysis: The Importance of OD600 Measurements",
    "slug": "accurate-optical-density-measurements-for-cell-growth-analysis-the-importance-of-od600-measurements",
    "category": "Industry Insights",
    "date": "2025-01-26",
    "author": "Inkarp Applications Team",
    "readTime": "4 min read",
    "image": "/assets/images/productImages/Implen/nanophotometer-od600.jpg",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Optical Density at 600 nm (OD600) is a cornerstone metric in microbiological research, offering critical insights into cell density within liquid cultures. Whether studying bacterial, yeast, or other cellular growth, OD600 measurements provide a reliable approach to monitor cell proliferation and optimize experimental outcomes. By leveraging advanced technologies, researchers can enhance the precision and reliability of these measurements, ensuring their studies yield meaningful and reproducible results."
      },
      {
        "type": "text",
        "heading": "OD600: Beyond Light Absorption",
        "content": "Unlike methods that depend solely on light absorption, OD600 primarily measures light scattering. This distinction is significant, as it accounts for variables such as cell size, shape, and the presence of debris, factors that can greatly influence readings. This approach ensures consistent and accurate results across different cell types, even when they exhibit similar densities. The ability to distinguish between these variables is a vital advantage in experimental setups requiring high reliability."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/accurate-optical-density-measurements-for-cell-growth-analysis-the-importance-of-od600-measurements/Higher-Absorbance-Readings.jpg",
        "caption": "Light Scattering in Cell Culture Samples"
      },
      {
        "type": "text",
        "content": "Light Scattering in Cell Culture Samples"
      },
      {
        "type": "text",
        "heading": "Tracking Growth Phases with Precision",
        "content": "OD600 measurements serve as a vital tool throughout the distinct growth phases of cell cultures: lag, log (exponential), stationary, and decline. By accurately tracking these phases, researchers can pinpoint the optimal moments for induction or harvesting. Typically, cultures are grown to an OD600 value of approximately 0.4 before proceeding with these processes, marking the peak of cell vitality and ensuring maximum yield and quality. This capability enables scientists to optimise their workflows and achieve consistent experimental outcomes."
      },
      {
        "type": "text",
        "heading": "The Beer-Lambert Law in OD600 Measurements",
        "content": "The Beer-Lambert Law, also known as the Lambert-Beer Law, is foundational to understanding OD600 measurements. This principle empirically links light absorption to sample properties, providing a robust framework for assessing microbial growth in liquid cultures. While OD600 values are often used to estimate bacterial concentrations, they primarily gauge turbidity caused by microbial growth rather than direct molecular absorption."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/accurate-optical-density-measurements-for-cell-growth-analysis-the-importance-of-od600-measurements/Beer-Lambert.jpeg",
        "caption": "The Beer-Lambert Law"
      },
      {
        "type": "text",
        "content": "The Beer-Lambert Law"
      },
      {
        "type": "text",
        "content": "Implen’s advanced Optical Density technologies harness the power of the Beer-Lambert Law to deliver accurate readings, even at lower microbial densities. This precision enables researchers to effectively monitor growth dynamics, identify optimal harvesting times, and improve the reliability of their studies. Instruments like the NanoPhotometer® and Implen OD600® exemplify how the Beer-Lambert Law can be applied to enhance experimental precision."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/accurate-optical-density-measurements-for-cell-growth-analysis-the-importance-of-od600-measurements/Implen-OD600.jpeg",
        "caption": "Implen OD600®"
      },
      {
        "type": "text",
        "heading": "Understanding Variations in OD600 Readings",
        "content": "While OD600 measurements are invaluable, variations in readings can occur due to differences in spectrophotometer setups. Factors such as optical path distances and lens configurations can lead to discrepancies in values for the same sample. This variability underscores the importance of normalization in OD600 readings to ensure comparability across instruments."
      },
      {
        "type": "text",
        "content": "To address these discrepancies, researchers can correlate readings from different devices using the same sample or create calibration curves based on known cell concentrations. Instruments like the NanoPhotometer® and Implen OD600® are designed to mitigate these challenges, incorporating default correction factors that ensure consistent and reliable results."
      },
      {
        "type": "text",
        "heading": "Best Practices for Accurate OD600 Measurements",
        "content": "To achieve precise OD600 determinations, using disposable cuvettes is strongly recommended over micro or nano-volume technologies. Cuvettes minimize variations in sample volume, which can significantly affect measurement accuracy. This practice ensures consistent readings and reduces the risk of errors that could compromise experimental outcomes."
      },
      {
        "type": "text",
        "content": "Higher Absorbance Reading"
      },
      {
        "type": "text",
        "content": "Additionally, adding glycerol to samples can help stabilize cell suspensions, providing consistent OD readings over time. This stabilisation technique is especially valuable in long-term experiments where maintaining uniformity in sample composition is critical."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/accurate-optical-density-measurements-for-cell-growth-analysis-the-importance-of-od600-measurements/Higher-Absorbance-Reading-images.jpeg",
        "caption": "Lower Absorbance Reading"
      },
      {
        "type": "text",
        "content": "Lower Absorbance Reading"
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "OD600 measurements are an indispensable tool in microbiological research, providing detailed insights into cell density and growth dynamics. By embracing advanced technologies and adhering to best practices, researchers can unlock the full potential of these measurements. Instruments like the NanoPhotometer® and Implen OD600® offer reliable solutions to overcome variability, ensuring accurate and reproducible results. Through careful application of the Beer-Lambert Law and the use of disposable cuvettes, scientists can optimise their experimental workflows, contributing to robust and impactful research outcomes."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments is renowned as the best distributor and service provider for Implen products in India. Committed to delivering advanced scientific solutions, Inkarp ensures exceptional product quality and reliable support for researchers nationwide."
      }
    ],
    "comments": []
  },
  {
    "id": 36,
    "title": "Specific Heat Capacity Measurements Using DSC I",
    "slug": "specific-heat-capacity-measurements-using-dsc-i",
    "category": "Industry Insights",
    "date": "2025-01-24",
    "author": "Inkarp Applications Team",
    "readTime": "4 min read",
    "image": "/assets/images/productImages/Hitachi/differential-scanning-calorimeter-dsc-nexta-dsc-series.jpg",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Differential Scanning Calorimetry (DSC) is a vital analytical technique that allows precise measurement of specific heat capacity (Cp), even for small sample quantities. Its accuracy and reliability make it an indispensable tool for material characterization in various industries, including electronics and adhesives. This application note delves into the principles behind specific heat capacity measurements using DSC, highlights the accuracy of these measurements through sapphire testing, and explores practical applications in epoxy adhesives and IC packages."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/specific-heat-capacity-measurements-using-dsc-i/Hitachi-NEXTA-DSC.png",
        "caption": "Hitachi NEXTA® DSC"
      },
      {
        "type": "text",
        "heading": "Principles of Specific Heat Capacity Measurements",
        "content": "DSC measures specific heat capacity by comparing the heat flow of a sample to that of a reference material with a known specific heat capacity under identical conditions. Figure 1 illustrates this process, where DSC data from three conditions—sample, reference, and empty pan—are used. The specific heat capacity of the sample is calculated using a standardized formula (Equation 1), ensuring consistency and accuracy."
      },
      {
        "type": "text",
        "content": "The method hinges on ensuring that the heat capacities of the sample and reference are approximately equivalent. This alignment minimizes errors and enhances the reliability of the results."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/specific-heat-capacity-measurements-using-dsc-i/DSC-measurement.jpeg",
        "caption": "Figure 1 DSC measurement of specific heat capacity. a : empty pan b : sample\nc : reference"
      },
      {
        "type": "text",
        "heading": "Accuracy of Specific Heat Capacity Measurements",
        "content": "The precision of DSC in measuring specific heat capacity was validated through repeated testing on a 30 mg sapphire sample. The results, depicted in Figure 2, reveal remarkable consistency, with variations from literature values limited to approximately 2%."
      },
      {
        "type": "text",
        "content": "Table 1 provides a detailed summary of the average values, standard deviations (SD), literature values, and deviations from these benchmarks. Notably, the average deviation from the literature value was within 1%, underscoring the high accuracy of the technique."
      },
      {
        "type": "text",
        "content": "A subsequent test evaluated the impact of matching heat capacities between the sample and reference. Sapphire samples with heat capacities at 65%, 99%, and 175% of the reference material's heat capacity were tested. Table 2 demonstrates that the most accurate measurements were obtained when the sample and reference heat capacities were nearly identical, as observed with the 29.68 mg sapphire sample. This f inding reaffirms the importance of matching heat capacities for optimal measurement accuracy."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/specific-heat-capacity-measurements-using-dsc-i/Results-for-repeated.jpeg",
        "caption": "Figure 2 Results for repeated measurements of sapphire\nΔCp = Cp (literature value) - Cp (measured value)\nSample weight : 29.7mg\nHeating rate : 10°C/min"
      },
      {
        "type": "text",
        "content": "Figure 2 : Results for repeated measurements of sapphire\nΔCp = Cp (literature value) - Cp (measured value)\nSample weight : 29.7mg\nHeating rate : 10°C/min"
      },
      {
        "type": "table",
        "columns": [
          "Temp.(°C)",
          "avg. (J/g·deg)",
          "SD",
          "C.V. (%)",
          "Literature value\n\n(J/g·deg)",
          "Deviation (%)\n\nfrom literature value"
        ],
        "rows": [
          [
            "40",
            "0.806",
            "0.018",
            "2.2",
            "0.806",
            "0"
          ],
          [
            "60",
            "0.844",
            "0.012",
            "1.4",
            "0.843",
            "-0.1"
          ],
          [
            "80",
            "0.874",
            "0.008",
            "0.9",
            "0.877",
            "-0.3"
          ],
          [
            "100",
            "0.912",
            "0.006",
            "0.7",
            "0.908",
            "-0.4"
          ],
          [
            "120",
            "0.941",
            "0.005",
            "0.5",
            "0.935",
            "-0.6"
          ],
          [
            "140",
            "0.965",
            "0.004",
            "0.4",
            "0.959",
            "-0.6"
          ],
          [
            "160",
            "0.989",
            "0.006",
            "0.6",
            "0.981",
            "-0.8"
          ],
          [
            "180",
            "1.007",
            "0.007",
            "0.7",
            "1.001",
            "-0.6"
          ]
        ]
      },
      {
        "type": "table",
        "columns": [
          "Temp. (°C)",
          "19.20mg",
          "29.68mg",
          "50.25mg"
        ],
        "rows": [
          [
            "Measured (J/g·deg)",
            "Deviation (%) from literature",
            "Measured (J/g·deg)",
            "Deviation (%) from literature",
            "Measured (J/g·deg)",
            "Deviation (%) from literature"
          ],
          [
            "40",
            "0.8",
            "-0.7",
            "0.795",
            "-1.4",
            "0.797",
            "-1.1"
          ],
          [
            "60",
            "0.851",
            "0.9",
            "0.843",
            "0",
            "0.835",
            "-0.9"
          ],
          [
            "80",
            "0.888",
            "1.3",
            "0.877",
            "0",
            "0.862",
            "-1.7"
          ],
          [
            "100",
            "0.929",
            "2.3",
            "0.912",
            "0.4",
            "0.901",
            "-0.8"
          ],
          [
            "120",
            "0.966",
            "3.3",
            "0.942",
            "0.7",
            "0.928",
            "-0.7"
          ],
          [
            "140",
            "0.989",
            "3.1",
            "0.966",
            "0.7",
            "0.949",
            "-1"
          ],
          [
            "160",
            "1.017",
            "3.7",
            "0.989",
            "0.8",
            "0.968",
            "-1.2"
          ]
        ]
      },
      {
        "type": "text",
        "content": "Reference weight : 29.71 mg"
      },
      {
        "type": "text",
        "heading": "Measuring the Specific Heat Capacity of Epoxy Adhesives",
        "content": "Epoxy adhesives, widely used in industries for their bonding and sealing properties, present a fascinating case study for DSC applications. Figure 3 and Table 3 detail the specific heat capacity measurements of an epoxy adhesive across varying temperatures."
      },
      {
        "type": "text",
        "content": "The results show a significant increase in specific heat capacity between 70°C and 90°C, attributed to the glass transition phase of the epoxy. This transition reflects changes in the molecular structure of the adhesive, which is critical for understanding its thermal behavior. Table 3 provides specific heat capacity values for different temperature points, offering valuable data for engineers and researchers."
      },
      {
        "type": "text",
        "heading": "Measuring the Specific Heat Capacity of IC Packages",
        "content": "IC packages, composed of epoxy resin (approximately 20%) and inorganic fillers, are essential components in modern electronics. The specific heat capacity of these packages was analyzed using DSC, with results displayed in Figure 4 and Table 3."
      },
      {
        "type": "text",
        "content": "The findings reveal that the specific heat capacity of IC packages is generally lower than that of pure epoxy adhesives. This difference arises from the lower specific heat capacity of the inorganic materials used as fillers. The data highlights the composite nature of IC packages and their distinct thermal properties compared to standalone epoxy adhesives."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/specific-heat-capacity-measurements-using-dsc-i/Specific-heat-capacity-results.jpeg",
        "caption": "Figure 3: Specific heat capacity results for epoxy adhesive\nTemperature interval for Cp calculation : 5 °C"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/specific-heat-capacity-measurements-using-dsc-i/Specific-heat-capacity.jpeg",
        "caption": "Figure 4 Specific heat capacity results for IC package. Temperature interval for Cp calculation: 5 °C"
      },
      {
        "type": "text",
        "content": "Figure 4 : Specific heat capacity results for IC package. Temperature interval for Cp calculation: 5 °C"
      },
      {
        "type": "table",
        "columns": [
          "Temp .(0c)",
          "Cp (J/g .deg)"
        ],
        "rows": [
          [
            "Epoxy adhesive",
            "IC Packages"
          ],
          [
            "30",
            "1.188",
            "0.91"
          ],
          [
            "35",
            "1.21",
            "0.923"
          ],
          [
            "40",
            "1.228",
            "0.941"
          ],
          [
            "45",
            "1.231",
            "0.968"
          ],
          [
            "50",
            "1.245",
            "1"
          ],
          [
            "55",
            "1.254",
            "1.029"
          ],
          [
            "60",
            "1.274",
            "1.058"
          ],
          [
            "65",
            "1.282",
            "1.09"
          ],
          [
            "70",
            "1.31",
            "1.111"
          ],
          [
            "75",
            "1.34",
            "1.112"
          ],
          [
            "80",
            "1.408",
            "1.105"
          ],
          [
            "85",
            "1.499",
            "1.116"
          ],
          [
            "90",
            "1.575",
            "1.112"
          ],
          [
            "95",
            "1.609",
            "1.111"
          ],
          [
            "100",
            "1.614",
            "1.109"
          ],
          [
            "105",
            "1.615",
            "1.102"
          ],
          [
            "110",
            "1.621",
            "1.11"
          ],
          [
            "115",
            "1.628",
            "1.107"
          ],
          [
            "120",
            "142",
            "1.118"
          ],
          [
            "125",
            "133",
            "1.122"
          ],
          [
            "130",
            "1.65",
            "1.13"
          ],
          [
            "135",
            "1.651",
            "1.155"
          ],
          [
            "140",
            "1.645",
            "1.16"
          ],
          [
            "145",
            "1.647",
            "1.167"
          ],
          [
            "150",
            "1.66",
            "1.181"
          ],
          [
            "155",
            "1.665",
            "1.178"
          ],
          [
            "160",
            "1.652",
            "1.188"
          ],
          [
            "165",
            "1.675",
            "1.207"
          ],
          [
            "170",
            "1.66",
            "1.22"
          ],
          [
            "175",
            "1.651",
            "1.221"
          ]
        ]
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "DSC emerges as a robust and accurate tool for specific heat capacity measurements, enabling researchers and industries to understand material properties with exceptional precision. The study of sapphire demonstrated the technique's high accuracy, with deviations from literature values remaining minimal. Furthermore, the applications in epoxy adhesives and IC packages showcase DSC's versatility in addressing real-world challenges."
      },
      {
        "type": "text",
        "content": "By capturing the thermal transitions of epoxy adhesives and distinguishing the composite thermal properties of IC packages, DSC provides invaluable insights for material selection, product development, and quality control. These findings underline the critical role of DSC in advancing material science and ensuring optimal performance across diverse applications."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments, the authorized distributor of Hitachi products in India, is widely recognized as the leading distributor and service provider for the NEXTA® DSC series."
      },
      {
        "type": "text",
        "content": "Dedicated to providing cutting-edge scientific solutions, Inkarp guarantees top-tier product quality and dependable support for researchers across the country."
      },
      {
        "type": "text",
        "content": "References - Hitachi High Tech"
      }
    ],
    "comments": []
  },
  {
    "id": 37,
    "title": "Online Monitoring of Acid Number and OH Number during Polyester Resin Production",
    "slug": "online-monitoring-acid-number-oh-during-polyester-resin-production",
    "category": "Industry Insights",
    "date": "2025-01-17",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/Bruker/matrix-f-ii-banner-bruker.png",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Polyester resins, classified as unsaturated synthetic resins, are renowned for the\nversatility and extensive range of applications. These resins play a crucial role in\nvarious industries, including:"
      },
      {
        "type": "text",
        "content": "The flexibility of polyester resins stems from their adaptable chemical properties,\nmaking them indispensable in both industrial and commercial applications."
      },
      {
        "type": "text",
        "heading": "Production of Unsaturated Polyester Resins",
        "content": "Unsaturated polyester resins are synthesized through the chemical reaction of saturated and unsaturated di-carboxylic acids with alcohols. When cross-linked with a vinyl reactive monomer, these resins form highly durable structures and coatings."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/online-monitoring-acid-number-oh-during-polyester-resin-production/Unsaturated-polyester.jpeg",
        "caption": "Unsaturated polyester synthesized through the chemical reaction of saturated and unsaturated di-carboxylic acids with alcohols."
      },
      {
        "type": "text",
        "content": "Unsaturated polyester synthesized through the chemical reaction of saturated and unsaturated di-carboxylic acids with alcohols."
      },
      {
        "type": "text",
        "content": "The properties of the final cross-linked resins depend on various factors:"
      },
      {
        "type": "text",
        "content": "Careful selection of these parameters allows manufacturers to tailor the properties of polyester resins for specific applications."
      },
      {
        "type": "text",
        "content": "For instance, the PD-1/PD-L1 checkpoint inhibits immune activity to prevent tissue damage. However, many cancers, including NSCLC, exploit this mechanism by overexpressing PD-L1, effectively evading immune destruction. Therapeutic monoclonal antibodies targeting these interactions have shown promise in reactivating the immune response against tumors. Yet, challenges persist as many patients either do not respond or develop resistance to these therapies due to suboptimal patient selection methods."
      },
      {
        "type": "text",
        "heading": "Importance of Monitoring Acid and OH Numbers",
        "content": "Throughout the production process, it is essential to monitor key parameters such as Acid Number and OH Number. Real-time monitoring ensures:"
      },
      {
        "type": "text",
        "content": "FT-NIR process spectroscopy has emerged as a proven and reliable tool for this purpose. It is widely adopted across the industry for its ability to provide accurate, real-time data."
      },
      {
        "type": "text",
        "heading": "FT-NIR Measurement in Polyester Resin Production",
        "content": "The liquid nature of polyester resin products makes them well-suited for analysis using FT-NIR spectroscopy. Fiber optic transmission probes can be installed directly in the reactor or in a bypass line for continuous monitoring."
      },
      {
        "type": "text",
        "content": "The MATRIX-F process spectrometer offers a unique advantage:"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/online-monitoring-acid-number-oh-during-polyester-resin-production/Bruker-MATRIX.jpeg",
        "caption": "Bruker MATRIX-F II FT-NIR Process Spectrometer"
      },
      {
        "type": "text",
        "content": "Bruker MATRIX-F II FT-NIR Process Spectrometer"
      },
      {
        "type": "text",
        "content": "Additionally, process communication protocols such as Profibus DP, Modbus, OPC DA, or 4-20mA enable seamless data transfer to Distributed Control Systems (DCS). This integration facilitates optimized process control and ensures consistent production quality."
      },
      {
        "type": "text",
        "heading": "Quantitative Analysis in Polyester Resin Production",
        "content": "Near-infrared (NIR) spectroscopy is a vital analytical technique for studying polyester resin production. NIR spectra are derived from the combination and overtone bands of C-H, N-H, and O-H vibrations, which are abundant in the organic components of reaction mixtures. This makes NIR spectroscopy an ideal tool for analyzing these compounds."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/online-monitoring-acid-number-oh-during-polyester-resin-production/PLS-based.jpeg",
        "caption": "Cross validation results of a PLS based model for the online prediction of the Acid Number during the Polyester reaction."
      },
      {
        "type": "text",
        "content": "Cross validation results of a PLS based model for the online prediction of the Acid Number during the Polyester reaction."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/online-monitoring-acid-number-oh-during-polyester-resin-production/Cross-validation.jpeg",
        "caption": "Cross validation results of a PLS based model for the online prediction of the OH Number during the Polyester reaction."
      },
      {
        "type": "text",
        "content": "Cross validation results of a PLS based model for the online prediction of the OH Number during the Polyester reaction."
      },
      {
        "type": "text",
        "heading": "Innovative Solutions from Bruker Optics",
        "content": "Bruker Optics provides a diverse range of advanced instrumentation designed to meet specific analytical needs in the polyester resin industry:"
      },
      {
        "type": "text",
        "content": "These instruments enable precise monitoring and analysis, ensuring high standards in resin production and beyond."
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "Polyester resins are a cornerstone in modern industry, offering unparalleled versatility and utility. From their diverse applications to their intricate production process, these resins embody innovation and adaptability. Advanced monitoring technologies, such as FT-NIR spectroscopy and Bruker Optics' state-of-the-art instruments, ensure that production processes meet the highest standards of precision and efficiency."
      },
      {
        "type": "text",
        "content": "By leveraging these technologies, manufacturers can produce high-quality polyester resins that meet the evolving demands of various industries, from transportation and infrastructure to textiles and beyond."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments, the authorized distributor of Bruker products in India, is widely recognized as the leading distributor and service provider for MATRIX-F II FT-NIR Process Spectrometer. Dedicated to offering cutting-edge scientific solutions, Inkarp guarantees top-tier product quality and dependable support to researchers across the country."
      }
    ],
    "comments": []
  },
  {
    "id": 38,
    "title": "Applying Dynamic Mechanical Analysis to Research & Development for Viscoelastic Damping Materials",
    "slug": "applying-dynamic-mechanical-analysis-research-development-for-viscoelastic-damping-materials",
    "category": "Industry Insights",
    "date": "2025-01-11",
    "author": "Inkarp Applications Team",
    "readTime": "6 min read",
    "image": "/assets/images/productImages/Hitachi/dma-200.png",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Reducing vibration in mechanical systems is vital for minimizing noise, enhancing component life, and improving overall system performance. While vibration can often be managed by isolation or altering the mass and stiffness of system components, damping remains a practical and effective alternative when other methods are insufficient. Applying materials with high damping properties—primarily viscoelastic materials—provides a viable solution to dissipate mechanical energy as heat during deformation."
      },
      {
        "type": "text",
        "content": "Viscoelastic materials exhibit unique damping properties derived from their ability to convert mechanical energy into heat through molecular interactions. This energy dissipation capability is quantified using the loss factor (η), a measure of energy lost per deformation cycle. Given that temperature and vibrational frequency significantly influence the loss factor, understanding the behavior of viscoelastic materials across these variables is crucial for designing efficient damping systems."
      },
      {
        "type": "text",
        "content": "Dynamic Mechanical Analysis (DMA) emerges as a powerful tool in this context, enabling the efficient, precise characterization of viscoelastic damping materials. Compared to traditional methods such as the Oberst beam test, DMA offers significant advantages in terms of speed, resolution, and versatility, making it an essential resource for research and development."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/applying-dynamic-mechanical-analysis-research-development-for-viscoelastic-damping-materials/Hitachi-NEXTA-DMA.png",
        "caption": "Hitachi NEXTA DMA"
      },
      {
        "type": "text",
        "heading": "Viscoelastic Damping Materials",
        "content": "Viscoelasticity describes the combination of viscous and elastic behaviors in materials during deformation. A viscoelastic material’s response depends on the applied load and its duration, leading to a time-dependent strain. During vibration, viscoelastic materials dissipate mechanical energy through internal molecular interactions, effectively reducing system vibration."
      },
      {
        "type": "text",
        "content": "Viscoelastic materials function across three temperature-dependent regions:"
      },
      {
        "type": "text",
        "content": "Glassy Region: At low temperatures, materials exhibit high stiffness (elastic modulus, E') and minimal energy dissipation (loss factor, tan δ)."
      },
      {
        "type": "text",
        "content": "Rubbery Region: At high temperatures, stiffness decreases, and the material becomes rubbery, with reduced damping properties."
      },
      {
        "type": "text",
        "content": "Transition Region:\nBetween the glassy and rubbery states, the material exhibits a peak loss factor, making this region crucial for optimizing damping performance."
      },
      {
        "type": "text",
        "content": "The damping performance of viscoelastic materials also varies with vibrational frequency. Low frequencies allow viscous behavior to dominate, while high frequencies favor elastic responses. By tailoring material formulations, researchers can optimize damping performance within specific temperature and frequency ranges."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/applying-dynamic-mechanical-analysis-research-development-for-viscoelastic-damping-materials/Figure1-Damping.jpeg",
        "caption": "Figure 1 – Damping (tan δ) and modulus (Eˈ) as a function of temperature with the three regions marked"
      },
      {
        "type": "text",
        "heading": "Dynamic Mechanical Analysis (DMA)",
        "content": "DMA measures material properties under mechanical and thermal stress, providing critical insights into material phase transitions. Using sinusoidal force across a temperature and frequency range, DMA evaluates the elastic modulus (E'), loss modulus (E''), and the tan δ ratio. These parameters characterize a material's damping performance with exceptional precision and sensitivity."
      },
      {
        "type": "text",
        "content": "DMA's ability to generate extensive, detailed datasets efficiently—often at increments of less than a degree—makes it superior to traditional methods. It eliminates time-intensive preparation steps required in the Oberst beam method, which demands long soak times and extensive sample preparation. Additionally, DMA enables the use of small samples, ensuring faster thermal equilibrium during testing."
      },
      {
        "type": "text",
        "heading": "DMA Testing Procedure",
        "content": "The study tested various polymer-based viscoelastic materials and adhered to ISO 6721-5:1996 standards, involving precise calibration, stable ambient conditions, and temperature modulation using liquid nitrogen and an internal oven."
      },
      {
        "type": "text",
        "content": "Samples were mounted in a dual cantilever configuration, with stress and strain constants calculated based on sample geometry. The samples tested differed in filler type, polymer content, plasticizer content, and processing method. These variations enabled a detailed analysis of how formulation and processing affect damping performance."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/applying-dynamic-mechanical-analysis-research-development-for-viscoelastic-damping-materials/Table1_DMA_parameters.jpeg",
        "caption": "Table 1 – DMA parameters"
      },
      {
        "type": "text",
        "content": "Table 1 - DMA parameters"
      },
      {
        "type": "text",
        "heading": "Results",
        "content": "1. Filler Variation:\nSamples with different filler types and particle sizes exhibited distinct viscoelastic responses. Smaller particle sizes maintained the transition region around ambient temperatures, while larger particle sizes shifted it to higher temperatures, emphasizing the impact of filler characteristics."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/applying-dynamic-mechanical-analysis-research-development-for-viscoelastic-damping-materials/Figure2_DMA_results.jpeg",
        "caption": "Figure 4 – DMA results for viscoelastic materials with different fillers"
      },
      {
        "type": "text",
        "content": "Figure 2 - DMA results for viscoelastic materials with different fillers"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/applying-dynamic-mechanical-analysis-research-development-for-viscoelastic-damping-materials/Table_2_A_Samples.jpeg",
        "caption": "Table 2 – ‘A’-Samples"
      },
      {
        "type": "text",
        "content": "Table 2 - ‘A’-Samples"
      },
      {
        "type": "text",
        "content": "2. Polymer Content:\nReducing polymer content shifted the transition region to higher temperatures and decreased the loss factor, reflecting increased stiffness and diminished energy dissipation."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/applying-dynamic-mechanical-analysis-research-development-for-viscoelastic-damping-materials/figure_3_DMA_results.jpeg",
        "caption": "Figure 5 – DMA results for viscoelastic materials with different polymer content"
      },
      {
        "type": "text",
        "content": "Figure 3 - DMA results for viscoelastic materials with different polymer content"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/applying-dynamic-mechanical-analysis-research-development-for-viscoelastic-damping-materials/Table3_B_Samples.jpeg",
        "caption": "Table 2 – ‘B’ Samples"
      },
      {
        "type": "text",
        "content": "Table 3 - ‘B’ Samples"
      },
      {
        "type": "text",
        "content": "3. Plasticizer Content:\nIncreasing plasticizer content softened the material, lowering the transition temperature and enhancing damping performance at ambient conditions. Excessive plasticizer, however, led to over-softening and reduced damping efficiency."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/applying-dynamic-mechanical-analysis-research-development-for-viscoelastic-damping-materials/Figure_4_DMA_results_graph.jpeg",
        "caption": "Figure 6 – DMA results for viscoelastic materials with different plasticiser content"
      },
      {
        "type": "text",
        "content": "Figure 4 - DMA results for viscoelastic materials with different plasticiser content"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/applying-dynamic-mechanical-analysis-research-development-for-viscoelastic-damping-materials/Table_4_C_Samples.jpeg",
        "caption": "Table 4 – ‘C’ Samples"
      },
      {
        "type": "text",
        "content": "Table 4 - ‘C’ Samples"
      },
      {
        "type": "text",
        "content": "4. Processing Methods:\nLaboratory and production samples displayed minor differences, with production samples slightly shifting the transition region to higher temperatures. Variations were attributed to factors like mixing efficiency and f iller particle behavior during processing."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/applying-dynamic-mechanical-analysis-research-development-for-viscoelastic-damping-materials/Figure_5_DMA_results_for_viscoelastic_materials3.jpeg",
        "caption": "Figure 7 – DMA results for viscoelastic materials with different sample processing methods"
      },
      {
        "type": "text",
        "content": "Figure 5 - DMA results for viscoelastic materials with different sample processing methods"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/applying-dynamic-mechanical-analysis-research-development-for-viscoelastic-damping-materials/Table_5_D_Samples.jpeg",
        "caption": "Table 5 – ‘D’ Samples"
      },
      {
        "type": "text",
        "content": "Table 5 - ‘D’ Samples"
      },
      {
        "type": "text",
        "heading": "Discussion",
        "content": "DMA proved to be an invaluable tool for characterizing viscoelastic materials, highlighting the influence of formulation and processing on damping properties. Its ability to quickly and precisely evaluate material performance across a temperature range surpasses traditional methods like the Oberst beam test. However, DMA requires meticulous sample preparation and parameter selection to ensure accurate results."
      },
      {
        "type": "text",
        "content": "Advanced techniques, such as time-temperature superposition (TTS), further extend DMA's capabilities, enabling predictions of material performance across untested temperature and frequency ranges. Future research should explore larger sample sizes, different test fixtures, and the impact of environmental factors such as humidity on damping properties."
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "Dynamic Mechanical Analysis offers a sophisticated, efficient, and precise method for evaluating viscoelastic damping materials. By analyzing the effects of filler type, polymer content, plasticizer content, and processing methods, DMA provides critical insights into material optimization for specific temperature and frequency ranges."
      },
      {
        "type": "text",
        "content": "As an essential tool in research and development, DMA enhances the understanding of viscoelastic materials, enabling tailored formulations for diverse applications. With ongoing advancements, DMA is poised to remain a cornerstone in the study and optimization of damping materials, ensuring improved system performance and longevity in various engineering contexts."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments is the authorized distributor of Hitachi products in India and widely renowned as the best distributor and service provider for the NEXTA® Dynamic Mechanical Analyzer (DMA). With a focus on advanced scientific solutions, Inkarp offers high-quality products and reliable support to researchers across India."
      },
      {
        "type": "text",
        "content": "Assistance from Benjamin Dowdell in the preparation of samples along with the organisation of results are gratefully acknowledged. Material science advice and reviewing from Philip Holgate is immensely appreciated."
      },
      {
        "type": "text",
        "content": "1. Jones DI. Handbook of Viscoelastic Vibration Damping. England, UK: John Wiley & Sons Ltd.; 2001 p. 39."
      },
      {
        "type": "text",
        "content": "2. International Standard ISO 6721-3:1994 Plastics – Determination of dynamic mechanical properties – Part 3: Flexural Vibration – Resonance-curve method"
      },
      {
        "type": "text",
        "content": "3. ASTM E756-05(2010) Standard test method for measuring vibration-damping properties of materials"
      },
      {
        "type": "text",
        "content": "4. Sun CT, Lu YP. Vibration Damping of Structural Elements. New Jersey, USA: Prentice Hall PTR; 1995. p. 10."
      },
      {
        "type": "text",
        "content": "5. Harris CM, Piersol AG. Harris’ Shock and Vibration Handbook (Fifth Edition). New York, USA:McGraw-Hill; 2002. p. 1190/36.16."
      },
      {
        "type": "text",
        "content": "6. Elejabarrieta MJ, Cortés F, Martinez M. Mechanical Engineering Theory and Applications - Viscoelastic Surface Treatments for Passive Control of Structural Vibration. New York, USA: Nova Science Publishers; 2012. p. 3."
      },
      {
        "type": "text",
        "content": "7. Nashif AD, Jones DI, Henderson JP. Vibration Damping. New Jersey, USA: John Wiley & Sons, Inc.; 1985. p. 264."
      },
      {
        "type": "text",
        "content": "8. Menard KP. Dynamic Mechanical Analysis (Second Edition) - A Practical Introduction. Florida, USA. CRC Press/Taylor & Francis Group; 2008. p. 2-4, 10, 148."
      },
      {
        "type": "text",
        "content": "9. International Standard ISO 6721-5:1996 Plastics - Determination of dynamic mechanical properties - Part 5: Flexural vibration - Non-resonance method"
      },
      {
        "type": "text",
        "content": "10. Verstappen AP, Pearse JR. Evaluation of Viscoelastic Vibration Damping Properties with a Dynamic Mechanical Analyzer. 18th International Congress on Sound and Vibration; 10-14 July 2011; Rio de Janeiro, Brazil 2011. p. 3."
      }
    ],
    "comments": []
  },
  {
    "id": 39,
    "title": "Electrochemical Investigations: A Modern Approach to Energy and Molecular Research",
    "slug": "electrochemical-investigations-a-modern-approach-to-energy-and-molecular-research",
    "category": "Industry Insights",
    "date": "2025-01-03",
    "author": "Inkarp Applications Team",
    "readTime": "5 min read",
    "image": "/assets/images/productImages/Bruker/vertex-80-80v-ft-ir-research-spectrometer.png",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Electrochemical investigations have become a pivotal area of modern research, driven by the demand for sustainable energy solutions and deeper insights into molecular behavior. With the rapid advancement of technology and industry, global energy consumption continues to rise, creating an urgent need for high-capacity, lightweight rechargeable batteries. These innovations depend on a profound understanding of electrolyte systems and electrode surfaces, both of which are central to the improvement of energy storage systems."
      },
      {
        "type": "text",
        "content": "Beyond energy storage, electrochemistry plays a crucial role in biochemistry and catalysis. It provides valuable information about molecules and their behaviors under specific electrochemical potentials. For instance, it sheds light on the redox-active centers in biomolecules, the reaction mechanisms of catalysts, and the formation of carbon oxides during alcohol oxidation."
      },
      {
        "type": "text",
        "heading": "The Integration of FTIR Spectroscopy with Electrochemistry",
        "content": "Combining Fourier-transform infrared (FTIR) spectroscopy with electrochemical methods offers a unique perspective on molecular changes and reaction processes. This integration allows researchers to correlate molecular transformations with electrochemical responses. Such insights are critical for understanding electrolyte systems and electrode surfaces, and the Bruker A530/x reflection unit is a noteworthy tool in this domain."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/electrochemical-investigations-a-modern-approach-to-energy-and-molecular-research/Keywords-Instrumentation-and-Software.jpeg",
        "caption": "Keywords, Instrumentation and Software"
      },
      {
        "type": "text",
        "content": "Keywords, Instrumentation and Software"
      },
      {
        "type": "table",
        "columns": [
          "Keywords",
          "Instrumentation and Software"
        ],
        "rows": [
          [
            "Electrode surface",
            "INVENIO R, VERTEX"
          ],
          [
            "Electrolyte",
            "A530/x reflection unit"
          ],
          [
            "Internal reflection",
            "Potentiostat"
          ],
          [
            "External reflection",
            "Rapid Scan, trigger functionality"
          ],
          [
            "Potential modulation",
            "D31x/B MCT detector"
          ],
          [
            "FTIR spectroelectrochemistry",
            "OPUS 3D Software"
          ]
        ]
      },
      {
        "type": "text",
        "content": "This advanced setup supports two primary configurations for external IR reflection-absorbance spectroscopy (IRRAS):"
      },
      {
        "type": "text",
        "heading": "Internal Reflection ATR (Attenuated Total Reflection) Configuration:",
        "content": "For analyzing dissolved molecules, optically transparent thin-layer electrochemical cells (OTTLE) allow for detailed transmission measurements. Using semi-transparent metal mini grid electrodes, this setup enables precise monitoring of molecular interactions near electrode surfaces."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/electrochemical-investigations-a-modern-approach-to-energy-and-molecular-research/Different-measurement-modes.jpeg",
        "caption": "Figure 1: Different measurement modes of the A530/x reflection unit.\nOn the left side external reflection (materials: CaF2, BaF2), on the right\nside internal reflection (materials: Ge, Si)."
      },
      {
        "type": "text",
        "heading": "Experimental Study: Oxidation of Ferrocyanide",
        "content": "A classic example of electrochemical analysis involves the oxidation of ferrocyanide [Fe(CN)6]4−[Fe(CN)_6]^{4-}, which illustrates the dependence of the CN-ligand stretching vibration on the oxidation state of the iron center (FeII^\\text{II} or FeIII^\\text{III}). This redox system has been widely documented in literature and offers an ideal model for studying molecular transformations."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/electrochemical-investigations-a-modern-approach-to-energy-and-molecular-research/Bruker-VERTEX-80-FTIR-Spectrometer.jpg",
        "caption": "Bruker VERTEX 80 FTIR spectrometer"
      },
      {
        "type": "text",
        "heading": "Instrumentation",
        "content": "Bruker VERTEX 80 FTIR Spectrometer"
      },
      {
        "type": "text",
        "content": "Experiments were conducted using a purged VERTEX80 FTIR spectrometer equipped with the A530/P accessory and a mid-band MCT detector. The setup featured a thin gold plate disk as the working electrode, alongside silver and platinum wires serving as quasi-reference and counter electrodes, respectively. Measurement parameters included a resolution of 4 cm−1^{-1}, 100 scans, and p-polarized light."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/electrochemical-investigations-a-modern-approach-to-energy-and-molecular-research/Design-of-the-reflection-cell-A530-with-installed-glass-tube.jpeg",
        "caption": "Figure 2: Design of the reflection cell A530/x with installed glass tube."
      },
      {
        "type": "text",
        "content": "The electrochemical processes were controlled using a Gamry 600 reference potentiostat synchronized with the FTIR spectrometer. A solution of potassium ferrocyanide (20 mmol/L20 \\text{ mmol/L}) and potassium chloride (1 mol/L1 \\text{ mol/L}) served as the electrolyte."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/electrochemical-investigations-a-modern-approach-to-energy-and-molecular-research/First-and-second-run-of-cyclic-voltammogram.jpeg",
        "caption": "Figure 3: First and second run of a cyclic voltammogram with 0.1 V/s of ferrocyanide [Fe(CN)6] 4- in 1 M KCl solution."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/electrochemical-investigations-a-modern-approach-to-energy-and-molecular-research/Pictures-of-the-experimental-setup.jpeg",
        "caption": "Figure 4: Pictures of the experimental setup. Reflection unit with polymeric flask installed (left), complete cell installed and connected (right)."
      },
      {
        "type": "text",
        "heading": "Results and Observations",
        "content": "A cyclic voltammogram was initially recorded to establish the oxidation and reduction potentials of the ferrocyanide/ferricyanide system. Subsequent FTIR spectroelectrochemical studies were performed in ATR mode using a silicon hemispherical window. The solution was monitored at varying potentials, and the resulting IR spectra were analyzed."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/electrochemical-investigations-a-modern-approach-to-energy-and-molecular-research/Potential-change-during-an-experimental-run.jpeg",
        "caption": "Figure 5: Potential change during an experimental run. Depicted like given in chronoamperometry. IR spectra are measured at the defined potential levels."
      },
      {
        "type": "text",
        "content": "A key observation was the shift in the CN-ligand stretching vibration corresponding to the redox state. Specifically:"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/electrochemical-investigations-a-modern-approach-to-energy-and-molecular-research/IR-spectra.jpeg",
        "caption": "Figure 6: IR spectra of the ferrocyanide solution measured at potentials ranging from -0.3 V to 0.8V shown as SNIFTIRS type spectra."
      },
      {
        "type": "text",
        "heading": "Oxidized Form ([Fe(CN)6]3−[Fe(CN)_6]^{3-}):",
        "content": "These shifts were further illustrated using SNIFTIRS (Subtractively Normalized Interfacial Fourier Transform IR Spectroscopy) spectra and 3D time-resolved plots, providing a clear depiction of the redox process."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/electrochemical-investigations-a-modern-approach-to-energy-and-molecular-research/Three-dimensional-representation-of-the-oxidation-of-a-ferrocyanide-solution.jpeg",
        "caption": "Figure 7: Three dimensional representation of the oxidation of a ferrocyanide solution at potentials ranging from -0.3 V to 0.8 V, shown as 3D-plot as offered in the OPUS software."
      },
      {
        "type": "text",
        "heading": "Layer Thickness Analysis",
        "content": "For thin-layer studies, the thickness of the electrolyte layer between the electrode surface and the hemispherical window was determined using interference patterns. In this setup, the layer thickness was calculated as approximately 27μm27 \\mu\\text{m}, ensuring precise measurements of molecular interactions within the electrochemical cell."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/electrochemical-investigations-a-modern-approach-to-energy-and-molecular-research/Interference-pattern.jpeg",
        "caption": "Figure 8: IR spectra of the empty electrochemical cell measured in the external reflection mode using a barium fluoride hemispherical window. The layer thickness in this measurement between electrode surface and window is determined to 27 μm."
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "The study of ferrocyanide oxidation through FTIR spectroelectrochemistry exemplifies the power of this combined analytical technique. By monitoring molecular changes in real-time and correlating them with electrochemical potentials, researchers can gain invaluable insights into reaction mechanisms."
      },
      {
        "type": "text",
        "content": "The use of BEING’s BPK-9870A Automatic Kjeldahl Nitrogen Analyzer demonstrated efficient, accurate, and reproducible results in protein analysis for soybeans, reinforcing the method’s reliability and relevance in modern scientific research and industry applications."
      },
      {
        "type": "text",
        "content": "One of the main advantages of this setup is its automation and synchronization. The integration of the potentiostat and spectrometer enables seamless control of experimental parameters, ensuring accurate and reliable data collection. This approach simplifies the monitoring of electrochemical processes, making it a valuable tool for energy research, biochemistry, and catalysis."
      },
      {
        "type": "text",
        "content": "FTIR spectroelectrochemistry stands as a cornerstone of modern scientific investigation, bridging the gap between molecular-level insights and practical applications in energy and beyond."
      },
      {
        "type": "text",
        "content": "Inkarp Instruments, the authorized distributor of Bruker products in India, is renowned as the best distributor and service provider in India for Bruker's Vertex 80 FTIR Spectrometer. Committed to delivering advanced scientific solutions, Inkarp ensures exceptional product quality and reliable support for researchers nationwide."
      },
      {
        "type": "text",
        "content": "[1] C. Berthomieu , L. Marboutin, F. Dupeyrat, P. Bouyer, Biopolymers 2006, 82 (4), 363-367."
      },
      {
        "type": "text",
        "content": "[2] Bruker Product Note M140 - 08/12: A530/P or A530/V Reflection Unit prepared for Electrochemical Cell."
      },
      {
        "type": "text",
        "content": "[3] Bruker Application Note AN40 (D. A. Moss, W. Mäntele): FTIR Spectroelectrochemistry of Proteins;"
      },
      {
        "type": "text",
        "content": "[4] S. R. Domingos, H. Luyten ,F. van Anrooij, H. J. Sanders, B. H. Bakker, W. J. Buma, F. Hartl, S. Woutersen, Rev. Sci. Instrum. 2013, 84, 033103."
      },
      {
        "type": "text",
        "content": "[5] S. M. Rosendahl, F. Borondics, T. E. May, T. M. Pedersen and I. J. Burgess Anal. Chem. 2011, 83 (10), 3632–3639."
      },
      {
        "type": "text",
        "content": "[6] A. Kabbabi, R. Faure, R. Durand, B. Beden, F. Hahn, J.-M. Leger, C. Lamy, J. Electroanal.Chem. 1998, 444, 1–53."
      }
    ],
    "comments": []
  },
  {
    "id": 40,
    "title": "A New Biomarker for NSCLC Immunotherapy: Functional PD-1/PD-L1 Engagement",
    "slug": "a-new-biomarker-for-nsclc-immunotherapy-functional-pd-1-pd-l1-engagement",
    "category": "Industry Insights",
    "date": "2024-12-28",
    "author": "Inkarp Applications Team",
    "readTime": "5 min read",
    "image": "/assets/blogs/BlogTwentySix/hawk-violet-3-qf-pro.jpg",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Immunotherapies for non–small-cell lung carcinoma (NSCLC) have made significant strides in recent years. However, despite considerable success in certain subsets of patients, a substantial proportion of patients do not benefit from these therapies."
      },
      {
        "type": "text",
        "content": "But, a groundbreaking case study by Hawk Biosystems featured in the Journal of Clinical Oncology sheds new light on immunotherapy in non-small cell lung carcinoma (NSCLC). Titled\n“ Functional engagement of the PD-1/PD-L1 complex but not PD-L1 expression is highly predictive of patient response to immunotherapy in NSCLC, ” the findings of the case study suggest that by improving patient selection methods, response rates to immune checkpoint inhibition (ICI) therapies in non-small cell lung carcinoma (NSCLC) could increase by up to 280%."
      },
      {
        "type": "text",
        "heading": "Understanding Immune Checkpoints",
        "content": "Immune checkpoints are receptor-ligand pairs that naturally regulate the immune system to prevent excessive activation, which could lead to autoimmunity. Key immune checkpoints include:"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/a-new-biomarker-for-nsclc-immunotherapy-functional-pd-1-pd-l1-engagement/PD-1-PD-L1-checkpoint.jpeg"
      },
      {
        "type": "text",
        "content": "For instance, the PD-1/PD-L1 checkpoint inhibits immune activity to prevent tissue damage. However, many cancers, including NSCLC, exploit this mechanism by overexpressing PD-L1, effectively evading immune destruction. Therapeutic monoclonal antibodies targeting these interactions have shown promise in reactivating the immune response against tumors. Yet, challenges persist as many patients either do not respond or develop resistance to these therapies due to suboptimal patient selection methods."
      },
      {
        "type": "text",
        "heading": "Current Methods for Patient Selection in ICI Therapy",
        "content": "Presently, NSCLC patients are selected for ICI therapies based on the expression levels of PD-L1 detected using immunohistochemistry (IHC). However, this approach has notable limitations:"
      },
      {
        "type": "text",
        "content": "As a result, patients are often misclassified:"
      },
      {
        "type": "text",
        "heading": "QF-Pro®: Revolutionizing Patient Stratification for ICI Therapies",
        "content": "QF-Pro® addresses these challenges by enabling precise quantification of protein-protein interactions (PPIs) and post-translational modifications (PTMs) using an innovative application of Förster Resonance Energy Transfer (FRET). This technology achieves unprecedented sensitivity and dynamic range, allowing for robust analysis even in pathology samples."
      },
      {
        "type": "text",
        "content": "In the case study, PD-1 and PD-L1 were labeled with donor and acceptor chromophores, respectively. FRET signals, indicative of receptor-ligand interactions, were measured to identify patients most likely to benefit from ICI therapies. Unlike PD-L1 expression, these interactions strongly correlated with patient outcomes."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/a-new-biomarker-for-nsclc-immunotherapy-functional-pd-1-pd-l1-engagement/QF-Pro.jpeg",
        "caption": "Figure 2: QF-Pro® detects FRET between the receptor (PD-1) and ligand (PD-L1) when they are interacting within 1-10nm."
      },
      {
        "type": "text",
        "heading": "Key Findings",
        "content": "A blinded, multi-site analysis of 188 NSCLC patients treated with ICIs revealed the following:"
      },
      {
        "type": "text",
        "content": "This method improved response rates to ICI therapies by up to 280%, addressing both patient under-treatment and over-treatment issues."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/a-new-biomarker-for-nsclc-immunotherapy-functional-pd-1-pd-l1-engagement/PD-1-PD-L1-interaction.jpeg",
        "caption": "Figure 3: High PD-1/PD-L1 interaction state, quantify with QF-Pro® better correlates with enhanced OS in response to immunotherapy than PD-L1 expression. Patients were stratified into two groups: those with high interaction states and those with low interaction states."
      },
      {
        "type": "text",
        "heading": "Implications for Precision Medicine",
        "content": "The QF-Pro® platform represents a paradigm shift in personalized medicine, particularly in NSCLC. By identifying functional biomarkers like PD-1/PD-L1 interaction, it ensures accurate patient stratification, reducing unnecessary treatments and optimizing therapeutic efficacy."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/a-new-biomarker-for-nsclc-immunotherapy-functional-pd-1-pd-l1-engagement/PD-L1-Score.jpeg",
        "caption": "Figure 4: QF-Pro® identifies that 24.44% of NSCLC patients have significant PD-1/PD-L1 interaction state despite showing low PD-L1 scores. These NSCLC patients are currently missed from correct treatment groups."
      },
      {
        "type": "text",
        "heading": "Future Perspectives",
        "content": "The potential of QF-Pro® extends beyond NSCLC. Its application in other immune-oncology domains and fundamental research holds immense promise. HAWK Biosystems seeks collaborations to expand its deployment across larger cohorts and new clinical settings. Researchers and clinicians working on NSCLC, ICI therapies, or other pathological areas are encouraged to explore how QF-Pro® can advance their work."
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "The adoption of QF-Pro® has marked a monumental advancement in the field of personalized medicine. By replacing traditional PD-L1 expression-based stratification with PD-1/PD-L1 interaction analysis, this platform has the potential to significantly enhance patient outcomes in NSCLC and beyond. With its proven ability to accurately stratify patients and improve responserates, QF-Pro® represents a critical tool in the global agenda for precision medicine. HAWK Biosystems invites stakeholders to join in leveraging this technology to maximize its impact on patient care worldwide."
      },
      {
        "type": "text",
        "content": "1. Aldarouish M, Wang C: Trends and advances in tumor immunology and lung cancer immunotherapy. J Exp Clin Cancer Res 35:157, 2016"
      },
      {
        "type": "text",
        "content": "2. Man J, Millican J, Mulvey A, et al: Response rate and survival at key timepoints with PD-1 blockade vs chemotherapy in PD-L1 subgroups: Meta-analysis of metastatic NSCLC trials. JNCI Cancer Spectr 5:pkab012, 2021"
      },
      {
        "type": "text",
        "content": "3. Qin S, Xu L, Yi M, et al: Novel immune checkpoint targets: Moving beyond PD-1 and CTLA-4. Mol Cancer 18155:155, 2019"
      },
      {
        "type": "text",
        "content": "4. Gridelli C, Ardizzoni A, Barberis M, et al: Predictive biomarkers of immunotherapy for non-small cell lung cancer: Results from an experts panel meeting of the\nItalian association of thoracic oncology. Transl Lung Cancer Res 6:373-386, 2017"
      },
      {
        "type": "text",
        "content": "5. Savic Prince S, Bubendorf L: Predictive potential and need for standardization of PD-L1 immunohistochemistry. Virchows Arch 474:475-484, 2019"
      },
      {
        "type": "text",
        "content": "6. Niu M, Yi M, Li N, et al: Predictive biomarkers of anti-PD-1/PD-L1 therapy in NSCLC. Exp Hematol Oncol 10:18, 2021"
      },
      {
        "type": "text",
        "content": "7. Veeriah S, Leboucher P, de Naurois J, et al: High-throughput time-resolved FRET reveals Akt/PKB activation as a poor prognostic marker in breast cancer.\n\nCancer Res 74:4983-4995, 2014"
      },
      {
        "type": "text",
        "content": "8. Miles J, Applebee CJ, Leboucher P, et al: Time resolved amplified FRET identifies protein kinase B activation state as a marker for poor prognosis in clear cell renal cell carcinoma.\n\nBBA Clin 8:97-102, 2017"
      },
      {
        "type": "text",
        "content": "9. Sanchez-Magraner L, Miles J, Baker CL, et al: High PD-1/PD-L1 checkpoint interaction infers tumor selection and therapeutic sensitivity to anti-PD-1/PD-L1\ntreatment. Cancer Res 80:4244-4257, 2020"
      },
      {
        "type": "text",
        "content": "10. Sanchez-Magraner L, de la Fuente M, Evans C, et al: Quanti fication of PD-1/PD-L1 interaction between membranes from PBMCs and melanomasamplesusing cell membrane microarray and time-resolved forster resonance energy transfer. Analytica 2:156-170, 2021"
      },
      {
        "type": "text",
        "content": "11. Budczies J, Klauschen F, Sinn BV, et al: Cutoff finder: A comprehensive and straightforward webapplication enabling rapid biomarker cutoff optimization. PLoS\n\nOne7:e51862, 2012"
      }
    ],
    "comments": []
  },
  {
    "id": 41,
    "title": "Temperature Modulated DSC: Principles, Applications, and Measurement Examples",
    "slug": "temperature-modulated-dsc-principles-applications-and-measurement-examples",
    "category": "Industry Insights",
    "date": "2024-12-27",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/Hitachi/differential-scanning-calorimeter-dsc-nexta-dsc-series.jpg",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "The conventional Differential Scanning Calorimetry (DSC) method measures heat f low and temperature variations, such as glass transition, crystallization, or melting, by detecting differences in heat flow between a sample and a reference material during heating or cooling at a constant rate. On the other hand, AC calorimetry measures the specific heat capacity of a sample by analyzing the oscillation in its temperature when periodically heated. This method has been widely used for specific heat capacity measurements."
      },
      {
        "type": "text",
        "content": "Temperature Modulated DSC (TM-DSC) combines the periodic temperature control used in AC calorimetry with the constant rate temperature control of traditional DSC. This hybrid method allows simultaneous acquisition of specific heat capacity data (referred to as the Reversing Heat Flow) and conventional DSC data. While the Total Heat Flow represents the data from standard DSC measurements, subtracting the Heat Capacity Component from the Total Heat Flow yields the Kinetic Component (Non-Reversing Heat Flow)."
      },
      {
        "type": "text",
        "content": "This article introduces the principles of TM-DSC and explores its applications."
      },
      {
        "type": "text",
        "heading": "Principle",
        "content": "In traditional DSC, heat flow differences (ΔQ\\Delta Q) between the sample and reference material are measured during constant-rate heating. TM-DSC modifies this by introducing sinusoidal temperature modulation superimposed on linear heating, raising the sample temperature at an average constant rate through repeated short-term heating and cooling cycles (Figure 1)."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/temperature-modulated-dsc-principles-applications-and-measurement-examples/Temperature-curve-and-DSC-signal-for-TM-DSC.jpg",
        "caption": "Temperature curve and DSC signal for TM-DSC"
      },
      {
        "type": "text",
        "content": "By reversing the time variable, the equation separates the Heat Capacity and Kinetic Components. These components can be extracted through data analysis using Fourier Transform and contour integration, as illustrated in Figure 2."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/temperature-modulated-dsc-principles-applications-and-measurement-examples/DSC-data-of-Temperature-Modulated-measurement.jpg",
        "caption": "DSC data of Temperature Modulated measurement"
      },
      {
        "type": "text",
        "heading": "Features",
        "content": "TM-DSCoffers several advantages over conventional DSC, including:"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/temperature-modulated-dsc-principles-applications-and-measurement-examples/Classification-of-DSC-Measurement-Phenomena.jpg",
        "caption": "Classification of DSC Measurement Phenomena"
      },
      {
        "type": "text",
        "content": "This method is particularly beneficial for analyzing complex thermal behaviors, such as overlapping glass transitions, curing reactions, or phenomena influenced by thermal history."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/temperature-modulated-dsc-principles-applications-and-measurement-examples/TM-DSC-measurement-of-amorphous-PET.jpg",
        "caption": "TM-DSC measurement of amorphous PET"
      },
      {
        "type": "text",
        "heading": "Amorphous Polyethylene Terephthalate (PET)",
        "content": "In amorphous PET, TM-DSC detects glass transition (75–82°C), cold crystallization (132°C), and melting (256°C) in the Total Heat Flow. The glass transition and melting appear in the Heat Capacity Component, while cold crystallization and melting are evident in the Kinetic Component."
      },
      {
        "type": "text",
        "heading": "Glass Transition with Enthalpy Relaxation",
        "content": "For cured epoxy resin, enthalpy relaxation may overlap with the glass transition, appearing as a broad endothermic peak. TM-DSC effectively separates the glass transition (Heat Capacity Component) from the enthalpy relaxation (Kinetic Component), enabling accurate identification."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/temperature-modulated-dsc-principles-applications-and-measurement-examples/TM-DSC-measurement-of-glass-transition-with-enthalpy-relaxation.jpg",
        "caption": "TM-DSC measurement of glass transition with enthalpy relaxation"
      },
      {
        "type": "text",
        "heading": "Curing Reaction of Thermoset Polymer",
        "content": "For uncured epoxy resin, the glass transition (~70°C) and curing reaction (~180°C) overlap in the Total Heat Flow. TM-DSC isolates the curing reaction in the Kinetic Component, providing precise thermal behavior analysis."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/temperature-modulated-dsc-principles-applications-and-measurement-examples/TM-DSC-measurement-of-epoxy-resin--uncured-sample-.jpg",
        "caption": "TM-DSC measurement of epoxy resin (uncured sample)"
      },
      {
        "type": "text",
        "heading": "Immiscible Polymer Blends",
        "content": "In a PET-PC blend, overlapping cold crystallization (PET) and glass transition (PC) hinder conventional DSC analysis. TM-DSC separates these transitions, attributing the glass transition to the Heat Capacity Component and cold crystallization to the Kinetic Component."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/temperature-modulated-dsc-principles-applications-and-measurement-examples/TM-DSC-measurement-of-PET-and-PC-polymer-blend.jpg",
        "caption": "TM-DSC measurement of PET and PC polymer"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/temperature-modulated-dsc-principles-applications-and-measurement-examples/TM-DSC-measurement-of-nylon-fiber.jpg",
        "caption": "TM-DSC measurement of nylon fiber"
      },
      {
        "type": "text",
        "heading": "Vaporization in Nylon Fibers",
        "content": "Nylon, with its hydrophilic amide groups, absorbs moisture, leading to overlapping vaporization and glass transition signals. TM-DSC distinctly identifies the glass transition in the Heat Capacity Component while attributing vaporization to the Kinetic Component."
      },
      {
        "type": "text",
        "heading": "Crystal Polymorphism in Pharmaceuticals",
        "content": "In pharmaceuticals, crystal polymorphism presents complex thermal behavior. TM-DSC identifies transitions like metastable crystal fusion and stable crystal melting by separating reversible and irreversible thermal phenomena, enabling detailed phase behavior analysis."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/temperature-modulated-dsc-principles-applications-and-measurement-examples/TM-DSC-measurement-of-crystal-polymorphism.jpg",
        "caption": "TM-DSC measurement of crystal polymorphism"
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "TM-DSC enhances traditional DSC by offering detailed separation of thermal transitions into Heat Capacity and Kinetic Components. This enables more precise analysis of complex materials, improving efficiency and accuracy in thermal characterization."
      },
      {
        "type": "text",
        "content": "References\n- Hitachi"
      }
    ],
    "comments": []
  },
  {
    "id": 42,
    "title": "Analysis of Feed Ingredients with FT-NIR Spectrometer",
    "slug": "analysis-of-feed-ingredients-with-ft-nir-spectrometer",
    "category": "Industry Insights",
    "date": "2024-12-26",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/Bruker/tango-ii-ft-nir-spectrometer.png",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "The cost of animal nutrition constitutes the most significant operating expense for the majority of commercial livestock producers. Achieving an optimal balance between feed costs and livestock productivity requires a thorough analysis of all feed ingredients for nutrient concentration. These analyses are then employed to formulate precise rations and supplements. However, feedstuffs can vary widely in composition due to factors such as their geographic origin, seasonal fluctuations, or annual changes."
      },
      {
        "type": "text",
        "content": "To address these challenges, Fourier Transform Near Infrared Spectroscopy (FT-NIR) provides a rapid and effective solution for analyzing raw materials and finished feeds. This technology facilitates the optimization of production steps and ensures the consistent monitoring of final product quality, making it an indispensable tool in modernanimal nutrition management."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/analysis-of-feed-ingredients-with-ft-nir-spectrometer/Livestock-Feed.jpg",
        "caption": "Livestock Feed"
      },
      {
        "type": "text",
        "heading": "Easy Sample Analysis with FT-NIR",
        "content": "Bruker Optics offers a comprehensive range of FT-NIR solutions tailored to quality control and formulation adjustments. The non-destructive nature of FT-NIR allows samples to be analyzed within seconds, significantly reducing costs associated with time and reagent use."
      },
      {
        "type": "text",
        "content": "FT-NIR can be seamlessly integrated into laboratory or at-line processes near production facilities. For solid samples, an easy-to-clean cup is filled and presented to the analyzer. Liquid samples, such as oils or molasses, can be analyzed using disposable vials, offering versatility across diverse feed types."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/analysis-of-feed-ingredients-with-ft-nir-spectrometer/Bruker-TANGO-FT-NIR-Spectrometer.jpg",
        "caption": "Bruker TANGO FT-NIR Spectrometer"
      },
      {
        "type": "text",
        "content": "Bruker TANGO FT-NIR Spectrometer"
      },
      {
        "type": "text",
        "heading": "Ready-to-Use Calibration Packages",
        "content": "Bruker’s FT-NIR systems come with a suite of universal calibration packages designed for the feed industry. These calibrations support superior quality control, ultimately enhancing product performance."
      },
      {
        "type": "text",
        "content": "FT-NIR spectroscopy enables rapid, accurate, and non-destructive analysis of key feed parameters, including:"
      },
      {
        "type": "text",
        "content": "Additionally, specialized parameters such as starch, total sugar, Acid Detergent Fiber (ADF), and Neutral Detergent Fiber (NDF) can be evaluated when applicable. For advanced needs, Bruker’s FT-NIR instruments are compatible with third-party calibration packages and specialized services, such as the analysis of amino acids in feed ingredients."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/analysis-of-feed-ingredients-with-ft-nir-spectrometer/Sunflower-Protein-Content.jpg",
        "caption": "Sunflower: Protein Content"
      },
      {
        "type": "text",
        "content": "Sunflower: Protein Content"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/analysis-of-feed-ingredients-with-ft-nir-spectrometer/Wheat-Moisture-Content.jpg",
        "caption": "Wheat: Moisture Content"
      },
      {
        "type": "text",
        "content": "Wheat: Moisture Content"
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "Animal nutrition is a critical component of livestock production, and the accuracy of feed analysis directly impacts operational efficiency and productivity. FT-NIR spectroscopy, with its rapid, non-destructive, and precise analytical capabilities, empowers producers to manage feed variability effectively. By leveraging Bruker’s FT-NIR solutions, livestock producers can enhance their quality control processes, reduce operational costs, and maintain the nutritional balance necessary for optimal livestock performance. The availability of ready-to-use calibration packages further simplifies adoption, enabling producers to achieve consistent and reliable results across diverse feed materials. As the agricultural industry continues to prioritize efficiency and sustainability, FT-NIR technology stands out as a pivotal tool for ensuring excellence in animal nutrition management."
      }
    ],
    "comments": []
  },
  {
    "id": 43,
    "title": "Minimizing LCMS Artifacts Using Arium® Ultrapure Water Systems",
    "slug": "minimizing-lcms-artifacts-using-arium-ultrapure-water-systems",
    "category": "Industry Insights",
    "date": "2024-12-25",
    "author": "Inkarp Applications Team",
    "readTime": "7 min read",
    "image": "/assets/images/productImages/Sotorius/arium-mini-plus-lab-water-purification-system.png",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Liquid Chromatography-Mass Spectrometry (LCMS) is a sophisticated analytical technique that seamlessly integrates the separation capabilities of liquid chromatography with the precise identification and quantification abilities of mass spectrometry. LCMS has become indispensable in modern analytical chemistry, f inding extensive application across diverse scientific domains such as pharmaceuticals, environmental analysis, food safety, metabolomics, proteomics, and forensic science."
      },
      {
        "type": "text",
        "content": "In achieving analytical excellence, ultrapure water plays a pivotal role in LCMS applications. Ultrapure water, conforming to ASTM Type I specifications, underpins the entire analytical workflow, ensuring precision, reliability, and accuracy in results. Mitigating the challenges posed by water impurities, including organic compounds, bacteria, and ions, is essential for achieving optimal performance in both chromatography and mass spectrometry. By employing advanced water purification systems like the Arium® Mini UV, scientists and laboratory technicians can access ultrapure water of exceptional quality, thereby enhancing the sensitivity and reliability of analytical outcomes."
      },
      {
        "type": "text",
        "content": "This article delves into the critical importance of ultrapure water in LCMS, examines the impact of water impurities on chromatographic performance, and highlights the advantages of using state-of-the-art water purification systems to ensure consistent, reliable, and precise analytical results."
      },
      {
        "type": "text",
        "heading": "Organic Compounds",
        "content": "Organic compounds in the mobile phase are among the most significant contaminants in liquid chromatography applications. When present, these compounds compete with analytes for binding sites on the stationary phase. This competition diminishes analyte retention on the column, thereby reducing method sensitivity."
      },
      {
        "type": "text",
        "content": "Over time, organic compounds can accumulate on the column surface, obstructing analyte and solvent access to active sites and leading to mass transfer inefficiencies and a loss of resolution. If such contaminants concentrate at the column's head, they may cause ghost peaks, interfering with the separation process. In severecontamination scenarios, organic compounds may form a pseudo-stationary phase, resulting in peak tailing, retention time shifts, and compromised analytical accuracy."
      },
      {
        "type": "text",
        "heading": "Bacterial Contamination",
        "content": "Bacteria and residual biofilms in water can obstruct columns and frits, causing flow irregularities and degraded chromatographic performance. Organic by-products produced by bacteria, such as pyrogens, nucleases, or alkaline phosphatase, can induce chromatographic disturbances, adversely affecting the accuracy, precision, and reproducibility of results. These contaminants also compromise the stability and longevity of the chromatographic column."
      },
      {
        "type": "table",
        "columns": [
          "",
          "Conductivity [µSxcm-1]",
          "Resistivity [MΩ x cm]",
          "TOC [ppb]",
          "Endotoxin [EU x ml-1]",
          "Bacteria [CFC x mL-1"
        ],
        "rows": [
          [
            "Arium® Mini UV",
            "0.055",
            "18.2",
            "≤5",
            "0.001",
            "0.001"
          ]
        ]
      },
      {
        "type": "text",
        "heading": "Inorganic Contamination",
        "content": "Excessive alkali ions and other inorganic impurities can introduce noise and skew results in LCMS analysis. To mitigate these risks, it is recommended to replace mobile phases rather than topping them off, thereby preventing the accumulation of contaminants in supply bottles. Prolonged exposure of mobile phases to air can also lead to phthalate contamination, underscoring the necessity for a clean and controlled environment."
      },
      {
        "type": "text",
        "content": "Ionic impurities in water can alter the ionic strength of a solution, impacting specific chromatographic separations. Changes in ionic strength influence conductivity, osmotic pressure, and the behavior of charged species, thereby affecting overall chromatographic performance."
      },
      {
        "type": "text",
        "heading": "Advantages of Water Purification Systems",
        "content": "Commercially available LCMS-grade bottled water may yield suboptimal results due to contamination during production or inadequate bottle handling. For sensitive LCMS applications, the use of freshly produced, high-quality ultrapure water is crucial to ensuring accurate and reliable outcomes."
      },
      {
        "type": "text",
        "content": "Sartorius’ Arium® Mini UV systems deliver ultrapure water meeting ASTM Type I standards with attributes such as high resistivity, low Total Organic Carbon (TOC) levels, and minimal bacterial content. These systems ensure the highest water purity, enabling reliable and accurate chromatographic data."
      },
      {
        "type": "text",
        "heading": "Total Organic Carbon (TOC)",
        "content": "TOC serves as a practical indicator of organic contamination in water. This method oxidizes organic substances and measures the resultant products to determine contamination levels."
      },
      {
        "type": "text",
        "heading": "Ultraviolet Radiation",
        "content": "UV radiation is a key mechanism in breaking down and oxidizing organic compounds. A wavelength of 185 nm effectively disintegrates carbon-containing molecules, producing ionized fragments removable by ion exchange. Additionally, UV light inactivates microorganisms by damaging their RNA and DNA, ensuring water purity."
      },
      {
        "type": "text",
        "content": "Arium® Mini UV systems utilize full-spectrum UV lamps to maximize organic molecule breakdown, ensuring water quality suitable for high-performance liquid chromatography applications."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/minimizing-lcms-artifacts-using-arium-ultrapure-water-systems/Arium-Mini-UV-Ultrapure-Water-Systems.jpg",
        "caption": "Arium® Mini UV Ultrapure Water Systems"
      },
      {
        "type": "text",
        "content": "Arium® Mini UV Ultrapure Water Systems"
      },
      {
        "type": "text",
        "heading": "Materials and Methods",
        "content": "Feasibility studies conducted at Sartorius Bohemia, NY, USA, evaluated the impact of various water sources on LCMS performance. A DG44 CHO-cell mAb production process was carried out using the Sartorius Ambr® 15 platform, followed by analysis with the Waters BioAccord™ LCMS System. Samples were processed using Arium® ultrapure water, commercially available LCMS-grade bottled water, and in-house utilities deionized (DI) water."
      },
      {
        "type": "text",
        "content": "The findings revealed that both Arium® ultrapure water and LCMS-grade bottled water displayed comparable chromatographic profiles with consistent peak shapes and baseline stability. In contrast, in-house DI water exhibited elevated backgroundlevels and lower peak intensities, indicating the presence of impurities. Mass spectral analysis further identified specific contaminants in DI and bottled water samples, reinforcing the need for ultrapure water for LCMS applications."
      },
      {
        "type": "text",
        "heading": "Compact and Reliable",
        "content": "The Arium®MiniUVsystemisdesigned to meettheultrapure water requirements of smaller laboratories, offering a daily output of 10 liters from either tap or pre-treated water. Its compact design (28 cm width) makes it suitable for labs with space constraints. Equipped with user-friendly displays and innovative bag-tank technology, the system ensures reliable results for routine and critical analyses alike."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/minimizing-lcms-artifacts-using-arium-ultrapure-water-systems/Arium-Mini-UV-Ultrapure-Water-Systems2.png",
        "caption": "Arium® Mini UV Ultrapure Water Systems"
      },
      {
        "type": "text",
        "content": "Arium® Mini UV Ultrapure Water Systems"
      },
      {
        "type": "table",
        "columns": [
          "Water Condotions",
          "Water Source",
          "Stated Resistivity"
        ],
        "rows": [
          [
            "1",
            "Arium® Mini UV",
            ">18 MΩ"
          ],
          [
            "2",
            "Utilities USP Water",
            ">18 MΩ"
          ],
          [
            "3",
            "Commercial LCMS Bottled Water",
            "Not Stated"
          ]
        ]
      },
      {
        "type": "table",
        "columns": [
          "Results LC Conditions",
          ""
        ],
        "rows": [
          [
            "Results LC System",
            "Water ACQUITYTM Premier System"
          ],
          [
            "Detection",
            "TUV"
          ],
          [
            "Column",
            "2.1 x 100 mm BioResolveTM RP Polyphenyl"
          ],
          [
            "Column Temp",
            "60 0C"
          ],
          [
            "Sample Temp",
            "8 0C"
          ],
          [
            "Injection Volume",
            "5µL"
          ],
          [
            "Flow Rate",
            "0.4mL/min"
          ],
          [
            "Mobile Phase A",
            "H2O, 0.1% Formic Acid (Range of Conditions)"
          ],
          [
            "Mobile Phase B",
            "Acetonitrile, 0.1% Formic acid"
          ],
          [
            "MS Conditions",
            ""
          ],
          [
            "MS System",
            "Water ACQUITY RDaTM"
          ],
          [
            "lonization Mode",
            "Positive"
          ],
          [
            "Acquisition Range",
            "500 - 7,000 m/z"
          ],
          [
            "Capillary Voltage",
            "1.5 kV"
          ],
          [
            "Collision Energy",
            "NA"
          ],
          [
            "Cone Viltage",
            "95 V"
          ]
        ]
      },
      {
        "type": "text",
        "heading": "Results",
        "content": "The water sources used in the analysis included freshly opened LCMS-grade bottled water, known for its high purity, and Arium®-water, which adheres to strict quality standards. The performance of in-house deionized (DI) water (USP), a common and cost-effective water source in laboratory settings, was also evaluated."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/minimizing-lcms-artifacts-using-arium-ultrapure-water-systems/arium-mini-Figure-1.jpg",
        "caption": "Figure 1: Total Ion Chromatogram (TIC; 1; TOF MS (400 – 7000), 95 V ESI+), Mass Spectral Data (2; Average Time 2.1751 min,\nTOF MS (400 – 7000), 95 V ESI+: Combined) From a Monoclonal Antibody Sample And UV Traces (3; Channel Name: TUV 280)"
      },
      {
        "type": "text",
        "content": "The data analysis revealed some notable trends. Both LCMS-grade bottled water and Arium®-water showed similar chromatographic profiles, with comparable peak shapes and stable baselines, indicating that these high-purity water sources perform consistently and effectively in LCMS analysis. However, when in-house DI water (USP)was used, the chromatographic profiles showed a significantly higher background level, suggesting the presence of impurities or contaminants such as TOC, inorganic substances, and bacterial contamination. Additionally, a slight variation in peak area was observed, highlighting the potential impact of water quality on chromatographic accuracy and reliability."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/minimizing-lcms-artifacts-using-arium-ultrapure-water-systems/arium-mini-Figure-2.jpg",
        "caption": "Figure 2: Extracted Mass Chromatogram of Retention Time ~1.6–1.7 Min (Light Chain Peak, 1) And Zoomed in Spectra (2);\nAverage Time 2.1168 min, TOF MS (400 – 7000), 95 V ESI+: Combined."
      },
      {
        "type": "text",
        "content": "The peak at around 1.61 minutes corresponds to free Light Chain in the sample and was visible across all water conditions. This is typical for unpurified cell-culture samples, as the Protein A purification step was excluded, allowing other proteins to remain in the solution. The larger peak at around 2.08 minutes corresponds to the complete monoclonal antibody (mAb), which was clearly differentiated in all water conditions. While Arium®-water and bottled water showed similar curves, the USP water resulted in a lower peak intensity and higher background absorbance."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/minimizing-lcms-artifacts-using-arium-ultrapure-water-systems/arium-mini-Figure-3.jpg",
        "caption": "Figure 3: Total Ion Chromatogram (TIC; 1, TOF MS (400 – 7000), 95 V ESI+) And Mass Spectrum From a Monoclonal\nAntibody Sample Prepared With Arium®-water (Average Time 2.1418 min (UV3) and 2.1668 min (PERF), 2, TOF MS\n(400 – 7000), 95 V ESI+: Combined)."
      },
      {
        "type": "text",
        "content": "Further analysis of the mass spectra of the free light chain in solution revealed a potential contaminant in the lower m/z range of some samples. Upon closer inspection, this contaminant was only present in the USP and bottled water mobile phase samples. The isotopic abundances of the ion were consistent with a molecular formula of C24H19N6O2Cl2. Although the exact structure was not determined, the difference in abundance was clearly noticeable."
      },
      {
        "type": "text",
        "content": "Due to its proven performance and reliability, Arium®-water was fully implemented in the Sartorius upstream laboratory for LCMS applications. Figure 3 shows the intact mass results from a perfusion CHO cell culture, with samples taken both from inside the bioreactor and from the perfusate path (PERF)."
      },
      {
        "type": "text",
        "content": "The data reveals small differences in relative glycoform abundance between the two samples, with minimal background noise, making the results easy to interpret."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/minimizing-lcms-artifacts-using-arium-ultrapure-water-systems/arium-mini-Figure-4.jpg",
        "caption": "figure 4. Comparison of Expenses Between In-House Produced Arium®-water Type I (Ultrapure Water) and Bottled Water(LCSM grade With PFAS Content Below Detection Limit)"
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "This study underscores the critical role of water quality in LCMS applications. Inadequate water sources, such as in-house DI water or improperly handled bottled LCMS-grade water, can introduce contaminants that compromise the accuracy and reliability of analytical results. The use of advanced water purification systems, such as the Arium® Mini UV, ensures ultra-pure water that meets stringent quality standards, enhancing chromatographic performance and laboratory efficiency."
      },
      {
        "type": "text",
        "content": "nvesting in in-house water purification systems is not only scientifically advantageous but also economically beneficial. Over a year, laboratories using Arium® systems can achieve significant cost savings while ensuring superior data quality. By prioritizing ultrapure water, laboratories can achieve precise, reliable, and reproducible results, cementing the foundation for advanced analytical research and applications."
      },
      {
        "type": "text",
        "content": "1. Williams, S. Ghost peaks in reversed-phase gradient HPLC: a review and update. Journal of chromatography. A 1052, 1–11; 10.1016/j.chroma.2004.07.110 (2004)."
      },
      {
        "type": "text",
        "content": "2. Bendlin, H. & Eßmann, M. Reinstwasser. Planung, Realisierung, Qualifizierung von Reinstwassersystemen. 1st ed. (Maas & Peither GMP-Verl., Schopfheim, 2004)."
      },
      {
        "type": "text",
        "content": "3. Choi, J. & Chung, J. Effect of dissolved oxygen on efficiency of TOC reduction by UV at 185 nm in an ultrapure water production system. Water research 154, 21–27; 10.1016/j.watres.2019.01.037 (2019)."
      },
      {
        "type": "text",
        "content": "4. Pereira, R. V. et al. Evaluation of the effects of ultraviolet light on bacterial contaminants inoculated into whole milk and colostrum, and on colostrum immunoglobulin G. Journal of dairy science 97, 2866–2875; 10.3168/ jds.2013-7601 (2014)."
      }
    ],
    "comments": []
  },
  {
    "id": 44,
    "title": "Accurate And Precise Spike-In Method For Ctc Validation Studies With Cellenone®",
    "slug": "accurate-and-precise-spike-in-method-for-ctc-validation-studies-with-cellenone",
    "category": "Industry Insights",
    "date": "2024-12-24",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/cellenONE-product.png",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "The analysis of circulating tumor cells (CTCs) from a simple blood draw holds significant promise for cancer diagnostics and monitoring treatment progress. Given the extreme rarity of CTCs—often occurring at a rate of just 1 CTC per 10 billion red blood cells—advanced technologies like RareCyte's AccuCyte®- CyteFinder® system are essential. This system offers exceptional sensitivity and specificity while delivering a consistent and comprehensive workflow."
      },
      {
        "type": "text",
        "content": "Accurate, precise, and reproducible CTC detection is crucial for diagnostics and clinical trials, necessitating thorough assay validation. To validate enumeration accuracy, it is essential to create surrogate blood samples containing known quantities of model CTCs (mCTCs) at levels close to the assay's detection limit. Achieving this requires precise and reproducible spike-in samples, a task that cannot be reliably accomplished using serial dilution or flow cytometry methods."
      },
      {
        "type": "text",
        "heading": "CellenONE®: Transforming Single-Cell Isolation and Dispensing",
        "content": "Developed by Cellenion, the cellenONE® instrument is an advanced single-cell isolation and dispensing technology that uses automated image recognition to ensure each droplet contains precisely one cell. While the primary applications of cellenONE are in single-cell analyses and cell line development, Cellenion and RareCyte have collaborated to extend its use to a novel domain: circulating tumor cell (CTC) assay validation. This collaboration demonstrates how RareCyte employs cellenONE to generate critical samples for CTC assay validation, establishing it as the preferred system for mCTC sample preparation."
      },
      {
        "type": "text",
        "heading": "Methods",
        "content": "A customized sample deck was engineered for cellenONE to facilitate precise cell deposition on both microscope slides and RareCyte’s AccuCyte Blood Collection Tubes (BCTs) containing 7.5 ml of whole blood (Figure 1).\n\nFigure 1. 5-step CTC enumeration validation workflow. Dispense cells with cellenONE onto slides and into BCT;\nprocess BCT to slides with AccuCyte system; stain slides with RarePlex® Enumeration Panel Kit; image and analyze with CyteFinder Instrument to count CTCs."
      },
      {
        "type": "text",
        "content": "The cellenONE was programmedtodispense:"
      },
      {
        "type": "text",
        "content": "Blood samples were subsequently processed onto slides using the AccuCyte system. After processing, mCTCs (model CTCs) on all slides were counted using RareCyte’s CTCenumeration assay."
      },
      {
        "type": "text",
        "heading": "Results and Discussion",
        "content": "The cellenONE instrument enabled the deposition of known numbers of cells with exceptional accuracy and precision, supporting standardized sample preparation for assay validation studies."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/accurate-and-precise-spike-in-method-for-ctc-validation-studies-with-cellenone/mCTCs.jpg",
        "caption": "Image of 100 mCTCs printed to a slide"
      },
      {
        "type": "text",
        "content": "Figure A. HAP-1 mCTC spike-in assay."
      },
      {
        "type": "text",
        "content": "Figure B. SW900 mCTC spike-in assay. Scale bar represents 5 μm."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/accurate-and-precise-spike-in-method-for-ctc-validation-studies-with-cellenone/100-mCTCs.jpg",
        "caption": "mCTC count for slides printed with 100 mCTCs"
      },
      {
        "type": "text",
        "content": "Single-Cell Dispensing Accuracy:\nThe system’s accuracy was confirmed by directly printing single cells onto slides, as shown in Table 1."
      },
      {
        "type": "text",
        "content": "Spike-In Studies:\nThe cellenONE was then employed to spike limiting numbers of mCTCsintoblood tubes. When processed with the RareCyte CTC assay, these samples demonstrated remarkable recovery rates, as detailed in Table 2."
      },
      {
        "type": "text",
        "content": "The cellenONE method provided a reproducible solution for dispensing clinically relevant quantities of cells, which is critical for robust assay validation."
      },
      {
        "type": "table",
        "columns": [
          "Replicate",
          "Print #",
          "mCTC count"
        ],
        "rows": [
          [
            "1",
            "100",
            "100"
          ],
          [
            "2",
            "100",
            "100"
          ],
          [
            "3",
            "100",
            "100"
          ],
          [
            "4",
            "100",
            "100"
          ],
          [
            "5",
            "100",
            "99"
          ],
          [
            "6",
            "100",
            "99"
          ],
          [
            "7",
            "100",
            "100"
          ],
          [
            "8",
            "100",
            "99"
          ],
          [
            "Total",
            "800",
            "797"
          ],
          [
            "Recovery",
            "",
            "0.99"
          ]
        ]
      },
      {
        "type": "table",
        "columns": [
          "Replicate",
          "Spike-in #",
          "mCTC count"
        ],
        "rows": [
          [
            "1",
            "8",
            "8"
          ],
          [
            "2",
            "5",
            "5"
          ],
          [
            "3",
            "5",
            "5"
          ],
          [
            "4",
            "5",
            "4"
          ],
          [
            "5",
            "5",
            "5"
          ],
          [
            "6",
            "5",
            "4"
          ],
          [
            "7",
            "5",
            "5"
          ],
          [
            "8",
            "5",
            "5"
          ],
          [
            "9",
            "6",
            "6"
          ],
          [
            "Total",
            "49",
            "47"
          ],
          [
            "Recovery",
            "",
            "0.99"
          ]
        ]
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "In clinical diagnostics, accuracy, precision, and reproducibility are non-negotiable. RareCyte, known for its high-performance CTC assays, ensures rigorous validation processes to meet these demands."
      },
      {
        "type": "text",
        "content": "For accuracy validation studies, RareCyte required a system capable of reliably dispensing single mCTCs with unparalleled precision. Existing methods like flow cytometry and serial dilution assays fell short in achieving high accuracy for single-digit cell deposition."
      },
      {
        "type": "text",
        "content": "The cellenONE system fulfilled these requirements, making it an integral component of RareCyte’s validation process for every commercially developed CTC assay. By leveraging cellenONE technology, RareCyte has elevated its assay validation standards, ensuring consistency and reliability in clinical diagnostics."
      },
      {
        "type": "text",
        "content": "References\n- RareCyte"
      }
    ],
    "comments": []
  },
  {
    "id": 45,
    "title": "Determination of Protein Content in Soybeans Using the Kjeldahl Method",
    "slug": "determination-of-protein-content-in-soybeans-using-the-kjeldahl-method",
    "category": "Industry Insights",
    "date": "2024-12-23",
    "author": "Inkarp Applications Team",
    "readTime": "4 min read",
    "image": "/assets/images/productImages/Buchi/K-375.webp",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "The Kjeldahl method, developed by Johan Kjeldahl at the Carlsberg Laboratory in Copenhagen, was originally designed for the brewing industry. However, its applications have since expanded significantly and are now widely used to determine nitrogen levels in various organic substances. These include foods, beverages, meat, agricultural products, animal feed, environmental water and soil samples, biological materials, dairy products, and pharmaceuticals."
      },
      {
        "type": "text",
        "content": "Despite advancements and automation in the Kjeldahl method for total nitrogen determination, its fundamental principles have remained unchanged. The method comprises three primary steps: digestion, distillation, and titration. The process begins by converting the organic nitrogen in a sample into measurable ammonium ions, followed by titration analysis to determine protein content. Protein content is expressed as a percentage, calculated by multiplying the nitrogen result by a conversion factor derived from the average nitrogen content of proteins."
      },
      {
        "type": "text",
        "content": "This article focuses on the determination of protein content in soybeans using BEING’s BPK-9870A Automatic Kjeldahl Nitrogen Analyzer, showcasing its precision and efficiency in modern protein analysis."
      },
      {
        "type": "text",
        "heading": "Soybeans and Their Nutritional Significance",
        "content": "Soybeans (Glycine max (L.) Merr.), a leguminous crop originally cultivated in China, were introduced to India for commercial production in the late 1960s. Within a decade, soybeans became a significant contributor to India’s oilseed production. They are consumed in various forms, including fermented foods (miso, tempeh, natto, soy sauce) and unfermented foods (tofu, soymilk, edamame, soy nuts, and sprouts)."
      },
      {
        "type": "text",
        "content": "Soybeans are renowned for their high nutritional value, serving as an excellent source of plant-based protein and oil. On average, they contain 40–50% protein and 18% oil, along with bioactive compounds like isoflavones, phytic acid, and saponins. Soybean proteins are classified based on their solubility into albumins (water-soluble), globulins (salt-soluble), glutelins (dilute acid/alkali-soluble), and prolamins (alcohol-soluble)."
      },
      {
        "type": "text",
        "content": "Efficient and accurate evaluation of protein content in food products is essential for assessing their nutritional and economic value."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/determination-of-protein-content-in-soybeans-using-the-kjeldahl-method/Determination-of-Protein.jpg",
        "caption": "BEING’s BPK-9870A Automatic Kjeldahl Nitrogen Analyzer"
      },
      {
        "type": "text",
        "content": "BEING’s BPK-9870A Automatic Kjeldahl Nitrogen Analyzer"
      },
      {
        "type": "text",
        "heading": "1. Sampling",
        "content": "Nine varieties of soybeans were collected, and analyses were performed in triplicate to ensure accuracy."
      },
      {
        "type": "text",
        "heading": "2. Methodology",
        "content": "Protein content determination was carried out using the BEING\nBPK-9870A Automatic Kjeldahl Nitrogen Analyzer. The chemicals used were sourced from Sigma Aldrich and required no further purification. Approximately 0.5 g of each soybean variety was weighed and placed into 250 mL digestion tubes. Each tube received 20 mL of concentrated sulfuric acid and two catalyst tablets, each containing 5 g of potassium sulfate (K₂SO₄) and 0.5 g of copper sulfate pentahydrate (CuSO₄·5H₂O)."
      },
      {
        "type": "text",
        "content": "The digestion process was conducted at 400°C for three hours using a BRJX-8B Digestion System. Following digestion, samples were neutralized in a BZH-1B Acid-Alkali Neutralization Unit. Sodium hydroxide (32% NaOH) was added to the neutralized samples, and the resulting ammonia was distilled using the BPK-9870A Automatic Kjeldahl Nitrogen Analyzer. The distillate was collected in a known volume of standardized 0.1 N sulfuric acid (H₂SO₄)."
      },
      {
        "type": "text",
        "content": "Nitrogen content was then determined through titration with a standardized 0.1 N hydrochloric acid (HCl) solution, using a mixture of bromocresol green and methyl red as indicators. The crude protein content was calculated by multiplying the nitrogen content by the universally accepted conversion factor of 6.25. This factor assumes that proteins contain 16% nitrogen (100/16 = 6.25) and that all organic nitrogen originates from proteins."
      },
      {
        "type": "text",
        "content": "The protein content of the nine soybean seed varieties analyzed is presented in Table 1."
      },
      {
        "type": "table",
        "columns": [
          "Sample Variety",
          "Protein %"
        ],
        "rows": [
          [
            "JS-335",
            "40"
          ],
          [
            "JS71-05",
            "39"
          ],
          [
            "PK - 564",
            "41"
          ],
          [
            "JS90 - 41",
            "41"
          ],
          [
            "JS75 - 46",
            "38"
          ],
          [
            "NRC - 2",
            "39"
          ],
          [
            "MACS58",
            "39"
          ],
          [
            "Monetta",
            "39"
          ],
          [
            "MACS 13",
            "38"
          ]
        ]
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "In an era where the purity and nutritional value of food are of growing concern, accurate protein analysis is crucial for both nutritional and economic assessments of food products. The Kjeldahl method remains an indispensable tool for nitrogen and protein determination due to its high accuracy, versatility, reproducibility, and universal acceptance."
      },
      {
        "type": "text",
        "content": "The use of BEING’s BPK-9870A Automatic Kjeldahl Nitrogen Analyzer demonstrated efficient, accurate, and reproducible results in protein analysis for soybeans, reinforcing the method’s reliability and relevance in modern scientific research and industry applications."
      },
      {
        "type": "text",
        "content": "1. https://iisrindore.icar.gov.in/statistics.html"
      },
      {
        "type": "text",
        "content": "2. Qin, P.; Wang, T.; Luo, Y. A Review on Plant-Based\nProteins from Soybean: Health Benefits and Soy Product\nDevelopment. Journal of Agriculture and Food\nResearch 2022, 7 (7), 100265. DOI:\n10.1016/j.jafr.2021.100265."
      },
      {
        "type": "text",
        "content": "3. Friedman, M.; Brandon, D. L. Nutritional and Health\nBenefits of Soy Proteins. Journal of Agricultural and Food\nChemistry 2001, 49 (3), 1069–1086. DOI:10.1021/jf0009246."
      }
    ],
    "comments": []
  },
  {
    "id": 46,
    "title": "Optimizing Ethanol Recovery in Winterized Botanical Extracts with Heidolph AUTOaccurate Technology",
    "slug": "optimizing-ethanol-recovery-in-winterized-botanical-extracts-with-heidolph-autoaccurate-technology",
    "category": "Industry Insights",
    "date": "2024-12-21",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/heidolph/hei-vap-ultimate-control-rotary-evaporator.webp",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Ethanol recovered from a winterized batch of botanical extract can be reused for multiple cycles of extraction and winterization. However, due to the dynamic nature of batch evaporation, ensuring a highly productive workflow and high-quality results without residual ethanol requires precise and frequent adjustments to vacuum settings during separation. For less experienced operators, identifying and maintaining optimal parameter settings can be a significant challenge. Striking a balance between effective separation and operational efficiency often demands expertise and constant oversight."
      },
      {
        "type": "text",
        "heading": "Automated Process Control: Addressing Industry Challenges",
        "content": "Many manufacturers respond to these operational demands by dedicating personnel solely to monitor evaporators and manually adjust vacuum settings. However, this approach often results in inefficiencies, as these technicians may lack sufficient experience with evaporator systems, thereby reducing daily output and operational cost-effectiveness."
      },
      {
        "type": "text",
        "content": "To address this challenge, Heidolph has developed the Hei-VAP Industrial packages , which offer an advanced solution to streamline the evaporation process. The innovative AUTOaccurate function automates the detection, adjustment, and maintenance of optimal vacuum settings throughout the evaporation process. By doing so, it eliminates the need for constant manual monitoring. AUTOaccurate ensures that the condenser operates at peak efficiency and further lowers the vacuum to a predefined final pressure after solvent evaporation, enabling the production of high-quality botanical extracts with no residual ethanol."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/optimizing-ethanol-recovery-in-winterized-botanical-extracts-with-heidolph-autoaccurate-technology/hei-vap-package.jpg",
        "caption": "Hei-VAP Package: Hei-VAP Industrial with Glassware A1C"
      },
      {
        "type": "text",
        "heading": "Ethanol as the Solvent of Choice",
        "content": "Ethanol is widely regarded as an ideal solvent for extraction and winterization processes due to its low toxicity and ease of handling compared to alternative solvents. However, ethanol’s cost, often elevated by taxation, makes its recycling and reuse critical to minimizing production expenses and reducing the environmentalfootprint of manufacturing operations. The automation provided by Heidolph's AUTOaccurate function ensures high-performance distillation, significantly enhancing solvent recovery efficiency and product quality."
      },
      {
        "type": "text",
        "heading": "Method: Ethanol Recovery with AUTOaccurate",
        "content": "For the batch ethanol recovery from winterized botanical extracts, the Heidolph Hei-VAP Industrial package was employed, leveraging the AUTOaccurate function to achieve optimal results. The operational parameters were set as follows:"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/optimizing-ethanol-recovery-in-winterized-botanical-extracts-with-heidolph-autoaccurate-technology/hei-vap-performance-plus-package.jpg",
        "caption": "HEI-VAP Performance Plus Package"
      },
      {
        "type": "text",
        "heading": "Fig 2: HEI-VAP Performance Plus Packages\n\nResults",
        "content": "The process delivered exceptional results, producing a clear, colorless ethanol distillate ready for reuse in extraction and winterization. The botanical extract obtained was clear, golden-colored, and free from solvent residue, ensuring both product quality and compliance with manufacturing standards."
      }
    ],
    "comments": []
  },
  {
    "id": 47,
    "title": "Variable Magnetic Field Generator Nanosurf's Innovative Design",
    "slug": "variable-magnetic-field-generatornanosurf-s-innovative-design",
    "category": "Industry Insights",
    "date": "2024-12-19",
    "author": "Inkarp Applications Team",
    "readTime": "4 min read",
    "image": "/assets/images/productImages/Nanosurf/driveafm.jpg",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "The Variable Magnetic Field Sample Holder (VMFSH) is a specialized accessory designed for use with Nanosurf’s CoreAFM, FlexAFM, and DriveAFM systems. This advanced tool facilitates atomic force microscopy (AFM) measurements under a variable in-plane magnetic field, enabling detailed studies of magnetic materials at the nanoscale."
      },
      {
        "type": "text",
        "heading": "The Significance of Magnetic Materials",
        "content": "Magnetic materials play a crucial role in modern science and technology, featuring prominently in applications ranging from household electronics to advanced medical diagnostic tools. As technology continues to miniaturize, these materials are f inding new applications in areas such as data storage, memory devices, spintronics, robotics, electronics, and biomedical devices."
      },
      {
        "type": "text",
        "content": "To advance the understanding and development of magnetic (nano)materials, nanoscale characterization is essential. The VMFSH, when combined with standard or advanced AFM modes, allows for correlative measurements under varying magnetic fields. This capability makes it possible to observe changes in magnetization, conductivity, and topography in situ, using magnetic fields up to 720 mT."
      },
      {
        "type": "text",
        "heading": "Understanding Magnetic Hysteresis",
        "content": "The VMFSH is particularly suited for studying ferrimagnets and ferromagnets, which are widely known for their ability to retain memory of an applied magnetic field even after its removal. Magnetic hysteresis—the variation of magnetization properties depending on whether the magnetic field is increasing or decreasing—is a key focus of such studies."
      },
      {
        "type": "text",
        "content": "In ferromagnets, high magnetic fields align magnetic domains, leading to saturation magnetization. When the field reverses, domain alignment is disrupted, but residual magnetization remains at zero field. To fully demagnetize the material, a coercive f ield (Hc) is applied, canceling out net domain alignment. The behavior of domains near the coercive field is particularly interesting, as they often form structuredpatterns influenced by material properties such as grain size, stress, and temperature. These properties can be precisely probed using AFM."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/variable-magnetic-field-generatornanosurf-s-innovative-design/Magnetic-Hysteresis.jpg",
        "caption": "Magnetic Hysteresis Loop of a Ferromagnet"
      },
      {
        "type": "text",
        "heading": "Magnetic Hysteresis Loop of a Ferromagnet\n\nFigure 1. Magnetic hysteresis loop of a ferromagnet. Mg-residual magnetization, He- coercive field. At high fields the magnetic domains are fully aligned. At intermediate fields, the domains align patterns reducing the magnetization strength.\n\nInnovative Design of the VMFSH",
        "content": "The VMFSH (Fig. 2) employs a stack of permanent magnets within the sample holder base to generate the magnetic field. These magnets are rotated by a programmable stepper motor, producing a variable in-plane magnetic field up to 720 mT (7200 G). When the magnets’ poles are aligned, the field reaches its maximum strength, while alignment at 90° produces a zero-field state (Fig. 3). The field is concentrated around the sample via ferromagnetic poles."
      },
      {
        "type": "text",
        "content": "Unlike solenoid magnets, the use of permanent magnets eliminates heat dissipation f luctuations, ensuring minimal thermal drift and consistent performance."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/variable-magnetic-field-generatornanosurf-s-innovative-design/Innovative-Design-of-the-VMFSH.jpg",
        "caption": "The Variable Magnetic Field Sample Holder"
      },
      {
        "type": "text",
        "heading": "The Variable Magnetic Field Sample Holder\n\nFigure 2.\nThe variable magnetic field sample holder. The base contains the permanent magnets, a precise stepper motor for their rotation, and an integrated calibrated Hall sensor. The sample mounting plate is positioned in the center of the top plate, between the magnetic poles.\n\nWorking Principle of the Variable Magnetic Field Sample Holder\n\nFigure 3.\nWorking principle of the variable magnetic field sample holder. The permanent magnets in the base of the holder can rotate around the vertical axis. When the magnetic field of the magnets is aligned with the magnetic poles, the field is at its maximum (left image), and when the magnetic field of the magnets is normal to the poles, the field is zero (right image).\n\nField Adjustability",
        "content": "The field strength can be adjusted by controlling the magnet rotation and the gap width between the magnetic poles. Five spacers are provided to define these gaps, offering spacings of 2, 4, 6, 8, or 10 mm, corresponding to maximum fields of 720, 370, 240, 180, and 140 mT, respectively. A Hall sensor integrated into the system ensures accurate field measurements."
      },
      {
        "type": "text",
        "heading": "Automation and Precision",
        "content": "The VMFSH is equipped with automation software that allows precise control over the magnetic field. Users can set specific field setpoints and conduct Magnetic Force Microscopy (MFM) scan series within a defined field range. The automated resolution for field adjustment is 0.1 mT, while manual adjustments achieve an even finer resolution of 0.005 mT."
      },
      {
        "type": "text",
        "heading": "Applications in Advanced Research",
        "content": "The VMFSH is compatible with advanced AFM modes, such as Conductive AFM and MFM. For example, it has been used to study Shakti spin ice configurations—a nanometer-scale arrangement of magnets. By imaging these lattices at various magnetic states, researchers gain insights into magnetic behavior during reversal processes (e.g., at-200 mT and-10 mT, as shown in Fig. 4)."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/variable-magnetic-field-generatornanosurf-s-innovative-design/Advanced-Research.jpg",
        "caption": "MFM images of Shakti Spin Ice Structure"
      },
      {
        "type": "text",
        "heading": "HighMaximumFieldStrength:",
        "content": "The VMFSH’s unique design and capabilities make it an indispensable tool for researchers exploring the nanoscale properties of magnetic materials, enabling groundbreaking discoveries across multiple scientific disciplines."
      },
      {
        "type": "table",
        "columns": [
          "Features",
          "Variable in-plane magnetic field generator; Integrated hall\nsensor."
        ],
        "rows": [
          [
            "Platform compatibility",
            "CoreAFM, FlexAFM, DriveAFM"
          ],
          [
            "Requirements",
            "Accessory Interface, Isostage 300"
          ],
          [
            "Sample size",
            "2 x 2 mm2 to 10 x 10 mm2"
          ],
          [
            "Maximum field",
            "720 mT (7200 G), 2 mm gap"
          ],
          [
            "Field resolution",
            "0.1 mT (1G)"
          ],
          [
            "Magnetic field",
            "Permanent rare earth magnets"
          ],
          [
            "Field variation",
            "Programmable stepper motor"
          ],
          [
            "Dimensions",
            "100 mm x 140 mm"
          ]
        ]
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "The Variable Magnetic Field Sample Holder (VMFSH) is a cutting-edge accessory that enhances the capabilities of atomic force microscopy by enabling precise measurements in a variable in-plane magnetic field. Its innovative design, featuring permanent magnets, programmable field adjustments, and advanced automation, makes it a powerful tool for nanoscale research. By offering unprecedented accuracy and flexibility, the VMFSH empowers scientists to investigate magnetic materials with remarkable depth, advancing applications in data storage, spintronics, biomedical devices, and beyond. For researchers focused on the complexities of magnetic hysteresis and domain behavior, the VMFSH provides an invaluable platform to drive innovation and deepen understanding in this critical field."
      }
    ],
    "comments": []
  },
  {
    "id": 48,
    "title": "Nucleic Acid Quantification using Implen NanoPhotometer",
    "slug": "nucleic-acid-quantification-using-implen-nanophotometer",
    "category": "Industry Insights",
    "date": "2024-12-16",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/Implen/nanophotometer-np80.jpg",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "heading": "Introduction",
        "content": "Accurate quantification of nucleic acids is crucial in cancer research for a number of reasons. From detection and analysis of genetic alterations to monitoring treatment response, quantification of DNA, RNA and nucleic acids has its own role in advancing our comprehension of cancer research. This application sheds lights on the use of Implen NanoPhotometer in DNA and RNA quantification in the context of breast cancer research, focusing its role in understanding genomic changes, identifying biomarkers and developing targeted therapies."
      },
      {
        "type": "text",
        "content": "Neoadjuvant chemotherapy is a systematic pre-surgical treatment where chemotherapy is given before surgery for patients with localised high risk or inoperable tumours. Often used for breast cancer, it is aimed at downsizing the tumour to avoid axillary dissections in patients. Successful therapy paves way for preservation of organs, avoiding mastectomy, and reducing surgical dissections in sensitive patients. Although there are studies which indicate significant advantages of neoadjuvant chemotherapy, predicting its response is difficult due to tumour heterogenicity and limited precision of existing biomarkers. Therefore, the key goal remains achieving subsequent pathological complete response. To accomplish this, prediction of novel biomarkers by identifying patients who might benefit from neoadjuvant therapy. This application highlights the use of Implen NanoPhotometer® for the quantification of DNA and RNA."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/nucleic-acid-quantification-using-implen-nanophotometer/DNA-RNA-1.jpeg",
        "caption": "Implen Nanophotometers"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/nucleic-acid-quantification-using-implen-nanophotometer/DNA-RNA-2.jpeg",
        "caption": "Implen Nanophotometers"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/nucleic-acid-quantification-using-implen-nanophotometer/nucleic-acids.jpg",
        "caption": "Implen Nanophotometers"
      },
      {
        "type": "text",
        "heading": "Methods",
        "content": "Four datasets of patient populations were used in this study - NACBC Sequencing Set, Internal NACBC Validation Set, External GEO Validation Set (GSE25066) and External TCGA Validation Set, each of varying characteristics. DNA was extracted from fresh frozen tissue samples and blood samples using the QIAamp DNA Mini Kit and QIAamp DNA Blood Mini Kit (Qiagen). RNA was extracted using TRIzol reagents (Tiangen)"
      },
      {
        "type": "text",
        "heading": "Nucleic acid quantification",
        "content": "Purity Assessment: The purity of isolated DNA and RNA samples was evaluated using the NanoPhotometer®. The absorbance ratio of 260 nm to 280 nm (A260/A280) was determined. A ratio within the range of 1.8 to 2.0 indicated pure samples suitable for subsequent experiments. Concentration Measurement: The concentration of nucleic acids was quantified based on the absorbance at 260 nm. A mass ≥ 3 μg was considered sufficient for sequencing sample library construction."
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "Key findings of this study indicate neoadjuvant chemotherapy significantly alters mutation rates, DNA repair pathways, and immune microenvironment. Specifically, the CDKAL1P409L mutation was identified as reducing chemotherapy sensitivity, while amplifications in ADGRA2 or ADRB3 were linked with worse prognosis and treatment outcomes. The application note highlights the use of Implen Nanophotometer for DNA and RNA quantification. Specifically, after isolating total DNA from fresh frozen tissue samples and blood samples, and extracting RNA from fresh frozen tumour tissue, the purity of the total DNA and RNA was estimated using the NanoPhotometer."
      },
      {
        "type": "text",
        "content": "Sample outputs of DNA and RNA quantification using the Implen NanoPhotometer is shown in Figure 1."
      },
      {
        "type": "text",
        "heading": "Reference",
        "content": "1. Yin, G.; Liu, L.; Yu, T.; Yu, L.; Feng, M.; Zhou, C.; Wang, X.; Teng, G.; Ma, Z.; Zhou, W.; Ye, C.; Zhang, J.; Ji, C.; Zhao, L.; Zhou, P.; Guo, Y.; Meng, X.; Fu, Q.; Zhang, Q.; Li, L. Genomic and Transcriptomic Analysis of Breast Cancer Identifies Novel Signatures Associated with Response to Neoadjuvant Chemotherapy. Genome medicine 2024, 16 (1). DOI: 10.1186/s13073-024-01286-8."
      }
    ],
    "comments": []
  },
  {
    "id": 49,
    "title": "Exploring the role of Precision X-Ray Imaging in cancer biology",
    "slug": "exploring-the-role-of-precision-x-ray-imaging-in-cancer-biology",
    "category": "Industry Insights",
    "date": "2024-12-15",
    "author": "Inkarp Applications Team",
    "readTime": "4 min read",
    "image": "/assets/images/productImages/Zeiss/axio-observer-ls_product.webp",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "heading": "Introduction",
        "content": "DNA double – strand breaks (DSBs) are a primary mechanism that causes cancer cell death. DSBs are a result of radiation therapy given to combat cancer. This resulting damage to the DNA can however trigger a cascade of activations of DNA repair mechanism, lessening the impact of radiation therapy. This article highlights the use of Precision X-ray’s imaging systems in the delivery of siRNA through novel polymer - lipid based nanocarrier."
      },
      {
        "type": "text",
        "content": "One of the therapeutic approaches for combating breast cancer is radiation therapy. It triggers various forms of DNA damage via the use of ionising radiation. Destruction of DNA is accompanied by DNA double–stranded breaks (DSBs), proven to be most harmful in causing cancer cell death. While radiation therapy is successful in delivering the intended DNA damage, its perverse effect is activation of DNA repair mechanisms. Cancer cells often develop resistance to this treatment by activating their DNA damage response (DDR) machinery, which repairs DSBs. RAD50, a SMC protein (Structural Maintenance of Chromosomes) along with heterotrimeric recombination 11 homolog 1 (Mre11) and Nijmegen breakage syndrome protein 1 (NBS1) form the MRN complex, which binds to damaged and broken DNA to exhibit various enzymatic activities that are crucial for the repair of DSBs."
      },
      {
        "type": "text",
        "content": "Silencing RAD50 in cancer cells using small interfering RNA (siRNA) to enhance breast cancer chemotherapy has been explored. However, delivering siRNA to target cells and their cytoplasm poses significant obstacles, including degradation by RNAases, accumulation and penetration within tumours, cellular uptake, and entrapment and degradation within endosomes/ lysosomes. To overcome these challenges, various nanocarrier systems have been developed to improve siRNA in vivo stability, tissue bioavailability, and transfection efficiency. To help achieve the development of novel polymer–lipid based RAD50 siRNA loaded nanoparticles, Precision X-Ray systems have been employed, as highlighted in this application note."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/exploring-the-role-of-precision-x-ray-imaging-in-cancer-biology/X-RAY-image.jpg",
        "caption": "Precision X-Ray"
      },
      {
        "type": "text",
        "heading": "Experimental",
        "content": "MDA-MB-231 cells, a triple-negative breast cancer (TNBC) cell line, and MCF-10A cells, a non-malignant breast cell line, were acquired and cultured in Dulbecco's Modified Eagle's Medium (DMEM). The RAD50-siRNA-NPs were prepared in an oil - water emulsion. This was followed by assessment of siRNA encapsulation, in vitro transfection of RAD50 siRNA into cells and investigation of internalization and intracellular localization of siRNA-NPs. To assess the effect of RAD50-siRNA-NPs treatment and RT on DNA damage repair, MDA-MB-231 cells were treated with RAD50-siRNA-NPs or free-siRNA and then irradiated with a single dose of 5 Gy using X-RAD 320 system (Precision X-Ray, Madison, CT, USA; 320 kV, 2.7 Gy/ miFor evaluation of in vivo RAD50 silencing and biomarkers, the tumours were exposed to radiation (10 Gy) using small animal irradiator (SmART+) XRAD system (Precision X-Ray Inc., Madison, CT, USA)."
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "This application highlights the use of Precision X-Ray imaging systems. The X-RAD 320 was critical in applying radiation therapy (RT) on the MDA-MB-231 cells that rendered a controlled assessment of the fate of DNA damage repair after treatment with RAD50-siRNA-NPs. Furthermore, the SmART+ XRAD system provided in vivo radiation with precision such that RAD50 silencing, and its biomarkers could be evaluated in tumour models. These results emphasize the role of Precision X-Ray imaging systems in improving our comprehension of cancer and leading to new treatments of it. The results showed that the nanoparticles successfully delivered siRNA into the cells, silenced RAD50 expression, and increased radiation-induced DNA damage. suggesting that targeting RAD50 with siRNA-NPs could be a promising strategy to improve radiation therapy outcomes for breast cancer."
      },
      {
        "type": "text",
        "heading": "Reference",
        "content": "1. Zetrini, A. E.; Abbasi, A. Z.; He, C.; HoYin Lip; Ibrahim Alradwan; Rauth, A. M.; Henderson, J. T.; Xiao Yu Wu. Targeting DNA Damage Repair Mechanism by Using RAD50-Silencing SiRNA Nanoparticles to Enhance Radiotherapy in Triple Negative Breast Cancer. Materials Today Bio 2024, 28, 101206–101206. DOI: 10.1016/j.mtbio.2024.101206."
      }
    ],
    "comments": []
  },
  {
    "id": 50,
    "title": "Kidney Stone Analysis Using ATR with Bruker Alpha II Spectrometer",
    "slug": "kidney-stone-analysis-using-atr-with-bruker-alpha-ii-spectrometer",
    "category": "Industry Insights",
    "date": "2024-12-03",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/Bruker/banner-alpha.png",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Kidney stones are commonly composed of calcium phosphates, oxalates, uric acid, or cystine, often occurring as mixtures. Reliable analysis requires specialized methods due to the possibility of many other components. Fourier Transform Infrared Spectroscopy (FT-IR) is a powerful and cost-efficient method for kidney stone analysis, offering speed and the ability to analyze amorphous substances, unlike X-ray diffraction. The ATR (Attenuated Total Reflection) method enhances FT-IR analysis by eliminating extensive sample preparation. A kidney stone sample simply needs to be pressed onto the ATR measurement interface, streamlining the process."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/kidney-stone-analysis-using-atr-with-bruker-alpha-ii-spectrometer/Kidney-stone.jpg",
        "caption": "Kidney stones"
      },
      {
        "type": "text",
        "heading": "Method and Instrumentation",
        "content": "The ALPHA Kidney Stone Analyzer combines an ALPHA FT-IR spectrometer with a diamond ATR module, user-friendly wizard software, and a comprehensive spectral library of over 5000 authentic kidney stone spectra, developed by Prof. Michel Daudon. The diamond ATR interface is robust, handling even the hardest samples, and requires minimal sample amounts—around 1 mgis sufficient. The IR radiation penetrates the sample’s surface, capturing absorbance data that the software processes into actionable results in under a minute."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/kidney-stone-analysis-using-atr-with-bruker-alpha-ii-spectrometer/ALPHA-Kidney-Stone-Analyzer.jpg",
        "caption": "ALPHA Kidney Stone Analyzer"
      },
      {
        "type": "text",
        "heading": "Application Example",
        "content": "Once a sample is measured, the software automatically initiates a spectrum search. During this process, the measured spectrum is systematically compared to a comprehensive database of reference spectra. The degree of similarity between the query spectrum and the database spectra is quantified using what are known as hit quality points. The greater the similarity, the higher the hit quality points assigned to the database spectrum, with a maximum score of 1000 points."
      },
      {
        "type": "text",
        "content": "The following figures illustrate the analysis results for different kidney stone samples. Figure 1 demonstrates the analysis of a stone where cystine is identified as the primary component, achieving an excellent hit quality of 941 points."
      },
      {
        "type": "text",
        "content": "Additionally, the substance “carbonate apatite” was identified as a secondary component. However, the apatite content appears to be less than 5%, as pure cystine is listed as the second entry on the hit list with a nearly identical hit quality of 940."
      },
      {
        "type": "text",
        "content": "The upper section of the results screen provides supplementary information about the selected library entry, including synonyms for the compound names."
      },
      {
        "type": "text",
        "content": "Figure 2 displays the search results for a second sample. The top match achieves an outstanding hit quality score of 962, identifying the sample as a combination of whewellite (calcium oxalate) and uric acid. However, with the second match scoring nearly as high at 961, the possibility of protein traces being present cannot be excluded."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/kidney-stone-analysis-using-atr-with-bruker-alpha-ii-spectrometer/Figure-1.jpg",
        "caption": "Figure-1"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/kidney-stone-analysis-using-atr-with-bruker-alpha-ii-spectrometer/Figure-2.jpg",
        "caption": "Figure-2"
      },
      {
        "type": "text",
        "heading": "Summary",
        "content": "The ALPHA Kidney Stone Analyzer is a compact, efficient system designed for rapid, reliable kidney stone analysis. Its advanced ATR-based FT-IR technology, robust design, and extensive spectral library enable high throughput and convenience. This innovative solution empowers medical professionals to achieve precise, efficient results, redefining kidney stone analysis in clinical settings."
      }
    ],
    "comments": []
  },
  {
    "id": 51,
    "title": "Achieving Precision in Moisture Analysis: Installation of the Mettler Toledo HX204 Moisture Analyzer",
    "slug": "achieving-precision-in-moisture-analysis-installation-of-the-mettler-toledo-hx204-moisture-analyzer",
    "category": "Industry Insights",
    "date": "2024-11-20",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/Mettler/halogen-moisture-analyzer-hx204.jpg",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "In Hyderabad, the successful installation of the Mettler Toledo HX204 Halogen Moisture Analyzer marked a new milestone in precision moisture measurement. Renowned for its accuracy and reliability, the HX204 caters to the stringent demands of industries like food production, pharmaceuticals, chemicals, and more. The installation process, from setup to training, demonstrated the advanced capabilities of this high-performance instrument.\nMettler Toledo HX204 Moisture Analyzer Overview\nThe HX204 combines cutting-edge technology and user-friendly operation, making it one of the most reliable solutions for moisture analysis. This adaptable analyser meets the needs of various industries, providing precise and consistent results that adhere to industry standards."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/achieving-precision-in-moisture-analysis-installation-of-the-mettler-toledo-hx204-moisture-analyzer/HX204.jpeg",
        "caption": "METTLER TOLEDO HX204 Halogen Moisture Analyzer software"
      },
      {
        "type": "text",
        "heading": "Maximum Capacity:",
        "content": "These features underscore why the HX204 is recognized for its high-precision moisture measurement capabilities."
      },
      {
        "type": "text",
        "heading": "Applications of the Mettler Toledo HX204",
        "content": "The versatility of the HX204 extends its use across multiple sectors, such as:"
      },
      {
        "type": "text",
        "heading": "Enhanced Features for Precision and Productivity",
        "content": "The HX204’s innovative features simplify complex moisture analyses and improve productivity:"
      },
      {
        "type": "text",
        "heading": "Day 1: Installation",
        "content": "The service team carried out a meticulous setup, connecting the HX204 with EasyDirect Moisture Software and testing network compatibility and USB export functions. Every feature was thoroughly checked for smooth operation, resulting in a flawless installation."
      },
      {
        "type": "text",
        "heading": "Day 2: Training",
        "content": "The following day, a comprehensive, hands-on demonstration was conducted. The customer’s team was guided through the analyzer’s interface, moisture analysis methods, and advanced features, including customizable drying tempera"
      },
      {
        "type": "text",
        "heading": "Reflecting on the Installation Experience",
        "content": "The successful installation of the HX204 Halogen Moisture Analyzer highlights the importance of precision, detailed training, and seamless integration. With a flawless setup and comprehensive training, the customer is now empowered to leverage the full potential of their analyser, ensuring efficiency and confidence in every moisture analysis process."
      }
    ],
    "comments": []
  },
  {
    "id": 52,
    "title": "Ensuring Sample Integrity in Clinical Trials with Being -86℃ Ultra Low Temperature Freezer",
    "slug": "ensuring-sample-integrity-in-clinical-trials-with-being-86-ultra-low-temperature",
    "category": "Industry Insights",
    "date": "2024-11-01",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/blogs/legacy/ensuring-sample-integrity-in-clinical-trials-with-being-86-ultra-low-temperature/Ultra-Low-Temperature-banner.jpg",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "In the world of clinical trials, where precision, reliability, and accuracy are paramount,\nmaintaining the integrity of biological samples is a critical aspect of the entire\nprocess. Whether it’s blood samples, tissues, RNA, or other sensitive biological\nmaterials, any compromise in their quality could lead to inaccurate results, delayed\nresearch, and compromised patient safety. This is where an ultra-low temperature\nfreezer, like the Being -86℃ Ultra Low Temperature Freezer, plays a vital role in\nsafeguarding the integrity of clinical trial samples."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/ensuring-sample-integrity-in-clinical-trials-with-being-86-ultra-low-temperature/Ultra-Low-Temperature-banner.jpg",
        "caption": "80℃ Ultra Low Temperature Freezer"
      },
      {
        "type": "text",
        "heading": "The Importance of Sample Integrity in Clinical Trials",
        "content": "Clinical trials involve a series of carefully controlled tests and studies to evaluate the\nefficacy and safety of new drugs, treatments, or medical devices. For these studies to\nbe accurate, the biological samples collected must remain in their original state from\ncollection to analysis. Sample integrity refers to the preservation of these samples'\nstructural, chemical, and biological characteristics, ensuring they remain unaltered\nand viable throughout the studys"
      },
      {
        "type": "text",
        "content": "Factors such as temperature fluctuations, improper handling, and contamination\ncan degrade samples, leading to unreliable results. This makes proper storage\nsolutions essential to clinical trial success, and ultra-low temperature freezers are\ndesigned to meet this need."
      },
      {
        "type": "text",
        "heading": "How the Being -86℃ Ultra Low Temperature Freezer Ensures Sample\nIntegrity",
        "content": "The Being -86℃ Ultra Low Temperature Freezer is a sophisticated tool that offers\nadvanced features to ensure the protection and preservation of critical samples\nduring clinical trials. Here’s how this freezer stands out:"
      },
      {
        "type": "text",
        "heading": "Benefits of Using Being -86℃ Freezer in Clinical Trials",
        "content": "By using the Being -86℃ Ultra Low Temperature Freezer, clinical researchers can be\nconfident that their samples remain in perfect condition throughout the duration of\nthe trial. Here are some key benefits:"
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "The Being -86℃ Ultra Low Temperature Freezer is an indispensable tool for clinical\ntrials, ensuring that sample integrity is maintained throughout the study. Its\nultra-low temperature capabilities, precise monitoring, and energy efficiency make it\na trusted choice for preserving biological materials. By safeguarding the integrity of\nsamples, the Being -86℃ Freezer helps clinical researchers achieve accurate, reliable,\nand groundbreaking results, contributing to the development of new treatments\nand medical breakthroughs."
      }
    ],
    "comments": []
  },
  {
    "id": 53,
    "title": "Exploring Cell-Based Liquid Biopsy: Beyond Circulating Tumour Cell Enumeration",
    "slug": "exploring-cell-based-liquid-biopsy-beyond-circulating-tumour-cell-enumeration-with-the-rarecyte-platform",
    "category": "Industry Insights",
    "date": "2024-10-27",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/blogs/BlogFour/cytefinder-ii.jpg",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "heading": "Exploring Cell-Based Liquid Biopsy: Beyond Circulating Tumour Cell Enumeration with the RareCyte Platform",
        "content": "In recent years, liquid biopsy has revolutionised cancer diagnostics. Unlike traditional tissue biopsies, which require invasive procedures, liquid biopsy allows for the non-invasive collection of blood samples to analyse circulating tumour DNA (ctDNA) and circulating tumour cells (CTCs). However, while ctDNA has been widely adopted for mutational analysis, it lacks the ability to assess cancer phenotypes, such as protein biomarker expression, which can be crucial in guiding treatment decisions. This is where CTCs come into play. CTCs are intact cancer cells that have detached from a tumour and entered the bloodstream, potentially leading to distant metastases. Their presence in the blood is not only a marker of disease progression but also of resistance to cancer therapies."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/exploring-cell-based-liquid-biopsy-beyond-circulating-tumour-cell-enumeration-with-the-rarecyte-platform/Exploring-Cell-Based-Liquid-product.jpeg",
        "caption": "Cardiff University Researchers Utilize Reactor-Ready for Sustainable Polymer Synthesis"
      },
      {
        "type": "text",
        "heading": "The RareCyte Liquid Biopsy Platform",
        "content": "The RareCyte platform offers a comprehensive workflow for CTC analysis that includes:"
      },
      {
        "type": "text",
        "content": "This workflow enables both the enumeration of CTCs and in-depth analysis of protein biomarkers and genomic information, expanding the potential of liquid biopsy beyond traditional methods."
      },
      {
        "type": "text",
        "heading": "Protein Biomarker Analysis",
        "content": "One of the most exciting aspects of the RareCyte platform is its ability to investigate protein biomarkers on CTCs. These biomarkers can provide critical insights into tumour characteristics, drug targets, and potential resistance mechanisms. For instance, the platform has validated assays for biomarkers like the androgen receptor (AR) in prostate cancer and HER2 and ER in breast cancer. This allows clinicians to track the presence of different cancer subtypes over time, offering a dynamic view of the tumour’s evolution."
      },
      {
        "type": "text",
        "content": "The RareCyte platform can also support companion diagnostic development. By analysing drug targets directly on CTCs, researchers can better understand how patients might respond to therapies and develop non-invasive diagnostic tests."
      },
      {
        "type": "text",
        "heading": "Nucleic Acid Sequencing Applications",
        "content": "CTCs offer a distinct advantage over ctDNA for genomic analysis. Unlike ctDNA, which represents fragmented genetic material, CTCs contain entire cancer genomes. This allows for:"
      },
      {
        "type": "text",
        "heading": "Clinical Applications and Breakthroughs",
        "content": "In clinical settings, the RareCyte platform has shown remarkable results. In a study involving gastrointestinal cancer patients, CTC enumeration and biomarker analysis provided real-time insights into treatment responses. For instance, CTCs were characterised using dual-biomarker assays to assess proliferation markers like EGFR and Ki-67, as well as immune checkpoint markers such as HER2 and PD-L1. This type of analysis allows for more personalised and effective treatment strategies."
      },
      {
        "type": "text",
        "content": "In another example, CTCs from a colorectal cancer patient were sequenced using a targeted gene panel, identifying an APC mutation in some CTCs. This kind of detailed genomic analysis can help clinicians tailor therapies to the unique genetic makeup of each patient’s cancer."
      },
      {
        "type": "text",
        "heading": "Conclusion:",
        "content": "The RareCyte platform is pushing the boundaries of liquid biopsy by enabling not just the enumeration of CTCs but also detailed phenotypic and genomic analysis. By combining CTC biomarker analysis with ctDNA sequencing, liquid biopsy can offer a more comprehensive view of cancer, helping clinicians make more informed decisions. As we move toward more personalised medicine, technologies like RareCyte are essential in harnessing the full potential of liquid biopsy to improve cancer diagnosis, treatment, and patient outcomes."
      },
      {
        "type": "text",
        "heading": "References:",
        "content": "Kaldjian, E. P.; Ramirez, A. B.; Costandy, L.; Ericson, N. G.; Malkawi, W. I.; George, T. C.; Pashtoon Murtaza Kasi. Beyond Circulating Tumor Cell Enumeration: Cell-Based Liquid Biopsy to Assess Protein Biomarkers and Cancer Genomics Using the RareCyte® Platform. Frontiers in Pharmacology 2022, 13. DOI: 10.3389/fphar.2022.835727."
      }
    ],
    "comments": []
  },
  {
    "id": 54,
    "title": "Advancing Sustainable Polymer Synthesis with Reactor-Ready: A Milestone at Cardiff University",
    "slug": "advancing-sustainable-polymer-synthesis-with-reactor-ready-a-milestone-at-cardiff-university",
    "category": "Industry Insights",
    "date": "2024-09-29",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/radleys/reactor-ready-flex-lab-reactor.jpg",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "The surge in plastic production and consumption over the past few decades has led to significant environmental challenges. To tackle these issues, researchers are focusing on developing innovative, chemically recyclable polymers. Unlike traditional recycling methods, which struggle to eliminate residual colourants and often result in recycled materials retaining the original hues, this new approach offers a more sustainable solution."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/advancing-sustainable-polymer-synthesis-with-reactor-ready-a-milestone-at-cardiff-university/Advancing-Sustainable-b.png",
        "caption": "Cardiff University Researchers Utilize Reactor-Ready for Sustainable Polymer Synthesis"
      },
      {
        "type": "text",
        "heading": "Transforming Polymer Recycling at Cardiff University",
        "content": "Researchers at Cardiff University have made a breakthrough in polymer science by synthesising single-component, coloured polymers that can be fully recycled back to their parent acid/alcohol and then reprocessed into colourless polymers. This is achieved through the use of chromophore-containing monomers in epoxide-anhydride ring-opening copolymerization (ROCOP), a technique that enables the creation of vividly coloured polymers without altering their fundamental properties."
      },
      {
        "type": "text",
        "content": "What sets this method apart is the covalent bonding of the dye within the polymer structure, allowing intense coloration with minimal chromophore content. This breakthrough means that these dyed polymers can be depolymerized, their chromophores removed, and the base monomers re-polymerised to produce pristine, colour-free polymers."
      },
      {
        "type": "text",
        "heading": "Reactor-Ready: Facilitating Large-Scale Polymer Synthesis",
        "content": "To scale up their innovative polymerization process, the Cardiff University team utilised the Radleys 2-litre Reactor-Ready Jacketed Lab Reactor, paired with a Hei-TORQUE stirrer and precise temperature control from a Huber Ministat. This setup enabled the researchers to synthesise between 280 and 320 grams of polymer in a single batch, demonstrating the feasibility of large-scale production."
      },
      {
        "type": "text",
        "content": "Managing large-scale polymerization reactions, which can be exothermic, requires careful control. By using an external PT1000 temperature probe in conjunction with the Huber Ministat, the team could accurately monitor and adjust the reaction temperature, effectively mitigating the risks associated with exothermic reactions."
      },
      {
        "type": "text",
        "heading": "Towards a Sustainable Future for Polymers",
        "content": "The ability to recycle coloured polymers into pure, white polymers represents a significant leap forward for the recycling industry. This method is not only effective but also highly adaptable, allowing for a wide range of dopants to be used, imparting various functionalities and customizable properties to the polymer. The impact of this research is far-reaching, offering a sustainable approach to rethinking polymer production and consumption."
      },
      {
        "type": "text",
        "content": "By employing the Reactor-Ready system for their large-scale synthesis, the Cardiff University researchers have demonstrated a powerful method for creating versatile, recyclable polymers. This pioneering approach not only addresses current challenges in polymer recycling but also lays the groundwork for a more sustainable future in material science."
      }
    ],
    "comments": []
  },
  {
    "id": 55,
    "title": "Enhancing Polymer Research with Radleys Mya 4 Reaction Station",
    "slug": "enhancing-polymer-research-with-radleys-mya-4-reaction-station",
    "category": "Industry Insights",
    "date": "2024-09-23",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/radleys/mya-4-reaction-station.jpg",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Polymer research is the study of polymers, which are large\nmolecules composed of repeated subunits known as monomers. As\npolymer research covers a wide range of topics, including the\nsynthesis, structure, properties, and applications of these\nmaterials, it is crucial for developing new materials with\nspecific properties for various industries."
      },
      {
        "type": "text",
        "content": "The Radleys Mya 4 Research Station is a versatile laboratory\ntool designed to enhance efficiency and precision in polymer\nresearch and other chemical processes. Here's how it can enhance\npolymer research:"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/enhancing-polymer-research-with-radleys-mya-4-reaction-station/Product-2.png",
        "caption": "Radleys Mya 4 Reaction Station"
      },
      {
        "type": "text",
        "heading": "Safety Features:",
        "content": "The Mya 4 Research Station includes safety features like integrated heating and stirring controls, reducing the risk of accidents and ensuring safe operation during polymerization reactions."
      },
      {
        "type": "text",
        "heading": "Data Collection and Reproducibility:",
        "content": "The station facilitates consistent and reliable data collection, which is essential for polymer research. Accurate data allows researchers to better understand the polymerization process and the resulting material properties, leading to more reproducible and reliable results."
      },
      {
        "type": "text",
        "content": "Overall, the Radleys Mya 4 Research Station enhances polymer research by providing a controlled, efficient, and safe environment for conducting complex polymerization reactions, ultimately leading to faster discovery and development of new polymers."
      },
      {
        "type": "text",
        "content": "Inkarp , the trusted distributor and service provider across India for Radleys Mya 4 Research Station is committed to innovation and customer satisfaction."
      }
    ],
    "comments": []
  },
  {
    "id": 56,
    "title": "Optimising Protein Purification Processes with the Kubota M500TR Centrifuge",
    "slug": "optimising-protein-purification-processes-with-the-kubota-m500tr-centrifuge",
    "category": "Industry Insights",
    "date": "2024-08-27",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/Kubota/benchtop-high-speed-refrigerated-centrifuge-model-m500tr.jpg",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "Protein purification is fundamental to biochemical research and biopharmaceutical production. Whether you're studying protein structure, function, or developing therapeutic proteins, achieving high purity with maximum yield is crucial. The process involves isolating a specific protein from a complex mixture, and each step must be carefully optimised to maintain the protein's integrity and activity."
      },
      {
        "type": "text",
        "heading": "The Role of Centrifugation in Protein Purification",
        "content": "Centrifugation is often the first step in the protein purification process. It separates components based on density, allowing for the removal of cell debris and insoluble material, leaving a clarified lysate that contains the protein of interest. Choosing the right centrifuge is essential to ensure precision and consistency in this critical step."
      },
      {
        "type": "text",
        "content": "Introducing the Kubota M500TR Centrifuge—a versatile, high-performance centrifuge that can enhance your protein purification workflow."
      },
      {
        "type": "text",
        "heading": "WhyChoose the Kubota M500TR Centrifuge?",
        "content": "The Kubota M500TR Centrifuge is designed to meet the demands of modern laboratories, offering several advantages that make it ideal for protein purification:"
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/optimising-protein-purification-processes-with-the-kubota-m500tr-centrifuge/Product-3.png",
        "caption": "Kubota M500TR Centrifuge"
      },
      {
        "type": "text",
        "heading": "Enhancing Protein Purification Efficiency",
        "content": "The Kubota M500TR Centrifuge streamlines the protein purification process by delivering the speed, precision, and safety required for successful protein isolation. By optimising the initial centrifugation step, researchers can improve downstream processes such as chromatography, dialysis, and concentration, ultimately leading to higher protein yields and purity."
      },
      {
        "type": "text",
        "content": "For researchers and biotechnologists, investing in a reliable centrifuge like the Kubota M500TR can make a significant difference in the efficiency and success of their protein purification workflows. The combination of versatility, control, and safety ensures that your samples are handled with the care and precision they deserve."
      },
      {
        "type": "text",
        "heading": "Conclusion:",
        "content": "Optimising protein purification processes is essential for advancing scientific research and biopharmaceutical development. With the Kubota M500TR Centrifuge, you can enhance your lab’s efficiency and achieve better results, paving the way for new discoveries and innovations in the world of proteins."
      },
      {
        "type": "text",
        "content": "For more information on the Kubota M500TR Centrifuge and how it can benefit your laboratory, visit Inkarp’s website or contact our team of experts. Let us help you elevate your protein purification processes with the best equipment in the market."
      },
      {
        "type": "text",
        "content": "Inkarp , empowering research with superior technology!"
      }
    ],
    "comments": []
  },
  {
    "id": 57,
    "title": "Bruker Alpha II FTIR for Rapid Material Identification in Chemical Industries",
    "slug": "using-bruker-alpha-ii-ftir-for-rapid-material-identification-in-chemical-industries",
    "category": "Industry Insights",
    "date": "2024-08-19",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/Bruker/banner-alpha.png",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "heading": "Using Bruker Alpha II FTIR for Rapid Material Identification in Chemical Industries",
        "content": "In the complex world of chemical manufacturing, precise and prompt material identification is essential for maintaining product quality, safety, and meeting regulatory standards. Whether it’s verifying the composition of raw materials or ensuring the integrity of final products, material identification plays an important role in maintaining operational efficiency and minimizing risks. One of the most advanced technologies designed for this purpose is the Bruker ALPHA II FTIR (Fourier Transform Infrared) Spectrometer . Its unique combination of robustness, accuracy, and ease of use makes it an invaluable tool for rapid material identification in the chemical industry."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/using-bruker-alpha-ii-ftir-for-rapid-material-identification-in-chemical-industries/Product-1.png",
        "caption": "Bruker ALPHA II FTIR"
      },
      {
        "type": "text",
        "heading": "The Importance of Rapid Material Identification in the Chemical Industry",
        "content": "Chemical manufacturers handle a wide variety of materials daily, from raw ingredients to intermediate compounds and finished products. In such environments, even minor discrepancies in material composition can lead to costly production errors, product recalls, or, worse, hazardous safety violations. Rapid material identification (RMI) allows manufacturers to quickly verify the identity of substances and detect contaminants or impurities, ensuring consistent quality and reducing the risk of accidents."
      },
      {
        "type": "text",
        "content": "Traditional methods of material analysis, such as chromatography or wet chemical tests, often require significant time and expertise to perform. In contrast, spectroscopy offers a much faster, non-destructive alternative that can be applied across a wide range of sample types. By measuring how different materials absorb infrared light, FTIR spectroscopy provides a unique chemical fingerprint that can be used to identify substances quickly and accurately."
      },
      {
        "type": "text",
        "heading": "WhyBruker ALPHAII FTIR is Ideal for Material Identification",
        "content": "The Bruker ALPHA II FTIR spectrometer is one of the most reliable and versatile tools available for material identification in chemical industries. Its design and functionality are specifically tailored to meet the needs of industries that require speed, accuracy, and flexibility."
      },
      {
        "type": "text",
        "heading": "Applications in the Chemical Industry",
        "content": "The versatility and precision of the Bruker ALPHA II FTIR make it an ideal tool for a wide range of applications within the chemical industry. Here are some specific areas where the ALPHAII excels:"
      },
      {
        "type": "text",
        "heading": "Conclusion:",
        "content": "The Bruker ALPHA II FTIR spectrometer offers an unparalleled combination of speed, accuracy, and ease of use, making it the perfect tool for rapid material identification in chemical industries. Whether it’s analyzing raw materials, monitoring product quality, or conducting environmental tests, the ALPHA II ensures that manufacturers can quickly and reliably identify materials at every stage of the production process. With its robust design, minimal maintenance requirements, and versatile sampling options, the ALPHA II is set to become an essential asset for any chemical laboratory or production facility."
      }
    ],
    "comments": []
  },
  {
    "id": 58,
    "title": "Exploring the Kjeldahl Method: Case Studies and Applications in Protein Analysis",
    "slug": "exploring-the-kjeldahl-method-case-studies-and-applications-in-protein-analysis",
    "category": "Industry Insights",
    "date": "2024-08-08",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/Buchi/K-375.webp",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "heading": "Introduction:",
        "content": "The Kjeldahl method, also known as Kjeldahl digestion, is a fundamental technique in\nanalytical chemistry for quantitatively determining organic nitrogen and ammonia/ammonium\nin samples. Developed by John Kjeldahl in 1883, this method specifically targets organic\nnitrogen, excluding other forms of inorganic nitrogen like nitrates unless modified. Its\nsignificance lies in the empirical relationship between Kjeldahl nitrogen and protein content,\nmaking it a crucial tool for indirectly quantifying protein in various samples."
      },
      {
        "type": "text",
        "heading": "Significance in Protein Analysis:",
        "content": "The accuracy of the Kjeldahl method in measuring nitrogen content is vital for determining\nprotein levels in different samples. Since proteins consist of amino acids, which contain\nnitrogen, this method indirectly quantifies protein by converting the measured nitrogen\ncontent into protein content using a conversion factor. This is particularly important in the\nfood industry for nutritional labeling and quality control, in agriculture for assessing soil and\nfertilizer quality, and in environmental monitoring for evaluating nitrogen pollution levels."
      },
      {
        "type": "text",
        "heading": "Conclusion:",
        "content": "The Kjeldahl method is a valuable tool for the wheat flour industry in determining protein\ncontent and ensuring quality. Despite some limitations, it remains a reliable and widely used\ntechnique for this purpose."
      }
    ],
    "comments": []
  },
  {
    "id": 59,
    "title": "Optimizing Solvent Recovery in Pharmaceutical Processes with Heidolph Rotary Evaporators",
    "slug": "optimizing-solvent-recovery-in-pharmaceutical-processes-with-heidolph-rotary-evaporators",
    "category": "Industry Insights",
    "date": "2024-08-04",
    "author": "Inkarp Applications Team",
    "readTime": "3 min read",
    "image": "/assets/images/productImages/heidolph/hei-vap-expert-control-rotary-evaporator.webp",
    "tags": [
      "Laboratory Applications",
      "Scientific Instruments"
    ],
    "sections": [
      {
        "type": "text",
        "content": "In the dynamic world of pharmaceutical research and development, achieving speed and efficiency is crucial. Leading companies are constantly exploring innovative methods to streamline their processes, accelerate time-to-market, and cut costs. A key yet often underestimated aspect is solvent recovery—a critical step in many drug manufacturing workflows.\nHeidolph rotary evaporators offer a strategic solution that enhances both environmental sustainability and cost-effectiveness in this process."
      },
      {
        "type": "image",
        "imageUrl": "/assets/blogs/legacy/optimizing-solvent-recovery-in-pharmaceutical-processes-with-heidolph-rotary-evaporators/Synthesis.png",
        "caption": "Heidolph Rotary Evaporators"
      },
      {
        "type": "text",
        "heading": "The Challenge of Solvents",
        "content": "Solvents are essential in extracting, purifying, and crystallizing pharmaceutical ingredients. However, their disposal can be problematic. Traditional disposal methods often lead to significant solvent waste, increasing disposal costs and environmental impact."
      },
      {
        "type": "text",
        "heading": "Heidolph Rotary Evaporators: An Efficient Solution",
        "content": "Heidolph Rotary evaporators provide an effective solution for solvent recovery. These robust instruments work by gently heating a rotating flask under vacuum, allowing solvents to evaporate at lower temperatures. This method not only preserves valuable drug ingredients from thermal degradation but also captures a larger volume of solvent vapor for reuse."
      },
      {
        "type": "text",
        "heading": "Why choose Heidolph Rotary Evaporator?",
        "content": "Selecting the right rotary evaporator is crucial for maximizing solvent recovery. Key factors to consider include sample volume, heating power and control, vacuum system efficiency, and condenser performance. Investing in high-quality equipment ensures optimal solvent recovery and enhances overall process efficiency. Heidolph Rotary Evaporators cover all the key factors."
      },
      {
        "type": "text",
        "heading": "Leading in Efficiency and Sustainability",
        "content": "Incorporating advanced rotary evaporator technology positions your company as a leader in operational efficiency and environmental responsibility. This dual focus on sustainability and cost-effectiveness offers a competitive edge in the pharmaceutical industry. Heidolph Rotary Evaporators are the ideal choice for achieving these goals."
      },
      {
        "type": "text",
        "heading": "Conclusion",
        "content": "By utilizing cutting-edge Heidolph rotary evaporator solutions, pharmaceutical companies can achieve greater efficiency, minimize environmental impact, and improve their financial performance.\nWith Heidolph’s reliable premium devices and Inkarp’s extensive distribution and service network, we ensure you receive the best quality products along with solution-oriented advice and sustainable support."
      },
      {
        "type": "text",
        "content": "Inkarp , Empowering research with superior technology!"
      }
    ],
    "comments": []
  }
];

export const posts = rawPosts.map((post) => ({
  ...post,
  slug: post.slug || slugify(post.title),
  excerpt: getExcerpt(post),
}));

export function getPostsByCategory(category) {
  if (!category || category === "All") {
    return posts;
  }
  return posts.filter((post) => post.category === category);
}

export function getFeaturedPost() {
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
}

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug);
}

export function getRecentPosts(excludeSlug, limit = 4) {
  return [...posts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter((post) => post.slug !== excludeSlug)
    .slice(0, limit);
}

export function getCategoryCounts() {
  return categories
    .filter((category) => category !== "All")
    .map((category) => ({
      category,
      count: posts.filter((post) => post.category === category).length,
    }));
}

export function getAllTags() {
  const tagSet = new Set();
  posts.forEach((post) => post.tags?.forEach((tag) => tagSet.add(tag)));
  return [...tagSet];
}

export function formatPostDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
