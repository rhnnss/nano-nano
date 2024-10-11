/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  reactStrictMode: false,
  output: "standalone",
  httpAgentOptions: {
    keepAlive: true,
  },
  trailingSlash: false,
  env: {
    NEXT_PUBLIC_PASSWORD: process.env.NEXT_PUBLIC_PASSWORD,
    NEXT_PUBLIC_USERNAME: process.env.NEXT_PUBLIC_USERNAME,
    NEXT_PUBLIC_TOKEN: process.env.NEXT_PUBLIC_TOKEN,
    NEXT_PUBLIC_LOGIN_URL: process.env.NEXT_PUBLIC_LOGIN_URL,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.konimex.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // async headers() {
  //   const cspHeader = `
  //     default-src 'self';
  //     script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:;
  //     worker-src 'self' blob:;
  //     style-src 'self' 'unsafe-inline';
  //     font-src 'self';
  //     object-src 'none';
  //     base-uri 'self';
  //     frame-ancestors 'none';
  //     upgrade-insecure-requests;
  //   `;
  //   // Replace newline characters and spaces
  //   const contentSecurityPolicyHeaderValue = cspHeader
  //     .replace(/\n/g, "")
  //     .trim();
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         { key: "X-Content-Type-Options", value: "nosniff" },
  //         { key: "X-Frame-Options", value: "SAMEORIGIN" },
  //         { key: "Referrer-Policy", value: "origin" },
  //         {
  //           key: "Strict-Transport-Security",
  //           value: "max-age=63072000; includeSubDomains; preload",
  //         },
  //         {
  //           key: "Content-Security-Policy",
  //           value: contentSecurityPolicyHeaderValue,
  //         },
  //       ],
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
