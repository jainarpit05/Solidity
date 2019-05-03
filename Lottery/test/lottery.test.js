const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({ data: bytecode })
  .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery Contract', () => {

  // Test 1: Check if the contract has deployed
  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  });

  // Test 2: One account has entered into the Lottery
  it('allows one account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether') // Wei to Ether
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
  });

  // Test 3: More than one account has entered into the Lottery
  it('allows multiple accounts to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.02', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[3],
      value: web3.utils.toWei('0.02', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(accounts[3], players[3]);
    assert.equal(4, players.length);
  });

  // Test 4: Check the minimum Ether used to enter into Lottery
  it('requires a minimum amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 1 // in Wei
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  // Test 5: Check if Manager can call the pickWinner
  it('only manager can call pickWinner', async () => {
      try {
        await lottery.methods.pickWinner().send({
          from: accounts[1]
        });
        assert(false);
      } catch (err) {
        assert(err);
      }
    });

    // Test 6: Check to see if winner receives the money and players array has been reset
    it('sends money to the winner and resets the players array', async () => {
      await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether')
    });

    const initialBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initialBalance;

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert(difference > web3.utils.toWei('1.8', 'ether'));
    assert.equal(0, players.length);
  });
})
