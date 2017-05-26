'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

'use strict';

(function () {
  var fs = require('fs'),
      ct = require('./constants'),
      ejs = require('ejs'),
      inflection = require('inflection'),
      fse = require('fs-extra'),
      path = require('path'),
      appRoot = __dirname.replace('/bin', '').replace('/lib', '');

  var DissectController = function DissectController(scaffold, model, config) {
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
  };

  DissectController.prototype = {
    dissect: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var config;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                config = this.config;
                _context.next = 4;
                return this.exportModel(path.join(config.dest, '/api/models', '/' + this.modelName + '.js'));

              case 4:
                _context.next = 9;
                break;

              case 6:
                _context.prev = 6;
                _context.t0 = _context['catch'](0);
                throw _context.t0;

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 6]]);
      }));

      function dissect() {
        return _ref.apply(this, arguments);
      }

      return dissect;
    }(),

    /* 
     * make associations
     */
    exportModelAss: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var associations, modelAssociation, hasBelongsTo, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, ass, hasHasMany, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _ass, hasBelongsToMany, tableArray, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _ass2, i, j;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                associations = this.model.associations;
                modelAssociation = '';

                // check BelongsTo

                hasBelongsTo = !_lodash2.default.isNil(associations) && _lodash2.default.has(associations, 'belongsTo');

                if (!hasBelongsTo) {
                  _context2.next = 23;
                  break;
                }

                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 7;

                for (_iterator = associations.belongsTo[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  ass = _step.value;

                  modelAssociation += '\n' + this.modelName + '.belongsTo(' + ass + ');\n';
                  modelAssociation += ass + '.hasOne(' + this.modelName + ');\n';
                }
                _context2.next = 15;
                break;

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2['catch'](7);
                _didIteratorError = true;
                _iteratorError = _context2.t0;

              case 15:
                _context2.prev = 15;
                _context2.prev = 16;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 18:
                _context2.prev = 18;

                if (!_didIteratorError) {
                  _context2.next = 21;
                  break;
                }

                throw _iteratorError;

              case 21:
                return _context2.finish(18);

              case 22:
                return _context2.finish(15);

              case 23:

                // check HasMany (1 to Many)
                hasHasMany = !_lodash2.default.isNil(associations) && _lodash2.default.has(associations, 'hasMany');

                if (!hasHasMany) {
                  _context2.next = 44;
                  break;
                }

                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context2.prev = 28;

                for (_iterator2 = associations.hasMany[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  _ass = _step2.value;

                  modelAssociation += _ass + '.hasMany(' + this.modelName + ');';
                }
                _context2.next = 36;
                break;

              case 32:
                _context2.prev = 32;
                _context2.t1 = _context2['catch'](28);
                _didIteratorError2 = true;
                _iteratorError2 = _context2.t1;

              case 36:
                _context2.prev = 36;
                _context2.prev = 37;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 39:
                _context2.prev = 39;

                if (!_didIteratorError2) {
                  _context2.next = 42;
                  break;
                }

                throw _iteratorError2;

              case 42:
                return _context2.finish(39);

              case 43:
                return _context2.finish(36);

              case 44:

                // check BelongsToMany (Many to Many)
                hasBelongsToMany = _lodash2.default.has(this.associations, 'belongsToMany');
                tableArray = [];

                if (!hasBelongsToMany) {
                  _context2.next = 66;
                  break;
                }

                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                _context2.prev = 50;

                for (_iterator3 = associations.belongsToMany[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  _ass2 = _step3.value;

                  tableArray.push(_ass2);
                }
                _context2.next = 58;
                break;

              case 54:
                _context2.prev = 54;
                _context2.t2 = _context2['catch'](50);
                _didIteratorError3 = true;
                _iteratorError3 = _context2.t2;

              case 58:
                _context2.prev = 58;
                _context2.prev = 59;

                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }

              case 61:
                _context2.prev = 61;

                if (!_didIteratorError3) {
                  _context2.next = 64;
                  break;
                }

                throw _iteratorError3;

              case 64:
                return _context2.finish(61);

              case 65:
                return _context2.finish(58);

              case 66:
                for (i = tableArray.length - 1; i >= 0; i--) {
                  for (j = 0; j <= tableArray.length - 1; j++) {
                    if (i !== j) {
                      // console.log('i,j', i, j);
                      // console.log('tableArray[i],tableArray[j]', tableArray[i], tableArray[j]);
                      modelAssociation += '\n                    ' + tableArray[i] + '.belongsToMany(' + tableArray[j] + ', {\n                      through: ' + this.modelName + ',\n                      foreignKey: {\n                        name: \'' + tableArray[i] + 'Id\',\n                        as: \'' + inflection.pluralize(tableArray[j]) + '\',\n                      },\n                    });';
                    }
                  }
                }
                return _context2.abrupt('return', modelAssociation);

              case 68:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[7, 11, 15, 23], [16,, 18, 22], [28, 32, 36, 44], [37,, 39, 43], [50, 54, 58, 66], [59,, 61, 65]]);
      }));

      function exportModelAss() {
        return _ref2.apply(this, arguments);
      }

      return exportModelAss;
    }(),

    exportModel: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(exportFilePath) {
        var modelColumn, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, column, name, columnType, modelAssociation, filePath, str, buffer, isExist;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                modelColumn = '';
                _iteratorNormalCompletion4 = true;
                _didIteratorError4 = false;
                _iteratorError4 = undefined;
                _context3.prev = 5;
                _iterator4 = this.model.fields[Symbol.iterator]();

              case 7:
                if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                  _context3.next = 31;
                  break;
                }

                column = _step4.value;

                // console.log('!!!! column=>', column);
                name = inflection.camelize(column.name, true);
                columnType = column.type.toLowerCase();
                _context3.t0 = columnType;
                _context3.next = _context3.t0 === 'virtual' ? 14 : _context3.t0 === 'enum' ? 16 : 22;
                break;

              case 14:
                modelColumn += '\n                  ' + name + ': {\n                    type: ' + this.toSequelizeType(columnType) + (column.length ? '(' + column.length + ')' : '') + ',\n                    get: function() {},\n                    set: function() {},\n                  },\n\n\n                ';
                return _context3.abrupt('break', 28);

              case 16:
                modelColumn += name + ': {\n                    type: ' + this.toSequelizeType(columnType) + '(' + column.param.slice(1, -1) + '),';
                if (column.allowNull) {
                  modelColumn += '' + (column.allowNull ? 'allowNull: true,' : 'allowNull: false,');
                }
                if (column.unique) {
                  modelColumn += 'unique: true,';
                }
                if (column.default) {
                  modelColumn += 'defaultValue: ' + this.getColumnDefaultType(column) + ',';
                }
                modelColumn += '},\n\n';
                return _context3.abrupt('break', 28);

              case 22:
                modelColumn += name + ': {\n                    type: ' + this.toSequelizeType(columnType) + (column.length ? '(' + column.length + ')' : '') + ',';
                if (column.allowNull) {
                  modelColumn += '' + (column.allowNull ? 'allowNull: true,' : 'allowNull: false,');
                }
                if (column.unique) {
                  modelColumn += 'unique: true,';
                }
                if (column.default) {
                  modelColumn += 'defaultValue: ' + this.getColumnDefaultType(column) + ',';
                }
                modelColumn += '},\n\n';
                return _context3.abrupt('break', 28);

              case 28:
                _iteratorNormalCompletion4 = true;
                _context3.next = 7;
                break;

              case 31:
                _context3.next = 37;
                break;

              case 33:
                _context3.prev = 33;
                _context3.t1 = _context3['catch'](5);
                _didIteratorError4 = true;
                _iteratorError4 = _context3.t1;

              case 37:
                _context3.prev = 37;
                _context3.prev = 38;

                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }

              case 40:
                _context3.prev = 40;

                if (!_didIteratorError4) {
                  _context3.next = 43;
                  break;
                }

                throw _iteratorError4;

              case 43:
                return _context3.finish(40);

              case 44:
                return _context3.finish(37);

              case 45:
                _context3.next = 47;
                return this.exportModelAss();

              case 47:
                modelAssociation = _context3.sent;
                filePath = path.join(appRoot, '/tmpl/model.ejs');
                _context3.next = 51;
                return fs.readFileSync(filePath, 'utf8');

              case 51:
                str = _context3.sent;
                buffer = ejs.render(str, _extends({}, this, {
                  modelColumn: modelColumn,
                  modelAssociation: modelAssociation
                }));
                _context3.next = 55;
                return fs.existsSync(exportFilePath);

              case 55:
                isExist = _context3.sent;

                if (isExist) {
                  _context3.next = 59;
                  break;
                }

                _context3.next = 59;
                return fs.writeFileSync(exportFilePath, buffer);

              case 59:
                _context3.next = 64;
                break;

              case 61:
                _context3.prev = 61;
                _context3.t2 = _context3['catch'](0);
                throw _context3.t2;

              case 64:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 61], [5, 33, 37, 45], [38,, 40, 44]]);
      }));

      function exportModel(_x) {
        return _ref3.apply(this, arguments);
      }

      return exportModel;
    }(),

    getColumnDefaultType: function getColumnDefaultType(column) {
      var defaultValue = void 0;
      var type = column.type.toLowerCase();
      if (type === 'string' || type === 'enum') {
        defaultValue = '\'' + column.default + '\'';
      } else {
        defaultValue = column.default;
      }
      return defaultValue;
    },


    toSequelizeType: function toSequelizeType(type) {
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
          case 'tinyint':
          case 'boolean':
          case 'bool':
            return 'Sequelize.BOOLEAN';
            break;
          case 'virtual':
            return 'Sequelize.VIRTUAL';
            break;
          case 'enum':
            return 'Sequelize.ENUM';
            break;
          case 'text':
            return 'Sequelize.TEXT';
            break;
          default:
            return 'Sequelize.STRING';
        }
      } catch (e) {
        throw e;
      }
    }

  };

  exports.dissect = function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(_ref5) {
      var scaffold = _ref5.scaffold,
          model = _ref5.model,
          config = _ref5.config;
      var controller;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              controller = new DissectController(scaffold, model, config);
              _context4.next = 4;
              return controller.dissect();

            case 4:
              _context4.next = 9;
              break;

            case 6:
              _context4.prev = 6;
              _context4.t0 = _context4['catch'](0);
              throw _context4.t0;

            case 9:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this, [[0, 6]]);
    }));

    return function (_x2) {
      return _ref4.apply(this, arguments);
    };
  }();
})();