import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import ErrorPage from "../ErrorPage";
import { QueryClient, QueryClientProvider } from "react-query";

describe("ErrorPage", () => {
  beforeEach(() => {
    const mockedUseNavigate = vitest.fn()
    vitest.doMock("react-router-dom", async () => {
      const mod = await vitest.importActual<typeof import("react-router-dom")>(
        "react-router-dom"
      )
      return {
        ...mod,
        useNavigate: () => mockedUseNavigate,
      }
    })
  })
  afterEach(() => {
    vitest.restoreAllMocks()
  })
  test('should render text', () => {
    const queryClient = new QueryClient()
    const errorPage = render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ErrorPage />
        </BrowserRouter>
      </QueryClientProvider>)
    expect(errorPage).exist

    const oops = screen.getByRole('heading', { name: "Oops! Something went wrong" })
    expect(oops).exist

    const us = screen.getByRole('link', { name: "us" })
    expect(us).exist

    const home = screen.getByRole('link', { name: "Go back" })
    expect(home).exist
  })
})
