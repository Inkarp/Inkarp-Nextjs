'use client';
import { Fragment } from 'react';
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

  const plannerSections = product.planners ?? (product.connectivityPlanner ? [product.connectivityPlanner] : []);
  const productSections = [
    {
      key: 'product-info',
      node: <ProductInfoTabs product={product} />,
    },
    workflowSection?.steps?.length > 0 && {
      key: 'workflow',
      node: <EvaporationWorkflow section={workflowSection} metrics={performanceSection?.metrics} />,
    },
    product.orbitVisualizer && {
      key: 'orbit-visualizer',
      node: <OrbitVisualizer data={product.orbitVisualizer} productName={product.name} />,
    },
    product.simulator && {
      key: 'distillation-simulator',
      node: <DistillationSimulator data={product.simulator} productName={product.name} />,
    },
    product.calculator && {
      key: 'solvent-calculator',
      node: <SolventCalculator calculatorData={product.calculator} simulatorData={product.simulator} productName={product.name} />,
    },
    product.suitability?.fields?.length > 0 && product.suitability?.results?.length > 0 && {
      key: 'suitability-checker',
      node: <SuitabilityChecker data={product.suitability} productName={product.name} />,
    },
    solventSection?.cards?.length > 0 && {
      key: 'solvent-guide',
      node: <SolventGuide data={solventSection} simulatorData={product.simulator} />,
    },
    product.readinessGuide?.items?.length > 0 && {
      key: 'readiness-guide',
      node: (
        <ChecklistGuide
          data={product.readinessGuide}
          productName={product.name}
          sectionId={product.readinessGuide.sectionId ?? 'readiness'}
        />
      ),
    },
    ...plannerSections.map((planner, index) => ({
      key: `planner-${planner.sectionId ?? index}`,
      node: <ConnectivityPlanner data={planner} productName={product.name} />,
    })),
    product.unattendedPlanner && {
      key: 'unattended-planner',
      node: <UnattendedHoursPlanner data={product.unattendedPlanner} productName={product.name} />,
    },
    product.benchPlanner && {
      key: 'bench-planner',
      node: <BenchSpacePlanner data={product.benchPlanner} productName={product.name} />,
    },
    product.serviceLifePlanner && {
      key: 'service-life-planner',
      node: <ServiceLifePlanner data={product.serviceLifePlanner} productName={product.name} />,
    },
    roiSection && {
      key: 'roi-calculator',
      node: <ROICalculator data={roiSection} productName={product.name} />,
    },
    product.applicationsExplorer && {
      key: 'applications-explorer',
      node: <ApplicationsExplorer data={product.applicationsExplorer} productName={product.name} />,
    },
    product.configWizard && {
      key: 'config-wizard',
      node: <ConfigWizard data={product.configWizard} productName={product.name} />,
    },
    product.workflowScore && {
      key: 'workflow-score',
      node: <WorkflowScore data={product.workflowScore} productName={product.name} />,
    },
    product.comparison && {
      key: 'method-comparison',
      node: <MethodComparison data={product.comparison} />,
    },
    product.quiz && {
      key: 'fit-quiz',
      node: <FitQuiz data={product.quiz} productName={product.name} />,
    },
    product.pairing && {
      key: 'vacuum-chiller-pairing',
      node: <VacuumChillerPairing data={product.pairing} />,
    },
    benefitsSection?.cards?.length > 0 && {
      key: 'benefits',
      node: <WhyLabsChoose cards={benefitsSection.cards} section={benefitsSection} productName={product.name} />,
    },
    certsSection?.cards?.length > 0 && {
      key: 'certs',
      node: <StandardsCerts cards={certsSection.cards} section={certsSection} productName={product.name} />,
    },
    product.serviceMap && {
      key: 'service-map',
      node: <ServiceMap data={product.serviceMap} />,
    },
    product.faqs?.length > 0 && {
      key: 'faq',
      node: <FAQSection faqs={product.faqs} productName={product.name} />,
    },
    product.booking && {
      key: 'demo-booking',
      node: <DemoBooking data={product.booking} productName={product.name} />,
    },
  ].filter(Boolean);

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

      {productSections.map(({ key, node }) => (
        <Fragment key={key}>
          {node}
        </Fragment>
      ))}

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
