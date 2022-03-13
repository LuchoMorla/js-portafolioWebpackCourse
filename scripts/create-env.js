const fileSystem = require('fs');

fileSystem.writeFileSync('./.env', `API=${process.env.API}\n`);