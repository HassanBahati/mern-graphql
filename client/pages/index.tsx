import type { NextPage } from "next";
import { useState } from "react";

const Home: NextPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [createdUser, setCreatedUser] = useState({});
  const [loggedUser, setLoggedUser] = useState({});
  const [loading, setLoading] = useState(false);

  const signupHandler = (event: any) => {
    event.preventDefault();
    setLoading(true);
    // this.setState({ authLoading: true });
    const graphqlQuery = {
      query: `
      mutation {
        createUser(userInput: {email: "${email}", name: "${name}", password: "${password}"}) {
          email
          name
          _id
        }
      }
      
      `,
    };
    fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        setLoading(false);
        setCreatedUser(resData?.data?.createUser);
        console.log(resData?.data?.createUser);
        if (resData.errors && resData.errors[0].status === 422) {
          throw new Error(
            "Validation failed.Make sure the email address isnt used yet"
          );
        }
        if (resData.errors) {
          throw new Error("user creation failed");
        }
        console.log(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loginHandler = (event: any) => {
    event.preventDefault();
    setLoading(true);
    const graphqlQuery = {
      query: `
      {
        login(email: "${email}", password: "${password}"){
          token
          userId
        }
      }
      `,
    };
    // this.setState({ authLoading: true });
    fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        setLoading(false);
        setLoggedUser(resData?.data?.login);
        console.log(resData?.data?.login);
        if (resData.errors && resData.errors[0].status === 422) {
          throw new Error(
            "Validation failed.Make sure the email address isnt used yet"
          );
        }
        if (resData.errors) {
          throw new Error("user login failed");
        }
        localStorage.setItem("token", resData.data.login.token);
        localStorage.setItem("userId", resData.data.login.userId);
        console.log(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h1>Sign up form</h1>
      <form onSubmit={signupHandler}>
        <input
          name="name"
          type="text"
          placeholder="Name here"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          name="email"
          type="email"
          placeholder="Email here"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          name="password"
          type="password"
          placeholder="Password here"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          Created user
          <br /> Name: {createdUser?.name}
          <br /> Email: {createdUser?.email}
          <br /> Name: {createdUser?._id}
        </div>
      )}

      <h1>Login form</h1>
      <form onSubmit={loginHandler}>
        <input
          name="email"
          type="email"
          placeholder="Email here"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          name="password"
          type="password"
          placeholder="Password here"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          Loggedin user
          <br /> userID: {loggedUser?.userId}
          <br /> Token: {loggedUser?.token}
        </div>
      )}
    </div>
  );
};

export default Home;
