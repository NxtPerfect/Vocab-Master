import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import Flashcard from "../Flashcard";

describe("Flashcard", () => {
  beforeEach(() => {
    vitest.doMock("react-router-dom", async () => {
      const mod = await vitest.importActual<typeof import("react-router-dom")>(
        "react-router-dom"
      )
      return {
        ...mod,
        useNavigate: () => vitest.fn(),
        useBlocker: () => vitest.fn()
      }
    })
  })
  afterEach(() => {
    vitest.restoreAllMocks()
  })
  test('should render flashcard', () => {
    const queryClient = new QueryClient()
    const flashcard = render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Flashcard />
        </BrowserRouter>
      </QueryClientProvider>)
    expect(flashcard).exist

    // const oops = screen.getByRole('heading', { name: "Oops! Something went wrong" })
    // expect(oops).exist
    //
    // const us = screen.getByRole('link', { name: "us" })
    // expect(us).exist
    //
    // const home = screen.getByRole('link', { name: "Go back" })
    // expect(home).exist
  })
})
