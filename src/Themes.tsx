import {List} from "immutable";
import * as React from "react";
import {branch, compose, lifecycle, renderNothing, withHandlers, withState} from "recompose";
import {Theme} from "./types/Theme";

export interface ThemeProps {
    channel: any;
    api: any;
    active: boolean;
}

interface ThemeState {
    stateTheme: Theme;
    setStateTheme: (theme: Theme) => void;
    stateThemes: List<Theme>;
    setStateThemes: (themes: List<Theme>) => void;
}

interface ThemeHandler {
    onSelectTheme: (theme: Theme) => void;
    onReceiveThemes: (theme: Theme[]) => void;
}

type BaseComponentProps = ThemeProps & ThemeState & ThemeHandler;

const BaseComponent: React.SFC<BaseComponentProps> = ({onSelectTheme, stateThemes, stateTheme}) => (
    <div style={RowStyle}>
        {stateThemes.map((th, i) => {
            const buttonStyle = th === stateTheme ? SelectedButtonStyle : ButtonStyle;
            return <div style={buttonStyle} key={i} onClick={() => onSelectTheme(th)}>{th.name}</div>;
        }).toArray()}
    </div>
);

export const Themes = compose<BaseComponentProps, ThemeProps>(
    withState("stateTheme", "setStateTheme", null),
    withState("stateThemes", "setStateThemes", List()),
    withHandlers<ThemeProps & ThemeState, ThemeHandler>({
        onSelectTheme: ({channel, setStateTheme, api}) => (theme) => {
            setStateTheme(theme);
            api.setQueryParams({theme: theme.name});
            channel.emit("panelThemeSelected", theme);
        },
        onReceiveThemes: ({setStateTheme, setStateThemes, channel, api}) => (newThemes: Theme[]) => {
            const themes = List(newThemes);
            const themeName = api.getQueryParam("theme");
            setStateThemes(List(themes));
            if (themes.count() > 0) {
                const theme = themes.find((t) => t.name === themeName) || themes.first();
                setStateTheme(theme);
                channel.emit("panelThemeSelected", theme);
            }
        },
    }),
    lifecycle<BaseComponentProps, BaseComponentProps>({
        componentDidMount() {
            const {channel, onReceiveThemes} = this.props;
            channel.on("decoratorThemesReceived", onReceiveThemes);
        },
        componentWillUnmount() {
            const {channel, onReceiveThemes} = this.props;
            channel.removeListener("decoratorThemesReceived", onReceiveThemes);
        },
    }),
    branch<BaseComponentProps>(
        ({stateTheme, active}) => !stateTheme || !active,
        renderNothing,
    ),
)(BaseComponent);

const RowStyle: React.CSSProperties = {
    padding: "10px",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    boxSizing: "border-box",
};

const ButtonStyle: React.CSSProperties = {
    border: "1px solid #BBB",
    borderRadius: "6px",
    color: "#BBB",
    padding: "13px",
    marginRight: "15px",
    cursor: "pointer",
    // tslint:disable-next-line:max-line-length
    fontFamily: "-apple-system, \".SFNSText-Regular\", \"San Francisco\", BlinkMacSystemFont, \"Segoe UI\", \"Roboto\", \"Oxygen\", \"Ubuntu\", \"Cantarell\", \"Fira Sans\", \"Droid Sans\", \"Helvetica Neue\", \"Lucida Grande\", \"Arial\", sans-serif",
    lineHeight: "25px",
};

const SelectedButtonStyle: React.CSSProperties = {
    ...ButtonStyle,
    backgroundColor: "#BBB",
    color: "#333",
    fontWeight: "bold",
};
