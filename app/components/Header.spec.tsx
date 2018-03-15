import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";
import { tid } from "../../test/testUtils";
import { HeaderComponent } from "./Header";

describe("<HeaderComponent />", () => {
  it("should not render logout button when unauthorized", () => {
    const mockFunction = spy();
    const component = shallow(<HeaderComponent isAuthorized={false} logout={mockFunction} />);

    expect(component.find(tid("Header-logout"))).to.have.length(0);
  });

  it("should render logout button when authorized", () => {
    const mockFunction = spy();
    const component = shallow(<HeaderComponent isAuthorized={true} logout={mockFunction} />);

    expect(component.find(tid("Header-logout"))).to.have.length(1);
  });

  it("should simulate a click and logout", () => {
    const mockFunction = spy();
    const component = shallow(<HeaderComponent isAuthorized={true} logout={mockFunction} />);
    const LogoutButton = component.find(tid("Header-logout"));

    LogoutButton.simulate("click");

    expect(mockFunction.called).to.be.true;
  });
});