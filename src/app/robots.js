import { SITE_URL } from "@/data/pageSeo";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    host: SITE_URL,
  };
}
