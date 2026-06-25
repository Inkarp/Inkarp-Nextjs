export const categories = [
  "All",
  "Application Notes",
  "Industry Insights",
  "Product Updates",
  "Company News",
];

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

const rawPosts = [
  {
    id: 1,
    title: "Revolutionizing Sample Preparation in Analytical Laboratories",
    category: "Application Notes",
    date: "2025-07-19",
    author: "Inkarp Applications Team",
    readTime: "6 min read",
    image: "/assets/blogs/BlogOne/revolutionizingSample1.jpeg",
    tags: ["Gravimetric Dosing", "Sample Preparation", "Pharma QC"],
    sections: [
      {
        type: "text",
        heading: "Revolutionizing Sample Preparation in Analytical Laboratories",
        content:
          "Sample preparation variability is a recurring source of Out of Specification (OOS) results that disrupt analytical laboratory workflows. Gravimetric sample preparation offers a transformative solution, enhancing weighing accuracy in labs, reducing laboratory errors, and improving efficiency. This blog explores how the gravimetric method addresses these challenges, with insights from key figures and tables in the original document.",
      },
      {
        type: "text",
        heading: "Understanding Gravimetric Sample Preparation",
        content:
          "Gravimetric sample preparation involves weighing both the solid sample and the solvent to achieve precise concentrations, unlike the volumetric method, which relies on less accurate volume measurements using volumetric glassware. By leveraging gravimetric dosing mixing systems like Quantos powder, this approach minimizes variability, reduces OOS results, and streamlines laboratory processes.",
      },
      {
        type: "text",
        heading: "The Impact of Out-of-Specification Results",
        content:
          "OOS results have long challenged the pharmaceutical industry, notably since a 1993 court ruling involving Barr Labs, which clarified that OOS results may stem from laboratory errors rather than batch failures. The FDA's 2006 guidelines emphasized thorough laboratory investigations to identify root causes. Sample processing and human error are the primary sources of OOS results, with sample processing consuming over 61% of laboratory time. The formal OOS investigation process can take days or months, costing thousands of dollars and generating complex Corrective and Preventative Actions (CAPAs) that complicate SOPs.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogOne/revolutionizingSample2.jpeg",
        caption: "Figure 1: Sources of OOS results and time spent in laboratory",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogOne/revolutionizingSample3.jpeg",
        caption: "Figure 2: The accepted formal process for investigating OOS results",
      },
      {
        type: "text",
        heading: "Good Weighing Practice: Ensuring Accuracy",
        content:
          "The Good Weighing Practice (GWP) standard provides a scientific foundation for weighing accuracy in labs, addressing measurement uncertainty and minimum weight requirements per USP General Chapter <41>. Measurement uncertainty increases with smaller sample weights, emphasizing the need for precise calibration balance procedures. A common misconception is that tare weight contributes to minimum weight compliance, but USP General Chapter <1251> clarifies that only the sample weight matters.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogOne/revolutionizingSample4.jpeg",
        caption:
          "Figure 3: Measurement uncertainty — absolute (green line) and relative (blue line) measurement uncertainty of a weighing instrument. The accuracy limit of the balance, the so-called minimum weight, is the intersection point between relative measurement uncertainty and the required weighing accuracy.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogOne/revolutionizingSample5.jpeg",
        caption:
          "Figure 4: Safety factor — variability of the relative measurement uncertainty due to changing environmental conditions and influences introduced by the operator. Weighing in the green area guarantees adherence to the weighing accuracy requirements (application of a safety factor).",
      },
      {
        type: "text",
        heading: "Challenges with Volumetric Methods",
        content:
          "The volumetric method relies on volumetric glassware, introducing several error sources. Failure rates: up to 50% of new glassware fails Class A specifications, per Coleman and Harris (2006). Calibration temperature: flasks are calibrated at 20°C, and deviations from endothermic/exothermic reactions or sonication introduce errors. Cross-contamination risk: reusing glassware requires rinsing, increasing solvent waste and contamination risks. Tolerances: relative percent errors are higher for smaller glassware sizes.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogOne/revolutionizingSample6.jpeg",
        caption:
          "Figure 5: A typical volumetric method workflow, outlining steps like gathering equipment and material, weighing, labeling, sonicating, and cleaning. This multi-step process, often exceeding 40 steps for multiple samples, is prone to laboratory errors. Tuned and untuned sonicators show inconsistent energy distribution in mixing, a key source of variability. Manual labeling further risks OOS results due to identification errors, requiring solvent-based removal that adds inefficiencies.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogOne/revolutionizingSample7.jpeg",
        caption: "Foils from a tuned and untuned sonicator",
      },
      {
        type: "table",
        columns: ["Pipettes — Volume (ml)", "Pipettes — Relative % Error", "Flasks — Volume (ml)", "Flasks — Relative % Error"],
        rows: [
          ["1", "0.5%", "10", "0.3%"],
          ["2", "0.4%", "25", "0.25%"],
          ["5", "0.3%", "50", "0.2%"],
          ["10", "0.2%", "100", "0.15%"],
        ],
        caption: "Table 1: Relative percent errors for Class A glassware",
      },
      {
        type: "text",
        heading: "Conclusion",
        content:
          "Gravimetric sample preparation directly addresses the dominant sources of OOS results — sample processing and human error — by replacing error-prone volumetric glassware workflows with precise, traceable weighing. Adopting Good Weighing Practice alongside gravimetric dosing systems like Quantos powder reduces laboratory errors, shortens investigation cycles, and improves data integrity across pharmaceutical QC operations.\n\nInkarp Instruments is a leading distributor and trusted service partner for METTLER TOLEDO products in India. Committed to innovation and excellence, Inkarp provides cutting-edge scientific instruments backed by expert support, empowering researchers nationwide to advance their work with confidence.",
      },
    ],
    comments: [],
  },
  {
    id: 2,
    title:
      "Advanced Application of Differential Scanning Calorimetry (DSC) in the Lithium-ion Battery Manufacturing Industry",
    category: "Application Notes",
    date: "2025-07-19",
    author: "Inkarp Applications Team",
    readTime: "9 min read",
    image: "/assets/blogs/BlogTwo/AdvanceApplication.jpeg",
    tags: ["DSC", "Lithium-ion Batteries", "Thermal Analysis"],
    sections: [
      {
        type: "text",
        heading:
          "Advanced Application of Differential Scanning Calorimetry (DSC) in the Lithium-ion Battery Manufacturing Industry",
        content:
          "Lithium-ion (Li-ion) batteries represent the cornerstone of modern energy storage systems, spanning applications from consumer electronics to electric vehicles (EVs) and grid-scale storage. As their utilization continues to expand, there is a corresponding escalation in the demand for improved performance metrics, extended cycle life, and, critically, enhanced operational safety. Central to achieving these objectives is the in-depth understanding of the thermal behaviour of individual battery components. Differential Scanning Calorimetry (DSC) emerges as a pivotal technique in this context, offering quantitative and qualitative insights into the enthalpic and thermodynamic transitions occurring in battery materials under controlled heating or cooling conditions.\n\nDSC measures the difference in heat flow between a sample and a reference as a function of time or temperature. It allows for the detection of a range of thermal events, including melting, crystallization, glass transitions, polymorphic transformations, decomposition reactions, and changes in heat capacity. These thermal fingerprints are invaluable in the assessment of battery component stability, compatibility, and phase behaviour, which directly influence battery safety and efficiency.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogTwo/AdvanceApplication1.jpeg",
        caption: "Figure 1: Hitachi NEXTA DSC200",
      },
      {
        type: "text",
        heading: "Electrolyte and Solvent Thermal Profiling",
        content:
          "The electrolyte system in Li-ion batteries typically comprises a lithium salt (e.g., LiPF6) dissolved in a mixture of organic carbonates such as ethylene carbonate (EC), dimethyl carbonate (DMC), and diethyl carbonate (DEC). These solvents have low flash points and are susceptible to exothermic degradation at elevated temperatures, often catalyzed by trace moisture or impurities.\n\nDSC enables the identification of critical parameters such as glass transition temperature (Tg), melting points (Tm), and decomposition onset temperatures. These transitions are significant for both low-temperature performance and high-temperature safety. For instance, the Tg of EC:DMC mixtures can range from -60°C to -40°C depending on salt concentration and solvent ratio, affecting ionic conductivity at sub-zero temperatures. Moreover, the decomposition of LiPF6-based electrolytes can occur around 150-180°C, releasing HF and triggering secondary reactions. DSC profiles help formulate thermally robust electrolytes and screen additives (such as flame retardants or stabilizers) for enhanced safety.",
      },
      {
        type: "text",
        heading: "Separator Melting and Shrinkage Behaviour",
        content:
          "Polyolefin separators such as polyethylene (PE) and polypropylene (PP) are widely used due to their chemical inertness and mechanical strength. However, these materials melt at relatively low temperatures (~120-170°C), compromising their dimensional stability and increasing the risk of internal short circuits under thermal stress. DSC is employed to precisely measure the melting points and thermal shrinkage behaviour of separator films.\n\nFor example, PP typically shows a sharp endothermic melting peak around 165°C, whereas PE melts near 130°C. Modified separators, such as those coated with ceramic layers (e.g., Al2O3 or SiO2), exhibit delayed or suppressed melting signals, indicating improved thermal stability. DSC thus serves as a rapid screening tool for separator selection and development, especially when evaluating separators for use in high-temperature or high-power applications.",
      },
      {
        type: "text",
        heading: "Evaluation of Binders and Electrode Formulation Components",
        content:
          "Electrode binders such as polyvinylidene fluoride (PVDF), styrene-butadiene rubber (SBR), and carboxymethyl cellulose (CMC) contribute to electrode mechanical integrity and processability. Their thermal behaviour during electrode drying and cell formation influences coating adhesion and interfacial stability. DSC allows the determination of the melting point, glass transition temperature, and thermal decomposition characteristics of these polymers.\n\nFor instance, PVDF shows a melting endotherm around 170-180°C and degrades above 300°C. Identifying these transitions ensures that the binder remains stable during processing and storage. Furthermore, additives like conductive carbon or functional polymers can be analyzed for thermal interactions with active materials or solvents. Any shift in thermal events indicates possible incompatibilities or synergistic interactions, which can be harnessed or mitigated accordingly.",
      },
      {
        type: "text",
        heading: "Solid-State and Polymer Electrolyte Systems",
        content:
          "With the rise of all-solid-state lithium batteries (ASSLBs), the characterization of inorganic and polymeric electrolytes has become increasingly important. DSC is indispensable for evaluating phase transitions such as crystallization, melting, or glass transition in these solid electrolytes. For example, polyethylene oxide (PEO)-based polymer electrolytes exhibit semi-crystalline behaviour with melting around 60°C and a Tg near -60°C. The degree of crystallinity and the thermal transitions influence ionic conductivity and mechanical properties.\n\nSimilarly, inorganic solid electrolytes like Li7La3Zr2O12 (LLZO) or NASICON-type materials may undergo phase transitions that affect their stability and performance. DSC can detect these subtle transitions, which are often correlated with ionic mobility and electrode-electrolyte interfacial resistance. Understanding these thermophysical properties enables the rational design of hybrid and composite electrolytes for next-generation solid-state cells.",
      },
      {
        type: "text",
        heading: "Degradation Analysis",
        content:
          "DSC also plays a crucial role in degradation analysis, especially when evaluating thermophysical changes in aged or cycled battery components. By comparing the thermal profiles of pristine versus aged materials, variations in crystallinity, heat flow, and decomposition behaviour can be identified. For instance, increased exothermicity in a cathode after extended cycling may indicate structural degradation or elevated surface reactivity. Likewise, the absence or shift of characteristic melting peaks in the electrolyte region may reflect salt decomposition or solvent loss.\n\nIn SEI (solid electrolyte interphase) characterization, DSC provides indirect evidence of SEI formation and evolution, especially when coupled with other techniques such as TGA or MS. Such thermal fingerprinting is useful in lifetime prediction, thermal tolerance assessment, and warranty analytics.",
      },
      {
        type: "text",
        heading: "Thermal Safety Profiling",
        content:
          "Battery safety evaluation under thermal, mechanical, or electrical stress conditions necessitates preliminary screening of material thermal sensitivity. DSC is routinely employed as a first-line technique prior to more advanced and resource-intensive methods such as Accelerating Rate Calorimetry (ARC). DSC offers critical early-stage data, including exothermic onset temperatures, total heat release, and thermal stability thresholds under both inert and oxidative environments.\n\nAdvanced DSC methods, including temperature modulated DSC (TM-DSC), enable deconvolution of overlapping thermal events, allowing for precise attribution of transitions. This is critical in constructing thermal propagation models for battery management systems (BMS), fire risk assessment, and compliance with regulatory standards (e.g., UN 38.3, IEC 62133, UL 1642).",
      },
      {
        type: "text",
        heading: "Published Findings",
        content:
          "Published studies have used DSC to characterize a range of thermal events in lithium-ion battery materials. Mono- and bi-salt ether-based electrolytes for high-loading lithium-metal batteries showed Tg ranging from -61°C to -53°C depending on salt type and concentration, with no observable melting or crystallization peaks between -90°C and 50°C — indicating a fully amorphous electrolyte system critical for uniform ion conduction and thermal stability. Exothermic decomposition onsets were detected at 160°C and 180°C, correlating with enhanced thermal resilience of the formulations.\n\nA highly-concentrated poly(ethylene carbonate) (PEC)-based solid polymer electrolyte containing 80 wt% lithium bis(fluorosulfonyl)imide (LiFSI), supported by a 3D macroporous polyimide matrix, showed a Tg of -47°C with no detectable crystallization or melting transitions in the -70°C to 110°C range — confirming the stability and amorphous character essential for room-temperature ion conduction.\n\nHoley reduced graphene oxide/polystyrene (HRGO/PS) anode composites showed a broad endothermic baseline without distinct melting peaks up to 250°C, indicating exceptional thermal stability. An exothermic onset corresponding to polymer degradation was observed at ~305°C, and the post-annealed composite exhibited a 37% reduction in degradation enthalpy compared to pristine PS.\n\nBifunctional PEG-based cross-linked polymer electrolytes for all-solid-state Li-ion batteries showed Tg ranging from -29.2°C to -8.2°C depending on the [EO]/[Li+] ratio, with no observable melting or crystallization peaks up to 100°C, confirming an amorphous cross-linked network structure.\n\nPVDF nanofiber-reinforced solid polymer electrolytes showed Tm increasing from 149.6°C (pristine) to 157.2°C after incorporating crystalline PVDF nanofibers, with the exothermic decomposition onset shifting from 215.3°C to 231.8°C and the enthalpy of melting increasing from 28.4 J/g to 35.7 J/g — reflecting improved thermal stability and structural reinforcement.\n\nAll referenced thermal measurements were conducted using Hitachi High-Tech Differential Scanning Calorimeters.",
      },
      {
        type: "text",
        heading: "Conclusion",
        content:
          "DSC serves as a vital analytical technique within the lithium-ion battery manufacturing and research ecosystem. Its ability to precisely resolve thermal transitions in complex, multi-component systems enables in-depth evaluation of material compatibility, phase stability, and thermal decomposition thresholds. From optimizing separator compositions to enhance thermal tolerance, to screening cathode materials for resistance to exothermic runaway reactions, and evaluating the thermal stability of electrolyte formulations, DSC provides critical thermodynamic data essential for the rational design of safe and high-performance battery systems. As the field advances toward solid-state configurations and next-generation chemistries, the strategic importance of DSC continues to expand — cementing its role as a cornerstone of advanced materials characterization in battery innovation.\n\nInkarp Instruments is a leading distributor and trusted service partner for Hitachi products in India.",
      },
    ],
    comments: [],
  },
  {
    id: 3,
    title: "Precision Hydrogen Content in Crude Oil Analysis with NMR Spectroscopy",
    category: "Application Notes",
    date: "2025-06-19",
    author: "Inkarp Applications Team",
    readTime: "5 min read",
    image: "/assets/blogs/BlogThree/Image1.jpeg",
    tags: ["NMR Spectroscopy", "Crude Oil Analysis", "Petroleum Testing"],
    sections: [
      {
        type: "text",
        heading: "Precision Hydrogen Content in Crude Oil Analysis with NMR Spectroscopy",
        content:
          "Determining the hydrogen content in crude oil is vital for assessing petroleum quality and optimizing the use of crude oils in refining and combustion processes. Nuclear magnetic resonance (NMR) spectroscopy offers a robust, efficient alternative to traditional methods like ASTM D5291, enabling precise hydrogen analysis of paraffins, naphthenes, and aromatics. This blog explores how Nanalysis' high-performance 60 MHz 1H NMR spectroscopy simplifies crude oil analysis.",
      },
      {
        type: "text",
        heading: "Importance of Hydrogen Analysis in Crude Oils",
        content:
          "The hydrogen content in crude oil, typically ranging from 9-16 wt% per ASTM D5291, directly influences combustion efficiency, making it a critical parameter in petroleum quality testing. Traditional ASTM D5291 methods rely on elemental analyzers, requiring compressed gases and frequent maintenance, which increase costs and complexity. In contrast, 1H NMR spectroscopy provides a quantitative, non-destructive approach to hydrogen analysis, capturing signals from paraffins, naphthenes, and aromatics in a single spectrum. This method's simplicity and in-house applicability reduce operational costs and turnaround times, enhancing efficiency in crude oil analysis.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogThree/Image2.png",
        caption: "Nanalysis 60 Benchtop NMR Spectrometer",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogThree/Image3.jpeg",
        caption:
          "Table 1. Comparison of running 3000 samples between elemental analysis (EA) (following ASTM D5291 for hydrogen content analysis in oils) and benchtop nuclear magnetic resonance (NMR) spectroscopy.",
      },
      {
        type: "text",
        heading: "Method: NMR Spectroscopy with Internal Calibrant HMDSO",
        content:
          "Using a Nanalysis 60 PRO instrument at 60.73 MHz, 1H NMR spectroscopy was applied to measure hydrogen content in crude oil analogs, 1-octene and undecane. The method employed hexamethyldisiloxane (internal calibrant HMDSO) as a reference for quantitative integration. Spectra were acquired at 32°C with a spectral width of 40 ppm, 8 scans, and a 23-second interscan delay. Integration regions for the sample and HMDSO were used to calculate hydrogen content via a specific equation. Results for 1-octene (average 14.33%) and undecane (average 15.84%) closely matched theoretical values (14.37% and 15.47%, respectively), with relative standard deviations (RSD) of 0.6% and 0.5%. This demonstrates the accuracy and reproducibility of high-performance 60 MHz 1H NMR spectroscopy for hydrogen analysis.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogThree/Image4.jpeg",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogThree/Image5.jpeg",
        caption:
          "Figure 1: Representative 1H NMR spectrum of 1-octene (top) and undecane (bottom) in CDCl3. The integration regions used in the calculation, I(Sample) and I(HMDSO), are highlighted.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogThree/Image6.jpeg",
        caption: "Table 2. Results of hydrogen content determination using the 60 MHz benchtop NMR for 1-octene and undecane.",
      },
      {
        type: "text",
        heading: "Conclusion: Advancing Crude Oil Analysis with NMR",
        content:
          "Nuclear magnetic resonance using 1H NMR spectroscopy revolutionizes hydrogen content determination in crude oil, offering a faster, cost-effective alternative to ASTM D5291. The Nanalysis high-performance 60 MHz 1H NMR system, with internal calibrant HMDSO, ensures precise crude oil analysis of paraffins, naphthenes, and aromatics, supporting petroleum quality testing. Its benchtop design enables in-house testing, reducing reliance on external labs.\n\nInkarp Instruments acts as a reliable distributor and service provider for Nanalysis products in India, offering advanced scientific solutions tailored to the dynamic requirements of modern research. With a commitment to excellence and trustworthiness, we enable researchers across India with state-of-the-art technology and dedicated support to advance innovation and discovery.\n\nReferences:\n[1] Ali, I.; Basit, M. A. Int. J. Hydrogen Energy 1993, 18, 1009-1011.\n[2] Drews, A. W. Manual on Hydrocarbon Analysis (ASTM D5291): 6th Edition; American Society for Testing and Materials, 1998, 852-856.\n[3] Mondal, S.; Kumar, R.; Bansal, V.; Patel, M. B. J. Anal. Sci. Technol. 2015, 6, 1-10.\n[4] Bharti, S. K.; Roy, R. Trends Anal. Chem. 2012, 35, 5-26.",
      },
    ],
    comments: [],
  },
  {
    id: 4,
    title: "Advancing Cancer Diagnostics with Precision CTC Analysis",
    category: "Industry Insights",
    date: "2025-06-19",
    author: "Inkarp Applications Team",
    readTime: "6 min read",
    image: "/assets/blogs/BlogFour/Image1.jpeg",
    tags: ["Circulating Tumor Cells", "Oncology Diagnostics", "Cell Dispensing"],
    sections: [
      {
        type: "text",
        heading: "Advancing Cancer Diagnostics with Precision CTC Analysis",
        content:
          "The field of cancer diagnostics is rapidly evolving, with a growing emphasis on technologies that can detect and analyze rare cells in the bloodstream, such as circulating tumor cells (CTCs). These cells, which are shed from tumors and circulate in the blood, hold immense potential for non-invasive cancer detection and treatment monitoring. However, their extreme rarity — often just one CTC per 10 billion red blood cells — presents significant challenges for accurate detection. To address this, innovative solutions like RareCyte's AccuCyte and CyteFinder instrument, combined with Cellenion's cellenONE for CTC analysis, are revolutionizing rare cell analysis technology by enabling precise and reproducible validation of CTC assays.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogFour/Image2.jpg",
        caption: "RareCyte CyteFinder® II",
      },
      {
        type: "text",
        heading: "A Novel Approach to CTC Validation",
        content:
          "The rarity of CTCs demands technologies that combine high sensitivity with robust reproducibility. RareCyte, a leader in circulating tumor cell analysis, has developed the AccuCyte-CyteFinder system, which offers an end-to-end workflow for CTC enumeration and biomarker expression analysis in cancers such as breast cancer, prostate cancer, and lung cancer. To ensure the accuracy required for clinical trials, rigorous assay validation is critical. This involves creating surrogate blood samples with known quantities of model CTCs (mCTCs) at levels close to the assay's limit of detection.\n\nTraditional methods like serial dilution or flow cytometry often fall short in delivering the precision needed for such low cell counts. To overcome this, RareCyte partnered with Cellenion to leverage a circulating tumor cell spike-in method using the cellenONE instrument. The cellenONE is a single-cell isolation and dispensing technology that uses automated image recognition to ensure each dispensed droplet contains exactly one cell. Originally designed for single-cell analyses and cell line development, this cell dispenser has been adapted for CTC assay validation, offering unmatched accuracy and precision.",
      },
      {
        type: "text",
        heading: "The Validation Workflow",
        content:
          "The collaboration between RareCyte and Cellenion resulted in a tailored workflow for CTC assay validation. A customized sample deck was designed for the cellenONE, enabling precise deposition of cells onto microscope slides or into RareCyte's AccuCyte Blood Collection Tubes (BCTs) containing 7.5 ml of whole blood. The cellenONE was programmed to dispense 100 cells per slide or 5-8 cells per BCT. These samples were then processed using the AccuCyte system, stained with the RarePlex Enumeration Panel Kit, and analyzed with the CyteFinder Instrument to count CTCs.\n\nThis workflow ensures that circulating tumor cell assays are validated with a high degree of standardization, critical for clinical applications. The ability to deposit precise numbers of mCTCs, such as HAP1 and SW900 cell lines, into blood samples allows researchers to mimic the clinical scarcity of CTCs, making validation studies both accurate and reproducible.",
      },
      {
        type: "text",
        heading: "Impressive Results with High Recovery Rates",
        content:
          "The results of this circulating tumor cell spike-in method are remarkable. The cellenONE system, when printing 100 mCTCs directly onto slides, demonstrated exceptional accuracy: across eight replicates, a total of 800 cells were dispensed, with 797 recovered, yielding a recovery rate of 99%. This near-perfect accuracy confirms the reliability of the cellenONE for high-throughput applications.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogFour/Image3.jpg",
        caption:
          "Figure 2: mCTC images from cellenONE spike-in assay. CTCs are identified by the presence of a nucleus, localization of cytokeratin (CK) to the cytoplasm or epithelial cell adhesion molecule (EpCAM) to the cell membrane, and absence of CD45 localization. A. HAP-1 mCTC spike-in assay. B. SW900 mCTC spike-in assay. Scale bar represents 5 μm.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogFour/Image4.jpg",
        caption: "Figure 3: Image of 100 mCTCs printed to a slide.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogFour/Image5.jpg",
        caption: "Table 1: Recovery results from the cellenONE spike-in validation across eight replicates.",
      },
      {
        type: "text",
        heading: "Transforming Cancer Diagnostics",
        content:
          "The integration of cellenONE into RareCyte's validation workflow has set a new standard for circulating tumor cell analysis. Unlike flow cytometry or serial dilution, which struggle with low cell counts, the cellenONE delivers unparalleled accuracy and reproducibility. This makes it an essential tool for rare cell analysis technology, particularly in the context of clinical trials where precision is non-negotiable.\n\nBy enabling the creation of standardized samples with known mCTC counts, the cellenONE ensures that RareCyte's CTC assays meet the stringent requirements of cancer diagnostics. This technology not only enhances the reliability of CTC enumeration but also supports biomarker expression analysis, paving the way for personalized treatment strategies in breast cancer, prostate cancer, and lung cancer.",
      },
      {
        type: "text",
        heading: "Conclusion",
        content:
          "Precision cell dispensing has closed a critical validation gap for circulating tumor cell assays — enabling reproducible, near-perfect recovery rates at cell counts that mirror real clinical scarcity. As CTC-based diagnostics move further into routine oncology workflows, this level of validation rigor will be essential for regulatory confidence and clinical adoption.\n\nInkarp Instruments stands as a trusted distributor and service provider of RareCyte's advanced scientific solutions in India, delivering cutting-edge technology tailored to the dynamic needs of modern research. Committed to excellence, we empower researchers across the nation with innovative tools and unparalleled expertise, fostering breakthroughs and driving progress in scientific discovery.\n\nReference: RareCyte",
      },
    ],
    comments: [],
  },
  {
    id: 5,
    title: "Advancing Polymer Synthesis for a Sustainable Future",
    category: "Industry Insights",
    date: "2025-06-19",
    author: "Inkarp Applications Team",
    readTime: "5 min read",
    image: "/assets/blogs/BlogFive/Image1.jpeg",
    tags: ["Polymer Synthesis", "Sustainability", "Reactor Technology"],
    sections: [
      {
        type: "text",
        heading: "Advancing Polymer Synthesis for a Sustainable Future",
        content:
          "Mounting plastic waste is prompting innovative solutions in polymer synthesis and recycling. Researchers are now focusing on creating polymers that can be chemically recycled, addressing limitations in traditional plastic recycling methods, such as the inability to remove colorants. At Cardiff University, work using the Radleys Reactor-Ready system has led to the development of single-component, colored polymers that can be depolymerized and remade into colorless materials, offering a promising path toward sustainability. This article explores how these advancements in chemical synthesis and reactor technology are revolutionizing the plastics recycling industry and paving the way for materials science innovations.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogFive/Image2.jpg",
      },
      {
        type: "text",
        heading: "Developing Colored Polymers with Chromophore Integration",
        content:
          "Researchers at Cardiff University have developed a method to synthesize highly colored, glowing polymers using epoxide-anhydride ring-opening copolymerization (ROCOP). By incorporating chromophore-containing monomers, they create highly colored polymers with covalent bonding of dyes, requiring only minimal dopant levels. This approach ensures that the polymers retain the properties of the base material while exhibiting vibrant coloration and luminescence, critical for applications in fluorescent polymer research and advanced materials development. The result is a versatile polymer with tailored optical properties, suitable for various industrial polymer applications.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogFive/Image3.png",
      },
      {
        type: "text",
        heading: "Scaling Synthesis with Reactor-Ready Technology",
        content:
          "The synthesis of these innovative polymers was conducted on a laboratory scale using a Radleys Reactor-Ready 2-litre jacketed lab reactor, equipped with a Hei-TORQUE stirrer and a Huber Ministat for precise temperature control. This lab reactor enabled the production of 280-320 grams of material in a single reaction, demonstrating its capability for polymer scale synthesis. The use of an external PT1000 temperature probe with the Huber Ministat allowed researchers to monitor and control reaction temperatures effectively, mitigating the risks of exothermic reactions common in large-scale epoxide homopolymerizations. This setup ensures safety and consistency, making it ideal for scaling up chemical reactions in research settings.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogFive/Image4.jpeg",
        caption: "Radleys Reactor-Ready™ Flex Lab Reactor",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogFive/Image5.jpg",
      },
      {
        type: "text",
        heading: "Revolutionizing Plastic Recycling",
        content:
          "A key breakthrough in this research is the ability to chemically recycle colored polymers back to their parent acid or alcohol, removing the chromophore to produce colorless, pure polymers. Unlike traditional plastic recycling, which struggles with persistent colorants, this method allows for the complete regeneration of base monomers, which can then be repolymerized into high-quality, color-free materials. This innovation addresses a critical challenge in the plastics recycling industry, offering a sustainable solution that supports a circular economy. The strategy's flexibility also allows for the integration of various dopants, enabling the creation of polymers with customized properties for diverse applications.",
      },
      {
        type: "text",
        heading: "Impact on Materials Science and Industry",
        content:
          "The advancements achieved through this research have far-reaching implications for materials science innovations and industrial polymer applications. By enabling the production of recyclable, functional polymers with tailored properties, this approach supports the development of sustainable materials for industries ranging from packaging to electronics. The ability to scale up polymer synthesis using advanced reactor systems like the Radleys Reactor-Ready ensures that these innovations can transition from the lab to industrial settings, driving progress toward a more sustainable future.",
      },
      {
        type: "text",
        heading: "Conclusion: A Path to Sustainable Polymer Production",
        content:
          "The work at Cardiff University highlights the transformative potential of chemical synthesis in addressing environmental challenges. By leveraging the Radleys Reactor-Ready system for polymer scale production and developing recyclable, glowing polymers, researchers are redefining the possibilities in the plastics recycling industry. These materials science innovations not only solve critical recycling challenges but also open new avenues for creating advanced, sustainable materials. As this technology scales, it promises to reshape how we produce, use, and recycle polymers, fostering a more sustainable and innovative future.\n\nInkarp Instruments is a trusted distributor and service provider of Radleys products in India, delivering advanced scientific solutions tailored to the needs of contemporary research. Committed to excellence, we empower scientists across the country with innovative technology and expert support to advance discovery and innovation.\n\nReference: Radleys",
      },
    ],
    comments: [],
  },
  {
    id: 11,
    title: "Dynamic Viscoelastic Analysis of Polypropylene Homopolymer and Block Copolymer",
    category: "Application Notes",
    date: "2025-06-19",
    author: "Inkarp Applications Team",
    readTime: "6 min read",
    image: "/assets/blogs/BlogEleven/Image1.jpeg",
    tags: ["DMA", "Polypropylene", "Viscoelasticity"],
    sections: [
      {
        type: "text",
        heading: "Dynamic Viscoelastic Analysis of Polypropylene Homopolymer and Block Copolymer",
        content:
          "Polypropylene (PP) is a general-purpose resin widely used in industries for manufacturing everyday products such as automobile parts and household electrical goods. Three common types of PP utilized as industrial materials include polypropylene homopolymer (made of propylene only), polypropylene block copolymer (with ethylene), and random copolymer (with ethylene). Each type possesses distinct properties, and their application depends on the desired characteristics of the final product.\n\nIn addition to block PP, the polypropylene block copolymer incorporates polypropylene homopolymer, ethylene propylene rubber (EPR), and PE copolymer. The block copolymer features a sea-island structure, with a continuous matrix phase of PP and a dispersed phase of EPR and PE copolymer domains.\n\nThis brief focuses on dynamic viscoelastic measurement of polypropylene homopolymer and polypropylene block copolymer to evaluate their viscoelastic properties.",
      },
      {
        type: "text",
        heading: "Experiment",
        content:
          "The samples consisted of a commercially available polypropylene homopolymer and a polypropylene block copolymer containing approximately 6% ethylene. Measurements were conducted using the DMA200 Dynamic Mechanical Analyser, and the measurement conditions included five frequencies (0.5, 1, 2, 5, and 10 Hz), a temperature range from -120°C to 150°C, and a heating rate of 2°C/min.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogEleven/Image2.webp",
        caption: "Hitachi NEXTA® DMA200",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogEleven/Image3.jpeg",
      },
      {
        type: "text",
        heading: "Measurement Results",
        content:
          "Figures 2 and 3 present the dynamic viscoelasticity spectrum of the homopolymer and copolymer, respectively. These results reflect simultaneous measurements of temperature and frequency dispersion in polymers, displaying storage modulus (E'), loss modulus (E\"), and tan δ curves across five frequencies (0.5 to 10 Hz).\n\nThe polypropylene homopolymer results (Figure 2) reveal three dispersions: α (crystal relaxation), β (glass transition temperature), and γ (local mode relaxation). In contrast, the polypropylene block copolymer results (Figure 3) exhibit an additional peak between -50°C and -30°C on the E\" and tan δ curves, likely corresponding to the glass transition temperature of ethylene propylene rubber in the block PP.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogEleven/Image4.jpeg",
        caption: "Figure 2: Dynamic viscoelasticity spectrum of homopolymer",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogEleven/Image5.jpeg",
        caption: "Figure 3: Dynamic viscoelasticity spectrum of copolymer",
      },
      {
        type: "text",
        content:
          "Figures 4 and 5 display the apparent activation energy derived from the tan δ dispersion peaks in Figures 2 and 3. Similar values were obtained for α-dispersion (crystal relaxation) and β-dispersion (glass transition temperature) for the PP component in both the homopolymer and block copolymer. Additionally, the apparent activation energy of the dispersion peak between -50°C and -30°C in the block copolymer was 292.5 kJ/mol, supporting the attribution to the glass transition temperature of ethylene propylene rubber.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogEleven/Image6.jpeg",
        caption: "Figure 4: Apparent activation energy for α- and β-dispersion of homopolymer",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogEleven/Image7.jpeg",
        caption: "Figure 5: Apparent activation energy for α- and β-dispersion of copolymer",
      },
      {
        type: "text",
        content:
          "Figure 6 compares the E' and tan δ curves at 10 Hz for polypropylene homopolymer and polypropylene block copolymer. Below -80°C, both exhibit similar storage modulus transitions. However, post-EPR dispersion, the storage modulus of the block copolymer is lower than that of the homopolymer, likely due to the influence of ethylene propylene rubber and PE copolymer domains. Additionally, the tan δ curves indicate higher vibrational absorption in the block copolymer at low temperature below the PP dispersion, attributed to the EPR and PE copolymer domains.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogEleven/Image8.jpeg",
        caption: "Figure 6: Comparison of E' and tan δ curves for homopolymer and copolymer at 1 Hz",
      },
      {
        type: "text",
        heading: "Conclusion",
        content:
          "This application note demonstrates dynamic viscoelastic measurement of polypropylene homopolymer and polypropylene block copolymer to assess their viscoelastic properties. The polypropylene block copolymer results reveal the glass transition temperature of ethylene propylene rubber alongside the inherent relaxation of PP. Notably, differences in vibrational absorption were observed, particularly at low temperature, highlighting the impact of EPR and PE copolymer domains in enhancing vibrational absorption in block copolymers compared to homopolymers.\n\nInkarp Instruments is a leading distributor and trusted service partner for Hitachi products in India. Committed to innovation and excellence, Inkarp provides cutting-edge scientific instruments backed by expert support, empowering researchers nationwide to advance their work with confidence.\n\nReferences:\n1. Yasaku Wada, \"Solid Properties of Polymers\", Baihukan (1971)\n2. N. Okubo, Application Brief DMS No.7, SII NanoTechnology (1990)",
      },
    ],
    comments: [],
  },
  {
    id: 12,
    title: "Advancing Edible Oil Quality Control with FT-NIR Spectroscopy",
    category: "Application Notes",
    date: "2025-06-19",
    author: "Inkarp Applications Team",
    readTime: "7 min read",
    image: "/assets/blogs/BlogTwelve/Image1.jpeg",
    tags: ["FT-NIR", "Edible Oil", "Process Analytical Technology"],
    sections: [
      {
        type: "text",
        heading: "Advancing Edible Oil Quality Control with FT-NIR Spectroscopy",
        content:
          "In the food industry, ensuring the quality and safety of edible oils is critical for meeting consumer expectations and regulatory standards. From seed oil to finished products like sunflower oil, canola oil, and soybean oil, producers face challenges in maintaining consistent quality. Traditional analytical methods are often slow and involve hazardous chemicals. Bruker Optics' FT-NIR spectroscopy is a non-destructive testing method that delivers rapid, accurate results. This blog explores how FT-NIR analyzers enhance quality control across the entire edible oil production chain, from seed reception to by-product analysis, ensuring efficiency, safety, and compliance.",
      },
      {
        type: "text",
        heading: "The Power of FT-NIR Spectroscopy in Edible Oil Analysis",
        content:
          "Near-infrared spectroscopy is a well-established technique in agriculture, and its adoption in the food industry is growing. FT-NIR spectroscopy, pioneered by Bruker Optics, offers a non-destructive testing solution for analyzing both liquid and solid samples. Unlike traditional wet-chemical or chromatographic methods, which are time-consuming and require hazardous solvents, FT-NIR analyzers provide a safer, faster alternative. These systems deliver precise results without sample preparation, reducing costs and environmental impact, making them ideal for the edible oil industry.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogTwelve/Image2.jpeg",
        caption: "Figure 1: Production chain",
      },
      {
        type: "text",
        heading: "Quality Control Across the Production Chain",
        content:
          "FT-NIR spectroscopy supports quality control at every stage of edible oil production, from seed reception to by-product utilization.\n\nSeed Reception: Analyzing incoming oilseeds, such as sunflower seed, rapeseed, canola, soybeans, and sesame seed, at the reception bay is crucial for quality control and fair pricing. Traditional methods often involve sending samples to external laboratories, causing delays. FT-NIR analyzers enable rapid, on-site analysis, allowing tight quality control before seeds are discharged, ensuring only high-quality seeds proceed to processing.\n\nStorage: Proper storage of oilseeds is essential to prevent bacterial, fungal, or mold growth, which can render seed oil unfit for consumption and lead to profit losses. FT-NIR spectroscopy monitors moisture content and storage conditions, ensuring optimal seed quality for processing. Regular analysis also supports drying processes, maintaining seed integrity over extended storage periods.\n\nOil Extraction: Cleaning, drying, dehulling, and flaking maximize oil yield from seeds. FT-NIR spectroscopy monitors moisture and oil levels in seeds and expeller cakes, providing quick insights into extraction efficiency. It also analyzes crude oil for parameters like free fatty acids, phospholipids, and waxes, optimizing conditions for the subsequent refining process.\n\nOil Refining: Refining removes undesirable substances like free fatty acids and colors but may eliminate valuable components like antioxidants. FT-NIR analyzers enable close monitoring of refining processes and final product testing, both in the lab and through real-time, online process analytical technology. This eliminates delays and costly rework, ensuring high-quality oils.\n\nFat Modification: Natural oils often require modification through fractionation, interesterification, or hydrogenation to meet food industry demands. FT-NIR spectroscopy monitors physical and chemical properties, including fatty acid profile, free fatty acids, trans fatty acids, iodine value, and solid fat content (SFC), ensuring the modified oils meet nutritional and functional requirements.\n\nBy-Products: By-products like hulls and expeller cakes are valuable for industries such as animal feed. FT-NIR analyzers assess parameters like moisture, oil, protein, fiber, and ash content in under a minute, helping determine market value and ensuring quality for secondary applications.",
      },
      {
        type: "text",
        heading: "Quality Control of Finished Edible Oils",
        content:
          "Edible oils, including sunflower oil, canola oil, soybean oil, corn oil, fish oil, tallow, and lard, require rigorous quality assessment. FT-NIR analyzers measure critical parameters such as free fatty acids, trans fatty acids, iodine value, peroxide value, anisidine value, fatty acid profile, triglyceride profile, SEC screening, saturation, and color. These measurements align with standards set by the American Oil Chemists' Society (AOCS) and the German Society for Fat Science, replacing slow traditional methods with rapid, reliable results.",
      },
      {
        type: "text",
        heading: "Olive Oil Authentication: Ensuring Liquid Gold",
        content:
          "Extra virgin olive oil, produced through cold-pressing without chemicals, is prone to adulteration due to its premium value. FT-NIR spectroscopy provides a robust solution for olive oil authentication, monitoring the production process and detecting low-quality or adulterated oils, ensuring consumer trust and brand integrity.",
      },
      {
        type: "text",
        heading: "Optimizing Frying Oil Quality",
        content:
          "The quality of frying oil significantly affects the taste, color, and safety of fried foods. FT-NIR spectroscopy monitors frying oil degradation, analyzing parameters like free fatty acids, total polar compounds, polymerized triglycerides, and anisidine value. Recognized by the German Society for Fat Science in their 2013 Standard Method, FT-NIR analyzers deliver accurate, rapid results, enabling consistent quality in fast-food and large-scale frying operations.",
      },
      {
        type: "text",
        heading: "Process Analytical Technology for Real-Time Control",
        content:
          "FT-NIR spectroscopy is integral to process analytical technology (PAT) in food processing. The Bruker Optics MATRIX-F spectrometer supports online process control for solid and liquid samples, using contact and non-contact sensors, including fiber optic probes that withstand temperatures up to 260°C. This enables continuous monitoring in industrial deep-fat frying, ensuring optimal oil quality, reducing waste, and enhancing economic efficiency.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogTwelve/Image3.png",
        caption: "Bruker MATRIX-F II FT-NIR Spectrometer",
      },
      {
        type: "text",
        heading: "State-of-the-Art Technology and Software",
        content:
          "Bruker Optics' FT-NIR analyzers feature the RockSolid interferometer with cube corner mirrors, resistant to vibration and thermal effects, ensuring stability and reliability in harsh factory environments. The pre-aligned, user-replaceable light source minimizes downtime, and precise wavelength accuracy supports calibration transfer, making these analyzers ideal for both lab and production settings.\n\nThe OPUS software suite enhances FT-NIR analyzers with tools for calibration development, raw material identification, and conformity testing. The Multi Evaluation (ME) function automates hierarchical analyses, combining identification, quantification, and conformity tests. OPUS/LAB offers an intuitive interface for routine operators, while OPUS/PROCESS supports automated process control with integration options like Profibus DP, Modbus, and OPC. The software ensures data security with GMP/GLP compliance, 21 CFR Part 11 conformity, and permanent online diagnostics.",
      },
      {
        type: "text",
        heading: "Conclusion",
        content:
          "FT-NIR spectroscopy from Bruker Optics transforms edible oil quality testing by providing a rapid, non-destructive solution across the production chain — from seed reception to olive oil authentication and by-product analysis. By integrating process analytical technology, producers achieve real-time control, reduce costs, and meet stringent standards. With robust technology, intuitive software, and comprehensive support, FT-NIR analyzers empower the edible oil industry to deliver high-quality products consistently.\n\nInkarp Instruments is a premier distributor and dependable service partner for Bruker products in India. Committed to innovation and excellence, Inkarp supplies advanced scientific instruments along with expert support, enabling researchers across the country to drive groundbreaking discoveries.\n\nReference: Bruker",
      },
    ],
    comments: [],
  },
  {
    id: 13,
    title:
      "Analytical Validation of an Immunofluorescence Assay for ARv7 Protein Expression on Circulating Tumor Cells Using the RareCyte Platform",
    category: "Application Notes",
    date: "2025-06-05",
    author: "Inkarp Applications Team",
    readTime: "8 min read",
    image: "/assets/blogs/BlogThirteen/Image1.jpg",
    tags: ["Immunofluorescence", "ARv7", "Liquid Biopsy"],
    sections: [
      {
        type: "text",
        heading:
          "Analytical Validation of an Immunofluorescence Assay for ARv7 Protein Expression on Circulating Tumor Cells Using the RareCyte Platform",
        content:
          "In the realm of precision oncology, the characterization of circulating tumor cells (CTCs) through non-invasive methods like liquid biopsy has gained significant traction. These advancements offer real-time insights into tumor heterogeneity, therapy resistance, and potential biomarker identification in various cancers, particularly prostate cancer. A growing area of focus is the detection of the androgen receptor splice variant ARv7, which has been associated with resistance to anti-androgen therapies. This document outlines the analytical validation of an immunofluorescence assay developed to detect ARv7 protein expression on CTCs using the RareCyte Platform, providing a powerful tool for assessing treatment efficacy and guiding therapeutic decisions.",
      },
      {
        type: "text",
        heading: "Study Background",
        content:
          "CTCs represent a valuable diagnostic resource by enabling blood sample analysis for assessing drug target expression and disease progression without invasive procedures. The presence of ARv7 in tumor cells derived from prostate cancer patients is linked to poor response to second-generation anti-androgen therapies. This study aimed to validate a robust immunofluorescence-based assay to detect and quantify ARv7 expression using the RareCyte Platform, with the potential to refine treatment strategies and monitor patient response through liquid biopsy.",
      },
      {
        type: "text",
        heading: "Methods",
        content:
          "The study utilized blood samples from healthy donors, spiked with prostate cancer cell lines representing a range of ARv7 expression levels: 22RV1 (high), LNCAP (low), and BT-474 (negative). Sample preparation was executed using the AccuCyte Sample Preparation System.\n\nStaining was conducted with an automated slide staining system, using the RarePlex ARv7 CTC Panel Kit. This panel incorporates a nuclear dye, anti-CD45 (to exclude leukocytes), antibodies to cytokeratin and epithelial cell adhesion molecule (EpCAM), and an ARv7-specific antibody. Slides were then imaged using the CyteFinder Instrument, and CTC detection was performed via a machine learning-based algorithm followed by expert review. For quantification, mean fluorescence intensity (MFI) was used as a measure of ARv7 protein levels, providing an objective readout of expression.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogThirteen/Image2.jpg",
        caption: "RareCyte CyteFinder II",
      },
      {
        type: "text",
        heading: "Results",
        content:
          "The study successfully established an ARv7 MFI threshold that reliably distinguished ARv7-positive from ARv7-negative cells. The assay identified 83% of 22RV1 cells as positive and 98% of BT-474 cells as negative, demonstrating an overall accuracy of 90%. Importantly, ARv7-positive staining in clinical prostate cancer samples was appropriately localized to the nucleus, confirming the assay's biological relevance.\n\nWhen compared with a standard CTC detection assay, recovery rates using the ARv7 assay were at least equivalent, validating its efficiency. Furthermore, the ARv7 assay allowed for precise single-cell analysis, contributing to a deeper understanding of tumor heterogeneity.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogThirteen/Image3.jpeg",
        caption:
          "Figure 1: The RareCyte ARv7 CTC assay workflow. Blood was collected into AccuCyte Blood Collection Tubes. Nucleated blood cells were processed to slides using the density-based AccuCyte Sample Preparation System. Slides were stained with the RarePlex ARv7 CTC Panel Kit using the Leica® BOND RX automated slide staining system. Slides were scanned using the CyteFinder II Instrument and images were analyzed using CyteMapper® software and analysis tools. CTCs were analyzed by a trained reviewer and CTC ARv7 status was determined with a fluorescence intensity threshold.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogThirteen/Image4.jpeg",
        caption:
          "Figure 2: Sensitivity/specificity of ARv7 detection on cell lines. Method for determining ARv7 MFI intensity threshold. Sensitivity is graphed in two curves, one for cell line 22RV1 (ARv7-high) and one for LNCaP (ARv7-low). Bars and right axis values indicate specificity for the biomarker-negative cell line BT-474. An MFI cutoff of 100 was selected that achieved a minimum specificity value of 0.9. A cell with an MFI value greater than the 100 MFI threshold constitutes a positive test with the ARv7 assay for validation studies.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogThirteen/Image5.jpeg",
        caption:
          "Figure 3: Accuracy of ARv7 detection on cell lines by stainer run. Distribution of ARv7 MFI for stainer run 1 (left), 2 (center), and 3 (right) for each cell line. Threshold dotted line at MFI=100 is used to determine biomarker expression status on a per-cell basis.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogThirteen/Image6.jpeg",
        caption:
          "Table 1: Inter-stainer run mean and CV. ARv7 MFI and CV shown for each cell type and stainer run. Each run consisted of 7 slide replicates. ARv7 percent positivity was determined using an MFI cutoff of 100.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogThirteen/Image7.jpeg",
        caption:
          "Figure 4: mCTC stained for ARv7. Representative images of mCTC identified with the ARv7 Panel Kit. Scale bars represent 5 μm.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogThirteen/Image8.jpeg",
        caption:
          "Figure 5: Clinical CTC stained for ARv7. Representative images of clinical CTCs obtained by staining slides from prostate cancer patients with the ARv7 Staining Kit, with status indicated, and with ARv7 MFI shown on respective images. Scale bars represent 5 μm.",
      },
      {
        type: "text",
        heading: "Conclusion",
        content:
          "This analytical validation confirms that the ARv7 immunofluorescence assay is a sensitive, specific, and reproducible method for detecting ARv7 expression in CTCs from blood samples. The assay performed robustly in differentiating ARv7-positive from negative cells, and its performance was on par with existing CTC detection technologies.\n\nIn clinical samples, both ARv7-positive and ARv7-negative CTCs were successfully identified, demonstrating its potential utility in early and advanced clinical study stages. However, a larger cohort is necessary to establish a definitive clinical threshold for ARv7 positivity.\n\nCrucially, this assay facilitates androgen receptor status monitoring in a non-invasive manner and can serve as a predictive tool for therapeutic response. As ARv7 has been implicated in resistance to anti-androgen therapies, the ability to track its expression through liquid biopsy holds promise for personalized treatment planning.\n\nThe ARv7 assay is also compatible with the RarePlex 488 Developer Kit, allowing researchers to incorporate an additional biomarker for multiplexing, thereby broadening the scope of fluorescence intensity-based analysis in immunofluorescence assays.\n\nInkarp Instruments is India's leading distributor and trusted service partner for RareCyte products. Driven by a commitment to innovation and excellence, Inkarp delivers state-of-the-art scientific equipment and dependable support to researchers across the nation.\n\nReference: RareCyte",
      },
    ],
    comments: [],
  },
  {
    id: 14,
    title: "Optimizing the Lyophilisation Process for Banana Slices Using BUCHI Lyovapor™ L-200",
    category: "Application Notes",
    date: "2025-06-05",
    author: "Inkarp Applications Team",
    readTime: "7 min read",
    image: "/assets/blogs/BlogFourteen/Image1.jpg",
    tags: ["Freeze Drying", "Lyophilisation", "Food Processing"],
    sections: [
      {
        type: "text",
        heading: "Optimizing the Lyophilisation Process for Banana Slices Using BUCHI Lyovapor™ L-200",
        content:
          "Freeze drying, also known as lyophilisation, is a highly efficient and gentle food drying technology used for preserving delicate food items without altering their taste, texture, or nutritional value. In this application, the focus is on the freeze drying of banana slices using advanced laboratory freeze drying equipment. This method involves freezing the food and then removing water through sublimation under reduced pressure. The freeze-dried food obtained retains its original structure and is ideal for long-term storage. Commonly used in the production of freeze-dried products such as coffee, fruits, and vegetables, freeze drying offers distinct advantages in quality preservation. This study demonstrates the banana lyophilization process using the BUCHI Lyovapor™ L-200 Pro and evaluates the results using moisture analysis.",
      },
      {
        type: "text",
        heading: "Equipment Used",
        content:
          "BUCHI Lyovapor™ L-200 Pro\nBUCHI Lyovapor™ Software\nDeep freezer -40°C, tritec HANNOVER\nStainless steel tray\nMettler Toledo HR73 Halogen Moisture Analyser",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogFourteen/Image2.jpg",
        caption: "BUCHI Lyovapor™ L-200",
      },
      {
        type: "text",
        heading: "Materials",
        content: "Fresh banana slices, sourced from a local supermarket.",
      },
      {
        type: "text",
        heading: "Experimental Methodology — 1. Sample Preparation",
        content:
          "Fresh bananas were sliced into uniform pieces approximately 5 mm thick. A total of eleven slices were evenly arranged on a stainless steel tray and placed into a deep freezer at -40°C (tritec HANNOVER) overnight to ensure thorough freezing. An alternative storage temperature of -20°C may also be used, depending on available infrastructure.",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogFourteen/Image3.jpeg",
        caption: "Figure 1: Tray with fresh cut banana slices.",
      },
      {
        type: "table",
        columns: ["Drying chamber type", "Sample collapse temperature [°C]", "Safety temperature below collapse [°C]", "Gas type"],
        rows: [["Standard", "Inactivated", "Inactivated", "Ambient air"]],
        caption: "Table 1: General settings for drying of banana slices in Lyovapor™ L-200.",
      },
      {
        type: "text",
        heading: "2. Freeze Drying with BUCHI Lyovapor™ L-200 Pro",
        content:
          "After 24 hours of deep freezing, the frozen banana slices were transferred into the Lyovapor™ L-200, a high-performance lyophilisation machine designed for precise food drying applications. Using the Lyovapor™ Software, both the primary and secondary drying phases were programmed.\n\nDuring primary drying, water removal from the banana occurs via sublimation, while secondary drying eliminates adsorbed moisture. The shelf temperature was maintained below 25°C throughout the process to avoid sample collapse. Ambient air was used as the drying gas.",
      },
      {
        type: "table",
        columns: ["Step", "Unit", "1 — Primary Drying", "2 — Secondary Drying"],
        rows: [
          ["Time", "hh:mm", "12:00", "03:00"],
          ["Temperature set point", "°C", "25.0", "25.0"],
          ["Temperature gradient", "°C/min", "0.07", "0.00"],
          ["Pressure type", "", "Regulated", "Regulated"],
          ["Pressure set point", "mbar", "0.370", "0.100"],
          ["Safety pressure", "mbar", "1.500", "1.500"],
          ["Safety pressure duration", "sec", "10", "10"],
        ],
        caption: "Table 2: Parameters of the primary and secondary drying steps, set on the Lyovapor™ Software.",
      },
      {
        type: "text",
        heading: "3. Halogen Moisture Analysis",
        content:
          "Post freeze drying of banana slices, residual moisture content was measured to determine drying efficiency. Three banana slices were ground and quickly transferred (within 30 seconds) into the Mettler Toledo HR73 Halogen Moisture Analyser, a reliable instrument for moisture analysis of dried fruits. The analysis was conducted at 110°C, using a switch-off criterion of 5 (defined as a change of less than 1 mg in 140 seconds).",
      },
      {
        type: "table",
        rows: [
          ["Switch-off criterion", "5"],
          ["Drying temperature [°C]", "110"],
        ],
        caption: "Table 3: Moisture analyser settings",
      },
      {
        type: "image",
        imageUrl: "/assets/blogs/BlogFourteen/Image4.jpeg",
        caption: "Figure 2: Tray with banana slices after freeze drying",
      },
      {
        type: "text",
        heading: "Results and Discussion — 1. Visual Evaluation",
        content:
          "As shown in comparative images, the freeze-dried banana slices maintained their original shape, color, and size, indicating minimal structural change during the process. This confirms the effectiveness of the BUCHI Lyovapor™ L-200 in preserving the physical properties of the sample.",
      },
      {
        type: "text",
        heading: "2. Moisture Content Determination",
        content:
          "Moisture analysis results are summarized in the table below. All samples exhibited moisture contents below 3.14%, with an average water removal from banana of over 95.92%. The initial moisture content of the fresh banana was 76.97 ± 1.24%.",
      },
      {
        type: "table",
        columns: ["Banana slice", "Weight of freeze-dried sample [g]", "Weight of halogen-dried sample [g]", "Moisture content [%]"],
        rows: [
          ["1", "0.606", "0.587", "3.14"],
          ["2", "0.843", "0.818", "2.97"],
          ["3", "0.794", "0.770", "3.02"],
        ],
        caption: "Table 4: Results of the moisture analysis after freeze drying with Lyovapor™ L-200.",
      },
      {
        type: "text",
        heading: "Advantages of Freeze Drying Banana Slices",
        content:
          "Maintains flavor, color, aroma, and nutritional integrity. Eliminates surface hardening. Produces porous, lightweight freeze-dried food that is easily rehydrated. Reduces transportation costs due to lower weight and volume. No preservatives or additives required.",
      },
      {
        type: "text",
        heading: "Limitations",
        content:
          "Exposure to ambient air may lead to rapid rehydration. Requires vacuum-sealed or nitrogen-filled packaging. Fragile texture may lead to cracking during handling. Freeze drying is time and energy intensive, resulting in higher operational costs.",
      },
      {
        type: "text",
        heading: "Conclusion",
        content:
          "This study illustrates that the banana lyophilization process, when carried out using the BUCHI Lyovapor™ L-200 Pro, results in highly efficient water removal from banana slices while maintaining structural integrity. Supported by accurate measurements from the Mettler Toledo HR73 Halogen Moisture Analyser, the process ensures superior-quality freeze-dried food products. The integration of the BUCHI Lyovapor™ Software provides precise control and reproducibility, making this method ideal for both research and industrial applications in food drying technology.\n\nInkarp Instruments is India's leading distributor and trusted service partner for Buchi products. Driven by a commitment to innovation and excellence, Inkarp delivers cutting-edge scientific equipment and dependable support to researchers nationwide.\n\nReferences:\n1. G. W. Oetjen; Freeze drying; Ullmann's Encyclopedia of Industrial Chemistry (2004).\n2. H. Tse-Chao Hua, L. Bao-Lin, Z. Hua; Freeze Drying of Pharmaceutical and Food Products, Woodhead Publishing Series in Food Science, Technology and Nutrition, pages 141-169 (2010).",
      },
    ],
    comments: [],
  },
];

export const posts = rawPosts.map((post) => ({
  ...post,
  slug: slugify(post.title),
  excerpt: getFirstTextContent(post).split("\n")[0].slice(0, 220),
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
