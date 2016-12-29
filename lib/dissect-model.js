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

        this.nameClassify = inflection.camelize(model.name);
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

          await this.exportModel(path.join(
            config.dest,
            '/api/models',
            `/${this.nameClassify}.js`,
          ));

        } catch (e) {
          throw e;
        }
      },



      exportModel: async function(exportFilePath) {
        try {

          let modelColumn = '';
          for( let column of this.model.fields ) {
            let name = column.name;
            if (column.type.toLowerCase() !== 'virtual') {
              modelColumn += `${name}: {
                type: ${this.toSequelizeType(column.type)}${column.length ? `(${column.length})` : '' },
                allowNull: false,
                ${column.unique ? 'unique: true,' : ''}
                ${column.default ? `defaultValue: ${column.default},` : ''}
              },`
            } else {
              modelColumn += `${name}: {
                type: ${this.toSequelizeType(column.type)}${column.length ? `(${column.length})` : '' },
                get: function() {},
                set: function() {},
              },`
            }
          }
          const filePath = path.join(__dirname, '/tmpl/model.ejs');
          const str = await fs.readFileSync(filePath, 'utf8');
          const buffer =  ejs.render(str, { ...this, modelColumn });
          await fs.writeFileSync(exportFilePath, buffer);
        } catch (e) {
          throw e;
        }
      },

      toSequelizeType: (type) => {
        try {
          switch (type.toLowerCase()) {
            case 'string':
            case 'str':
              return 'Sequelize.STRING';
              break;
            case 'integer':
            case 'int':
              return 'Sequelize.INTEGER';
              break;
            case 'double':
              return 'Sequelize.DOUBLE';
              break;
            case 'decimal':
              return 'Sequelize.DECIMAL';
              break;
            case 'date':
              return 'Sequelize.DATE';
              break;
            case 'boolean':
            case 'bool':
              return 'Sequelize.BOOLEAN';
              break;
            case 'virtual':
              return 'Sequelize.VIRTUAL';
              break;
            default:
              return 'Sequelize.STRING';
          }
        } catch (e) {
          throw e;
        }
      }

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
