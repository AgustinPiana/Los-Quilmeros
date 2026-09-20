/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: '*.blogspot.com' },
      { protocol: 'https', hostname: 'blogger.googleusercontent.com' },
    ],
  },
};

module.exports = nextConfig;
