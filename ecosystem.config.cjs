module.exports = {
  apps: [
    {
      name: "undangan-digital",
      script: "node",
      args: "-r dotenv/config .next/standalone/server.js",
      cwd: "/home/mbingsdk/undangan",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
    },
  ],
};