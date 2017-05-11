'use strict';
import 'babel-core/register';
import 'babel-polyfill';
import fs from 'fs';
import path from 'path';
import cp from 'child_process';
import { StringDecoder } from 'string_decoder';
import {
  js_beautify as beautify
} from 'js-beautify';
import arg from './lib/argument-parser';
import { version } from './package.json';

(function() {

  const ct = require('./lib/constants');
  const Erd2Cargo = {
    appDir: path.dirname(require.main.filename),

    decoder: new StringDecoder('utf8'),

    config: {
      init: false,
    },

    init: function() {
      this.parse();
    },

    parse: async function() {
      try {
        // console.error('this.config', this.config);
        this.config = arg.parse(process.argv);
        const config = this.config;

        if (config.help) {
          this.help();
        } else if (config.clean) {
          await this.cleanFolder();
        } else if (config.version) {
          this.version();
        } else if (!config.file) {
          this.shell();
        } else {
          await this.checkFile();
        }
      } catch (error) {
        this.message(error, ct.MSG_ERROR);
      }
    },

    checkFile: async function() {
      let file = null;
      const exist = await fs.existsSync(this.config.file);
      if (exist) {
        try {
          file = await fs.readFileSync(this.config.file, 'utf8');
        } catch (error) {
          file = false;
          this.message('! Can not access ERD file.', ct.MSG_ERROR);
        }
      } else {
        console.warn('! Giving ERD file path is not exist.');
      }
      if (exist && file) {
        await this.start();
      } else {
        this.message('ERD to Cargo exporting stop.', ct.MSG_ERROR);
      }
    },

    cleanFolder: async function() {
      try {
        console.log('@ cleanFolder appDir is located=>', this.appDir);
        const isErdPathExists = await fs.existsSync(this.config.exportPath.erd);
        if (isErdPathExists) {
          const cmd = `rm -rf ${this.config.exportPath.erd}`;
          console.log(`@ cleanFolder command=>${cmd}`);
          const rmExportPath = await cp.execSync(cmd);
          if (rmExportPath) console.log('@ Remove sucecssed.');
        } else {
          console.log('@ Default ERD export path is not exist!');
        }
        const isCargoPathExists = await fs.existsSync(this.config.exportPath.cargo);
        if (isCargoPathExists) {
          const cmd = `rm -rf ${this.config.exportPath.cargo}`;
          console.log(`@ cleanFolder command=>${cmd}`);
          const rmExportPath = await cp.execSync(cmd);
          if (rmExportPath) console.log('@ Remove sucecssed.');
        } else {
          console.log('@ Default Cargo CMS export path is not exist!');
        }
        await this.checkFile();
      } catch (error) {
        this.message(error, ct.MSG_ERROR);
      }
    },

    exportErd: async function() {
      try {
        const $c = this.config;
        const parameter = `--export=${$c.mode} ${$c.file} ${$c.exportPath.erd} ${$c.exportPath.cargo}`;
        const buildErdScript = `${$c.pathPhp} ${$c.pathMwse} ${parameter}`;
        console.log('@ exec script=>', buildErdScript);

        const execBuildErd = await cp.execSync(buildErdScript);
        const textChunk = this.decoder.write(execBuildErd);
        // console.log('@ execBuildErd result=>', textChunk);
        return true;
      } catch (error) {
        // throw new Error(error);
        this.message(error, ct.MSG_ERROR);
        return false;
      }
    },

    scaffold: async function() {
      try {
        const erdExportPath = this.config.exportPath.erd;
        const exist = await fs.existsSync(erdExportPath);
        if (!exist) {
          return console.error(`No ERD exported  folder '${erdExportPath}' exists.`);
        }

        const readRawDir = await fs.readdirSync(erdExportPath);
        console.log('@ readDir result=>', readRawDir);

        let rawCount = 0;
        for (const file of readRawDir) {
          rawCount++;
          if (file.includes('.bak')) {
            console.warn(`! Skipped ${file} because it is a .bak file.`);
            continue;
          }
          console.log(`@ ${rawCount}/${readRawDir.length} file name=> ${file}`);
          const babelNode = 'node_modules/babel-cli/bin/babel-node.js';
          const execScaffold = `${babelNode} --presets es2015,stage-0 scaffold.js -f ${erdExportPath}/${file}`;
          const result = await cp.execSync(execScaffold);
          const textChunk = this.decoder.write(result);
          if (result) console.log(`@ execSync scaffold result=>\n${textChunk}`);
        }
        return true;
      } catch (error) {
        // throw new Error(error);
        this.message(error, ct.MSG_ERROR);
        return false;
      }

    },

    appendBody: async function(target, format) {
      try {
        const isExist = await fs.existsSync(target);
        if (isExist) {
          const data = await fs.readFileSync(target);
          const dataWithBody = format(data);
          const dataWithFix = beautify(dataWithBody, { indent_size: 2 });
          await fs.writeFileSync(target, dataWithFix);
        } else {
          console.warn(`@ Target ${target} is not exist so skip to beautify.`);
        }
        return true;
      } catch (error) {
        // throw new Error(error);
        this.message(error, ct.MSG_ERROR);
        return false;
      }
    },

    beautifyJs: async function(file) {
      try {
        const modelPath = `${this.config.exportPath.cargo}/api/models`;
        const readModelDir = await fs.readdirSync(modelPath);
        console.log('@ beautifyJs readDir result=>', readModelDir);
        let count = 0;
        for (const file of readModelDir) {
          const filePath = `${modelPath}/${file}`;
          fs.readFile(filePath, 'utf8', async(err, data) => {
            if (err) { throw err; }
            const dataWithFix = beautify(data, { indent_size: 2 });
            // console.log(data);
            await fs.writeFileSync(filePath, dataWithFix);
          });
        }
        return true;
      } catch (error) {
        this.message(error, ct.MSG_ERROR);
        return false;
      }

    },

    start: async function() {
      console.info('@ Start!');
      try {
        const exportResult = await this.exportErd() && await this.scaffold();
        if (!exportResult) {
          return console.error('! Export failed.');
        }
        const codeBeautify =
          await this.appendBody(
            `${this.config.exportPath.cargo}/config/init/menuItem/menuItem.js`,
            data => `module.exports.menuItem = [\n${data}\n];`,
          ) &&
          await this.appendBody(
            `${this.config.exportPath.cargo}/config/customRoutes.js`,
            data => `module.exports.customRoutes = {\n${data}\n};`,
          ) &&
          await this.beautifyJs();
        if (!exportResult && !codeBeautify) {
          console.error('! Code beautify failed.');
        }
      } catch (error) {
        this.message(error, ct.MSG_ERROR);
      }
    },

    help: function() {
      console.log('\nUsage: node erd2cargo.js [options argument] [filePath]\n');
      console.log('Options:');

      console.log('  -ce, --cargo-export [path]\t Target a specific folder path for export ERD json to Cargo CMS. (default: `./export_cargo`).');
      console.log('  -ee, --erd-export [path]\t Target a specific folder path for export ERD to json. (default: `./export_erd`).');
      console.log('  -m, --mode [modeName]\t\t Select a specific mode.');
      console.log('  -f, --file [filePath]\t\t\t File to read (required).');
      console.log('  -p, --php [filePath]\t\t\t Target a specific PHP exec path.');
      console.log('  -F, --force-overwrite\t\t\t Force overwrite of existing files.');
      console.log('  -c, --clean\t\t\t\t Clean exist files before scaffolding.');
      console.log('  -v, --version\t\t\t\t Shows the version of this tool.');

      console.log('\nExample:');
      console.log('  erd2cargo -f erd.mwb --erd-export ./erd --cargo-export ./cargo --clean');

      console.log('\nDocumentation can be found at ... well, not yet but I am sure you will find it eventually somewhere. :p\n');
    },

    shell: function() {
      this.message('Please give me a file through -file! (ie. -file data.json)', ct.MSG_ERROR);

      this.help();
    },

    version: function() {
      this.message(`v${version}`, ct.MSG_SUCCESS);
    },

    message: function(message, type) {
      if (type == ct.MSG_ERROR) {
        console.log('\x1b[1;97;101m%s\x1b[0m %s', '! ERROR: ', message);
      } else if (type == ct.MSG_WARNING) {
        console.log('\x1b[1;41;103m%s\x1b[0m %s', '!WARNING: ', message);
      } else if (type == ct.MSG_SUCCESS) {
        console.log('\x1b[1;97;42m%s\x1b[0m %s', '- SUCCESS: ', message);
      } else if (type == ct.MSG_FAILED) {
        console.log('\x1b[1;97;101m%s\x1b[0m %s', '!FAIL: ', message);
      }
    },

    finalize: function() {
      this.message('Finished scaffolding!', ct.MSG_SUCCESS);
    }
  };

  Erd2Cargo.init();
})();