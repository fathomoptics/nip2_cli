/* jslint esversion: 8 */
const util = require('util');
const process = require('process');
const path = require('path');
const execFile = util.promisify(require('child_process').execFile);

const options = {
  tabName: 'tab1',
  sheetName: 'workspace.ws',
  sheetPath: process.cwd(),
  env: {}
};

module.exports.setOptions = function(o) {
  return Object.assign(options, o);
};

module.exports.nip2Promise = function(main, cellMap, outPath) {
  let commandArgs = Object.keys(cellMap).reduce( (acc, ele) => acc.concat(['-=',  expandName(ele) + '=' + cellMap[ele] ]), []);
  commandArgs.unshift('-bp');
  commandArgs = commandArgs.concat(['-=', 'main=' + expandName(main)]);
  if(typeof outPath === 'string' && outPath.length > 0)
    commandArgs = commandArgs.concat([ '-o', outPath ]);
  commandArgs.push(path.join(options.sheetPath, options.sheetName));

  let env = JSON.parse(JSON.stringify(process.env));
  Object.assign(env, options.env);
  return execFile('nip2', commandArgs, {env});
};

function expandName(n) {
  return ['Workspaces', options.tabName, n].join('.');
}

module.exports.nip2 = async function(...args) {
  const execPromise = module.exports.nip2Promise(...args);
  const {stdout, stderr} = await execPromise;
  return stdout;
};
