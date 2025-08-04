/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  eslint: {
    dirs: ["src"],
  },
  trailingSlash: true,
}

module.exports = nextConfig
