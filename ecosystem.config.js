module.exports = {
  apps: [{
    name: 'websiteaee',
    script: 'node_modules/vite/bin/vite.js',
    args: 'preview',
    cwd: '/home/ubuntu/webpage',  // adaptez le chemin si besoin
    instances: 1,  // ou 'max' pour utiliser tous les CPU
    exec_mode: 'fork',  // 'cluster' si instances > 1
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    max_memory_restart: '1G',
    restart_delay: 3000,
    watch: false,  // important : ne pas watcher en prod
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};