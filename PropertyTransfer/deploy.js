const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  '', // Mnemonic from metamask
  'https://rinkeby.infura.io/v3/XXXXXXXXXXXXXXXXX' // Infura API
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: '4712388', from: accounts[0] });

    console.log('Interface:', interface);

  console.log('Contract deployed to', result.options.address);
};
deploy();
