// Dexter, Inkarp's lab guide: his artwork, his moods and the places he
// appears. One file, so any place can be switched off without touching the
// page it sits on (see the Dexter Everywhere plan).
import { DEXTER_FACES } from "./dexterFaces";

// Today's Dexter (public/dexter.png). A mood shows through motion and a small
// prop; when its new face is imported (scripts/import-dexter-faces.mjs, from
// the ChatGPT set) the face is used instead, with the same motion.
export const DEXTER_ART = {
  figure: "/assets/dexter/dexter-figure.webp",
  bust: "/assets/dexter/dexter-bust.webp",
  alt: "Dexter, Inkarp's lab guide",
};

export const DEXTER_MOODS = {
  hello: { label: "Hello", line: "Hi, I'm Dexter. Ask me anything about the instruments here." },
  listening: { label: "Listening", line: "Go on, I'm following." },
  wow: { label: "Wow", line: "That's everything I need.", prop: "spark" },
  thinking: { label: "Thinking", line: "Give me a moment…", prop: "dots" },
  worried: { label: "Worried", line: "One thing needs fixing first.", prop: "drop" },
  low: { label: "Low", line: "That didn't work." },
  puzzled: { label: "Puzzled", line: "Hmm, I can't find that.", prop: "question" },
  celebrate: { label: "Celebrate", line: "Done. Thank you!", prop: "confetti" },
};

export const MOOD_KEYS = Object.keys(DEXTER_MOODS);

// Extra poses from the ChatGPT set, for tip cards, forms, the chat and thank-you.
export const DEXTER_POSES = {
  pointing: "Pointing",
  clipboard: "Clipboard",
  tablet: "Tablet",
  thumbsup: "Thumbs up",
};

/** The artwork for a mood or pose: its new face when imported, else today's Dexter. */
export function dexterArt(name, size = "figure") {
  return DEXTER_FACES[name]?.[size]?.src ?? DEXTER_ART[size];
}

/** Width ÷ height of a mood's full figure (today's Dexter is 371 × 640). */
export function dexterFigureRatio(name) {
  const figure = DEXTER_FACES[name]?.figure;
  return figure ? figure.width / figure.height : 371 / 640;
}

/** Whether a mood or pose has its new face yet. */
export const hasNewFace = (name) => Boolean(DEXTER_FACES[name]);

// One switch per place. Off until each phase ships; /dexter-preview shows
// them all regardless.
export const DEXTER_PLACES = {
  notFound: true,
  errorPage: true,
  emptyStates: true,
  noResults: true,
  forms: true,
  thankYou: true,
  workflowStages: false,
  productFaqs: false,
  productTools: false,
  compare: false,
  quoteList: false,
  solutionFinder: false,
  headerSearch: false,
  homeIntro: false,
  footer: false,
};
