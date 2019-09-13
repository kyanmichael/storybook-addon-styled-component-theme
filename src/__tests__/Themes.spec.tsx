import {mount} from "enzyme";
import * as React from "react";
import {stub} from "sinon";
import {Themes} from "../Themes";

describe("Themes spec", () => {
    it("should render proper", () => {
        const api = {
            on: stub(),
            getCurrentStoryData: stub(),
        };
        const channel = {
            on: stub(),
            emit: stub(),
            removeListener: stub(),
        };

        const component = mount(<Themes api={api} channel={channel} active={true} />);
        expect(component.render()).toMatchSnapshot();
        expect(channel.on.calledTwice).toBeTruthy();
        expect(channel.emit.notCalled).toBeTruthy();

        component.unmount();
        expect(channel.removeListener.calledTwice).toBeTruthy();
    });
});
