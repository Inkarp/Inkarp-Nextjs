"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MdEmail, MdLocalPhone, MdLocationPin } from "react-icons/md";

const branches = [
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

function getScreenSize() {
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

function phoneHref(phone) {
  return phone.replace(/[^0-9+]/g, "");
}

export default function LocationCards() {
  const [screenSize, setScreenSize] = useState("lg");
  const [hoveredBranch, setHoveredBranch] = useState(null);
  const [cardHovered, setCardHovered] = useState(false);
  const hideTimeout = useRef(null);

  useEffect(() => {
    const handleResize = () => setScreenSize(getScreenSize());

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (hoveredBranch === null && !cardHovered) {
      hideTimeout.current = window.setTimeout(() => {
        setHoveredBranch(null);
      }, 150);
    } else if (hideTimeout.current) {
      window.clearTimeout(hideTimeout.current);
    }

    return () => {
      if (hideTimeout.current) {
        window.clearTimeout(hideTimeout.current);
      }
    };
  }, [hoveredBranch, cardHovered]);

  return (
    <section className="mx-auto px-2 py-8 md:px-12">
      <div className="flex flex-col items-center justify-center gap-8 lg:flex-row">
        <div className="w-full text-center sm:text-right md:text-left lg:w-1/4">
          <h1 className="text-2xl text-[#E63946]">12+ Branches Across India</h1>
          <p className="font-maxot text-lg">
            Wherever you are, we&apos;re nearby - ready to support and serve your
            scientific journey.
          </p>
        </div>

        <div className="relative mx-auto w-full rounded-lg">
          <Image
            alt="Location Map"
            className="h-auto w-full object-contain brightness-100"
            height={900}
            priority
            src="/assets/contact/IndiaMap.svg"
            width={900}
          />

          {branches.map((branch, index) => {
            const [top, left] = branch.position[screenSize];

            return (
              <div
                className="absolute"
                key={branch.name}
                onMouseEnter={() => setHoveredBranch(index)}
                onMouseLeave={() => {
                  hideTimeout.current = window.setTimeout(() => {
                    if (!cardHovered) {
                      setHoveredBranch(null);
                    }
                  }, 150);
                }}
                style={{ top, left, transform: "translate(-50%, -50%)" }}
              >
                <div className="relative z-[10000] size-6">
                  <div className="location-ping absolute left-1/2 top-1/2 z-0 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500" />
                  <MdLocationPin className="relative z-10 size-6 text-white drop-shadow" />
                </div>
                <span className="font-maxot mt-1 rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-sm font-medium text-zinc-950 shadow">
                  {branch.name}
                </span>

                {hoveredBranch === index ? (
                  <div
                    className="absolute left-[110%] top-1/2 z-[9999] w-[320px] max-w-xs rounded-lg border-2 border-[#E63946] bg-white p-4 shadow-2xl"
                    onMouseEnter={() => setCardHovered(true)}
                    onMouseLeave={() => {
                      setCardHovered(false);
                      hideTimeout.current = window.setTimeout(() => {
                        setHoveredBranch(null);
                      }, 150);
                    }}
                    style={{ transform: "translateY(-50%)" }}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <span className="flex items-center justify-center rounded-full bg-[#E63946] p-2">
                        <MdLocationPin className="size-5 text-white" />
                      </span>
                      <h2 className="font-maxot text-xl font-bold tracking-wide text-[#E63946]">
                        {branch.name}
                      </h2>
                    </div>

                    <div className="mb-2 flex items-start gap-3 rounded-lg bg-[#fef2f2] p-3">
                      <MdLocationPin className="mt-0.5 size-5 shrink-0 text-[#E63946]" />
                      <p className="text-sm leading-snug">{branch.address}</p>
                    </div>

                    <div className="mb-2 flex items-start gap-3 rounded-lg bg-[#f5f5f5] p-3">
                      <MdLocalPhone className="mt-0.5 size-5 shrink-0 text-[#E63946]" />
                      <div className="flex flex-col gap-1">
                        {branch.phone.split(",").map((phone, phoneIndex) => (
                          <a
                            className="font-medium underline hover:text-[#E63946]"
                            href={`tel:${phoneHref(phone)}`}
                            key={`${branch.name}-phone-${phoneIndex}`}
                          >
                            {phone.trim()}
                          </a>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg bg-[#f5f5f5] p-3">
                      <MdEmail className="mt-0.5 size-5 shrink-0 text-[#E63946]" />
                      <div className="flex flex-col gap-1">
                        {branch.email.split(",").map((email) => (
                          <a
                            className="font-medium underline hover:text-[#E63946]"
                            href={`mailto:${email.trim()}`}
                            key={`${branch.name}-${email}`}
                          >
                            {email.trim()}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="w-full text-center lg:w-1/4 lg:text-right">
          <h2 className="text-2xl text-[#E63946]">
            Inkarp Is Closer Than You Think
          </h2>
          <p className="font-maxot text-lg">
            Tap into our local teams for expert consultation and service
            tailored to your region.
          </p>
        </div>
      </div>
    </section>
  );
}
