This PR consists of three categories:


## 1. Renamed internal items

The purpose of this renaming is to improve the codebase's [greppability](http://john.freml.in/grep-orientated-programming):

> Greppability is the ease with which one can navigate a body of source code just by searching simple text keywords. From determining what code caused an output to tracing all the callers of a function, there's plenty that can be possible by text searching - or not depending how names are used or the project structured. And the easier it is, the faster and more reliably new developers can be productive.

For example, the name `setThemes` is currently used for two different things in `src/Themes.tsx`:

1. The function which updates the `themes` state variable.
2. The channel event which is received when the `src/ThemesProvider.tsx` component mounts.

By giving these items unique (and more specific) names, the codebase's greppability is improved.

**Note: Only internal items have been renamed. No items exposed in the addon's public API have been renamed, so this is not a breaking change.**

Commits:

* cdbcd20  –  Rename `themes` prop to `decoratorThemes`
* cf6225f  –  Rename `theme` to `stateTheme`
* 0e56d61  –  Rename `setTheme` to `setStateTheme`
* eb5bcc1  –  Rename `setThemes` to `decoratorThemesReceived`
* 7c49044  –  Rename `selectTheme` to `panelThemeSelected`
* e48f1f5  –  Rename `theme` to `stateTheme`
* fc3746e  –  Rename `setTheme` to `setStateTheme`
* bacde06  –  Rename `themes` to `stateThemes`
* cf2c742  –  Rename `setThemes` to `setStateThemes`

Complete diff – https://github.com/Sage/storybook-addon-styled-component-theme/compare/5678bfb...cf2c742


## 2. Miscellaneous improvements

* 3998235  –  Refactor `fontFamily` to avoid TSLint issue
* 421ffef  –  Improve React keys for theme buttons


## 3. Implemented new story-specific params/metadata

**Note: These new params are all optional, so this is not a breaking change.**

The new params are documented in the updated `README.md`:

> The following fields (all optional) can be supplied in a `themeSelector` metadata object for a story:
>
> * **`themes`**  –  An array of themes, overriding the `themes` passed to `addDecorator(withThemesProvider(themes))` (if any).
> * **`singleThemeMessage`**  –  A `string`, containing a message to be displayed in the "Themes" Panel when there's only one theme available.
> * **`showSingleThemeButton`**  –  A `boolean` (default `true`), specifying whether to display the single theme button when there's only one theme available.
>
> For example:
>
> ```jsx
> const customThemes = [theme3, theme4];
>
> storiesOf("demo", module)
>   .add("demo div", () => <div>DEMO</div>, {
>     themeSelector: {
>       themes: customThemes
>     }
>   });
> ```
>
> ```jsx
> const customThemes = [theme5];
>
> storiesOf("demo", module)
>   .add("demo div", () => <div>DEMO</div>, {
>     themeSelector: {
>       themes:                customThemes,
>       singleThemeMessage:    "There is only one theme configured for this story.",
>       showSingleThemeButton: false
>     }
>   });
> ```

Commits:

* 8d83996  –  `panelThemeSelected`: pass theme instead of name
* 23efc4b  –  Create `src/constants.tsx`
* f84dafa  –  Implement `storyThemesReceived` functionality
* fe9b282  –  `withThemesProvider`: default value for `themes`
* b7de211  –  Implement `singleThemeMessage` functionality
* a7794ed  –  Implement `showSingleThemeButton` functionality
* 20d3b93  –  Update `Themes.spec.tsx`
* 890d82b  –  Update `README.md`
* a3dc4c7  –  `onReceiveThemes()`: need to call `setQueryParams()`
* e4a1df9  –  Minor cleanup in `README.md` and `src/Themes.tsx`
