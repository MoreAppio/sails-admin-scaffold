'use strict';

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
                try {
                  // console.error('this.config', this.config);
                  this.config = _argumentParser2.default.parse(process.argv);
                  config = this.config;


                  if (config.help) {
                    this.help();
                  } else if (config.clean) {
                    this.cleanFolder();
                  } else if (config.version) {
                    this.version();
                  } else if (!config.file) {
                    this.shell();
                  } else {
                    err = false;
                    file = null;

                    try {
                      file = _fs2.default.readFileSync(config.file, 'utf8');
                    } catch (e) {
                      err = true;
                      console.log('Couldn\'t access \'' + config.file + '\'!');
                    }
                    if (!err) {
                      this.config = config;
                      this.start();
                    }
                  }
                } catch (error) {
                  console.error(error);
                }

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function parse() {
        return _ref.apply(this, arguments);
      }

      return parse;
    }(),

    cleanFolder: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var isErdPathExists, isCargoPathExists;
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

                if (isErdPathExists) {
                  console.log('@ cleanFolder command=>rm -rf ' + this.config.exportPath.erd);
                  // const rmExportPath = await cp.execSync(this.conifg.exportPath);
                } else {
                  console.warn('@ Default Erd export path is not exist!');
                }
                _context2.next = 8;
                return _fs2.default.existsSync(this.config.exportPath.cargo);

              case 8:
                isCargoPathExists = _context2.sent;

                if (isCargoPathExists) {
                  console.log('@ cleanFolder command=>rm -rf ' + this.config.exportPath.cargo);
                  // const rmOutputPath = await cp.execSync(`rm -rf this.conifg.outputPath`);
                } else {
                  console.warn('@ Default Cargo export path is not exist!');
                }
                _context2.next = 15;
                break;

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2['catch'](0);

                console.error(_context2.t0);

              case 15:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 12]]);
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
        var erdExportPath, readRawDir, rawCount, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file, babelNode, execScaffold, result, textChunk;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                erdExportPath = this.config.exportPath.erd;
                _context4.next = 4;
                return _fs2.default.readdirSync(erdExportPath);

              case 4:
                readRawDir = _context4.sent;

                console.log('@ readDir result=>', readRawDir);

                rawCount = 0;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context4.prev = 10;
                _iterator = readRawDir[Symbol.iterator]();

              case 12:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context4.next = 29;
                  break;
                }

                file = _step.value;

                rawCount++;

                if (!file.includes('.bak')) {
                  _context4.next = 18;
                  break;
                }

                console.warn('! Skipped ' + file + ' because it is a .bak file.');
                return _context4.abrupt('continue', 26);

              case 18:
                console.log('@ ' + rawCount + '/' + readRawDir.length + ' file name=> ' + file);
                babelNode = 'node_modules/babel-cli/bin/babel-node.js';
                execScaffold = babelNode + ' --presets es2015,stage-0 scaffold.js -f ' + erdExportPath + '/' + file;
                _context4.next = 23;
                return _child_process2.default.execSync(execScaffold);

              case 23:
                result = _context4.sent;
                textChunk = this.decoder.write(result);

                if (result) console.log('@ execSync result=>\n', textChunk);

              case 26:
                _iteratorNormalCompletion = true;
                _context4.next = 12;
                break;

              case 29:
                _context4.next = 35;
                break;

              case 31:
                _context4.prev = 31;
                _context4.t0 = _context4['catch'](10);
                _didIteratorError = true;
                _iteratorError = _context4.t0;

              case 35:
                _context4.prev = 35;
                _context4.prev = 36;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 38:
                _context4.prev = 38;

                if (!_didIteratorError) {
                  _context4.next = 41;
                  break;
                }

                throw _iteratorError;

              case 41:
                return _context4.finish(38);

              case 42:
                return _context4.finish(35);

              case 43:
                _context4.next = 48;
                break;

              case 45:
                _context4.prev = 45;
                _context4.t1 = _context4['catch'](0);

                // throw new Error(error);
                console.error(_context4.t1);

              case 48:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 45], [10, 31, 35, 43], [36,, 38, 42]]);
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

                console.log('@ readDir result=>', readModelDir);
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
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                console.info('@ Start!');

                _context8.next = 3;
                return this.exportErd();

              case 3:
                _context8.next = 5;
                return this.scaffold();

              case 5:
                _context8.next = 7;
                return appendBody(this.config.exportPath.cargo + '/config/init/menuItem/menuItem.js', function (data) {
                  return 'module.exports.menuItem = [\n' + data + '\n];';
                });

              case 7:
                _context8.next = 9;
                return appendBody(this.config.exportPath.cargo + '/config/customRoutes.js', function (data) {
                  return 'module.exports.customRoutes = {\n' + data + '\n};';
                });

              case 9:
                _context8.next = 11;
                return this.beautifyJs();

              case 11:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function start() {
        return _ref8.apply(this, arguments);
      }

      return start;
    }(),

    help: function help() {
      console.log('\nUsage: node xx.js [options argument]\n');
      console.log('Options:');

      console.log('  -ce, --cargo-export [folderPath]\t Target a specific folder path for export ERD json to Cargo CMS. (default: `${appDir}/export_cargo`).');
      console.log('  -ee, --erd-export [folderPath]\t Target a specific folder path for export ERD to json. (default: `${appDir}/export_erd`).');
      console.log('  -m, --mode [specific_mode]\t\t Select a specific mode.');
      console.log('  -f, --file [filepath]\t\t\t File to read (required).');
      console.log('  -p, --php [filepath]\t\t\t Target a specific PHP exec path.');
      console.log('  -F, --force-overwrite\t\t\t Force overwrite of existing files.');
      console.log('  -c, --clean\t\t\t\t Clean exist files before scaffolding.');
      console.log('  -v, --version\t\t\t\t Shows the version of this tool.');

      console.log('\nExample:');
      console.log('  node_modules/babel-cli/bin/babel-node.js --presets es2015,stage-0 index.js -f erd.mwb --erd-export ./erd --cargo-export ./cargo');

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
