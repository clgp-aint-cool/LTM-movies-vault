/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL || "https://lamthanhmy.com",
  generateRobotsSitemap: true,
  exclude: ["/api/:path*"],
  robots: {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://lamthanhmy.com/sitemap.xml",
  },
  changefreq: "weekly",
  priority: 0.7,
  excludeIndexablePages: true,
};

module.exports = config;
