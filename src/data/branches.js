// Pin placement on /assets/contact/IndiaMap.svg.
//
// The SVG outline was parsed to find its true drawn bounds inside the
// 1847x2000 viewBox, and those four edges are India's geographic extremes.
// Every pin is therefore derived from its real lat/lon rather than eyeballed —
// nothing here needs hand-tuning per city or per breakpoint.
//
// >> If every pin looks uniformly off, nudge these two numbers only. <<
// Positive x moves all pins right, positive y moves them down. Both are in
// percent of the map frame.
export const PIN_OFFSET = { x: 1.5, y: 0 };

const MAP = { x0: 2.15, x1: 96.53, y0: 1.78, y1: 98.55 };   // outline bounds, % of viewBox
const GEO_BOUNDS = { lon0: 68.11, lon1: 97.41, lat0: 37.1, lat1: 8.07 };

function pin({ lat, lon }) {
  const { x0, x1, y0, y1 } = MAP;
  const { lon0, lon1, lat0, lat1 } = GEO_BOUNDS;
  const left = x0 + ((lon - lon0) / (lon1 - lon0)) * (x1 - x0) + PIN_OFFSET.x;
  const top = y0 + ((lat0 - lat) / (lat0 - lat1)) * (y1 - y0) + PIN_OFFSET.y;
  return [top.toFixed(2) + '%', left.toFixed(2) + '%'];
}

export const branches = [
  {
    name: "Bengaluru",
    address:
      "Site No: D-71, 1st Floor, Above Axis Bank Ltd, Nandini Dollars Layout, Dollar Schemes, Nandini Layout, Bengaluru -560096. Karnataka.",
    phone: "Sales: 7338186776, Service: 7338186774",
    email: "salesbglr@inkarp.co.in, servicebglr@inkarp.co.in",
    coords: { lat: 12.97, lon: 77.59 },
  },
  {
    name: "Thiruvananthapuram",
    address:
      "T.C.46/2025, SNRA 110, Shastha Nagar, Karamana, Thiruvananthapuram - 695002. Kerala.",
    phone: "Sales: 7338186776, Service: 7338825314",
    email: "saleskerala@inkarp.co.in, servicekerala@inkarp.co.in",
    coords: { lat: 8.52, lon: 76.94 },
  },
  {
    name: "Chennai",
    address:
      "6A & 6B Jhaver Plaza, 1 A Nungambakkam High Road, Chennai - 600034. Tamil Nadu.",
    phone: "Sales: 7338825318, Service: 7338825314",
    email: "saleschennai@inkarp.co.in, servicechennai@inkarp.co.in",
    coords: { lat: 13.08, lon: 80.27 },
  },
  {
    name: "Kolkata",
    address:
      "P-40A, Gariahat Road (South), Cit Scheme - LXII, (1st Floor), Near Dhakuria Bridge - 700031. Kolkata.",
    phone: "Sales: 8712600762, Service: 8712600760",
    email: "saleskolkata@inkarp.co.in, servicekolkata@inkarp.co.in",
    coords: { lat: 22.57, lon: 88.36 },
  },
  {
    name: "Ahmedabad",
    address:
      "408, 4th Floor, Kataria Arcade, Near Adani Vidya Mandir, Behind Sarkhej Roza, Makarba, Ahmedabad - 380051. Gujarat.",
    phone: "Sales: 7780411299, Service: 9281014848",
    email: "salesahm@inkarp.co.in, servicegujarat@inkarp.co.in",
    coords: { lat: 23.02, lon: 72.57 },
  },
  {
    name: "Mumbai",
    address:
      "310/311, B-Wing, Dhamji Shamji Corporate Square, Next to Kanara Business Centre, Laxmi Nagar, Ghatkopar East, Mumbai - 400075. Maharashtra.",
    phone: "Sales: 7815901818, Service: 9281014851",
    email: "salesmumbai@inkarp.co.in, supportmumbai@inkarp.co.in",
    coords: { lat: 19.08, lon: 72.88 },
  },
  {
    name: "Delhi",
    address:
      "4FCS-52 TO 55, Corporate Suites, Ansal Plaza, Sector-1, Vaishali, Ghaziabad - 201010. Uttar Pradesh.",
    phone: "Sales: 7042194732 / 7042066011, Service: 7042194720",
    email: "salesdelhi@inkarp.co.in, servicedelhi@inkarp.co.in",
    coords: { lat: 28.61, lon: 77.21 },
  },
  {
    name: "Visakhapatnam",
    address:
      "Flat No: 501, 4th Floor, Ayyappa Nilayam, Sheelanagar, Visakhapatnam - 530012. Andhra Pradesh.",
    phone: "Sales: 7331146991, Service: 8121293939",
    email: "salesvizag@inkarp.co.in, servicevizag@inkarp.co.in",
    coords: { lat: 17.69, lon: 83.22 },
  },
  {
    name: "Pune",
    address:
      "Office No. 511, Fifth Floor, West Avenue, Bremen Chowk, Opposite PMRDA, Aundh, Pune - 411007. Maharashtra.",
    phone: "Sales: 7780412649, Service: 9281014852",
    email: "salespune@inkarp.co.in, servicepune@inkarp.co.in",
    coords: { lat: 18.52, lon: 73.86 },
  },
  {
    name: "Chandigarh",
    address:
      "House No. 8, 1st Floor, Phase XI, SAS Nagar, Mohali - 160062. Chandigarh.",
    phone: "Sales: 7042191973, Service: 7042194720",
    email: "saleschd@inkarp.co.in, servicedelhi@inkarp.co.in",
    coords: { lat: 30.73, lon: 76.78 },
  },
  {
    name: "Vadodara",
    address:
      "435, 4th Floor, Atlantis K10,Sarabhai Campus, Vadodara : 390 007 Gujarat",
    phone: "Sales: 7780411299, Service: 9281014848",
    email: "salesbaroda@inkarp.co.in, servicegujarat@inkarp.co.in",
    coords: { lat: 22.31, lon: 73.18 },
  },
  {
    name: "Hyderabad",
    address:
      "Inkarp Instruments Pvt Ltd, Plot No - 5A/10-11, 3rd Floor, IDA Nacharam Road No. 1, Nacharam - Chilka Nagar Road, Hyderabad - 500076",
    phone: "Sales: +91 8125580808, Service: +91 40 2717 2293",
    email: "saleshyd@inkarp.co.in, servicehyd@inkarp.co.in",
    coords: { lat: 17.39, lon: 78.49 },
  },
];

// Every branch gets its position computed from coords + PIN_OFFSET. The sm/md/lg
// shape is kept because ServiceMap still reads position[screenSize]; all three
// are identical now that the map frame matches the SVG aspect ratio.
branches.forEach((branch) => {
  const p = pin(branch.coords);
  branch.position = { sm: p, md: p, lg: p };
});

export function getScreenSize() {
  if (typeof window === "undefined") {
    return "lg";
  }

  if (window.innerWidth < 640) {
    return "sm";
  }

  if (window.innerWidth < 1024) {
    return "md";
  }

  return "lg";
}

export function phoneHref(phone) {
  return phone.replace(/[^0-9+]/g, "");
}
