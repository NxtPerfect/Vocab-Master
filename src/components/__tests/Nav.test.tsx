import React from "react";
import { render, screen } from "@testing-library/react";
import Nav from "../Nav";
import AuthProvider, { isAuthenticated, useAuth } from "../AuthProvider";
import Cookie from "js-cookie";

test("Nav logged in", () => {
  it('should render navbar with user streak and username', () => {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    setIsAuthenticated(true)
    render(<AuthProvider><Nav /></AuthProvider >)

    const logo = screen.getByRole('heading', { name: /Vocab Master/i })
    expect(logo).toBeInTheDocument()
    expect(screen.getByText("Home")).toBeInTheDocument()

    const home = screen.getByRole('button', { name: /Home/i })
    expect(home).toBeInTheDocument()
    expect(screen.getByText("Home")).toBeInTheDocument()

    const span = screen.getByRole('span', { name: /fail/i })
    expect(span).toBeInTheDocument()

    Cookie.set("username", "admin", { expires: 14, samesite: "Lax" })
    const username = screen.getByRole('span', { name: /admin/i })
    expect(username).toBeInTheDocument()
    expect(screen.getByText("admin")).toBeInTheDocument()
    Cookie.remove("username")
    expect(screen.getByText("This isn't even real bruh bruh")).toBeInTheDocument()
  })
})

test("Nav guest", () => {
  it('should render navbar as guest', () => {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    setIsAuthenticated(false);
    render(<AuthProvider><Nav /></AuthProvider >)

    const home = screen.getByRole('button', { name: /Home/i })
    expect(home).toBeInTheDocument()
    expect(screen.getByText("Home")).toBeInTheDocument()

    const login = screen.getByRole('button', { name: /Login/i })
    expect(home).toBeInTheDocument()
    expect(screen.getByText("Login")).toBeInTheDocument()

    const register = screen.getByRole('button', { name: /Register/i })
    expect(register).toBeInTheDocument()
    expect(screen.getByText("Register")).toBeInTheDocument()
  })
})
