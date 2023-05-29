/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/api/grenzeit/:slug*',
                destination: `${process.env.NEXT_PUBLIC_GRENZEIT_API_SCHEME}://${process.env.NEXT_PUBLIC_GRENZEIT_API_HOST}/api/latest/:slug*`
            }
        ]
    }
}

module.exports = nextConfig
