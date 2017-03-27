const bip39 = require('bip39')
const seedsplit = require('./lib/seedsplit')

//let m1 = bip39.generateMnemonic(256) // 24 words
let m1 = bip39.generateMnemonic() // 12 words

console.log(m1)

let sm = seedsplit.split(m1, 3, 2)

console.log(sm)

let m2 = seedsplit.combine(sm.slice(1))

console.log(m2)
console.log('Is correct:', m1 === m2)
