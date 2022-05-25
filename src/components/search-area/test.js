import React from "react";
import { shallow } from "enzyme";
import SearchArea from "./searchArea.jsx"

it("should render ReturnButton", () => {
  expect(
    shallow(
      <SearchArea />,
    ).exists(),
  ).toBeTruthy();
});
