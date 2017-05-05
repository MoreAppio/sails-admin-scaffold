'use strict';
import fs from 'fs';
import cp from 'child_process';

(async() => {

  const filePath = {
    erd: 'erd.mwb',
    mwse: 'mwse/vendor/bin/mysql-workbench-schema-export',
  };
  const rootPath = './generated';
  const exportMode = ['node-sequelize', 'scaffold'];

  const StringDecoder = require('string_decoder').StringDecoder;
  const decoder = new StringDecoder('utf8');

  try {
    const buildErdScript =
      `php ${filePath.mwse} --export=${exportMode[0]} ${filePath.erd} ${rootPath}`;
    const execBuildErd = await cp.execSync(buildErdScript);
    const textChunk = decoder.write(execBuildErd);
    console.log('@ execBuildErd result=>', textChunk);

    const readDir = await fs.readdirSync(rootPath);
    console.log('@ readDir result=>', readDir);

    let count = 0;
    for (const file of readDir) {
      try {
        count ++;
        if (file.includes('.bak')) {
          console.warn(`! Skipped ${file} because it is a .bak file.`);
          continue;
        }
        console.log(`@ ${count}/${readDir.length} file name=> ${file}`);
        const execScaffold = `babel-node --presets es2015,stage-0 scaffold.js -f ${rootPath}/${file}`;
        const result = await cp.execSync(execScaffold);
        const textChunk = decoder.write(result);
        if (result) console.log('@ execSync result=>\n', textChunk);
      } catch (error) {
        throw new Error(error);
      }
    }
  } catch (error) {
    console.error(error);
  }

})();