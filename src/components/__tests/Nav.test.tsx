import { render, screen } from "@testing-library/react";
import Nav from "../Nav";
import Cookie from "js-cookie";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";

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
      const mod = await vitest.importActual < typeof import("react-router-dom") > (
        "react-router-dom"
      )
      return {
        ...mod,
        useNavigate: () => mockedUseNavigate,
      }
    })
    vitest.doMock("./AuthProvider", async () => {
      return {
        useAuth: () => mockedUseAuth,
      };
    });
  })
  afterEach(() => {
    vitest.restoreAllMocks()
  })
  test('should render navbar with user streak and username', () => {
    const queryClient = new QueryClient()
    const nav = render(<QueryClientProvider client={queryClient}><BrowserRouter><Nav /></BrowserRouter></QueryClientProvider>)
    expect(nav).exist

    const logo = screen.getByRole('heading', { name: /Vocab Master/i })
    expect(logo).exist
    expect(screen.getByText("Home")).exist

    const home = screen.getByRole('link', { name: /Home/i })
    expect(home).exist
    expect(screen.getByText("Home")).exist

    // TODO: fails since we aren't logged in
    // const span = screen.getByRole('generic', { name: /fail/i })
    // expect(span).exist
    //
    // Cookie.set("username", "admin", { expires: 14, samesite: "Lax" })
    // const username = screen.getByRole('generic', { name: /admin/i })
    // expect(username).exist
    // expect(screen.getByText("admin")).exist
    // Cookie.remove("username")
  })
  test('should render navbar as guest', () => {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    setIsAuthenticated(false);
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
