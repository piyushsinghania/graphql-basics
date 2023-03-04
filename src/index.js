import { GraphQLServer } from 'graphql-yoga';

// Scalar Types - String, Boolean, Int, Float, ID

// Type Definations (schema)
const typeDefs = `
  type Query {
    me: User!
    post: Post!
    greeting(name: String): String!
    add(numbers: [Float!]!): Float!
    grades: [Int!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    me() {
      return {
        id: '12345',
        name: 'Piyush',
        email: 'piyush@example.com',
        age: 22
      }
    },
    post() {
      return {
        id: 'abc123',
        title: 'Hello Graphql',
        body: 'This is a graphql course I am learning...',
        published: true
      }
    },
    greeting(parent, args, ctx, info) {
      if (args.name) {
        return `Hello, ${args.name}!`
      }
      return `Hello!`
    },
    add(parent, args, ctx, info) {
      if(args.numbers.length === 0) {
        return 0
      }
      return args.numbers.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
      })
    },
    grades(parent, args, ctx, info) {
      return [85, 95, 90]
    }
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('Servier is Up');
});
