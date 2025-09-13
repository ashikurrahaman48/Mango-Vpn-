
module.exports = {
  apps: [
    {
      name: 'mangovpn-connect-web',
      script: 'npm',
      args: 'run start',
      exec_mode: 'cluster',
      instances: 'max', // Or a specific number of instances
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'mangovpn-connect-vpn-server',
      script: 'npm',
      args: 'run vpn:start',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};