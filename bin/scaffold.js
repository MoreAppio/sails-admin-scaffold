'use strict';

var _dissectController = require('./lib/dissect-controller');

var _dissectController2 = _interopRequireDefault(_dissectController);

var _dissectView = require('./lib/dissect-view');

var _dissectView2 = _interopRequireDefault(_dissectView);

var _dissectModel = require('./lib/dissect-model');

var _dissectModel2 = _interopRequireDefault(_dissectModel);

var _dissectConfig = require('./lib/dissect-config');

var _dissectConfig2 = _interopRequireDefault(_dissectConfig);

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

		job: function () {
			var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(file) {
				var json, appDir, count, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, model, hookPath, hookExist, readModelDir, _count, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _file, fileName;

				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.prev = 0;
								json = JSON.parse(JSONcleaner.clean(file));


								console.log(json);
								console.log(path.join(json.dest, json.controllerBasePath, '/admin'));

								if (!config.clean) {
									_context.next = 7;
									break;
								}

								_context.next = 7;
								return fse.removeSync(json.dest);

							case 7:
								_context.next = 9;
								return fse.ensureDirSync(path.join(json.dest, json.controllerBasePath, '/admin'));

							case 9:
								_context.next = 11;
								return fse.ensureDirSync(path.join(json.dest, json.controllerBasePath, '/api/admin'));

							case 11:
								_context.next = 13;
								return fse.ensureDirSync(path.join(json.dest, json.controllerBasePath, '/api/admin'));

							case 13:
								_context.next = 15;
								return fse.ensureDirSync(path.join(json.dest, '/api/models'));

							case 15:
								_context.next = 17;
								return fse.ensureDirSync(path.join(json.dest, '/config/init/menuItem'));

							case 17:
								json = this.cleanJSON(json);
								//
								appDir = path.dirname(require.main.filename);
								count = 0;
								_iteratorNormalCompletion = true;
								_didIteratorError = false;
								_iteratorError = undefined;
								_context.prev = 23;
								_iterator = json.models[Symbol.iterator]();

							case 25:
								if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
									_context.next = 84;
									break;
								}

								model = _step.value;


								// check if hook exists
								hookPath = appDir + '/api/hook/sails-hook-admin';
								_context.next = 30;
								return fs.existsSync(hookPath);

							case 30:
								hookExist = _context.sent;

								if (!hookExist) {
									_context.next = 72;
									break;
								}

								console.warn('@ hook exist!');
								_context.next = 35;
								return fs.readdirSync(hookPath + 'apimodels');

							case 35:
								readModelDir = _context.sent;

								console.log('@ readDir result=>', readModelDir);
								_count = 0;
								_iteratorNormalCompletion2 = true;
								_didIteratorError2 = false;
								_iteratorError2 = undefined;
								_context.prev = 41;
								_iterator2 = readModelDir[Symbol.iterator]();

							case 43:
								if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
									_context.next = 58;
									break;
								}

								_file = _step2.value;
								_context.prev = 45;
								fileName = _file.replace('.js', '');

								console.warn('@ fileName=>', fileName);

								if (!(fileName === model.name)) {
									_context.next = 50;
									break;
								}

								return _context.abrupt('continue', 55);

							case 50:
								_context.next = 55;
								break;

							case 52:
								_context.prev = 52;
								_context.t0 = _context['catch'](45);
								throw new Error(_context.t0);

							case 55:
								_iteratorNormalCompletion2 = true;
								_context.next = 43;
								break;

							case 58:
								_context.next = 64;
								break;

							case 60:
								_context.prev = 60;
								_context.t1 = _context['catch'](41);
								_didIteratorError2 = true;
								_iteratorError2 = _context.t1;

							case 64:
								_context.prev = 64;
								_context.prev = 65;

								if (!_iteratorNormalCompletion2 && _iterator2.return) {
									_iterator2.return();
								}

							case 67:
								_context.prev = 67;

								if (!_didIteratorError2) {
									_context.next = 70;
									break;
								}

								throw _iteratorError2;

							case 70:
								return _context.finish(67);

							case 71:
								return _context.finish(64);

							case 72:
								_context.next = 74;
								return _dissectController2.default.dissect({
									scaffold: this,
									model: model,
									config: json
								});

							case 74:
								_context.next = 76;
								return _dissectView2.default.dissect({
									scaffold: this,
									model: model,
									config: json
								});

							case 76:
								_context.next = 78;
								return _dissectModel2.default.dissect({
									scaffold: this,
									model: model,
									config: json
								});

							case 78:
								_context.next = 80;
								return _dissectConfig2.default.dissect({
									scaffold: this,
									model: model,
									config: json,
									count: count
								});

							case 80:

								count++;

							case 81:
								_iteratorNormalCompletion = true;
								_context.next = 25;
								break;

							case 84:
								_context.next = 90;
								break;

							case 86:
								_context.prev = 86;
								_context.t2 = _context['catch'](23);
								_didIteratorError = true;
								_iteratorError = _context.t2;

							case 90:
								_context.prev = 90;
								_context.prev = 91;

								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}

							case 93:
								_context.prev = 93;

								if (!_didIteratorError) {
									_context.next = 96;
									break;
								}

								throw _iteratorError;

							case 96:
								return _context.finish(93);

							case 97:
								return _context.finish(90);

							case 98:
								_context.next = 103;
								break;

							case 100:
								_context.prev = 100;
								_context.t3 = _context['catch'](0);

								console.log(_context.t3);

							case 103:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this, [[0, 100], [23, 86, 90, 98], [41, 60, 64, 72], [45, 52], [65,, 67, 71], [91,, 93, 97]]);
			}));

			function job(_x) {
				return _ref.apply(this, arguments);
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