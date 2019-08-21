import {List} from "immutable";
import * as React from "react";
import {STORY_RENDERED} from "@storybook/core-events";
import {branch, compose, lifecycle, mapProps, renderNothing, withHandlers, withState} from "recompose";
import {Theme} from "./types/Theme";
import {metadataKey} from "./constants";

export interface ThemeProps {
    channel: any;
    api: any;
    active: boolean;
}

export interface ThemeMetadataParams {
    themes?: Theme[];
    singleThemeMessage?: string;
}

interface ThemeExtraProps {
    singleThemeMessage?: string;
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
    onStoryRender: (storyId: string) => void;
}

type BaseComponentProps = ThemeProps & ThemeExtraProps & ThemeState & ThemeHandler;

const BaseComponent: React.SFC<BaseComponentProps> =
    ({onSelectTheme, stateThemes, stateTheme, singleThemeMessage}) => (
        <div>
            {stateThemes.size === 1 && singleThemeMessage && (
                <div style={MessageStyle}>{singleThemeMessage}</div>
            )}
            <div style={RowStyle}>
                {stateThemes.map((th: Theme) => {
                    const style: React.CSSProperties = ((th === stateTheme) ? SelectedButtonStyle : ButtonStyle);
                    return (
                        <div style={style} key={th.name} onClick={() => onSelectTheme(th)}>
                            {th.name}
                        </div>
                    );
                }).toArray()}
            </div>
        </div>
    );

export const Themes = compose<BaseComponentProps, ThemeProps>(
    mapProps<ThemeProps, ThemeProps & ThemeExtraProps>((props) => {
        const mappedProps: ThemeProps & ThemeExtraProps = {...props};
        const currentStoryData = props.api.getCurrentStoryData();
        if (currentStoryData) {
            const params: ThemeMetadataParams | undefined = props.api.getParameters(currentStoryData.id, metadataKey);
            if (params) {
                mappedProps.singleThemeMessage = params.singleThemeMessage;
            }
        }
        return mappedProps;
    }),
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
        onStoryRender: ({api, channel}) => (storyId: string) => {
            const params: ThemeMetadataParams | undefined = api.getParameters(storyId, metadataKey);
            if (params && params.themes) {
                channel.emit("storyThemesReceived", params.themes);
            }
        },
    }),
    lifecycle<BaseComponentProps, BaseComponentProps>({
        componentDidMount() {
            const {api, channel, onReceiveThemes, onStoryRender} = this.props;
            channel.on("decoratorThemesReceived", onReceiveThemes);
            channel.on("storyThemesReceived", onReceiveThemes);
            api.on(STORY_RENDERED, onStoryRender);
        },
        componentWillUnmount() {
            const {channel, onReceiveThemes} = this.props;
            channel.removeListener("decoratorThemesReceived", onReceiveThemes);
            channel.removeListener("storyThemesReceived", onReceiveThemes);
        },
    }),
    branch<BaseComponentProps>(
        ({stateTheme, active}) => !stateTheme || !active,
        renderNothing,
    ),
)(BaseComponent);

const fontFamily: string = [
    "-apple-system",
    "\".SFNSText-Regular\"",
    "\"San Francisco\"",
    "BlinkMacSystemFont",
    "\"Segoe UI\"",
    "\"Roboto\"",
    "\"Oxygen\"",
    "\"Ubuntu\"",
    "\"Cantarell\"",
    "\"Fira Sans\"",
    "\"Droid Sans\"",
    "\"Helvetica Neue\"",
    "\"Lucida Grande\"",
    "\"Arial\"",
    "sans-serif",
].join(", ");

const margin: string = "10px";

const MessageStyle: React.CSSProperties = {
    fontFamily,
    margin,
};

const RowStyle: React.CSSProperties = {
    margin,
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
    fontFamily,
    lineHeight: "25px",
};

const SelectedButtonStyle: React.CSSProperties = {
    ...ButtonStyle,
    backgroundColor: "#BBB",
    color: "#333",
    fontWeight: "bold",
};
