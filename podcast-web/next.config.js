module.exports = (phase, {defaultConfig}) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    async redirects() {
      return [
        {
          source: '/moderators',
          destination: '/moderators/dashboard',
          permanent: true,
        },
      ]
    },

  }
  return nextConfig
}
