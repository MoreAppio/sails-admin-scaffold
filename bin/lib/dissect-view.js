'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

(function () {
  var fs = require('fs'),
      ct = require('./constants'),
      ejs = require('ejs'),
      inflection = require('inflection'),
      fse = require('fs-extra'),
      path = require('path'),
      appRoot = require('app-root-path').path;

  var DissectController = function DissectController(scaffold, model, config) {
    try {
      this.scaffold = scaffold;
      this.model = model;
      this.config = config;
      // this.fields = model.fields;
      var defaultLayout = {
        label: "",
        hide: "",
        sort: true,
        class: "",
        hideWhenCreate: false,
        hideWhenEdit: false
      };
      this.fields = model.fields.map(function (field) {
        return _extends({
          layout: defaultLayout
        }, field.layout, field);
      });

      this.nameSingular = inflection.singularize(model.name.toLowerCase());
      this.namePlural = inflection.pluralize(model.name.toLowerCase());
      this.nameSingularCap = inflection.camelize(this.nameSingular);
      this.namePluralCap = inflection.camelize(this.namePlural);
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
                return fse.ensureDirSync(path.join(this.config.dest, '/views-' + this.config.target + '/admin/' + this.nameLowerCaseSingularCap));

              case 4:
                _context.next = 6;
                return this.exportVue(path.join(config.dest, '/views-' + this.config.target + '/admin/' + this.nameLowerCaseSingularCap + '/vue.ejs'));

              case 6:
                _context.next = 8;
                return this.exportShow(path.join(config.dest, '/views-' + this.config.target + '/admin/' + this.nameLowerCaseSingularCap + '/show.ejs'));

              case 8:
                _context.next = 10;
                return this.exportCreate(path.join(config.dest, '/views-' + this.config.target + '/admin/' + this.nameLowerCaseSingularCap + '/create.ejs'));

              case 10:
                _context.next = 12;
                return this.exportEdit(path.join(config.dest, '/views-' + this.config.target + '/admin/' + this.nameLowerCaseSingularCap + '/edit.ejs'));

              case 12:
                _context.next = 14;
                return this.exportIndex(path.join(config.dest, '/views-' + this.config.target + '/admin/' + this.nameLowerCaseSingularCap + '/index.ejs'));

              case 14:
                _context.next = 16;
                return this.exportForm(path.join(config.dest, '/views-' + this.config.target + '/admin/' + this.nameLowerCaseSingularCap + '/form.ejs'));

              case 16:
                _context.next = 21;
                break;

              case 18:
                _context.prev = 18;
                _context.t0 = _context['catch'](0);
                throw _context.t0;

              case 21:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 18]]);
      }));

      function dissect() {
        return _ref.apply(this, arguments);
      }

      return dissect;
    }(),

    exportVue: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(exportFilePath) {
        var filePath, str, buffer, isExist;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                filePath = path.join(appRoot, '/tmpl/view/vue.ejs');
                // const filePath = path.join('./tmpl/view/vue.ejs');

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

      function exportVue(_x) {
        return _ref2.apply(this, arguments);
      }

      return exportVue;
    }(),

    exportShow: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(exportFilePath) {
        var filePath, isExist;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                filePath = path.join(appRoot, '/tmpl/view/show.ejs');
                _context3.next = 4;
                return fs.existsSync(exportFilePath);

              case 4:
                isExist = _context3.sent;

                if (isExist) {
                  _context3.next = 8;
                  break;
                }

                _context3.next = 8;
                return fse.copySync(filePath, exportFilePath);

              case 8:
                _context3.next = 13;
                break;

              case 10:
                _context3.prev = 10;
                _context3.t0 = _context3['catch'](0);
                throw _context3.t0;

              case 13:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 10]]);
      }));

      function exportShow(_x2) {
        return _ref3.apply(this, arguments);
      }

      return exportShow;
    }(),

    exportCreate: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(exportFilePath) {
        var filePath, isExist;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                filePath = path.join(appRoot, './tmpl/view/create.ejs');
                _context4.next = 4;
                return fs.existsSync(exportFilePath);

              case 4:
                isExist = _context4.sent;

                if (isExist) {
                  _context4.next = 8;
                  break;
                }

                _context4.next = 8;
                return fse.copySync(filePath, exportFilePath);

              case 8:
                _context4.next = 13;
                break;

              case 10:
                _context4.prev = 10;
                _context4.t0 = _context4['catch'](0);
                throw _context4.t0;

              case 13:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 10]]);
      }));

      function exportCreate(_x3) {
        return _ref4.apply(this, arguments);
      }

      return exportCreate;
    }(),

    exportEdit: function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(exportFilePath) {
        var filePath, isExist;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                filePath = path.join(appRoot, '/tmpl/view/edit.ejs');
                _context5.next = 4;
                return fs.existsSync(exportFilePath);

              case 4:
                isExist = _context5.sent;

                if (isExist) {
                  _context5.next = 8;
                  break;
                }

                _context5.next = 8;
                return fse.copySync(filePath, exportFilePath);

              case 8:
                _context5.next = 13;
                break;

              case 10:
                _context5.prev = 10;
                _context5.t0 = _context5['catch'](0);
                throw _context5.t0;

              case 13:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 10]]);
      }));

      function exportEdit(_x4) {
        return _ref5.apply(this, arguments);
      }

      return exportEdit;
    }(),

    exportIndex: function () {
      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(exportFilePath) {
        var filePath, str, buffer, isExist;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                filePath = path.join(appRoot, '/tmpl/view/index.ejs');
                _context6.next = 4;
                return fs.readFileSync(filePath, 'utf8');

              case 4:
                str = _context6.sent;
                buffer = ejs.render(str, this);
                _context6.next = 8;
                return fs.existsSync(exportFilePath);

              case 8:
                isExist = _context6.sent;

                if (isExist) {
                  _context6.next = 12;
                  break;
                }

                _context6.next = 12;
                return fs.writeFileSync(exportFilePath, buffer);

              case 12:
                _context6.next = 17;
                break;

              case 14:
                _context6.prev = 14;
                _context6.t0 = _context6['catch'](0);
                throw _context6.t0;

              case 17:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 14]]);
      }));

      function exportIndex(_x5) {
        return _ref6.apply(this, arguments);
      }

      return exportIndex;
    }(),

    exportForm: function () {
      var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(exportFilePath) {
        var filePath, str, buffer, isExist;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                filePath = path.join(appRoot, '/tmpl/view/form.ejs');
                _context7.next = 4;
                return fs.readFileSync(filePath, 'utf8');

              case 4:
                str = _context7.sent;
                buffer = ejs.render(str, this);
                _context7.next = 8;
                return fs.existsSync(exportFilePath);

              case 8:
                isExist = _context7.sent;

                if (isExist) {
                  _context7.next = 12;
                  break;
                }

                _context7.next = 12;
                return fs.writeFileSync(exportFilePath, buffer);

              case 12:
                _context7.next = 17;
                break;

              case 14:
                _context7.prev = 14;
                _context7.t0 = _context7['catch'](0);
                throw _context7.t0;

              case 17:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this, [[0, 14]]);
      }));

      function exportForm(_x6) {
        return _ref7.apply(this, arguments);
      }

      return exportForm;
    }()

  };

  exports.dissect = function () {
    var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(_ref9) {
      var scaffold = _ref9.scaffold,
          model = _ref9.model,
          config = _ref9.config;
      var controller;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              controller = new DissectController(scaffold, model, config);
              _context8.next = 4;
              return controller.dissect();

            case 4:
              _context8.next = 9;
              break;

            case 6:
              _context8.prev = 6;
              _context8.t0 = _context8['catch'](0);
              throw _context8.t0;

            case 9:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, this, [[0, 6]]);
    }));

    return function (_x7) {
      return _ref8.apply(this, arguments);
    };
  }();
})();