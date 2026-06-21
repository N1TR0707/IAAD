// Konfigurasi PM2 untuk menjalankan backend IAAD Project di produksi.
// Jalankan dengan: pm2 start ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'iaad-backend',
      script: 'src/server.js',
      cwd: '/var/www/iaad/backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
