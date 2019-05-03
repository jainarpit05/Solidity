const path = require('path');
const fs = require('fs');
const solc = require('solc');

const PropertyTransferPath = path.resolve(__dirname, 'contracts', 'PropertyTransfer.sol');
const source = fs.readFileSync(PropertyTransferPath, 'utf8');

console.log(solc.compile(source, 1).contracts[':PropertyTransfer']);

module.exports = solc.compile(source, 1).contracts[':PropertyTransfer'];
