import React from "react";
import { render, screen } from "@testing-library/react";
import PageNotFound from "../PageNotFound";
import Layout from "../Layout";
import { QueryClient, QueryClientProvider } from "react-query";
import { Router } from "react-router";
import { BrowserRouter } from "react-router-dom";

describe("PageNotFound", () => {
  beforeEach(() => {
    const mockedUseNavigate = vitest.fn();
    vitest.doMock("react-router-dom", "useNavigate", async () => {
      mockedUseNavigate
    });
  })
  afterEach(() => {
    vitest.restoreAllMocks()
  })
  test('should render page not found text with link to home page', () => {
    const queryClient = new QueryClient()
    const pagenotfound = render(<QueryClientProvider client={queryClient}><BrowserRouter><Layout><PageNotFound /></Layout ></BrowserRouter></QueryClientProvider>);

    const heading = screen.getByRole('heading', { name: /Oops, website doesn't exist!/i });
    expect(heading).exist;

    // const paragraph = screen.getByRole('paragraph', { name: /Check that your url is correct, if issue persists contact support./i })
    const paragraph = screen.getByText(/Check that your url is correct, if issue persists contact support./i)
    expect(paragraph).exist;

    const link = screen.getByRole('link', { name: /Go back home/i })
    expect(link).exist;
  })
})
