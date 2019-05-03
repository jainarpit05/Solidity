const path = require('path');
const fs = require('fs');
const solc = require('solc');

const lotteyPath = path.resolve(__dirname, 'contracts', 'lottery.sol');
const source = fs.readFileSync(lotteyPath, 'utf8');

module.exports = solc.compile(source, 1).contracts[':Lottery'];
