import { FiBox, FiGitBranch } from "react-icons/fi";

// The /products hero's own copy, shared by the live hero and the previews.
export const VIEW_TABS = [
  { href: "/products", label: "By Product", active: true, Icon: FiBox },
  { href: "/workflows", label: "By Workflow", active: false, Icon: FiGitBranch },
];

export const HOW_TO_FIND_STEPS = [
  {
    num: "01",
    title: "Search directly",
    description: "Use a product name, brand, or method.",
  },
  {
    num: "02",
    title: "Browse by workflow",
    description: "Start from the lab workflow or sample type.",
  },
  {
    num: "03",
    title: "Filter to narrow down",
    description: "Use task, industry, and brand filters to shrink the list fast.",
  },
  {
    num: "04",
    title: "Ask a specialist",
    description: "Get guided support when specifications are unclear.",
  },
];
