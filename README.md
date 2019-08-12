[![npm version](https://badge.fury.io/js/storybook-addon-styled-component-theme.svg)](https://badge.fury.io/js/storybook-addon-styled-component-theme)
[![build status](https://travis-ci.org/echoulen/storybook-addon-styled-component-theme.svg?branch=master)](https://travis-ci.org/echoulen/storybook-addon-styled-component-theme)
[![codecov](https://codecov.io/gh/echoulen/storybook-addon-styled-component-theme/branch/master/graph/badge.svg)](https://codecov.io/gh/echoulen/storybook-addon-styled-component-theme)

![](https://media.giphy.com/media/FfFvOA9C0h9bhfCuNX/giphy.gif)

## Notice
Only support storybook 4 and newer


## Setup

### 1. Install
```bash
yarn add storybook-addon-styled-component-theme --dev
```

### 2. Register

Add to `.storybook/addons.js`:

```javascript
import 'storybook-addon-styled-component-theme/dist/src/register'; // v1.1.0^

import 'storybook-addon-styled-component-theme/dist/register'; // v1.0.7
```

### 3. Configure themes

Configure `themes` in `.storybook/config.js` for all stories:

```javascript
import {addDecorator} from '@storybook/react';
import {withThemesProvider} from 'storybook-addon-styled-component-theme';

const themes = [theme1, theme2];
addDecorator(withThemesProvider(themes));
```

or configure `themes` for a single group of stories:

```jsx
import {withThemesProvider} from 'storybook-addon-styled-component-theme';

const themes = [theme1, theme2];

storiesOf("demo", module)
  .addDecorator(withThemesProvider(themes))
  .add("demo div", () => <div>DEMO</div>);
```

Once `addDecorator()` has been called, you can customise the `themes` for a single story:

```jsx
const themes = [theme3, theme4];

storiesOf("demo", module)
  .add("demo div", () => <div>DEMO</div>, { themeSelector: { themes } });
```


## Remind
Make sure every theme object has a `name` property


## Contributing

`yarn`

`yarn build:watch`

`yarn serve`
