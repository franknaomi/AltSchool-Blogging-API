const express = require('express');
const logger = require('../loggerInstance');

const loggingMiddleware = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  res.on('finish', () => {
    logger.info(`${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`);
  });
  next();
};

module.exports = loggingMiddleware;
