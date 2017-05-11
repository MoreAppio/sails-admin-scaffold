'use strict';
import dissectController from './lib/dissect-controller';
import dissectView from './lib/dissect-view';
import dissectModel from './lib/dissect-model';
import dissectConfig from './lib/dissect-config';
import inflection from 'inflection';

(function()
{
	// Extensions
	var fs = require('fs')
	  , arg = require('./lib/argument-parser-scaffold')
	  , JSONcleaner = require('./lib/comment-cut-out')
	  , normalize = require('./lib/normalize')
		, fse = require('fs-extra')
		, path = require('path');

	// Constants
	var ct = require('./lib/constants');
  var config = {};

	var Scaffold = function()
	{
		this.init();

		this.config;
	}

	Scaffold.prototype =
	{
		init : function()
		{
			this.parse();
		},

		parse : function()
		{
			// Configuration
			config = arg.parse(process.argv);

			if(config.help)
			{
				this.help();
			}
			else if(config.file == null)
			{
				this.shell();
			}
			else
			{
				var err = false
				, file;

				try
				{
					file = fs.readFileSync(config.file, 'utf8');
				}
				catch(e)
				{
					err = true;
					console.log('Couldn\'t access \''+config.file+'\'!');
				}

				if(!err)
				{
					this.config = config;

					this.validate(file);
				}
			}
		},

		validate : function(file)
		{
			// TODO: Skip validate
			// var validateConfig = require('./lib/validate-config');

			// if(validateConfig.isValid(this))
			// {
				this.job(file);
			// }
		},

		cleanJSON : function(json)
		{
			for(var index in json.models)
			{
				json.models[index] = normalize.do(json.models[index]);
			}

			return json;
		},

    // check if hook exists
    checkHookAdmin: async function (json, model) {
      const hookPath = `${json.dest}/api/hook/sails-hook-admin`;
      const hookExist = await fs.existsSync(hookPath);
      // console.log('hookPath=>', hookPath, ', exists=>', hookExist);
      if (hookExist) {
        // console.log('@ hook "sails-hook-admin" exist!');
        const readModelDir = await fs.readdirSync(`${hookPath}/api/models`);
        // console.log('@ readDir result=>', readModelDir);
        let count = 0;
        for (const file of readModelDir) {
          try {
            const fileName = file.replace('.js', '');
            model.name = model.name.trim().replace('__', '_');
            const name = inflection.classify(model.name, false);
            // console.warn('@ fileName=>', fileName, ', model name=>', name);
            if (fileName.toLowerCase() === name.toLowerCase()) {
              console.log(`- Skip model ${fileName} because the hook has already built-in.`);
              return true;
            }
          } catch (error) {
            throw new Error(error);
          }
        }
        return false;
      }
    },

		job : async function(file)
		{
      try {
        var json = JSON.parse(JSONcleaner.clean(file));

        // console.log(json);
        // console.log(path.join(json.dest, json.controllerBasePath, '/admin'));
        await fse.ensureDirSync(path.join(json.dest, json.controllerBasePath, '/admin'));
        await fse.ensureDirSync(path.join(json.dest, json.controllerBasePath, '/api/admin'));
        await fse.ensureDirSync(path.join(json.dest, json.controllerBasePath, '/api/admin'));
        await fse.ensureDirSync(path.join(json.dest, '/api/models'));
        await fse.ensureDirSync(path.join(json.dest, '/config/init/menuItem'));
        json = this.cleanJSON(json);
        //
        const appDir = path.dirname(require.main.filename);

        let count = 0;
        for(const model of json.models) {

          let skip = await this.checkHookAdmin(json, model);

          if(!skip) {
            await dissectController.dissect({
            scaffold: this,
            model,
            config: json,
            });

            await dissectView.dissect({
            scaffold: this,
            model,
            config: json,
            });

            await dissectModel.dissect({
            scaffold: this,
            model,
            config: json,
            });

            await dissectConfig.dissect({
            scaffold: this,
            model,
            config: json,
            count,
            });
          }
          count++;
        }
        console.log('@ scaffold succeeded.');
      } catch (e) {
			  this.message(e, ct.MSG_ERROR);
      }
		},

		help : function()
		{
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

		shell : function()
		{
			this.message('Please give me a file through -file! (ie. -file data.json)', ct.MSG_ERROR);
		},

		message : function(message, type)
		{
			if(type == ct.MSG_ERROR)
			{
				console.log('\x1b[1;97;101m%s\x1b[0m %s', '!ERROR!', message);
			}
			else if(type == ct.MSG_WARNING)
			{
				console.log('\x1b[1;41;103m%s\x1b[0m %s', '!WARNING!', message);
			}
			else if(type == ct.MSG_SUCCESS)
			{
				console.log('\x1b[1;97;42m%s\x1b[0m %s', ' SUCCESS ', message);
			}
			else if(type == ct.MSG_FAILED)
			{
				console.log('\x1b[1;97;101m%s\x1b[0m %s', '!FAIL!', message);
			}
		},

		finalize : function()
		{
			this.message('Finished scaffolding!', ct.MSG_SUCCESS);
		}
	}

	new Scaffold();
})();
