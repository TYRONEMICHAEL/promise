# two x two

## Try it out now

You can try out the Promise protocol and two x two on devnet using the following link: https://promise-ok1cx9ty4-tyronemichael.vercel.app

> Please note this is using Devnet and it can take a while to sign transactions.

## Table of Contents

* [Quick Start](#quick-start)
* [Licensing](#licensing)
* [Useful Links](#useful-links)

## Quick Start (Localnet)

### Environment

Copy `.env.example` to `.env.local` and you'll be updating the values as you follow the steps. Ensure `NEXT_PUBLIC_SOLANA_WALLET_CLUSTER` is set to `localnet`.
### Squads

Build and deploy [squads](https://github.com/Squads-Protocol/squads-mpl) program.

Alternatively you can run the following command:
```
solana program deploy --program-id ./programs/squads_mpl-keypair.json ./programs/squads_mpl.so
```
This will deploy the program and give back a program id which you can use in you `.env.local` under `NEXT_PUBLIC_SQUADS_MULTISIG_ADDRESS`.

### Promise

Build and deploy the promise program.

Once deployed you can run the following command:
```
npm run createNetwork
```
This will give you the address of a newly created Network which is required for the app to run. Copy the address to `.env.local` under `NEXT_PUBLIC_PROMISE_NETWORK_ADDRESS`

### App

Build and run the app using the following command:
```
npm install
npm run dev
```

## Licensing

- Copyright &copy; 2023
- Licensed under MIT

## Useful Links

- [Tailwind CSS](https://tailwindcss.com/)
- [Next.js Docs](https://nextjs.org/docs/getting-started)
- [React.js Docs](https://reactjs.org/docs/getting-started.html)
- [Redux Docs](https://redux.js.org/introduction/getting-started) & [React-Redux Docs](https://react-redux.js.org/introduction/getting-started)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [TypeScript ESLint Docs](https://typescript-eslint.io/docs/)
