module.exports = {
  apps: [{
    name: 'gaomianBlog-api',
    script: './index.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    max_memory_restart: '500M',
    error_file: '/var/log/gaomianBlog/err.log',
    out_file: '/var/log/gaomianBlog/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};