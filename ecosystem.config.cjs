module.exports = {
  apps: [
    {
      name: "undangan-digital",
      script: ".next/standalone/server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
    },
  ],
};
