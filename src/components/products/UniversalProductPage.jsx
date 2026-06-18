'use client';
import InPageNav from './sections/InPageNav';
import StatsBar from './sections/StatsBar';
import ProductInfoTabs from './sections/ProductInfoTabs';
import EvaporationWorkflow from './sections/EvaporationWorkflow';
import DistillationSimulator from './sections/DistillationSimulator';
import SolventCalculator from './sections/SolventCalculator';
import SuitabilityChecker from './sections/SuitabilityChecker';
import SolventGuide from './sections/SolventGuide';
import ROICalculator from './sections/ROICalculator';
import ApplicationsExplorer from './sections/ApplicationsExplorer';
import ConfigWizard from './sections/ConfigWizard';
import WorkflowScore from './sections/WorkflowScore';
import MethodComparison from './sections/MethodComparison';
import FitQuiz from './sections/FitQuiz';
import GlasswareGuide from './sections/GlasswareGuide';
import VacuumChillerPairing from './sections/VacuumChillerPairing';
import WhyLabsChoose from './sections/WhyLabsChoose';
import StandardsCerts from './sections/StandardsCerts';
import ServiceMap from './sections/ServiceMap';
import FAQSection from './sections/FAQSection';
import DemoBooking from './sections/DemoBooking';
import SupportStrip from './sections/SupportStrip';

export default function UniversalProductPage({ product }) {
  if (!product) return null;

  const lf = product.longForm ?? {};

  // Pull data from longForm sections by eyebrow/position
  const workflowSection = lf.sections?.find((s) => s.eyebrow === 'Evaporation workflow');
  const solventSection = lf.sections?.find((s) => s.eyebrow === 'Solvent setup guide');
  const roiSection = lf.sections?.find((s) => s.eyebrow === 'ROI and payback');
  const benefitsSection = lf.sections?.find((s) => s.eyebrow === 'Benefits');
  const certsSection = lf.sections?.find((s) => s.eyebrow === 'Quality and safety');
  const glasswareSection = lf.sections?.find((s) => s.eyebrow === 'Glassware guide');

  return (
    <div className="w-full">
      {/* Sticky in-page navigation */}
      {product.inPageNav?.length > 0 && (
        <InPageNav links={product.inPageNav} />
      )}

      {/* Stats bar */}
      <StatsBar stats={lf.stats ?? []} />

      {/* Product info tabs (overview, features, specs, etc.) */}
      <ProductInfoTabs product={product} />

      {/* Evaporation workflow animation */}
      {workflowSection?.steps?.length > 0 && (
        <EvaporationWorkflow
          steps={workflowSection.steps}
          disclaimer={workflowSection.disclaimer}
        />
      )}

      {/* Distillation simulator */}
      {product.simulator && (
        <DistillationSimulator data={product.simulator} />
      )}

      {/* Recovery calculator */}
      {product.calculator && (
        <SolventCalculator data={product.calculator} />
      )}

      {/* Solvent setup guide */}
      {solventSection?.cards?.length > 0 && (
        <SolventGuide
          cards={solventSection.cards}
          disclaimer={solventSection.disclaimer}
        />
      )}

      {/* ROI calculator */}
      {roiSection && (
        <ROICalculator
          cards={roiSection.cards ?? []}
          disclaimer={roiSection.disclaimer}
        />
      )}

      {/* Applications explorer */}
      {product.applicationsExplorer && (
        <ApplicationsExplorer data={product.applicationsExplorer} />
      )}

      {/* Configuration wizard */}
      {product.configWizard && (
        <ConfigWizard data={product.configWizard} />
      )}

      {/* Suitability checker */}
      {product.suitability && (
        <SuitabilityChecker data={product.suitability} />
      )}

      {/* Workflow score comparison */}
      {product.workflowScore && (
        <WorkflowScore data={product.workflowScore} />
      )}

      {/* Method comparison table */}
      {product.comparison && (
        <MethodComparison data={product.comparison} />
      )}

      {/* Fit quiz */}
      {product.quiz && (
        <FitQuiz data={product.quiz} />
      )}

      {/* Glassware guide */}
      {glasswareSection?.cards?.length > 0 && (
        <GlasswareGuide cards={glasswareSection.cards} />
      )}

      {/* Vacuum & chiller pairing */}
      {product.pairing && (
        <VacuumChillerPairing data={product.pairing} />
      )}

      {/* Why labs choose (benefits) */}
      {benefitsSection?.cards?.length > 0 && (
        <WhyLabsChoose cards={benefitsSection.cards} />
      )}

      {/* Standards & certs */}
      {certsSection?.cards?.length > 0 && (
        <StandardsCerts cards={certsSection.cards} />
      )}

      {/* India service map */}
      {product.serviceMap && (
        <ServiceMap data={product.serviceMap} />
      )}

      {/* FAQ */}
      {product.faqs?.length > 0 && (
        <FAQSection faqs={product.faqs} />
      )}

      {/* Demo booking */}
      {product.booking && (
        <DemoBooking data={product.booking} />
      )}

      {/* CTA strip */}
      {lf.cta && (
        <section className="bg-[#fff3f4] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-2xl border border-[#BE0010]/15 bg-white p-6 shadow-xl shadow-[#BE0010]/10 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">{lf.cta.eyebrow}</p>
              <h2 className="font-maxot mt-2 text-2xl leading-tight text-zinc-950 sm:text-3xl">{lf.cta.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">{lf.cta.description}</p>
            </div>
            <a
              href={lf.cta.href ?? '/contact-us'}
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#BE0010] px-6 text-sm font-semibold text-white transition hover:bg-[#9f000d] shrink-0"
            >
              {lf.cta.label}
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </section>
      )}

      {/* Support strip */}
      <SupportStrip productName={product.name} />
    </div>
  );
}
