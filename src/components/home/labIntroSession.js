// Shared by the root layout (server) and LabIntro (client), so it lives in a
// plain module: constants exported from a "use client" file reach server
// components as client references, not as their values.
export const LAB_INTRO_STORAGE_KEY = "inkarp-lab-intro";

// Runs from <head> while the HTML is parsed, before first paint, so a visitor
// who has already seen the intro this session never gets a flash of it.
export const LAB_INTRO_SEEN_SCRIPT = `try{if(sessionStorage.getItem("${LAB_INTRO_STORAGE_KEY}")){var s=document.createElement("style");s.textContent="[data-lab-intro]{display:none!important}";document.head.appendChild(s)}}catch(e){}`;
