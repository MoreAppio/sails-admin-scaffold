'use strict';

(function() {
  const fs = require('fs'),
    ct = require('./constants'),
    ejs = require('ejs'),
    inflection = require('inflection'),
    fse = require('fs-extra'),
    path = require('path'),
    appRoot = require('app-root-path').path;

  const DissectController = function(scaffold, model, config) {
    try {
      this.scaffold = scaffold;
      this.model = model;
      this.config = config;
      this.fields = model.fields;

      this.nameSingular = inflection.singularize(model.name.toLowerCase());
      this.namePlural = inflection.pluralize(model.name.toLowerCase());
      this.nameSingularCap = inflection.camelize(this.nameSingular);
      this.namePluralCap = inflection.camelize(this.namePlural);
      this.nameClassify = inflection.camelize(model.name);
      this.nameLowerCaseSingularCap = this.nameSingularCap.toLowerCase();
    } catch (e) {
      throw e;
    }
  }

  DissectController.prototype = {
    dissect: async function() {
      try {
        const config = this.config;

        await this.exportAdminController(path.join(
          config.dest,
          config.controllerBasePath,
          '/admin/',
          `${this.nameClassify}Controller.js`,
        ));

        await this.exportAdminApiController(path.join(
          config.dest,
          config.controllerBasePath,
          '/api/admin/',
          `${this.nameClassify}Controller.js`,
        ));

      } catch (e) {
        throw e;
      }
    },

    exportAdminController: async function(exportFilePath) {
      try {
        const filePath = path.join(appRoot, '/tmpl/defaultAdminController.ejs');
        const str = await fs.readFileSync(filePath, 'utf8');
        const buffer = ejs.render(str, this);
        const isExist = await fs.existsSync(exportFilePath);
        if (!isExist)
          await fs.writeFileSync(exportFilePath, buffer);
      } catch (e) {
        throw e;
      }
    },

    exportAdminApiController: async function(exportFilePath) {
      try {
        const filePath = path.join(appRoot, '/tmpl/defaultAdminApiController.ejs');
        const str = await fs.readFileSync(filePath, 'utf8');
        const buffer = ejs.render(str, this);
        const isExist = await fs.existsSync(exportFilePath);
        if (!isExist)
          await fs.writeFileSync(exportFilePath, buffer);
      } catch (e) {
        throw e;
      }
    },
  }

  exports.dissect = async function({ scaffold, model, config }) {
    try {
      const controller = new DissectController(scaffold, model, config);
      await controller.dissect();
    } catch (e) {
      throw e;
    }
  }
})();