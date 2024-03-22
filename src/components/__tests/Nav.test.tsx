import { render, screen } from "@testing-library/react";
import Nav from "../Nav";
import Cookie from "js-cookie";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "../AuthProvider";

describe("Nav", () => {
  beforeEach(() => {
    const mockedUseNavigate = vitest.fn()
    const mockedUseAuth = vitest.fn(() => ({
      isAuthenticated: true, // Mock the return values of useAuth
      setIsAuthenticated: vitest.fn(),
      login: vitest.fn(),
      logout: vitest.fn(),
    }))
    vitest.doMock("react-router-dom", async () => {
      const mod = await vitest.importActual<typeof import("react-router-dom")>(
        "react-router-dom"
      )
      return {
        ...mod,
        useNavigate: () => mockedUseNavigate,
      }
    })
    vitest.mock("./AuthProvider", async () => {
      return {
        useAuth: () => mockedUseAuth,
      }
    })
  })
  afterEach(() => {
    vitest.restoreAllMocks()
  })
  test('should render navbar with user streak and username', () => {
    const queryClient = new QueryClient()
    Cookie.set("username", "admin", { expires: 14, samesite: "Lax" })
    const nav = render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Nav />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>)
    expect(nav).exist

    const logo = screen.getByRole('heading', { name: /Vocab Master/i })
    expect(logo).exist
    expect(screen.getByText("Home")).exist

    const home = screen.getByRole('link', { name: /Home/i })
    expect(home).exist
    expect(screen.getByText("Home")).exist

    // TODO: fails since we aren't logged in
    // as isAuthenticated is set to false
    // it always fails
    const span = screen.getByRole('generic', { name: /fail/i })
    expect(span).exist
    expect(screen.getByText("fail")).exist

    const username = screen.getByRole('generic', { name: /admin/i })
    expect(username).exist
    expect(screen.getByText("admin")).exist
    Cookie.remove("username")
    expect(screen.getByText("admin")).not.exist
  })
  test('should render navbar as guest', () => {
    const queryClient = new QueryClient()
    const nav = render(<QueryClientProvider client={queryClient}><BrowserRouter><Nav /></BrowserRouter></QueryClientProvider>)

    const home = screen.getByRole('link', { name: /Home/i })
    expect(home).exist
    expect(screen.getByText("Home")).exist

    const login = screen.getByRole('link', { name: /Login/i })
    expect(home).exist
    expect(screen.getByText("Login")).exist

    const register = screen.getByRole('link', { name: /Register/i })
    expect(register).exist
    expect(screen.getByText("Register")).exist
  })
})
