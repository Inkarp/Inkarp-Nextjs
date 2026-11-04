import balance from "@/components/products/sections/workflow-diagrams/balance";
import centrifuge from "@/components/products/sections/workflow-diagrams/centrifuge";
import hotplateStirrer from "@/components/products/sections/workflow-diagrams/hotplateStirrer";
import lcSystem from "@/components/products/sections/workflow-diagrams/lcSystem";
import microscopeUpright from "@/components/products/sections/workflow-diagrams/microscopeUpright";
import rotaryEvaporator from "@/components/products/sections/workflow-diagrams/rotaryEvaporator";
import titrator from "@/components/products/sections/workflow-diagrams/titrator";
import ultrasonicBath from "@/components/products/sections/workflow-diagrams/ultrasonicBath";
import uvVis from "@/components/products/sections/workflow-diagrams/uvVis";
import diagramStyles from "@/components/products/sections/WorkflowDiagram.module.css";
import BenchCycle from "./BenchCycle";
import styles from "./FooterLabBench.module.css";

/**
 * A lab bench along the bottom of the footer: line drawings of instruments
 * (the product pages' workflow drawings) standing on one bench line, each
 * quietly at work in grey — the rotavap flask turning, the stir bar spinning,
 * the rotor going round — while a red light passes along the bench, lighting
 * one instrument's working part at a time (BenchCycle). Phones show four,
 * tablets six, wide screens all nine. Drawn on the server; decorative.
 */

// Each instrument, its name, and the part that lights when it is its turn.
const BENCH = [
  { diagram: rotaryEvaporator, label: "Rotary evaporator", part: "rotate", show: "flex" },
  { diagram: hotplateStirrer, label: "Hotplate stirrer", part: "stir", show: "flex" },
  { diagram: centrifuge, label: "Centrifuge", part: "spin", show: "flex" },
  { diagram: microscopeUpright, label: "Microscope", part: "observe", show: "hidden lg:flex" },
  { diagram: balance, label: "Balance", part: "weigh", show: "flex" },
  { diagram: uvVis, label: "UV/Vis", part: "measure", show: "hidden sm:flex" },
  { diagram: titrator, label: "Titrator", part: "dose", show: "hidden lg:flex" },
  { diagram: lcSystem, label: "LC system", part: "separate", show: "hidden sm:flex" },
  { diagram: ultrasonicBath, label: "Ultrasonic bath", part: "sonicate", show: "hidden lg:flex" },
];

export default function FooterLabBench() {
  return (
    <BenchCycle>
      <ul aria-hidden="true" className={styles.shelf}>
        {BENCH.map(({ diagram: { Drawing }, label, part, show }) => (
          <li className={`${styles.item} ${show}`} data-bench-item={part} key={label}>
            <span className={`${diagramStyles.diagram} ${styles.drawing}`}>
              <svg fill="none" focusable="false" viewBox="-10 0 262 236">
                <Drawing />
              </svg>
            </span>
            <span className={styles.caption}>{label}</span>
          </li>
        ))}
      </ul>
    </BenchCycle>
  );
}
