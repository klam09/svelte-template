'use strict';

const url = require('url');
const paths = require('./paths');

const APP_ENV = process.env.APP_ENV;
if (!APP_ENV) {
    throw new Error(
        'The NODE_ENV environment variable is required but was not specified.'
    );
}

const envConfig = require(`${paths.appConfig}/${APP_ENV}.config.json`);

function ensureSlash(inputPath, needsSlash) {
    const hasSlash = inputPath.endsWith('/');
    if (hasSlash && !needsSlash) {
        return inputPath.substr(0, inputPath.length - 1);
    } else if (!hasSlash && needsSlash) {
        return `${inputPath}/`;
    } else {
        return inputPath;
    }
}

function getServedPath() {
    const publicUrl = getPublicUrl();
    const servedUrl = (publicUrl ? url.parse(publicUrl).pathname : '/');
    return ensureSlash(servedUrl, true);
}

function getEnvironmentConfig() {
    const config = {
        APPCONFIG: {
            NODE_ENV: process.env.NODE_ENV,
            PUBLIC_URL: getPublicUrl(),
            VERSION: require(paths.appPackageJson).version,
            BUILD_TIME: new Date(),
            APP_ENV: process.env.APP_ENV,
            ...envConfig
        }
    };

    const processedEnvConfig = _stringify(config);

    return { envConfig: config, processedEnvConfig };
}

function getPublicUrl() {
    const publicUrl = envConfig.PUBLIC_URL;
    return publicUrl ? publicUrl : '';
}

function _stringify(obj) {
    const newObj = Object.assign({}, obj);
    Object.keys(newObj).forEach(key => {
        if (typeof newObj[key] === 'object' && !Array.isArray(newObj[key])) {
            newObj[key] = _stringify(newObj[key]);
        } else {
            newObj[key] = JSON.stringify(newObj[key]);
        }
    });

    return newObj;
}

module.exports = {
    getEnvironmentConfig,
    getPublicUrl,
    getServedPath
};
