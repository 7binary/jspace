module.exports = shipit => {
  require('shipit-deploy')(shipit);
  require('shipit-shared')(shipit);
  const fs = require('fs');

  const appName = 'jspace';

  shipit.initConfig({
    default: {
      key: '/Users/artemzinovev/.ssh/id_rsa',
      deployTo: `/home/webuser/${appName}`,
      repositoryUrl: 'https://github.com/7binary/jspace.git',
      keepReleases: 2,
      shared: {
        overwrite: true,
        dirs: ['node_modules', 'client/node_modules', 'server/node_modules'],
        files: ['client/.env', 'server/.env'],
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
    // shipit.start('yarn-install', 'yarn-build', 'copy-config'); // to build at server
    shipit.start('copy-build', 'yarn-install', 'copy-config'); // to build at local
  });

  shipit.on('published', () => {
    shipit.start('pm2-server');
  });

  shipit.blTask('copy-build', async () => {
    shipit.local(`yarn build`);
    shipit.copyToRemote('./client/build', `${shipit.releasePath}/client/`);
    shipit.copyToRemote('./server/dist', `${shipit.releasePath}/server/`);
  });

  shipit.blTask('yarn-install', async () => {
    shipit.remote(`yarn --cwd "${shipit.releasePath}" install`);
  });

  shipit.blTask('yarn-build', async () => {
    shipit.remote(`yarn --cwd "${shipit.releasePath}" build`);
  });

  shipit.blTask('pm2-server', async () => {
    await shipit.remote(`pm2 delete -s ${appName} || :`);
    await shipit.remote(
      `pm2 start ${ecosystemFilePath} --env production --watch true`,
    );
  });

  shipit.blTask('copy-config', async () => {
    const ecosystem = `
module.exports = {
apps: [
  {
    name: '${appName}',
    script: '${shipit.releasePath}/server/dist/index.js',
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
      console.log('=> File <ecosystem.config.js> created successfully.');
    });
    await shipit.copyToRemote('ecosystem.config.js', ecosystemFilePath);
  });

};
