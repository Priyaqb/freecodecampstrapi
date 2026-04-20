import type { NextConfig } from "next";

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://127.0.0.1:1337";
const strapiHostname = new URL(strapiUrl).hostname;
const strapiProtocol = new URL(strapiUrl).protocol.replace(":", "") as "http" | "https";
const strapiPort = new URL(strapiUrl).port;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: strapiProtocol,
        hostname: strapiHostname,
        ...(strapiPort ? { port: strapiPort } : {}),
        pathname: "/uploads/**",
      },
    ],
    dangerouslyAllowSVG: false,
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
