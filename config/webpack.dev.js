const paths = require('./paths');
const fs = require('fs');

process.env.NODE_ENV = 'development';
process.env.APP_ENV = (process.argv[4] && process.argv[4].replace(/--/g, '')) || 'prod';

if (!fs.existsSync(`${paths.appConfig}/${process.env.APP_ENV}.config.json`)) {
    throw new Error(
        `Cannot find ${paths.appConfig}/${process.env.APP_ENV}.config.json`
    );
}
const getWebpackConfig = require('./webpack.config.js');

module.exports = getWebpackConfig(process.env.NODE_ENV);
