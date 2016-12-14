'use strict';

(function()
{
  const fs = require('fs')
    , ct = require('./constants')
    , ejs = require('ejs')
    , inflection = require('inflection')
    , fse = require('fs-extra')
    , path = require('path');

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
      } catch (e) {
        throw e;
      }
    }

    DissectController.prototype = {
      dissect : async function() {
        try {
          const config = this.config;

          await this.exportVue(path.join(
            config.dest,
            `/view-labfnp/admin/${this.model.name}/vue.ejs`,
          ));

          await this.exportShow(path.join(
            config.dest,
            `/view-labfnp/admin/${this.model.name}/show.ejs`,
          ));

          await this.exportCreate(path.join(
            config.dest,
            `/view-labfnp/admin/${this.model.name}/create.ejs`,
          ));


          await this.exportEdit(path.join(
            config.dest,
            `/view-labfnp/admin/${this.model.name}/edit.ejs`,
          ));

          await this.exportIndex(path.join(
            config.dest,
            `/view-labfnp/admin/${this.model.name}/index.ejs`,
          ));

        } catch (e) {
          throw e;
        }
      },

      exportVue: async function(exportFilePath) {
        try {
          const filePath = path.join(__dirname, '/tmpl/view/vue.ejs');
          const str = await fs.readFileSync(filePath, 'utf8');
          const buffer =  ejs.render(str, this);
          await fs.writeFileSync(exportFilePath, buffer);
        } catch (e) {
          throw e;
        }
      },

      exportShow: async function(exportFilePath) {
        try {
          const filePath = path.join(__dirname, '/tmpl/view/show.ejs');
          await fse.copySync(filePath, exportFilePath);
        } catch (e) {
          throw e;
        }
      },

      exportCreate: async function(exportFilePath) {
        try {
          const filePath = path.join(__dirname, '/tmpl/view/create.ejs');
          await fse.copySync(filePath, exportFilePath);
        } catch (e) {
          throw e;
        }
      },

      exportEdit: async function(exportFilePath) {
        try {
          const filePath = path.join(__dirname, '/tmpl/view/edit.ejs');
          await fse.copySync(filePath, exportFilePath);
        } catch (e) {
          throw e;
        }
      },

      exportIndex: async function(exportFilePath) {
        try {
          const filePath = path.join(__dirname, '/tmpl/view/index.ejs');
          const str = await fs.readFileSync(filePath, 'utf8');
          console.log(this);
          this.fields = this.fields.map((field) => {
            return {
              ...field,
              name: inflection.camelize(field.name, true ),
            }
          })
          const buffer =  ejs.render(str, this);
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
