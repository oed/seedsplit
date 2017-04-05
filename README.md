# seedsplit
Seedsplit lets you split a mnemonic seed into a selected number of shards which are also encoded as mnemonics. n-of-m shards can then be combined in order to get the initial mnemonic seed. This is accomplished by using Shamirs Secret Sharing. Seedsplit supports 12 and 24 word seeds.

## Why?
If you use a hardware wallet like Trezor or Ledger you get a mnemonic seed that can be used to recover your device in case of loss or breakage. After you have written this seed down you obviously need to keep it very safe, but how? Some people put it in a safety deposit box in their bank. However, this gives you have a trust issue again, which is what you where trying to avoid. With seedsplit you can split your seed into multiple mnemonics that you can had out to your friends and family. They can only recreate your seed if some of them come together to do so.

## Safe usage
For maximal safety you should only run this program on a computer that is not connected to the internet. Make sure to write down the mnemonic shards by hand, do **not** print them.

## Installation
```
$ npm i -g seedsplit
```

## Example usage
To split the mnemonic seed (`subway allow sketch yard proof apart world affair awful crop jealous bar` is used in the example):
```
$ seedsplit split -t 2 -s 3
Enter seed mnemonic:  
divorce husband dawn found essence field slim cycle warm claim empower artist caution merit
divorce object rule lemon possible public frozen expire twin evidence slim photo ivory leader
divorce wasp dentist company immune aim solve improve train hollow phone siren run spirit
```
Note that when you enter the seed no input will be displayed

To combine mnemonics to get a seed:
```
$ seedsplit combine -t 2
Enter shard mnemonic:  divorce object rule lemon possible public frozen expire twin evidence slim photo ivory leader
Enter shard mnemonic:  divorce wasp dentist company immune aim solve improve train hollow phone siren run spirit
subway allow sketch yard proof apart world affair awful crop jealous bar
```

## Tests
To run tests:
```
$ npm test
```

## Acknowledgments
Thanks to Christian Lundkvist for the idea of encoding the shards to mnemonics.
