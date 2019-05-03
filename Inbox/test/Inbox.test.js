const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); // Constructor function with uppercase 'W'
const web3 = new Web3(ganache.provider()); // Instance of web3

const { interface, bytecode } = require('../compile');

let accounts;
let inbox;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({ data: bytecode, arguments: ['Hi there!'] })
  .send({ from: accounts[2], gas: '1000000' });
});

describe('Inbox', () => {

  // Test 1: Check if the contract has been deployed
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  // Test 2: If the message matches with the initial argument.
  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, 'Hi there!');
  });

  // Test 3: Message can be changed
  it('can change the message', async () => {
    await inbox.methods.setMessage('bye').send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, 'bye');
  });
});
