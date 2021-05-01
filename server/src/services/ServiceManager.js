const logger = require("../metrics/logger");

class ServiceManager {
  constructor() {
    this.serviceReady = false;
  }

  init({ repository, services }) {
    logger({ service: "service", tag: this.constructor.name, message: `init` });
    this.repository = repository;
    this.services = services;
    this.serviceReady = true;
  }

  exec(fnName, params, message) {
    if (!this.serviceReady) throw new Error(`${this.constructor.name} is not ready`);
    if (!this[fnName] || typeof this[fnName] !== "function") throw new Error(`${fnName} is not valid`);
    try {
      logger({
        service: "service",
        tag: this.constructor.name,
        message: `exec ${fnName} ${params ? JSON.stringify(params) : ""} ${message ? message : ""}`,
      });
      return this[fnName](params);
    } catch (err) {
      logger({ service: "service", tag: "error", message: err.message });
    }
  }
}

module.exports = ServiceManager;
