const seedsplit = require('../lib/seedsplit')
const bip39 = require('bip39')
const Combinatorics = require('js-combinatorics')
const assert = require('chai').assert

describe('seedsplit', () => {
  let twelveWordSeeds = []
  let twentyfourWordSeeds  = []
  let shardsList1
  let shardsList2
  let shardsList3
  let shardsList4

  before(() => {
    let arr = Array.apply(null, Array(30))
    twelveWordSeeds = arr.map(e => bip39.generateMnemonic())
    twentyfourWordSeeds = arr.map(e => bip39.generateMnemonic(256))
  })

  it('should create the correct number of shards', async () => {
    let results = []
    results.push(testCorrectSplit(twelveWordSeeds, 5, 3))
    results.push(testCorrectSplit(twentyfourWordSeeds, 5, 3))
    results.push(testCorrectSplit(twelveWordSeeds, 3, 2))
    results.push(testCorrectSplit(twentyfourWordSeeds, 3, 2))
    results.push(testCorrectSplit(twelveWordSeeds, 2, 2))
    results.push(testCorrectSplit(twelveWordSeeds, 4, 2))
    results.push(testCorrectSplit(twelveWordSeeds, 6, 2))
    results.push(testCorrectSplit(twelveWordSeeds, 7, 2))
    results.push(testCorrectSplit(twelveWordSeeds, 8, 2))
    results.push(testCorrectSplit(twelveWordSeeds, 9, 2))
    results.push(testCorrectSplit(twelveWordSeeds, 255, 127))
    results.push(testCorrectSplit(twentyfourWordSeeds, 255, 127))

    shardsList1 = await results[0]
    shardsList2 = await results[1]
    shardsList3 = await results[2]
    shardsList4 = await results[3]

    await Promise.all(results)
  })

  it('should throw if threshold > shards', async () => {
    let didThrow = false
    try {
      await seedsplit.split(twelveWordSeeds[0], 3, 4)
    } catch (e) {
      didThrow = true
    }
    assert.isTrue(didThrow)
  })

  it('should give the correct seed with any combination of the right number of shards', async () => {
    let results = []
    results.push(testSufficientNumShards(shardsList1, twelveWordSeeds, 3))
    results.push(testSufficientNumShards(shardsList2, twentyfourWordSeeds, 3))
    results.push(testSufficientNumShards(shardsList1, twelveWordSeeds, 4))
    results.push(testSufficientNumShards(shardsList2, twentyfourWordSeeds, 4))
    results.push(testSufficientNumShards(shardsList1, twelveWordSeeds, 5))
    results.push(testSufficientNumShards(shardsList2, twentyfourWordSeeds, 5))

    results.push(testSufficientNumShards(shardsList3, twelveWordSeeds, 2))
    results.push(testSufficientNumShards(shardsList4, twentyfourWordSeeds, 2))
    results.push(testSufficientNumShards(shardsList3, twelveWordSeeds, 3))
    results.push(testSufficientNumShards(shardsList4, twentyfourWordSeeds, 3))

    await Promise.all(results)
  }).timeout(4000)

  it('should not give correct seed with a combination of too few shards', async () => {
    let results = []
    results.push(testInsufficientNumShards(shardsList1, twelveWordSeeds, 1))
    results.push(testInsufficientNumShards(shardsList2, twentyfourWordSeeds, 1))
    results.push(testInsufficientNumShards(shardsList1, twelveWordSeeds, 2))
    results.push(testInsufficientNumShards(shardsList2, twentyfourWordSeeds, 2))

    results.push(testInsufficientNumShards(shardsList3, twelveWordSeeds, 1))
    results.push(testInsufficientNumShards(shardsList4, twentyfourWordSeeds, 1))
    await Promise.all(results)
  })
})

async function testCorrectSplit(wordSeeds, numShards, threshold) {
  let shardsList = []
  for (const ws of wordSeeds) {
    let shards = await seedsplit.split(ws, numShards, threshold)
    assert.equal(shards.length, numShards, 'should have created right number of shares')
    shardsList.push(shards)
  }
  return shardsList
}

async function testSufficientNumShards(shardsList, wordSeeds, numShards) {
  for (let i = 0; i < shardsList.length; i++) {
    let cmbs = Combinatorics.combination(shardsList[i], numShards)
    while (cmb = cmbs.next()) {
      let combination = await seedsplit.combine(cmb)
      assert.equal(combination, wordSeeds[i])
    }
  }
}

async function testInsufficientNumShards(shardsList, wordSeeds, numShards) {
  for (let i = 0; i < shardsList.length; i++) {
    let cmbs = Combinatorics.combination(shardsList[i], numShards)
    while (cmb = cmbs.next()) {
      let combination
      try {
        combination = await seedsplit.combine(cmb)
      } catch (e) {
        // only throws when decoded hex is not valid
        assert.equal(e.message, 'Could not combine the given mnemonics')
      }
      assert.notEqual(combination, wordSeeds[i])
    }
  }
}
