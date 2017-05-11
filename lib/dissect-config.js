'use strict';

(function() {
  const fs = require('fs'),
    ct = require('./constants'),
    ejs = require('ejs'),
    inflection = require('inflection'),
    fse = require('fs-extra'),
    path = require('path'),
    appRoot = require('app-root-path').path;

  const DissectController = function(scaffold, model, config, index) {
    try {
      this.scaffold = scaffold;
      this.model = model;
      this.config = config;
      this.fields = model.fields;
      this.index = index;

      this.nameSingular = inflection.singularize(model.name.toLowerCase());
      this.namePlural = inflection.pluralize(model.name.toLowerCase());
      this.nameSingularCap = inflection.camelize(this.nameSingular);
      this.namePluralCap = inflection.camelize(this.namePlural);
      this.nameClassify = inflection.camelize(model.name);
      this.nameClassifyWithLowerFirst = inflection.camelize(this.model.name, true);
      this.nameLowerCaseSingularCap = this.nameSingularCap.toLowerCase();
    } catch (e) {
      throw e;
    }
  }

  DissectController.prototype = {
    dissect: async function() {
      try {
        const config = this.config;

        await this.exportRoute(path.join(
          config.dest,
          '/config/customRoutes.js',
        ));

        await this.exportMenuItem(path.join(
          config.dest,
          '/config/init/menuItem/menuItem.js',
        ));

      } catch (e) {
        throw e;
      }
    },

    exportRoute: async function(exportFilePath) {
      try {
        const filePath = path.join(appRoot, '/tmpl/routes.ejs');
        const str = await fs.readFileSync(filePath, 'utf8');
        const buffer = ejs.render(str, this);
        const isExist = await fs.existsSync(exportFilePath);

        if (isExist) {
          await fs.appendFile(exportFilePath, '\r\n');
          await fs.appendFile(exportFilePath, buffer);
        } else {
          await fs.writeFileSync(exportFilePath, buffer);
        }
      } catch (e) {
        throw e;
      }
    },

    exportMenuItem: async function(exportFilePath) {
      try {
        const filePath = path.join(appRoot, '/tmpl/menuItem.ejs');
        const str = await fs.readFileSync(filePath, 'utf8');
        const buffer = ejs.render(str, this);
        const isExist = await fs.existsSync(exportFilePath);
        
        if (isExist) {
          await fs.appendFile(exportFilePath, '\r\n');
          await fs.appendFile(exportFilePath, buffer);
        } else {
          await fs.writeFileSync(exportFilePath, buffer);
        }
      } catch (e) {
        throw e;
      }
    },
  }

  exports.dissect = async function({ scaffold, model, config, index }) {
    try {
      const controller = new DissectController(scaffold, model, config, index);
      await controller.dissect();
    } catch (e) {
      throw e;
    }
  }
})();