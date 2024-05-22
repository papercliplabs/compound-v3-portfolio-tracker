/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: false, // TODO(spennyp): remove this, only for dev
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**"
      },
    ]
  }
};

export default nextConfig;
