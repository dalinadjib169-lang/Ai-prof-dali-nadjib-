/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["ar", "fr", "en"],
    defaultLocale: "ar",
  },
};

module.exports = nextConfig;
