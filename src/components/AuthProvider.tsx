import React, { ReactElement, createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(false);

function AuthProvider({ children }: { children: ReactElement }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  const login = () => {
    setIsAuthenticated(true)
  }

  const logout = () => {
    setIsAuthenticated(false)
  }

  const contextValue = useMemo(() => ({
    isAuthenticated,
    setIsAuthenticated,
    login,
    logout
  }), [isAuthenticated])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export default AuthProvider
