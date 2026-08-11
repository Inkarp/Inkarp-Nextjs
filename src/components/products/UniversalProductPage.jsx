'use client';
import InPageNav from './sections/InPageNav';
import StatsBar from './sections/StatsBar';
import ProductInfoTabs from './sections/ProductInfoTabs';
import EvaporationWorkflow from './sections/EvaporationWorkflow';
import OrbitVisualizer from './sections/OrbitVisualizer';
import DistillationSimulator from './sections/DistillationSimulator';
import SolventCalculator from './sections/SolventCalculator';
import SuitabilityChecker from './sections/SuitabilityChecker';
import SolventGuide from './sections/SolventGuide';
import ConnectivityPlanner from './sections/ConnectivityPlanner';
import ChecklistGuide from './sections/ChecklistGuide';
import ROICalculator from './sections/ROICalculator';
import UnattendedHoursPlanner from './sections/UnattendedHoursPlanner';
import BenchSpacePlanner from './sections/BenchSpacePlanner';
import ServiceLifePlanner from './sections/ServiceLifePlanner';
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
import ProductMicrositeLayer from './ProductMicrositeLayer';
import ProductEngagementPopups from './ProductEngagementPopups';
import RecTag from '@/components/home/RecTag';


export default function UniversalProductPage({ product }) {
  if (!product) return null;

  const lf = product.longForm ?? {};

  // Pull data from longForm sections by a stable `key`, falling back to the
  // legacy eyebrow-text match for older product JSON that predates `key`.
  const findSection = (key, eyebrow) =>
    lf.sections?.find((s) => s.key === key || s.eyebrow === eyebrow);

  const workflowSection = findSection('workflow', 'Evaporation workflow');
  const performanceSection = findSection('performance', 'Performance');
  const solventSection = findSection('solventGuide', 'Solvent setup guide');
  const roiSection = findSection('roi', 'ROI and payback');
  const benefitsSection = findSection('benefits', 'Benefits');
  const certsSection = findSection('certs', 'Quality and safety');
  const glasswareSection = findSection('glassware', 'Glassware guide');

  return (
    <div className="w-full" data-product-page>
      <ProductMicrositeLayer
        links={product.inPageNav ?? []}
        productName={product.name}
      />
      <ProductEngagementPopups productName={product.name} popups={product.popups} />

      {/* Sticky in-page navigation */}
      {/* {product.inPageNav?.length > 0 && (
        <InPageNav links={product.inPageNav} />
      )} */}

      {/* Stats bar */}
      <StatsBar stats={lf.stats ?? product.stats ?? []} />

      {/* Product info tabs (overview, features, specs, etc.) */}
      <ProductInfoTabs product={product} />

      {/* Evaporation workflow animation */}
      {workflowSection?.steps?.length > 0 && (
        <EvaporationWorkflow section={workflowSection} metrics={performanceSection?.metrics} />
      )}

      {/* Orbit / vortex mechanism visualiser */}
      {product.orbitVisualizer && (
        <OrbitVisualizer data={product.orbitVisualizer} productName={product.name} />
      )}

      {/* Distillation simulator */}
      {product.simulator && (
        <DistillationSimulator data={product.simulator} productName={product.name} />
      )}

      {/* Recovery calculator */}
      {product.calculator && (
        <SolventCalculator calculatorData={product.calculator} simulatorData={product.simulator} productName={product.name} />
      )}

      {/* Suitability checker */}
      {product.suitability && (
        <SuitabilityChecker data={product.suitability} productName={product.name} />
      )}

      {/* Solvent setup guide */}
      {solventSection?.cards?.length > 0 && (
        <SolventGuide
          data={solventSection}
          simulatorData={product.simulator}
          sectionNumber="06"
        />
      )}

      {/* Readiness / requirement checklist */}
      {product.readinessGuide && (
        <ChecklistGuide
          data={product.readinessGuide}
          productName={product.name}
          sectionId={product.readinessGuide.sectionId ?? 'readiness'}
        />
      )}

      {/* Connectivity, planner & selector tools - supports either a single
          `connectivityPlanner` (legacy) or a `planners` array (multiple tools) */}
      {(product.planners ?? (product.connectivityPlanner ? [product.connectivityPlanner] : [])).map((planner, index) => (
        <ConnectivityPlanner key={planner.sectionId ?? index} data={planner} productName={product.name} />
      ))}

      {product.unattendedPlanner && (
        <UnattendedHoursPlanner data={product.unattendedPlanner} productName={product.name} />
      )}

      {product.benchPlanner && (
        <BenchSpacePlanner data={product.benchPlanner} productName={product.name} />
      )}

      {product.serviceLifePlanner && (
        <ServiceLifePlanner data={product.serviceLifePlanner} productName={product.name} />
      )}

      {/* ROI calculator */}
      {roiSection && (
        <ROICalculator data={roiSection} sectionNumber="07" productName={product.name} />
      )}

      {/* Applications explorer */}
      {product.applicationsExplorer && (
        <ApplicationsExplorer data={product.applicationsExplorer} productName={product.name} />
      )}

      {/* Configuration wizard */}
      {product.configWizard && (
        <ConfigWizard data={product.configWizard} productName={product.name} />
      )}

      {/* Workflow score comparison */}
      {product.workflowScore && (
        <WorkflowScore data={product.workflowScore} productName={product.name} />
      )}

      {/* Method comparison table */}
      {product.comparison && (
        <MethodComparison data={product.comparison} />
      )}

      {/* Fit quiz */}
      {product.quiz && (
        <FitQuiz data={product.quiz} productName={product.name} />
      )}

      {/* Glassware guide */}
      {/* {glasswareSection?.cards?.length > 0 && (
        <GlasswareGuide cards={glasswareSection.cards} section={glasswareSection} productName={product.name} />
      )} */}

      {/* Vacuum & chiller pairing */}
      {product.pairing && (
        <VacuumChillerPairing data={product.pairing} />
      )}

      {/* Why labs choose (benefits) */}
      {benefitsSection?.cards?.length > 0 && (
        <WhyLabsChoose cards={benefitsSection.cards} section={benefitsSection} productName={product.name} />
      )}

      {/* Standards & certs */}
      {certsSection?.cards?.length > 0 && (
        <StandardsCerts cards={certsSection.cards} section={certsSection} productName={product.name} />
      )}

      {/* India service map */}
      {product.serviceMap && (
        <ServiceMap data={product.serviceMap} />
      )}

      {/* FAQ */}
      {product.faqs?.length > 0 && (
        <FAQSection faqs={product.faqs} productName={product.name} />
      )}

      {/* Demo booking */}
      {product.booking && (
        <DemoBooking data={product.booking} productName={product.name} />
      )}

      {/* CTA strip */}
      {lf.cta && (
        <section className="bg-parchment-alt px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-6 border border-line-light bg-white p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <RecTag>{lf.cta.eyebrow}</RecTag>
              <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">{lf.cta.title}</h2>
              {lf.cta.subheading && (
                <p className="mt-2 max-w-2xl text-sm font-semibold text-ink">{lf.cta.subheading}</p>
              )}
              <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-soft">{lf.cta.description}</p>
            </div>
            <a
              href={lf.cta.href ?? '/contact'}
              className="inline-flex items-center justify-center border border-red bg-red px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-transparent hover:text-red shrink-0"
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
      {/* <SupportStrip productName={product.name} /> */}
    </div>
  );
}
