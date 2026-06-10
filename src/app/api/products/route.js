import { getAllPrincipals } from "@/data/products/principals";

export function GET() {
  const principals = getAllPrincipals();

  return Response.json({
    success: true,
    count: principals.length,
    data: principals,
  });
}