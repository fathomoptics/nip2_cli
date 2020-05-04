/* jslint esversion: 8 */
const util = require('util');
const process = require('process');
const path = require('path');
const execFile = util.promisify(require('child_process').execFile);

const options = {
  tabName: 'tab1',
  sheetName: 'workspace.ws',
  sheetPath: process.cwd()
};

module.exports.setOptions = function(o) {
  Object.assign(options, o);
};

module.exports.nip2 = async function(main, cellMap, outPath) {
  var commandArgs = Object.keys(cellMap).reduce( (acc, ele) => acc.concat(['-=',  expandName(ele) + '=' + cellMap[ele] ]), []);
  commandArgs.unshift('-bp');
  commandArgs = commandArgs.concat(['-=', 'main=' + expandName(main)]);
  if(typeof outPath === 'string' && outPath.length > 0)
    commandArgs = commandArgs.concat([ '-o', outPath ]);
  commandArgs.push(path.join(options.sheetPath, options.sheetName));
  const {stdout, stderr} = await execFile('nip2', commandArgs);
  return stdout;
};

function expandName(n) {
  return ['Workspaces', options.tabName, n].join('.');
}
