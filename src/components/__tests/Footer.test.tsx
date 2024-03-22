import { BrowserRouter } from "react-router-dom";
import Footer from "../Footer"
import { render, screen } from "@testing-library/react";

describe("Footer", () => {
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
    const footer = render(<BrowserRouter><Footer /></BrowserRouter>)
    expect(footer).exist

    const copyright = screen.getByText('Copyright (c) 2024 Aurora. All Rights Reserved.')
    expect(copyright).exist

    const home = screen.getByRole('link', { name: "Home" })
    expect(home).exist

    const terms = screen.getByRole('link', { name: "Terms of Service" })
    expect(terms).exist
  })
})
