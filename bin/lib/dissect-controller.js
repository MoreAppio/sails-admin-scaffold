'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

(function () {
  var fs = require('fs'),
      ct = require('./constants'),
      ejs = require('ejs'),
      inflection = require('inflection'),
      fse = require('fs-extra'),
      path = require('path');

  var DissectController = function DissectController(scaffold, model, config) {
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
                return this.exportAdminController(path.join(config.dest, config.controllerBasePath, '/admin/', this.nameClassify + 'Controller.js'));

              case 4:
                _context.next = 6;
                return this.exportAdminApiController(path.join(config.dest, config.controllerBasePath, '/api/admin/', this.nameClassify + 'Controller.js'));

              case 6:
                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context['catch'](0);
                throw _context.t0;

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 8]]);
      }));

      function dissect() {
        return _ref.apply(this, arguments);
      }

      return dissect;
    }(),

    exportAdminController: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(exportFilePath) {
        var filePath, str, buffer, isExist;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                filePath = path.join(__dirname, '/tmpl/defaultAdminController.ejs');
                _context2.next = 4;
                return fs.readFileSync(filePath, 'utf8');

              case 4:
                str = _context2.sent;
                buffer = ejs.render(str, this);
                _context2.next = 8;
                return fs.existsSync(exportFilePath);

              case 8:
                isExist = _context2.sent;

                if (isExist) {
                  _context2.next = 12;
                  break;
                }

                _context2.next = 12;
                return fs.writeFileSync(exportFilePath, buffer);

              case 12:
                _context2.next = 17;
                break;

              case 14:
                _context2.prev = 14;
                _context2.t0 = _context2['catch'](0);
                throw _context2.t0;

              case 17:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 14]]);
      }));

      function exportAdminController(_x) {
        return _ref2.apply(this, arguments);
      }

      return exportAdminController;
    }(),

    exportAdminApiController: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(exportFilePath) {
        var filePath, str, buffer, isExist;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                filePath = path.join(__dirname, '/tmpl/defaultAdminApiController.ejs');
                _context3.next = 4;
                return fs.readFileSync(filePath, 'utf8');

              case 4:
                str = _context3.sent;
                buffer = ejs.render(str, this);
                _context3.next = 8;
                return fs.existsSync(exportFilePath);

              case 8:
                isExist = _context3.sent;

                if (isExist) {
                  _context3.next = 12;
                  break;
                }

                _context3.next = 12;
                return fs.writeFileSync(exportFilePath, buffer);

              case 12:
                _context3.next = 17;
                break;

              case 14:
                _context3.prev = 14;
                _context3.t0 = _context3['catch'](0);
                throw _context3.t0;

              case 17:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 14]]);
      }));

      function exportAdminApiController(_x2) {
        return _ref3.apply(this, arguments);
      }

      return exportAdminApiController;
    }()
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

    return function (_x3) {
      return _ref4.apply(this, arguments);
    };
  }();
})();