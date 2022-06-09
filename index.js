/* jslint esversion: 8 */
const util = require('util');
const process = require('process');
const path = require('path');
const execFile = util.promisify(require('child_process').execFile);

const defaultOptions = {
  tabName: 'tab1',
  sheetPath: path.join(process.cwd(), 'workspace.ws'),
  env: {}
};

module.exports.setOptions = function(o) {
  return Object.assign(defaultOptions, o);
};

module.exports.nip2Promise = function(main, cellMap, options) {
  options = Object.assign({}, defaultOptions, options);
  let { outPath, signal, tabName, env, sheetPath } = { ...options };
  env = Object.assign({}, JSON.parse(JSON.stringify(process.env)), env);

  let commandArgs = Object.keys(cellMap).reduce( (acc, ele) => acc.concat(['-=',  `${expandName(tabName, ele)}=${cellMap[ele]}`]), []);
  commandArgs.unshift('-bp');
  commandArgs = commandArgs.concat(['-=', `main=${expandName(tabName, main)}`]);
  if(typeof outPath === 'string' && outPath.length > 0)
    commandArgs = commandArgs.concat([ '-o', outPath ]);
  commandArgs.push(path.normalize(options.sheetPath));

  return execFile('nip2', commandArgs, { env, signal });
};

function expandName(tabName, n) {
  return ['Workspaces', tabName, n].join('.');
}

module.exports.nip2 = async function(...args) {
  const execPromise = module.exports.nip2Promise(...args);
  const {stdout, stderr} = await execPromise;
  return stdout;
};
