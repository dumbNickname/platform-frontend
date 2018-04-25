# Working with Intl

## Setup

We use `react-intl` to provide intl feature in to Neufund Platform app.

All strings used by the app need to be statically extractable. We use `babel@7` (it parses
typescript code) + enhanced `babel-plugin-react-intl` to allow so. We extract them and build default
`intl/locales/en-en.json` file based on found string. If you want to modify english version (default
translation) just do so in `en-en.json` file

To make you code extractable you need to:

* always use literals so no variables etc
* create FormattedMessage component with `id` prop
* if you need to pass translated value as a string use `injectIntlHelpers` HoC and then call
  `formatIntlMessage` function (this name should not be used for non intl things) and pass id as a
  first arg

## Usage

To extract all ids from the source code do:

```
yarn intl:extract
```

It will create tmp messages files at `intl/messages` (it's git ignored) and it will combine them in
`intl/locales/en-en.json` leaving already translated ids.