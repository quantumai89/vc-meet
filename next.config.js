/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SOCKET_URL: 'https://vc-meet-server.up.railway.app',
  },
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
