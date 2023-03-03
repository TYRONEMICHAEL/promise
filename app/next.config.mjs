/**
 * @type {import('next').NextConfig}
 */
 const nextConfig = {
  basePath: "",
  images: {
    unoptimized: true,
    remotePatterns: [],
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        "fs": false,
        "path": false,
        "os": false,
      }
    }
    return config
  },
}

export default nextConfig