import React from "react";
import { render, screen } from "@testing-library/react";
import PageNotFound from "../PageNotFound";
import Layout from "../Layout";

test("PageNotFound", () => {
  it('should render page not found text with link to home page', () => {
    render(<Layout><PageNotFound/></Layout >);

    const heading = screen.getByRole('heading', { name: /Oops, website doesn't exist!/i });
    expect(heading).toBeInTheDocument();

    const paragraph = screen.getByRole('paragraph', { name: /Check that your url is correct, if issue persists contact support./i })
    expect(paragraph).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /Go back home/i })
    expect(link).toBeInTheDocument();
  })
})
