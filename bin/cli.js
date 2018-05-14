#!/usr/bin/env node

const seedsplit = require('../lib/seedsplit')
const program = require('commander')
const prompt = require('prompt')
const version = require('../package.json').version

prompt.message = ''
const prompts = {
  seed: {
    name: 'seed',
    description: 'Enter seed mnemonic',
    hidden: true,
    required: true
  },
  mnemonic: {
    name: 'mnemonic',
    description: 'Enter shard mnemonic',
    required: true
  }
}

function split({ threshold, shards }) {
  if (!threshold || !shards) {
    console.log('Please specify threshold and shards')
    return
  }
  handlePrompt(prompts.seed, async result => {
    let shardMnemonics = await seedsplit.split(result.seed, shards, threshold)
    console.log(shardMnemonics.join('\n'))
  })
}

function combine({ threshold }) {
  if (!threshold) {
    console.log('Please specify threshold')
    return
  }
  getMnemonics([], threshold, async mnemonics => {
    let seedMnemonic = await seedsplit.combine(mnemonics)
    console.log(seedMnemonic)
  })
}

function getMnemonics(mnemonics, threshold, callback) {
  if (threshold === 0) {
    callback(mnemonics)
  } else {
    handlePrompt(prompts.mnemonic, result => {
      mnemonics.push(result.mnemonic)
      getMnemonics(mnemonics, --threshold, callback)
    })
  }
}

function handlePrompt(question, callback) {
  try {
    prompt.get(question, (err, result) => {
      if (err) throw new Error(err)
      callback(result)
    })
  } catch (err) {
    console.log(err.message)
  }
}

program
  .version(version)

program
  .command('split')
  .description('Split a seed mnemonic into multiple mnemonics')
  .option('-t, --threshold <n>', 'number of shards needed to recovery seed', parseInt)
  .option('-s, --shards <m>', 'number of shards to create', parseInt)
  .action(opts => split(opts))

program
  .command('combine')
  .description('Combine multiple mnemonics into a seed mnemonic')
  .option('-t, --threshold <n>', 'number of shards needed to recovery seed', parseInt)
  .action(opts => combine(opts))

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
