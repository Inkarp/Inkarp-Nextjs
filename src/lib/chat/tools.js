// Tool definitions and their server-side handlers.
//
// Every factual claim the assistant makes about a product has to come back from
// one of these, which is what keeps it grounded in the real catalogue.

import { describeProduct, describeWorkflow, findProducts, getIndustryList } from "./catalogue";

// Schemas are deliberately non-strict: `strict: true` demands that every
// property appear in `required`, and search filters here are optional.
export const CHAT_TOOLS = [
  {
    name: "search_products",
    description:
      "Search the Inkarp catalogue. Use this before naming any product — never rely on memory. " +
      "Returns matching products with their slug, brand and page URL.",
    input_schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "What the customer is looking for, in their words. e.g. 'rotary evaporator', " +
            "'moisture analyser for plastics', 'SPR kinetics'.",
        },
        principal: {
          type: "string",
          description: "Optional brand slug to narrow by, e.g. 'heidolph'.",
        },
        industry: {
          type: "string",
          description: "Optional industry to narrow by, e.g. 'Pharmaceuticals'.",
        },
      },
      required: ["query"],
      additionalProperties: false,
    },
  },
  {
    name: "get_product_details",
    description:
      "Full detail for one product: specifications, key features, applications and FAQs. " +
      "Call this before stating any specification, figure or capability.",
    input_schema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "The product slug returned by search_products.",
        },
      },
      required: ["slug"],
      additionalProperties: false,
    },
  },
  {
    name: "recommend_workflow",
    description:
      "Common problems at a stage of a lab workflow, and the instruments that address them. " +
      "Use when the customer describes a process or a problem rather than a product.",
    input_schema: {
      type: "object",
      properties: {
        industry: {
          type: "string",
          description: "One of the nine Inkarp industries, e.g. 'Pharmaceuticals'.",
        },
        stage: {
          type: "string",
          description:
            "Optional workflow stage. Omit to list the stages available for that industry.",
        },
      },
      required: ["industry"],
      additionalProperties: false,
    },
  },
  {
    name: "list_industries",
    description: "The nine industries Inkarp organises its workflows around.",
    input_schema: { type: "object", properties: {}, required: [], additionalProperties: false },
  },
];

const HANDLERS = {
  search_products: ({ query, principal, industry }) => {
    const results = findProducts({ query, principal, industry });
    return results.length
      ? { count: results.length, results }
      : {
          count: 0,
          results: [],
          note: "Nothing matched. Try a broader term, or offer to put the customer in touch with a specialist.",
        };
  },
  get_product_details: ({ slug }) => describeProduct(slug),
  recommend_workflow: ({ industry, stage }) => describeWorkflow({ industry, stage }),
  list_industries: () => ({ industries: getIndustryList() }),
};

/** Run one tool call. Never throws — the model gets the error as a result. */
export async function runTool(name, input) {
  const handler = HANDLERS[name];
  if (!handler) return { error: `Unknown tool: ${name}` };
  try {
    return await handler(input ?? {});
  } catch (error) {
    return { error: `Tool ${name} failed: ${error.message}` };
  }
}
