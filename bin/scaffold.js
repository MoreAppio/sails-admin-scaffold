'use strict';

var _dissectController = require('./lib/dissect-controller');

var _dissectController2 = _interopRequireDefault(_dissectController);

var _dissectView = require('./lib/dissect-view');

var _dissectView2 = _interopRequireDefault(_dissectView);

var _dissectModel = require('./lib/dissect-model');

var _dissectModel2 = _interopRequireDefault(_dissectModel);

var _dissectConfig = require('./lib/dissect-config');

var _dissectConfig2 = _interopRequireDefault(_dissectConfig);

var _inflection = require('inflection');

var _inflection2 = _interopRequireDefault(_inflection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

(function () {
	// Extensions
	var fs = require('fs'),
	    arg = require('./lib/argument-parser-scaffold'),
	    JSONcleaner = require('./lib/comment-cut-out'),
	    normalize = require('./lib/normalize'),
	    fse = require('fs-extra'),
	    path = require('path');

	// Constants
	var ct = require('./lib/constants');
	var config = {};

	var Scaffold = function Scaffold() {
		this.init();

		this.config;
	};

	Scaffold.prototype = {
		init: function init() {
			this.parse();
		},

		parse: function parse() {
			// Configuration
			config = arg.parse(process.argv);

			if (config.help) {
				this.help();
			} else if (config.file == null) {
				this.shell();
			} else {
				var err = false,
				    file;

				try {
					file = fs.readFileSync(config.file, 'utf8');
				} catch (e) {
					err = true;
					console.log('Couldn\'t access \'' + config.file + '\'!');
				}

				if (!err) {
					this.config = config;

					this.validate(file);
				}
			}
		},

		validate: function validate(file) {
			// TODO: Skip validate
			// var validateConfig = require('./lib/validate-config');

			// if(validateConfig.isValid(this))
			// {
			this.job(file);
			// }
		},

		cleanJSON: function cleanJSON(json) {
			for (var index in json.models) {
				json.models[index] = normalize.do(json.models[index]);
			}

			return json;
		},

		// check if hook exists
		checkHookAdmin: function () {
			var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(json, model) {
				var hookPath, hookExist, readModelDir, count, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file, fileName, name;

				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								hookPath = json.dest + '/api/hook/sails-hook-admin';
								_context.next = 3;
								return fs.existsSync(hookPath);

							case 3:
								hookExist = _context.sent;

								if (!hookExist) {
									_context.next = 46;
									break;
								}

								_context.next = 7;
								return fs.readdirSync(hookPath + '/api/models');

							case 7:
								readModelDir = _context.sent;

								// console.log('@ readDir result=>', readModelDir);
								count = 0;
								_iteratorNormalCompletion = true;
								_didIteratorError = false;
								_iteratorError = undefined;
								_context.prev = 12;
								_iterator = readModelDir[Symbol.iterator]();

							case 14:
								if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
									_context.next = 31;
									break;
								}

								file = _step.value;
								_context.prev = 16;
								fileName = file.replace('.js', '');

								model.name = model.name.trim().replace('__', '_');
								name = _inflection2.default.classify(model.name, false);
								// console.warn('@ fileName=>', fileName, ', model name=>', name);

								if (!(fileName.toLowerCase() === name.toLowerCase())) {
									_context.next = 23;
									break;
								}

								console.log('- Skip model ' + fileName + ' because the hook has already built-in.');
								return _context.abrupt('return', true);

							case 23:
								_context.next = 28;
								break;

							case 25:
								_context.prev = 25;
								_context.t0 = _context['catch'](16);
								throw new Error(_context.t0);

							case 28:
								_iteratorNormalCompletion = true;
								_context.next = 14;
								break;

							case 31:
								_context.next = 37;
								break;

							case 33:
								_context.prev = 33;
								_context.t1 = _context['catch'](12);
								_didIteratorError = true;
								_iteratorError = _context.t1;

							case 37:
								_context.prev = 37;
								_context.prev = 38;

								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}

							case 40:
								_context.prev = 40;

								if (!_didIteratorError) {
									_context.next = 43;
									break;
								}

								throw _iteratorError;

							case 43:
								return _context.finish(40);

							case 44:
								return _context.finish(37);

							case 45:
								return _context.abrupt('return', false);

							case 46:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this, [[12, 33, 37, 45], [16, 25], [38,, 40, 44]]);
			}));

			function checkHookAdmin(_x, _x2) {
				return _ref.apply(this, arguments);
			}

			return checkHookAdmin;
		}(),

		job: function () {
			var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(file) {
				var json, appDir, count, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, model, skip;

				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								_context2.prev = 0;
								json = JSON.parse(JSONcleaner.clean(file));

								// console.log(json);
								// console.log(path.join(json.dest, json.controllerBasePath, '/admin'));

								_context2.next = 4;
								return fse.ensureDirSync(path.join(json.dest, json.controllerBasePath, '/admin'));

							case 4:
								_context2.next = 6;
								return fse.ensureDirSync(path.join(json.dest, json.controllerBasePath, '/api/admin'));

							case 6:
								_context2.next = 8;
								return fse.ensureDirSync(path.join(json.dest, json.controllerBasePath, '/api/admin'));

							case 8:
								_context2.next = 10;
								return fse.ensureDirSync(path.join(json.dest, '/api/models'));

							case 10:
								_context2.next = 12;
								return fse.ensureDirSync(path.join(json.dest, '/config/init/menuItem'));

							case 12:
								json = this.cleanJSON(json);
								//
								appDir = path.dirname(require.main.filename);
								count = 0;
								_iteratorNormalCompletion2 = true;
								_didIteratorError2 = false;
								_iteratorError2 = undefined;
								_context2.prev = 18;
								_iterator2 = json.models[Symbol.iterator]();

							case 20:
								if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
									_context2.next = 38;
									break;
								}

								model = _step2.value;
								_context2.next = 24;
								return this.checkHookAdmin(json, model);

							case 24:
								skip = _context2.sent;

								if (skip) {
									_context2.next = 34;
									break;
								}

								_context2.next = 28;
								return _dissectController2.default.dissect({
									scaffold: this,
									model: model,
									config: json
								});

							case 28:
								_context2.next = 30;
								return _dissectView2.default.dissect({
									scaffold: this,
									model: model,
									config: json
								});

							case 30:
								_context2.next = 32;
								return _dissectModel2.default.dissect({
									scaffold: this,
									model: model,
									config: json
								});

							case 32:
								_context2.next = 34;
								return _dissectConfig2.default.dissect({
									scaffold: this,
									model: model,
									config: json,
									count: count
								});

							case 34:
								count++;

							case 35:
								_iteratorNormalCompletion2 = true;
								_context2.next = 20;
								break;

							case 38:
								_context2.next = 44;
								break;

							case 40:
								_context2.prev = 40;
								_context2.t0 = _context2['catch'](18);
								_didIteratorError2 = true;
								_iteratorError2 = _context2.t0;

							case 44:
								_context2.prev = 44;
								_context2.prev = 45;

								if (!_iteratorNormalCompletion2 && _iterator2.return) {
									_iterator2.return();
								}

							case 47:
								_context2.prev = 47;

								if (!_didIteratorError2) {
									_context2.next = 50;
									break;
								}

								throw _iteratorError2;

							case 50:
								return _context2.finish(47);

							case 51:
								return _context2.finish(44);

							case 52:
								console.log('@ scaffold succeeded.');
								_context2.next = 58;
								break;

							case 55:
								_context2.prev = 55;
								_context2.t1 = _context2['catch'](0);

								this.message(_context2.t1, ct.MSG_ERROR);

							case 58:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this, [[0, 55], [18, 40, 44, 52], [45,, 47, 51]]);
			}));

			function job(_x3) {
				return _ref2.apply(this, arguments);
			}

			return job;
		}(),

		help: function help() {
			console.log('Usage: node xx.js [options argument]\n');
			console.log('Options:');

			console.log('  -h, --http-framework name\tHttp framework to use (default: express).');
			console.log('  -de, --db-engine name\t\tDB engine to use (default: mongodb).');
			console.log('  -df, --db-framework name\tDB framework to use (default: mongoose).');
			console.log('  -f, --file filepath\t\tFile to read (required).');
			console.log('  -F, --force-overwrite\t\tForce overwrite of existing files.');
			console.log('  -c, --clean\t\t Clean exist files before scaffolding.');

			console.log('\nExample:');
			console.log('  node scaffold.js --file data.json --http-framework koa -de mysql -F');

			console.log('\nDocumentation can be found at http://github.com/mauriciogior/node-scaffold');
		},

		shell: function shell() {
			this.message('Please give me a file through -file! (ie. -file data.json)', ct.MSG_ERROR);
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

	new Scaffold();
})();