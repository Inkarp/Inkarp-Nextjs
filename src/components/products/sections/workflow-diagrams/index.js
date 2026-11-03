// Workflow diagrams by kind (see WorkflowDiagram.jsx). Each is
// { Drawing, parts: [{ part, test }], tags: { part: { at, align } } } on the
// shared 240-unit grid. Which product shows which kind:
// src/data/products/heroDrawings.js.
import afm from './afm';
import airCondenser from './airCondenser';
import automationPlatform from './automationPlatform';
import bacteriaCounter from './bacteriaCounter';
import balance from './balance';
import batteryCycler from './batteryCycler';
import benchtopNmr from './benchtopNmr';
import blixer from './blixer';
import blowdownEvaporator from './blowdownEvaporator';
import centrifugalEvaporator from './centrifugalEvaporator';
import centrifuge from './centrifuge';
import circulator from './circulator';
import coinCellCrimper from './coinCellCrimper';
import densityMeter from './densityMeter';
import digitalMicroscope from './digitalMicroscope';
import fallingBallViscometer from './fallingBallViscometer';
import flamePhotometer from './flamePhotometer';
import flashPhotolysis from './flashPhotolysis';
import flashSystem from './flashSystem';
import flowReactor from './flowReactor';
import freezeDryer from './freezeDryer';
import ftSpectrometer from './ftSpectrometer';
import handheldRaman from './handheldRaman';
import heatBlock from './heatBlock';
import homogenizer from './homogenizer';
import hotplateStirrer from './hotplateStirrer';
import hydrogenGenerator from './hydrogenGenerator';
import hyperspectralImager from './hyperspectralImager';
import industrialRotavap from './industrialRotavap';
import jacketedReactor from './jacketedReactor';
import lcSystem from './lcSystem';
import magneticStirrer from './magneticStirrer';
import massSpec from './massSpec';
import microscopeInverted from './microscopeInverted';
import microscopeStereo from './microscopeStereo';
import microscopeUpright from './microscopeUpright';
import moistureAnalyzer from './moistureAnalyzer';
import multiTubeVortexer from './multiTubeVortexer';
import nanosprayRobot from './nanosprayRobot';
import nmrAutosampler from './nmrAutosampler';
import orbitalShaker from './orbitalShaker';
import overheadStirrer from './overheadStirrer';
import parallelReactor from './parallelReactor';
import peristalticPump from './peristalticPump';
import phMeter from './phMeter';
import photoreactor from './photoreactor';
import plateShaker from './plateShaker';
import powderFlowTester from './powderFlowTester';
import pressureHomogenizer from './pressureHomogenizer';
import probeSonicator from './probeSonicator';
import processSpectrometer from './processSpectrometer';
import reactionWorkstation from './reactionWorkstation';
import rockingShaker from './rockingShaker';
import rollCoater from './rollCoater';
import rotaryEvaporator from './rotaryEvaporator';
import rotationalViscometer from './rotationalViscometer';
import sheetCoater from './sheetCoater';
import slideScanner from './slideScanner';
import slurryMixer from './slurryMixer';
import solventPurifier from './solventPurifier';
import spectralMicroscope from './spectralMicroscope';
import spr from './spr';
import textureAnalyzer from './textureAnalyzer';
import titrator from './titrator';
import ultrasonicBath from './ultrasonicBath';
import uvVis from './uvVis';
import vacuumPump from './vacuumPump';
import vapourMoistureAnalyzer from './vapourMoistureAnalyzer';
import vortexMixer from './vortexMixer';
import waterBath from './waterBath';
import waterPurifier from './waterPurifier';
import waveShaker from './waveShaker';

export const DIAGRAMS = {
  'rotary-evaporator': rotaryEvaporator,
  balance,
  'ph-meter': phMeter,
  titrator,
  'density-meter': densityMeter,
  'moisture-analyzer': moistureAnalyzer,
  'uv-vis': uvVis,
  centrifuge,
  'flame-photometer': flamePhotometer,
  'microscope-upright': microscopeUpright,
  'microscope-inverted': microscopeInverted,
  'microscope-stereo': microscopeStereo,
  'slide-scanner': slideScanner,
  'hotplate-stirrer': hotplateStirrer,
  'magnetic-stirrer': magneticStirrer,
  'overhead-stirrer': overheadStirrer,
  'peristaltic-pump': peristalticPump,
  'orbital-shaker': orbitalShaker,
  'rocking-shaker': rockingShaker,
  'wave-shaker': waveShaker,
  'plate-shaker': plateShaker,
  'vortex-mixer': vortexMixer,
  'vacuum-pump': vacuumPump,
  'jacketed-reactor': jacketedReactor,
  'parallel-reactor': parallelReactor,
  'reaction-workstation': reactionWorkstation,
  'heat-block': heatBlock,
  'air-condenser': airCondenser,
  'blowdown-evaporator': blowdownEvaporator,
  'ft-spectrometer': ftSpectrometer,
  'process-spectrometer': processSpectrometer,
  'spectral-microscope': spectralMicroscope,
  'lc-system': lcSystem,
  'mass-spec': massSpec,
  'flash-system': flashSystem,
  'nanospray-robot': nanosprayRobot,
  'rotational-viscometer': rotationalViscometer,
  'powder-flow-tester': powderFlowTester,
  'texture-analyzer': textureAnalyzer,
  'roll-coater': rollCoater,
  'sheet-coater': sheetCoater,
  afm,
  homogenizer,
  'hyperspectral-imager': hyperspectralImager,
  'flow-reactor': flowReactor,
  'hydrogen-generator': hydrogenGenerator,
  'water-purifier': waterPurifier,
  'battery-cycler': batteryCycler,
  circulator,
  'water-bath': waterBath,
  'probe-sonicator': probeSonicator,
  'benchtop-nmr': benchtopNmr,
  'nmr-autosampler': nmrAutosampler,
  'automation-platform': automationPlatform,
  'centrifugal-evaporator': centrifugalEvaporator,
  photoreactor,
  'flash-photolysis': flashPhotolysis,
  'freeze-dryer': freezeDryer,
  spr,
  'ultrasonic-bath': ultrasonicBath,
  'coin-cell-crimper': coinCellCrimper,
  'slurry-mixer': slurryMixer,
  'pressure-homogenizer': pressureHomogenizer,
  'falling-ball-viscometer': fallingBallViscometer,
  'bacteria-counter': bacteriaCounter,
  blixer,
  'solvent-purifier': solventPurifier,
  'industrial-rotavap': industrialRotavap,
  'vapour-moisture-analyzer': vapourMoistureAnalyzer,
  'digital-microscope': digitalMicroscope,
  'multi-tube-vortexer': multiTubeVortexer,
  'handheld-raman': handheldRaman,
};
