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
};

export default nextConfig;
