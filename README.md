qeury in a client
`
@POST http://localhost:8080/graphql

{
"query":"{ hello { text views }}"
}`

login
`{
  login(email:"email", password: "password")
  {
    token
    userId
  }
}`
