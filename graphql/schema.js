const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type AuthData {
    token: String!
    userId: String!
}

type Post{
    _id: ID!
    title: String!
    content: String!
    image: String
    creator: User!
    createdAt: String!
    updatedAt: String!
}

type User{
    _id: ID!
    name: String!
    email: String!
    password: String
    status: String!
    posts: [Post!]!
}

input UserInputData{
    email: String!
    name: String!
    password: String!
}

type RootMutation{
    createUser(userInput: UserInputData) : User!
}

type RootQuery {
    login(email: String!, password: String!): AuthData!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
