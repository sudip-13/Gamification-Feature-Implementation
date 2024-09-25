/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "99designs-blog.imgix.net",
      },
    ],
  },
};

export default nextConfig;
