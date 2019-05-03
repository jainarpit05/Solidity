const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile.js');

const provider = new HDWalletProvider(
  '', // Mnemonic from Metamask
  'https://rinkeby.infura.io/v3/xxxxxxxxxxxxxxxxxx'// Infura API
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('From account: ', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({ data: bytecode })
  .send({ from: accounts[0], gas: '1000000' });

  console.log('Contract deployed to: ', result.options.address);
};

deploy();
