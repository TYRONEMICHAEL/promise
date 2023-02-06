## NFT Gate

The guard should be initialised with a required collection. The promisor will need to have an NFT that is part of this collection before their account will be created.

When validating this guard we need the following:
- The mint of the NFT
  - Get the Metaplex metadata account
  - Check is it owned by metaplex
  - Check if it is a verified collection
  - Collection is = to the required collection in the guard
- The associated token account of the mint
  - Should be owned by the spl program
  - Get the token account data
  - The token account should be owned by the promisor
  - It should have an amount > 1
  - The mint should be equal to the mint of the mint account