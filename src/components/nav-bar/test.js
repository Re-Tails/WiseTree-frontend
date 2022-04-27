import React from "react";
import { shallow } from "enzyme";
import NavBar from "./navbar.jsx";

jest.mock('react-router-dom', () => ({
    useRouteMatch: jest.fn().mockReturnValue({
      pathname: '/another-route',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }),
}));

it("should render NavBar", () => {
  expect(
    shallow(
      <NavBar />,
    ).exists(),
  ).toBeTruthy();
});
