export const branches = [
  {
    name: "Bengaluru",
    address:
      "Site No: D-71, 1st Floor, Above Axis Bank Ltd, Nandini Dollars Layout, Dollar Schemes, Nandini Layout, Bengaluru -560096. Karnataka.",
    phone: "Sales: 7338186776, Service: 7338186774",
    email: "salesbglr@inkarp.co.in, servicebglr@inkarp.co.in",
    position: { sm: ["80%", "35%"], md: ["79%", "35%"], lg: ["82%", "36%"] },
  },
  {
    name: "Thiruvananthapuram",
    address:
      "T.C.46/2025, SNRA 110, Shastha Nagar, Karamana, Thiruvananthapuram - 695002. Kerala.",
    phone: "Sales: 7338186776, Service: 7338825314",
    email: "saleskerala@inkarp.co.in, servicekerala@inkarp.co.in",
    position: { sm: ["72%", "47%"], md: ["90%", "34%"], lg: ["96%", "39%"] },
  },
  {
    name: "Chennai",
    address:
      "6A & 6B Jhaver Plaza, 1 A Nungambakkam High Road, Chennai - 600034. Tamil Nadu.",
    phone: "Sales: 7338825318, Service: 7338825314",
    email: "saleschennai@inkarp.co.in, servicechennai@inkarp.co.in",
    position: { sm: ["64%", "50%"], md: ["84%", "45%"], lg: ["85%", "47%"] },
  },
  {
    name: "Kolkata",
    address:
      "P-40A, Gariahat Road (South), Cit Scheme - LXII, (1st Floor), Near Dhakuria Bridge - 700031. Kolkata.",
    phone: "Sales: 8712600762, Service: 8712600760",
    email: "saleskolkata@inkarp.co.in, servicekolkata@inkarp.co.in",
    position: { sm: ["38%", "75%"], md: ["50%", "68%"], lg: ["50%", "72%"] },
  },
  {
    name: "Ahmedabad",
    address:
      "408, 4th Floor, Kataria Arcade, Near Adani Vidya Mandir, Behind Sarkhej Roza, Makarba, Ahmedabad - 380051. Gujarat.",
    phone: "Sales: 7780411299, Service: 9281014848",
    email: "salesahm@inkarp.co.in, servicegujarat@inkarp.co.in",
    position: { sm: ["40%", "25%"], md: ["50%", "15%"], lg: ["51%", "22%"] },
  },
  {
    name: "Mumbai",
    address:
      "310/311, B-Wing, Dhamji Shamji Corporate Square, Next to Kanara Business Centre, Laxmi Nagar, Ghatkopar East, Mumbai - 400075. Maharashtra.",
    phone: "Sales: 7815901818, Service: 9281014851",
    email: "salesmumbai@inkarp.co.in, supportmumbai@inkarp.co.in",
    position: { sm: ["50%", "25%"], md: ["63%", "20%"], lg: ["65%", "22%"] },
  },
  {
    name: "Delhi",
    address:
      "4FCS-52 TO 55, Corporate Suites, Ansal Plaza, Sector-1, Vaishali, Ghaziabad - 201010. Uttar Pradesh.",
    phone: "Sales: 7042194732 / 7042066011, Service: 7042194720",
    email: "salesdelhi@inkarp.co.in, servicedelhi@inkarp.co.in",
    position: { sm: ["25%", "38%"], md: ["33%", "36%"], lg: ["33%", "36%"] },
  },
  {
    name: "Visakhapatnam",
    address:
      "Flat No: 501, 4th Floor, Ayyappa Nilayam, Sheelanagar, Visakhapatnam - 530012. Andhra Pradesh.",
    phone: "Sales: 7331146991, Service: 8121293939",
    email: "salesvizag@inkarp.co.in, servicevizag@inkarp.co.in",
    position: { sm: ["50%", "69%"], md: ["68%", "55%"], lg: ["68%", "60%"] },
  },
  {
    name: "Pune",
    address:
      "Office No. 511, Fifth Floor, West Avenue, Bremen Chowk, Opposite PMRDA, Aundh, Pune - 411007. Maharashtra.",
    phone: "Sales: 7780412649, Service: 9281014852",
    email: "salespune@inkarp.co.in, servicepune@inkarp.co.in",
    position: { sm: ["50%", "30%"], md: ["70%", "30%"], lg: ["68%", "28%"] },
  },
  {
    name: "Chandigarh",
    address:
      "House No. 8, 1st Floor, Phase XI, SAS Nagar, Mohali - 160062. Chandigarh.",
    phone: "Sales: 7042191973, Service: 7042194720",
    email: "saleschd@inkarp.co.in, servicedelhi@inkarp.co.in",
    position: { sm: ["20%", "42%"], md: ["25%", "38%"], lg: ["25%", "37%"] },
  },
  {
    name: "Vadodara",
    address:
      "F-31 Yogeshwar Apartments - 1, Opp. Reliance Petrol Pump, Above Ajanta Faras Khana, High Tension Road, Subhanpura, Vadodara - 390023. Gujarat",
    phone: "Sales: 7780411299, Service: 9281014848",
    email: "salesbaroda@inkarp.co.in, servicegujarat@inkarp.co.in",
    position: { sm: ["45%", "32%"], md: ["60%", "18%"], lg: ["57%", "23%"] },
  },
  {
    name: "Hyderabad",
    address:
      "Inkarp Instruments Pvt Ltd, Plot No - 5A/10-11, 3rd Floor, IDA Nacharam Road No. 1, Nacharam - Chilka Nagar Road, Hyderabad - 500076",
    phone: "Sales: +91 8125580808, Service: +91 40 2717 2293",
    email: "saleshyd@inkarp.co.in, servicehyd@inkarp.co.in",
    position: { sm: ["50%", "48%"], md: ["65%", "40%"], lg: ["68%", "42%"] },
  },
];

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
