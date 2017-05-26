'use strict';

(function () {
	var OVERWRITE = '--force-overwrite';
	var FILE = '--file';
	var ERD_EXPORT_PATH = '--erd-export';
	var CARGO_EXPORT_PATH = '--cargo-export';
	var HELP = '--help';
	var CLEAN = '--clean';
	var PHP_PATH = '--php';
	var VERSION = '--version';
	var MODE = '--mode';

	var path = require('path');
	var projRoot = require('app-root-path').path;
	// var runtimeDir = path.dirname(require.main.filename);
	var runtimeDir = __dirname;

	var config = {
		exportPath: {
			erd: projRoot + '/.tmp/export_erd',
			cargo: projRoot + '/.tmp/export_cargo'
		},
		erdSource: null,
		overwrite: false,
		help: false,
		pathPhp: 'php',
		pathMwse: runtimeDir + '/mwse/vendor/bin/mysql-workbench-schema-export',
		exportModes: ['node-sequelize', 'scaffold'],
		mode: 'node-sequelize'
	};

	var next = null;

	exports.parse = function (argv) {
		argv.forEach(function (val, index, array) {
			if (index >= 2) {
				if (next != null) {
					switch (next) {
						case ERD_EXPORT_PATH:
							config.exportPath.erd = val;
							break;

						case CARGO_EXPORT_PATH:
							config.exportPath.cargo = val;
							break;

						case PHP_PATH:
							config.pathPhp = val;
							break;

						case FILE:
							config.file = val;
							break;

						case MODE:
							config.mode = val;
							break;
					}

					next = null;
				}

				if (val == ERD_EXPORT_PATH || val == '-ee') {
					next = ERD_EXPORT_PATH;
				} else if (val == CARGO_EXPORT_PATH || val == '-ce') {
					next = CARGO_EXPORT_PATH;
				} else if (val == FILE || val == '-f') {
					next = FILE;
				} else if (val == MODE || val == '-m') {
					next = MODE;
				} else if (val == PHP_PATH || val == '-p') {
					next = PHP_PATH;
				} else if (val == OVERWRITE || val == '-F') {
					config.overwrite = true;
				} else if (val == HELP || val == '-h') {
					config.help = true;
				} else if (val == CLEAN || val == '-c') {
					config.clean = true;
				} else if (val == VERSION || val == '-v') {
					config.version = true;
				}
			}
		});

		return config;
	};
})();