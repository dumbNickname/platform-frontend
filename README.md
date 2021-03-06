# platform-frontend

[![Build Status](https://travis-ci.org/Neufund/platform-frontend.svg?branch=master)](https://travis-ci.org/Neufund/platform-frontend)
[![codecov](https://codecov.io/gh/Neufund/platform-frontend/branch/master/graph/badge.svg)](https://codecov.io/gh/Neufund/platform-frontend)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Running project

### Prerequisites

* running ethereum node on port `8545`. To start local instance just run `yarn ganache`
* running `signature_auth_api` on port `5000`

```sh
yarn
yarn ganache   # in separate window. You need to upload neufund contracts. Keep on reading.
yarn start
```

#### Using external backend

Set NF_REMOTE_BACKEND_PROXY_ROOT variable in your .env file and run `yarn start:remote` to connect
to remote backend.

#### Uploading contracts

To upload modified version of Neufund Smartcontract that allows for easier blockchain development
you need to checkout
[`kk/frontend-platform-fixtures`](https://github.com/Neufund/platform-contracts/pull/55) branch and
run `yarn fixture`.

Typechain (it generates typed wrappers on smartcontracts) runs automatically after doing `yarn` to
trigger it manually do: `yarn generate:contracts`.

## Running tests

```
yarn test # checks formatting, runs linter and tests
```

### Fix all autofixable errors and run tests

```
yarn test:fix
```

### Production build

```
yarn build:prod
```

### Extracting translations from the app

```
yarn intl:extract
```

[Read more](./docs/working-with-intl.md)

### Docs

* [Component Development Guidelines](./docs/component-development-guidelines.md)
* [React Guidelines](./docs/react-guidelines.md)
* [Testing production build](./docs/testing-prod-build.md)
* [Working with Intl](./docs/working-with-intl.md)
* [Feature flags](./docs/feature-flags.md)
