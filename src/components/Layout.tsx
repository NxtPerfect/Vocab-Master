import React, { ReactElement, useState } from 'react'
import Nav from './Nav'
import Footer from './Footer'
import axios from 'axios'
import Cookie from "js-cookie"
import { useQuery } from 'react-query';

function Layout({ children }: { children: ReactElement }) {
  const [userStreak, setUserStreak] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Fetch all languages and user's progress if logged in
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      await queryAuthStatus()
      if (!isAuthenticated) return;
      await queryUserStreak()
    },
    onError: (err) => console.log(err)
  })

  // Gets current authentication status
  async function queryAuthStatus() {
    try {
      const data = await axios.get("http://localhost:6942/auth-status")
      setIsAuthenticated(data.data.isAuthenticated)
      console.log(isAuthenticated)
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async function queryUserStreak() {
    try {
      const data = await axios.post("http://localhost:6942/api/user_streak", { username: Cookie.get("username") })
      setUserStreak(data.data.message.userStreak)
      console.log(userStreak)
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  return (
    <>
      <Nav streak={userStreak} queryUserStreak={queryUserStreak} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} queryAuthStatus={queryAuthStatus} />
      {children}
      <Footer />
    </>
  )
}

export default Layout
