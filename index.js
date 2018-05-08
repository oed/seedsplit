const bip39 = require('bip39')
const seedsplit = require('./lib/seedsplit')

//let m1 = bip39.generateMnemonic(256) // 24 words
let m1 = bip39.generateMnemonic() // 12 words

console.log(m1)

let sm = seedsplit.split(m1, 3, 2)

sm.then((x) => console.log(x))

let m2 = sm.then((x) => seedsplit.combine(x.slice(1)))

m2.then((x) => {
  console.log(x)
  console.log('Is correct:', m1 === x)
})
