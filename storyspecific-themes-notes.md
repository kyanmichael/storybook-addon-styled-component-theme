# Enhancement: story-specific themes

## Introduction

* There are two key files in the addon:
    * [`src/ThemesProvider.tsx`](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/ThemesProvider.tsx)  –  This is the HOC which wraps each story with [a StyledComponents `<ThemeProvider>`](https://www.styled-components.com/docs/advanced#theming).
    * [`src/Themes.tsx`](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/Themes.tsx)  –  This is the Storybook "Themes" [Panel](https://storybook.js.org/docs/addons/writing-addons/#add-a-panel) which displays a button for each available theme.
* These files communicate with each other via [a Storybook Channel](https://storybook.js.org/docs/addons/api/#addonapigetchannel), whose API matches [Node.js's `EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter), enabling communication via the [`emit()`](https://nodejs.org/api/events.html#events_emitter_emit_eventname_args) and [`on()`](https://nodejs.org/api/events.html#events_emitter_on_eventname_listener) methods.
* These files use [Recompose](https://github.com/acdlite/recompose): a React utility library which has now been deprecated in favour of [React Hooks](https://reactjs.org/docs/hooks-intro.html).
* These files also use [Immutable.js](https://immutable-js.github.io/immutable-js/)'s [`List`](https://immutable-js.github.io/immutable-js/docs/#/List) data structure.
* There are a couple of other important files:
    * [`src/register.tsx`](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/register.tsx)  –  This [registers](https://storybook.js.org/docs/addons/api/#addonapiregister) the addon with Storybook, and [adds](https://storybook.js.org/docs/addons/api/#addonapiaddpanel) the "Themes" Panel.
    * [`src/withThemesProvider.tsx`](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/withThemesProvider.tsx)  –  This is the [Storybook Decorator](https://storybook.js.org/docs/addons/introduction/#storybook-decorators), which enables the addon to be connected to stories, via Storybook's `addDecorator()` method.


## Existing flow

1. A `themes` array is passed to `withThemesProvider()`, like this:  `addDecorator(withThemesProvider(themes))`
2. [`src/withThemesProvider.tsx`](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/withThemesProvider.tsx) receives [the `themes` array](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/withThemesProvider.tsx#L7), and [passes it](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/withThemesProvider.tsx#L8) to [`src/ThemesProvider.tsx`](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/ThemesProvider.tsx) in a prop.
3. Within [`src/ThemesProvider.tsx`](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/ThemesProvider.tsx), [`componentDidMount()`](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/ThemesProvider.tsx#L46) receives [the `themes` prop](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/ThemesProvider.tsx#L47), and [emits](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/ThemesProvider.tsx#L50) a `setThemes` event on the Storybook Channel.
4. [`src/Themes.tsx`](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/Themes.tsx) detects [the `setThemes` event](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/Themes.tsx#L58), and calls the `onReceiveThemes()` handler.
5. [`onReceiveThemes()`](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/Themes.tsx#L44) stores [the received themes](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/Themes.tsx#L47) in the component's [`themes` state variable](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/Themes.tsx#L37).
6. If [at least one](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/Themes.tsx#L48) theme was received, then `onReceiveThemes()` [determines the appropriate theme](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/Themes.tsx#L49) to make active (either using [the `theme` query string parameter](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/Themes.tsx#L46), or just selecting the first theme in the array).  It then [stores this active theme](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/Themes.tsx#L50) in the component's [`theme` state variable](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/Themes.tsx#L36), and [emits](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/Themes.tsx#L51) a `selectTheme` event on the Storybook Channel.
7. [`src/ThemesProvider.tsx`](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/ThemesProvider.tsx) detects [the `selectTheme` event](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/ThemesProvider.tsx#L49), and calls the `onSelectTheme()` handler.
8. [`onSelectTheme()`](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/ThemesProvider.tsx#L40) stores [the specified theme](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/ThemesProvider.tsx#L42) in the component's [`theme` state variable](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/ThemesProvider.tsx#L38).
9. This new `theme` value flows through [`mapProps()`](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/ThemesProvider.tsx#L33) and arrives in [the `BaseComponent`'s `theme` prop](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/ThemesProvider.tsx#L28), where it gets passed to the [`<Provider>`](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/ThemesProvider.tsx#L29) (this is either [the StyledComponents `<ThemeProvider>`](https://www.styled-components.com/docs/advanced#theming), or a [`<CustomThemeProvider>`](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/ThemesProvider.tsx#L34) supplied by the user).


## New functionality required

1. We don't want to be required to pass a global array of `themes` to `addDecorator(withThemesProvider(themes))`.  Instead, we want to be able to call `addDecorator(withThemesProvider())`, to add the decorator but without providing any global themes.
2. When writing a story, we want to be able to pass an array of story-specific `themes` as metadata to the addon.  For example:
    ```js
    const themes = [ … ];

    storiesOf('Button', module)
      .add(
        'default',
        () => { … },
        { themeSelector: { themes } }  // Metadata for addon
      );
    ```
3. We also want to have new metadata fields called `singleThemeMessage` and `showSingleThemeButton`, to configure the addon's behaviour when there's only one theme available.  For example:
    ```js
    const themes = [ … ];

    storiesOf('Button', module)
      .add(
        'default',
        () => { … },
        { // Metadata for addon
          themeSelector: {
            themes,
            singleThemeMessage:    'There is only one theme configured for this story.',
            showSingleThemeButton: false
          }
        }
      );
    ```


## Commits

These commits are on the [`storyspecific-themes`](https://github.com/kyanmichael/storybook-addon-styled-component-theme/commits/storyspecific-themes) branch:

* First, various items were renamed, to make their purpose clearer:
    * [`cdbcd20`](https://github.com/kyanmichael/storybook-addon-styled-component-theme/commit/cdbcd20)  –  Rename `themes` prop to `decoratorThemes`
    * [`cf6225f`](https://github.com/kyanmichael/storybook-addon-styled-component-theme/commit/cf6225f)  –  Rename `theme` to `stateTheme`
    * [`0e56d61`](https://github.com/kyanmichael/storybook-addon-styled-component-theme/commit/0e56d61)  –  Rename `setTheme` to `setStateTheme`
    * [`eb5bcc1`](https://github.com/kyanmichael/storybook-addon-styled-component-theme/commit/eb5bcc1)  –  Rename `setThemes` to `decoratorThemesReceived`
    * [`7c49044`](https://github.com/kyanmichael/storybook-addon-styled-component-theme/commit/7c49044)  –  Rename `selectTheme` to `panelThemeSelected`
    * [`e48f1f5`](https://github.com/kyanmichael/storybook-addon-styled-component-theme/commit/e48f1f5)  –  Rename `theme` to `stateTheme`
    * [`fc3746e`](https://github.com/kyanmichael/storybook-addon-styled-component-theme/commit/fc3746e)  –  Rename `setTheme` to `setStateTheme`
    * [`bacde06`](https://github.com/kyanmichael/storybook-addon-styled-component-theme/commit/bacde06)  –  Rename `themes` to `stateThemes`
    * [`cf2c742`](https://github.com/kyanmichael/storybook-addon-styled-component-theme/commit/cf2c742)  –  Rename `setThemes` to `setStateThemes`
* Then the new functionality was implemented:
    * [`8d83996`](https://github.com/kyanmichael/storybook-addon-styled-component-theme/commit/8d83996)  –  `panelThemeSelected`: pass theme instead of name
    * [`23efc4b`](https://github.com/kyanmichael/storybook-addon-styled-component-theme/commit/23efc4b)  –  Create `src/constants.tsx`
    * [`f84dafa`](https://github.com/kyanmichael/storybook-addon-styled-component-theme/commit/f84dafa)  –  Implement `storyThemesReceived` functionality
    * [`fe9b282`](https://github.com/kyanmichael/storybook-addon-styled-component-theme/commit/fe9b282)  –  `withThemesProvider`: default value for `themes`
    * [`3998235`](https://github.com/kyanmichael/storybook-addon-styled-component-theme/commit/3998235)  –  Refactor `fontFamily` to avoid TSLint issue
    * [`8f94599`](https://github.com/kyanmichael/storybook-addon-styled-component-theme/commit/8f94599)  –  Implement `singleThemeMessage` functionality
    * [`040401e`](https://github.com/kyanmichael/storybook-addon-styled-component-theme/commit/040401e)  –  Implement `showSingleThemeButton` functionality
    * [`5acb175`](https://github.com/kyanmichael/storybook-addon-styled-component-theme/commit/5acb175)  –  Update `Themes.spec.tsx`
    * [`ec9888c`](https://github.com/kyanmichael/storybook-addon-styled-component-theme/commit/ec9888c)  –  Update `README.md`

View [the complete diff](https://github.com/kyanmichael/storybook-addon-styled-component-theme/compare/master...kyanmichael:storyspecific-themes) for this branch.

View [the updated README](https://github.com/kyanmichael/storybook-addon-styled-component-theme/blob/storyspecific-themes/README.md).


## Notes on code changes

* The [`themes`](https://github.com/echoulen/storybook-addon-styled-component-theme/blob/v1.2.4/src/withThemesProvider.tsx#L7) parameter of `withThemesProvider()` needed to be given a default value of `[]`.  (This isn't strictly necessary, since [Immutable.js](https://immutable-js.github.io/immutable-js/)'s [`List`](https://immutable-js.github.io/immutable-js/docs/#/List) constructor will successfully create an empty `List` if it receives `undefined` as its parameter, but supplying a value of `[]` makes the code clearer.)
* To read metadata supplied to a story, Storybook's [`api.getParameters(storyId, metadataKey)`](https://github.com/storybookjs/storybook/blob/v5.1.9/lib/api/src/modules/stories.ts#L92) method is needed.  This isn't well-documented (there's one mention of it [here](https://storybook.js.org/docs/addons/writing-addons/#add-a-panel)).
* To read the metadata when the story is rendered, a listener is needed for the [`STORY_RENDERED`](https://github.com/storybookjs/storybook/blob/v5.1.9/lib/core-events/src/index.ts#L17) event (this isn't documented at all).
