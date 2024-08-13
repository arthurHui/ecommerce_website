/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    modularizeImports: {
        'antd': {
            transform: 'antd/lib/{{member}}',
        },
    },
    output: 'export'
}

module.exports = nextConfig
