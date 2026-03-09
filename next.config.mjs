/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ['remark-gfm', 'react-markdown', 'micromark-extension-gfm'],
}

export default nextConfig
