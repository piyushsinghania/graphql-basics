import { GraphQLServer } from 'graphql-yoga';
import { v4 } from 'uuid';

// Dummy data
let users = [
  {
    id: '1',
    name: 'piyush',
    email: 'piyush@example.com',
    age: 22
  },
  {
    id: '2',
    name: 'siddharth',
    email: 'siddharth@example.com',
    age: 22
  },
  {
    id: '3',
    name: 'abhishek',
    email: 'abhishek@example.com',
    age: 23
  },
]

let posts = [
  {
    id: '10',
    title: 'GraphQL 101',
    body: 'learning graphql with Andrew',
    published: true,
    author: '1'
  },
  {
    id: '20',
    title: 'Modern React',
    body: 'learning react with net ninja',
    published: true,
    author: '1'
  },
  {
    id: '30',
    title: 'Ruby on Rails',
    body: 'learning ruby on rails with mashrur',
    published: false,
    author: '3'
  },
]

let comments = [
  {
    id: '101',
    text: 'This graphql material is very useful',
    author: '1',
    post: '10'
  },
  {
    id: '102',
    text: 'I like the challenges andrew provides',
    author: '1',
    post: '10'
  },
  {
    id: '103',
    text: 'Challenges feel natural and are great way to learn',
    author: '2',
    post: '20'
  },
  {
    id: '104',
    text: 'Will try sarahs music someday',
    author: '3',
    post: '30'
  }
]

// Scalar Types - String, Boolean, Int, Float, ID

// Type Definations (schema)
const typeDefs = `
  type Query {
    me: User!
    post: Post!
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
  }

  type Mutation {
    createUser(data: CreateUserInput!): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput!): Post!
    deletePost(id: ID!): Post!
    createComment(data: CreateCommentInput!): Comment!
    deleteComment(id: ID!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users
      }
      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase())
      })
    },
    posts(parent, args, ctx, info) {
      if(!args.query) {
        return posts
      }
      return posts.filter((post) => {
        return (
          post.title.toLowerCase().includes(args.query.toLowerCase()) ||
          post.body.toLowerCase().includes(args.query.toLowerCase())
        )
      })
    },
    comments(parent, args, ctx, info) {
      return comments
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => user.email === args.data.email)
      if (emailTaken) {
        throw new Error('Email already registered.')
      }

      const user = {
        id: v4(),
        ...args.data
      }

      users.push(user)
      return user
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex(user => user.id === args.id)

      if(userIndex === -1) {
        throw new Error('User not found')
      }

      const deletedUsers = users.splice(userIndex, 1)

      // filter posts by the user
      const filteredPosts = posts
        .filter(post => post.author === args.id)
        .map(post => post.id)
      
      posts = posts.filter(post => {
        const match = post.author === args.id

        if(match) {
          comments = comments.filter(comment => comment.post !== post.id)
        }

        return !match
      })

      // filter comments by the user
      comments = comments.filter(comment => comment.author !== args.id)

      return deletedUsers[0];
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author)
      if(!userExists) {
        throw new Error("User not found")
      }

      const post = {
        id: v4(),
        ...args.data
      }

      posts.push(post)
      return post
    },
    deletePost(parent, args, info, ctx) {
      const postIndex = posts.findIndex(post => post.id === args.id)

      if(postIndex === -1) {
        throw new Error('Post not found')
      }

      // filter comments on the post
      comments = comments.filter(comment => comment.post !== args.id)

      // delete the post
      const deletedPosts = posts.splice(postIndex, 1);

      return deletedPosts[0]
    },
    createComment(parent, args, ctx, info) {
      // check for user
      const userExists = users.some(user => user.id === args.data.author)
      if(!userExists) {
        throw new Error("User not found")
      }

      // check for post
      const postExists = posts.some(post => post.id === args.data.post && post.published)
      if(!postExists) {
        throw new Error("Post not found")
      }

      const comment = {
        id: v4(),
        ...args.data
      }
      comments.push(comment);
      return comment;
    },
    deleteComment(parent, args, ctx, info) {
      const commentIndex = comments.findIndex(comment => comment.id === args.id)

      if(commentIndex === -1) {
        throw new Error("Comment not found")
      }

      const deletedComments = comments.splice(commentIndex, 1)
      return deletedComments[0]
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author)
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.post === parent.id)
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => post.author === parent.id)
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.author === parent.id)
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author)
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => post.id === parent.post)
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('Servier is Up');
});
