'use strict';

require('babel-core/register');

require('babel-polyfill');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _string_decoder = require('string_decoder');

var _jsBeautify = require('js-beautify');

var _argumentParser = require('./lib/argument-parser');

var _argumentParser2 = _interopRequireDefault(_argumentParser);

var _package = require('./package.json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

(function () {

  var ct = require('./lib/constants');
  var Erd2Cargo = {
    appDir: _path2.default.dirname(require.main.filename),

    decoder: new _string_decoder.StringDecoder('utf8'),

    config: {
      init: false
    },

    init: function init() {
      this.parse();
    },

    parse: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var config, err, file;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;

                // console.error('this.config', this.config);
                this.config = _argumentParser2.default.parse(process.argv);
                config = this.config;

                if (!config.help) {
                  _context.next = 7;
                  break;
                }

                this.help();
                _context.next = 35;
                break;

              case 7:
                if (!config.clean) {
                  _context.next = 11;
                  break;
                }

                this.cleanFolder();
                _context.next = 35;
                break;

              case 11:
                if (!config.version) {
                  _context.next = 15;
                  break;
                }

                this.version();
                _context.next = 35;
                break;

              case 15:
                if (config.file) {
                  _context.next = 19;
                  break;
                }

                this.shell();
                _context.next = 35;
                break;

              case 19:
                err = false;
                file = null;
                _context.prev = 21;
                _context.next = 24;
                return _fs2.default.readFileSync(config.file, 'utf8');

              case 24:
                file = _context.sent;
                _context.next = 31;
                break;

              case 27:
                _context.prev = 27;
                _context.t0 = _context['catch'](21);

                err = true;
                console.log('Couldn\'t access \'' + config.file + '\'!');

              case 31:
                if (err) {
                  _context.next = 35;
                  break;
                }

                this.config = config;
                _context.next = 35;
                return this.start();

              case 35:
                _context.next = 40;
                break;

              case 37:
                _context.prev = 37;
                _context.t1 = _context['catch'](0);

                console.error(_context.t1);

              case 40:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 37], [21, 27]]);
      }));

      function parse() {
        return _ref.apply(this, arguments);
      }

      return parse;
    }(),

    cleanFolder: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var isErdPathExists, cmd, rmExportPath, isCargoPathExists, _cmd, _rmExportPath;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;

                console.log('@ cleanFolder appDir is located=>', this.appDir);
                _context2.next = 4;
                return _fs2.default.existsSync(this.config.exportPath.erd);

              case 4:
                isErdPathExists = _context2.sent;

                if (!isErdPathExists) {
                  _context2.next = 14;
                  break;
                }

                cmd = 'rm -rf ' + this.config.exportPath.erd;

                console.log('@ cleanFolder command=>' + cmd);
                _context2.next = 10;
                return _child_process2.default.execSync(cmd);

              case 10:
                rmExportPath = _context2.sent;

                if (rmExportPath) console.log('@ Remove sucecssed.');
                _context2.next = 15;
                break;

              case 14:
                console.warn('@ Default ERD export path is not exist!');

              case 15:
                _context2.next = 17;
                return _fs2.default.existsSync(this.config.exportPath.cargo);

              case 17:
                isCargoPathExists = _context2.sent;

                if (!isCargoPathExists) {
                  _context2.next = 27;
                  break;
                }

                _cmd = 'rm -rf ' + this.config.exportPath.cargo;

                console.log('@ cleanFolder command=>' + _cmd);
                _context2.next = 23;
                return _child_process2.default.execSync(_cmd);

              case 23:
                _rmExportPath = _context2.sent;

                if (_rmExportPath) console.log('@ Remove sucecssed.');
                _context2.next = 28;
                break;

              case 27:
                console.warn('@ Default Cargo CMS export path is not exist!');

              case 28:
                _context2.next = 30;
                return this.start();

              case 30:
                _context2.next = 35;
                break;

              case 32:
                _context2.prev = 32;
                _context2.t0 = _context2['catch'](0);

                console.error(_context2.t0);

              case 35:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 32]]);
      }));

      function cleanFolder() {
        return _ref2.apply(this, arguments);
      }

      return cleanFolder;
    }(),

    exportErd: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var $c, parameter, buildErdScript, execBuildErd, textChunk;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                $c = this.config;
                parameter = '--export=' + $c.mode + ' ' + $c.file + ' ' + $c.exportPath.erd + ' ' + $c.exportPath.cargo;
                buildErdScript = $c.pathPhp + ' ' + $c.pathMwse + ' ' + parameter;

                console.log('@ exec script=>', buildErdScript);

                _context3.next = 7;
                return _child_process2.default.execSync(buildErdScript);

              case 7:
                execBuildErd = _context3.sent;
                textChunk = this.decoder.write(execBuildErd);

                console.log('@ execBuildErd result=>', textChunk);
                _context3.next = 15;
                break;

              case 12:
                _context3.prev = 12;
                _context3.t0 = _context3['catch'](0);

                // throw new Error(error);
                console.error(_context3.t0);

              case 15:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 12]]);
      }));

      function exportErd() {
        return _ref3.apply(this, arguments);
      }

      return exportErd;
    }(),

    scaffold: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        var erdExportPath, exist, readRawDir, rawCount, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file, babelNode, execScaffold, result, textChunk;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                erdExportPath = this.config.exportPath.erd;
                _context4.next = 4;
                return _fs2.default.existsSync(erdExportPath);

              case 4:
                exist = _context4.sent;

                if (exist) {
                  _context4.next = 7;
                  break;
                }

                return _context4.abrupt('return', console.error('No folder \'' + erdExportPath + '\' exists.'));

              case 7:
                _context4.next = 9;
                return _fs2.default.readdirSync(erdExportPath);

              case 9:
                readRawDir = _context4.sent;

                console.log('@ readDir result=>', readRawDir);

                rawCount = 0;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context4.prev = 15;
                _iterator = readRawDir[Symbol.iterator]();

              case 17:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context4.next = 34;
                  break;
                }

                file = _step.value;

                rawCount++;

                if (!file.includes('.bak')) {
                  _context4.next = 23;
                  break;
                }

                console.warn('! Skipped ' + file + ' because it is a .bak file.');
                return _context4.abrupt('continue', 31);

              case 23:
                console.log('@ ' + rawCount + '/' + readRawDir.length + ' file name=> ' + file);
                babelNode = 'node_modules/babel-cli/bin/babel-node.js';
                execScaffold = babelNode + ' --presets es2015,stage-0 scaffold.js -f ' + erdExportPath + '/' + file;
                _context4.next = 28;
                return _child_process2.default.execSync(execScaffold);

              case 28:
                result = _context4.sent;
                textChunk = this.decoder.write(result);

                if (result) console.log('@ execSync result=>\n', textChunk);

              case 31:
                _iteratorNormalCompletion = true;
                _context4.next = 17;
                break;

              case 34:
                _context4.next = 40;
                break;

              case 36:
                _context4.prev = 36;
                _context4.t0 = _context4['catch'](15);
                _didIteratorError = true;
                _iteratorError = _context4.t0;

              case 40:
                _context4.prev = 40;
                _context4.prev = 41;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 43:
                _context4.prev = 43;

                if (!_didIteratorError) {
                  _context4.next = 46;
                  break;
                }

                throw _iteratorError;

              case 46:
                return _context4.finish(43);

              case 47:
                return _context4.finish(40);

              case 48:
                _context4.next = 53;
                break;

              case 50:
                _context4.prev = 50;
                _context4.t1 = _context4['catch'](0);

                // throw new Error(error);
                console.error(_context4.t1);

              case 53:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 50], [15, 36, 40, 48], [41,, 43, 47]]);
      }));

      function scaffold() {
        return _ref4.apply(this, arguments);
      }

      return scaffold;
    }(),

    appendBody: function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(target, format) {
        var isExist, data, dataWithBody, dataWithFix;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return _fs2.default.existsSync(target);

              case 3:
                isExist = _context5.sent;

                if (!isExist) {
                  _context5.next = 14;
                  break;
                }

                _context5.next = 7;
                return _fs2.default.readFileSync(target);

              case 7:
                data = _context5.sent;
                dataWithBody = format(data);
                dataWithFix = (0, _jsBeautify.js_beautify)(dataWithBody, { indent_size: 2 });
                _context5.next = 12;
                return _fs2.default.writeFileSync(target, dataWithFix);

              case 12:
                _context5.next = 15;
                break;

              case 14:
                console.warn('@ Target ' + target + ' is not exist so skip to beautify.');

              case 15:
                _context5.next = 20;
                break;

              case 17:
                _context5.prev = 17;
                _context5.t0 = _context5['catch'](0);
                throw new Error(_context5.t0);

              case 20:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 17]]);
      }));

      function appendBody(_x, _x2) {
        return _ref5.apply(this, arguments);
      }

      return appendBody;
    }(),

    beautifyJs: function () {
      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(file) {
        var _this = this;

        var modelPath, readModelDir, count, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _loop, _iterator2, _step2;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                modelPath = this.config.exportPath.cargo + '/api/models';
                _context7.next = 4;
                return _fs2.default.readdirSync(modelPath);

              case 4:
                readModelDir = _context7.sent;

                console.log('@ beautifyJs readDir result=>', readModelDir);
                count = 0;
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context7.prev = 10;

                _loop = function _loop() {
                  var file = _step2.value;

                  var filePath = modelPath + '/' + file;
                  _fs2.default.readFile(filePath, 'utf8', function () {
                    var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(err, data) {
                      var dataWithFix;
                      return regeneratorRuntime.wrap(function _callee6$(_context6) {
                        while (1) {
                          switch (_context6.prev = _context6.next) {
                            case 0:
                              if (!err) {
                                _context6.next = 2;
                                break;
                              }

                              throw err;

                            case 2:
                              dataWithFix = (0, _jsBeautify.js_beautify)(data, { indent_size: 2 });
                              // console.log(data);

                              _context6.next = 5;
                              return _fs2.default.writeFileSync(filePath, dataWithFix);

                            case 5:
                            case 'end':
                              return _context6.stop();
                          }
                        }
                      }, _callee6, _this);
                    }));

                    return function (_x4, _x5) {
                      return _ref7.apply(this, arguments);
                    };
                  }());
                };

                for (_iterator2 = readModelDir[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  _loop();
                }
                _context7.next = 19;
                break;

              case 15:
                _context7.prev = 15;
                _context7.t0 = _context7['catch'](10);
                _didIteratorError2 = true;
                _iteratorError2 = _context7.t0;

              case 19:
                _context7.prev = 19;
                _context7.prev = 20;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 22:
                _context7.prev = 22;

                if (!_didIteratorError2) {
                  _context7.next = 25;
                  break;
                }

                throw _iteratorError2;

              case 25:
                return _context7.finish(22);

              case 26:
                return _context7.finish(19);

              case 27:
                _context7.next = 32;
                break;

              case 29:
                _context7.prev = 29;
                _context7.t1 = _context7['catch'](0);

                console.error(_context7.t1);

              case 32:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this, [[0, 29], [10, 15, 19, 27], [20,, 22, 26]]);
      }));

      function beautifyJs(_x3) {
        return _ref6.apply(this, arguments);
      }

      return beautifyJs;
    }(),

    start: function () {
      var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
        var exportResult, codeBeautify;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                console.info('@ Start!');
                _context8.prev = 1;
                _context8.next = 4;
                return this.exportErd();

              case 4:
                _context8.t0 = _context8.sent;

                if (!_context8.t0) {
                  _context8.next = 9;
                  break;
                }

                _context8.next = 8;
                return this.scaffold();

              case 8:
                _context8.t0 = _context8.sent;

              case 9:
                exportResult = _context8.t0;
                _context8.next = 12;
                return this.appendBody(this.config.exportPath.cargo + '/config/init/menuItem/menuItem.js', function (data) {
                  return 'module.exports.menuItem = [\n' + data + '\n];';
                });

              case 12:
                _context8.t2 = _context8.sent;

                if (!_context8.t2) {
                  _context8.next = 17;
                  break;
                }

                _context8.next = 16;
                return this.appendBody(this.config.exportPath.cargo + '/config/customRoutes.js', function (data) {
                  return 'module.exports.customRoutes = {\n' + data + '\n};';
                });

              case 16:
                _context8.t2 = _context8.sent;

              case 17:
                _context8.t1 = _context8.t2;

                if (!_context8.t1) {
                  _context8.next = 22;
                  break;
                }

                _context8.next = 21;
                return this.beautifyJs();

              case 21:
                _context8.t1 = _context8.sent;

              case 22:
                codeBeautify = _context8.t1;

                if (!(!exportResult && !codeBeautify)) {
                  _context8.next = 25;
                  break;
                }

                throw new Error('Error happened.');

              case 25:
                _context8.next = 30;
                break;

              case 27:
                _context8.prev = 27;
                _context8.t3 = _context8['catch'](1);

                console.error(_context8.t3);

              case 30:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this, [[1, 27]]);
      }));

      function start() {
        return _ref8.apply(this, arguments);
      }

      return start;
    }(),

    help: function help() {
      console.log('\nUsage: node xx.js [options argument]\n');
      console.log('Options:');

      console.log('  -ce, --cargo-export [path]\t Target a specific folder path for export ERD json to Cargo CMS. (default: `./export_cargo`).');
      console.log('  -ee, --erd-export [path]\t Target a specific folder path for export ERD to json. (default: `./export_erd`).');
      console.log('  -m, --mode [modeName]\t\t Select a specific mode.');
      console.log('  -f, --file [filepath]\t\t\t File to read (required).');
      console.log('  -p, --php [filepath]\t\t\t Target a specific PHP exec path.');
      console.log('  -F, --force-overwrite\t\t\t Force overwrite of existing files.');
      console.log('  -c, --clean\t\t\t\t Clean exist files before scaffolding.');
      console.log('  -v, --version\t\t\t\t Shows the version of this tool.');

      console.log('\nExample:');
      console.log('  erd2cargo -f erd.mwb --erd-export ./erd --cargo-export ./cargo --clean');

      console.log('\nDocumentation can be found at ... well, not yet but I am sure you will find it eventually somewhere. :p\n');
    },

    shell: function shell() {
      this.message('Please give me a file through -file! (ie. -file data.json)', ct.MSG_ERROR);

      this.help();
    },

    version: function version() {
      this.message('v' + _package.version, ct.MSG_SUCCESS);
    },

    message: function message(_message, type) {
      if (type == ct.MSG_ERROR) {
        console.log('\x1b[1;97;101m%s\x1b[0m %s', '!ERROR!', _message);
      } else if (type == ct.MSG_WARNING) {
        console.log('\x1b[1;41;103m%s\x1b[0m %s', '!WARNING!', _message);
      } else if (type == ct.MSG_SUCCESS) {
        console.log('\x1b[1;97;42m%s\x1b[0m %s', ' SUCCESS ', _message);
      } else if (type == ct.MSG_FAILED) {
        console.log('\x1b[1;97;101m%s\x1b[0m %s', '!FAIL!', _message);
      }
    },

    finalize: function finalize() {
      this.message('Finished scaffolding!', ct.MSG_SUCCESS);
    }
  };

  Erd2Cargo.init();
})();
