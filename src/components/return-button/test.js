import React from "react";
import { shallow } from "enzyme";
import ReturnButton from "./returnButton.jsx"

it("should render ReturnButton", () => {
  expect(
    shallow(
      <ReturnButton />,
    ).exists(),
  ).toBeTruthy();
});
