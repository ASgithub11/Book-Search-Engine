const typeDefs = `
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]!
    }

    type Book {
        _id: ID
        bookId: String
        authors: [String]!
        description: String
        title: String
        image: String
        link: String
    }

    input UserInput {
        username: String!
        email: String!
        password: String!
    }

    input BookInput {
        bookId: String
        authors: [String]!
        description: String
        title: String
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        users: [User]
        user(username: String!): User
        me: User
    }

    type Mutation {
        addUser(input: UserInput!): Auth
        login(email: String!, password: String!): Auth
        saveBook(input: BookInput!): User
        deleteBook(bookId: String!): User
    }
`;

export default typeDefs;
