/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ecomback.bfinit.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
