import React, { ReactElement, useEffect, useState } from 'react'
import Nav from './Nav'
import Footer from './Footer'
import axios from 'axios'
import Cookie from "js-cookie"
import { useQuery } from 'react-query';
import { useAuth } from './AuthProvider'

function Layout({ children }: { children: ReactElement }) {
  const [userStreak, setUserStreak] = useState<number>(0);
  const { isAuthenticated, setIsAuthenticated, login, logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const status = await queryAuthStatus();
      if (!status) {
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(true);
      await queryUserStreak();
    };

    fetchData();
  }, []);

  // Fetch all languages and user's progress if logged in
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      // const status = await queryAuthStatus()
      // console.log("Status", status)
      // if (!status) {
      //   setIsAuthenticated(false)
      //   return
      // }
      // setIsAuthenticated(true)
      await queryUserStreak()
    },
    onError: (err) => console.log(err),
    onSettled: () => {
      console.log("Success home", isAuthenticated)
    },
    enabled: true
  })

  // Gets current authentication status
  async function queryAuthStatus() {
    try {
      const data = await axios.post("http://localhost:6942/auth-status", { token: Cookie.get("token") })
      console.log("Data from auth-status", data.data.isAuthenticated)
      setIsAuthenticated(data.data.isAuthenticated)
      console.log("isAuthenticated", isAuthenticated)
      return data.data.isAuthenticated
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
      <Nav streak={userStreak} queryUserStreak={queryUserStreak} />
      {children}
      <Footer />
    </>
  )
}

export default Layout
