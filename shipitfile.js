module.exports = shipit => {
  require('shipit-deploy')(shipit);
  require('shipit-shared')(shipit);

  const appName = 'jspace';

  shipit.initConfig({
    default: {
      deployTo: '/home/webuser/jspace',
      repositoryUrl: 'https://github.com/7binary/jspace.git',
      keepReleases: 3,
      shared: {
        overwrite: true,
        dirs: ['node_modules'],
      },
    },
    prod: {
      servers: 'webuser@149.154.64.114:9009',
    },
  });

  const path = require('path');
  const ecosystemFilePath = path.join(
    shipit.config.deployTo,
    'shared',
    'ecosystem.config.js',
  );

  // Our listeners and tasks will go here
  shipit.on('updated', () => {
    shipit.start('yarn-install', 'copy-config');
  });

  shipit.on('published', () => {
    shipit.start('pm2-server');
  });

  shipit.blTask('copy-config', async () => {
    const fs = require('fs');
    const ecosystem = `
module.exports = {
apps: [
  {
    name: '${appName}',
    script: '${shipit.releasePath}/hello.js',
    watch: true,
    autorestart: true,
    restart_delay: 1000,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }
]
};`;
    fs.writeFileSync('ecosystem.config.js', ecosystem, function(err) {
      if (err) throw err;
      console.log('File created successfully.');
    });
    await shipit.copyToRemote('ecosystem.config.js', ecosystemFilePath);
  });

  shipit.blTask('yarn-install', async () => {
    shipit.remote(`cd ${shipit.releasePath} && yarn install --production`);
  });

  shipit.blTask('pm2-server', async () => {
    await shipit.remote(`pm2 delete -s ${appName} || :`);
    await shipit.remote(
      `pm2 start ${ecosystemFilePath} --env production --watch true`,
    );
  });
};
