import type { NextConfig } from "next";

/** Allow Next/Image to optimize images served from the Supabase storage CDN. */
function supabaseHostname(): string | null {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return url ? new URL(url).hostname : null;
  } catch {
    return null;
  }
}

const host = supabaseHostname();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: host
      ? [{ protocol: "https", hostname: host, pathname: "/storage/v1/object/**" }]
      : [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/**" }],
  },
  experimental: {
    // Server Actions body limit for screenshot uploads.
    serverActions: { bodySizeLimit: "6mb" },
  },
};

export default nextConfig;
