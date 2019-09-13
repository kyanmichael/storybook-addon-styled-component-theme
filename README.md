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
import {addDecorator} from '@storybook/react';
import {withThemesProvider} from 'storybook-addon-styled-component-theme';

const themes = [theme1, theme2];

storiesOf("demo", module)
  .addDecorator(withThemesProvider(themes))
  .add("demo div", () => <div>DEMO</div>);
```

Once `addDecorator()` has been called, it's possible to customise the `themes` for a single story (see the documentation below on metadata for more details):

```jsx
const customThemes = [theme3, theme4];

storiesOf("demo", module)
  .add("demo div", () => <div>DEMO</div>, { themeSelector: { themes: customThemes } });
```

### 4. Configure story-specific metadata

The following fields (all optional) can be supplied in a `themeSelector` metadata object for a story:

* **`themes`**  –  An array of themes, overriding the `themes` passed to `addDecorator(withThemesProvider(themes))` (if any).
* **`singleThemeMessage`**  –  A `string`, containing a message to be displayed in the "Themes" Panel when there's only one theme available.
* **`showSingleThemeButton`**  –  A `boolean` (default `true`), specifying whether to display the single theme button when there's only one theme available.
* **`buttonAttributes`**  –  An array of `string`s, specifying [HTML element attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes)
  to add to the theme buttons in the "Themes" Panel (each attribute's value will be the theme's name).  This is useful for targeting the buttons
  using [CSS attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) to programmatically click them, eg:
  `document.querySelector('[data-theme-name="dark"]').click()`.

For example:

```jsx
const customThemes = [theme3, theme4];

storiesOf("demo", module)
  .add("demo div", () => <div>DEMO</div>, {
    themeSelector: {
      themes:           customThemes,
      buttonAttributes: ["data-theme-name"]
    }
  });
```

```jsx
const customThemes = [theme5];

storiesOf("demo", module)
  .add("demo div", () => <div>DEMO</div>, {
    themeSelector: {
      themes:                customThemes,
      singleThemeMessage:    "There is only one theme configured for this story.",
      showSingleThemeButton: false
    }
  });
```


## Reminder
Make sure every theme object has a `name` property


## Contributing

`yarn`

`yarn build:watch`

`yarn serve`
