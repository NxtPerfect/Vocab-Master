function Register() {
  return (
    <>
      <form method="POST">
        <label htmlFor="email">Email</label>
        <input type="email" name="email"></input>
        <label htmlFor="username">Username</label>
        <input type="text" name="username"></input>
        <label htmlFor="password">Password</label>
        <input type="password" name="password"></input>
        <label htmlFor="password">Confirm Password</label>
        <input type="password" name="confirm_password"></input>
        <button>Register</button>
      </form>
    </>
  )
}
export default Register
