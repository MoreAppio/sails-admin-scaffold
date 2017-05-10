import _ from 'lodash';
'use strict';

(function() {
    const fs = require('fs'),
      ct = require('./constants'),
      ejs = require('ejs'),
      inflection = require('inflection'),
      fse = require('fs-extra'),
      path = require('path');

    const DissectController = function(scaffold, model, config) {
      try {
        this.scaffold = scaffold;
        this.model = model;
        this.config = config;
        this.fields = model.fields;
        this.associations = model.associations;
        this.modelName = inflection.camelize(model.name, false);

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
        dissect: async function() {
          try {
            const config = this.config;
            await this.exportModel(path.join(
              config.dest,
              '/api/models',
              `/${this.modelName}.js`,
            ));
          } catch (e) {
            throw e;
          }
        },

        /* 
         * make associations
         */
        exportModelAss: async function() {
          const associations = this.model.associations;
          let modelAssociation = '';

          // check BelongsTo
          const hasBelongsTo = !_.isNil(associations) && _.has(associations, 'belongsTo');
          if (hasBelongsTo) {
            for (const ass of associations.belongsTo) {
              modelAssociation += `\n${this.modelName}.belongsTo(${ass});\n`;
              modelAssociation += `${ass}.hasOne(${this.modelName});\n`;
            }
          }

          // check HasMany (1 to Many)
          const hasHasMany = !_.isNil(associations) && _.has(associations, 'hasMany');
          if (hasHasMany) {
            for (const ass of associations.hasMany) {
              modelAssociation += `${ass}.hasMany(${this.modelName});`;
            }
          }

          // check BelongsToMany (Many to Many)
          // const hasBelongsToMany = _.has(this.associations, 'belongsToMany');
          // if (hasBelongsToMany) {
          //   modelAssociation += `${this.modelName}.belongsToMany(${ass});`;
          // }

          return modelAssociation;
        },

        exportModel: async function(exportFilePath) {
            try {
              let modelColumn = '';
              for (const column of this.model.fields) {
                const name = inflection.camelize(column.name, true);
                if (column.type.toLowerCase() !== 'virtual') {
                  let defaultValue;
                  if (column.type.toLowerCase() === 'string') {
                    defaultValue = `\'${column.default}\'`;
                  } else {
                    defaultValue = column.default;
                  }
                  modelColumn +=
                    `${name}: {
                  type: ${this.toSequelizeType(column.type)}${column.length ? `(${column.length})` : '' },
                  ${column.allowNull ? 'allowNull: true,' : 'allowNull: false,'}
                  ${column.unique ? 'unique: true,' : ''}
                  ${column.default ? `defaultValue: ${defaultValue}` : ''}
                },`;
            } else {
              modelColumn += 
              `${name}: {
                type: ${this.toSequelizeType(column.type)}${column.length ? `(${column.length})` : '' },
                get: function() {},
                set: function() {},
              },`;
            }
          }
          const modelAssociation = await this.exportModelAss();
          const filePath = path.join(__dirname, '/tmpl/model.ejs');
          const str = await fs.readFileSync(filePath, 'utf8');
          const buffer = ejs.render(str, {
            ...this, 
            modelColumn,
            modelAssociation,
          });
          const isExist = await fs.existsSync(exportFilePath);
          if (!isExist)
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