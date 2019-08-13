import addons from "@storybook/addons";
import {List} from "immutable";
import * as React from "react";
import {branch, compose, lifecycle, mapProps, renderNothing, withHandlers, withState} from "recompose";
import {ThemeProvider, ThemeProviderComponent} from "styled-components";
import {Theme} from "./types/Theme";

export interface ThemesProviderProps {
    decoratorThemes: List<Theme>;
    CustomThemeProvider?: ThemeProviderComponent<any>;
}

interface ThemesProviderMapProps {
    Provider: ThemeProviderComponent<{theme: Theme}>;
}

interface ThemesProviderState {
    stateTheme: Theme;
    setStateTheme: (theme: Theme) => void;
}

interface ThemesProviderHandler {
    onSelectTheme: (name: string) => void;
}

type BaseComponentProps = ThemesProviderProps & ThemesProviderMapProps & ThemesProviderState & ThemesProviderHandler;

const BaseComponent: React.SFC<BaseComponentProps> = ({stateTheme, Provider, children}) => (
  <Provider theme={stateTheme} children={children as any}/>
);

export const ThemesProvider = compose<BaseComponentProps, ThemesProviderProps>(
    mapProps<ThemesProviderProps & ThemesProviderMapProps, ThemesProviderProps>((props) => {
        const {CustomThemeProvider} = props;
        const Provider = CustomThemeProvider ? CustomThemeProvider : ThemeProvider;
        return {...props, Provider};
    }),
    withState("stateTheme", "setStateTheme", null),
    withHandlers<ThemesProviderProps & ThemesProviderMapProps & ThemesProviderState, ThemesProviderHandler>({
        onSelectTheme: ({setStateTheme, decoratorThemes}) => (name) => {
            const theme = decoratorThemes.find((th: Theme) => th.name === name);
            setStateTheme(theme);
        },
    }),
    lifecycle<BaseComponentProps, BaseComponentProps>({
        componentDidMount() {
            const {onSelectTheme, decoratorThemes} = this.props;
            const channel = addons.getChannel();
            channel.on("panelThemeSelected", onSelectTheme);
            channel.emit("decoratorThemesReceived", decoratorThemes);
        },
        componentWillUnmount() {
            const {onSelectTheme} = this.props;
            const channel = addons.getChannel();
            channel.removeListener("panelThemeSelected", onSelectTheme);
        },
    }),
    branch<BaseComponentProps>(
        (props) => !props.stateTheme,
        renderNothing,
    ),
)(BaseComponent);
