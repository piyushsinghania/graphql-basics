import { GraphQLServer } from 'graphql-yoga';
import { v4 } from 'uuid';

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
    users(parent, args, { db }, info) {
      if (!args.query) {
        return db.users
      }
      return db.users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase())
      })
    },
    posts(parent, args, { db }, info) {
      if(!args.query) {
        return db.posts
      }
      return db.posts.filter((post) => {
        return (
          post.title.toLowerCase().includes(args.query.toLowerCase()) ||
          post.body.toLowerCase().includes(args.query.toLowerCase())
        )
      })
    },
    comments(parent, args, { db }, info) {
      return db.comments
    }
  },
  Mutation: {
    createUser(parent, args, { db }, info) {
      const emailTaken = db.users.some(user => user.email === args.data.email)
      if (emailTaken) {
        throw new Error('Email already registered.')
      }

      const user = {
        id: v4(),
        ...args.data
      }

      db.users.push(user)
      return user
    },
    deleteUser(parent, args, { db }, info) {
      const userIndex = db.users.findIndex(user => user.id === args.id)

      if(userIndex === -1) {
        throw new Error('User not found')
      }

      const deletedUsers = db.users.splice(userIndex, 1)

      // filter posts by the user      
      db.posts = db.posts.filter(post => {
        const match = post.author === args.id

        if(match) {
          db.comments = db.comments.filter(comment => comment.post !== post.id)
        }

        return !match
      })

      // filter comments by the user
      db.comments = db.comments.filter(comment => comment.author !== args.id)

      return deletedUsers[0];
    },
    createPost(parent, args, { db }, info) {
      const userExists = db.users.some(user => user.id === args.data.author)

      if(!userExists) {
        throw new Error("User not found")
      }

      const post = {
        id: v4(),
        ...args.data
      }

      db.posts.push(post)
      return post
    },
    deletePost(parent, args, { db }, info) {
      const postIndex = db.posts.findIndex(post => post.id === args.id)

      if(postIndex === -1) {
        throw new Error('Post not found')
      }

      // filter comments on the post
      db.comments = db.comments.filter(comment => comment.post !== args.id)

      // delete the post
      const deletedPosts = db.posts.splice(postIndex, 1);

      return deletedPosts[0]
    },
    createComment(parent, args, { db }, info) {
      // check for user
      const userExists = db.users.some(user => user.id === args.data.author)

      if(!userExists) {
        throw new Error("User not found")
      }

      // check for post
      const postExists = db.posts.some(post => post.id === args.data.post && post.published)

      if(!postExists) {
        throw new Error("Post not found")
      }

      const comment = {
        id: v4(),
        ...args.data
      }
      
      db.comments.push(comment);
      return comment;
    },
    deleteComment(parent, args, { db }, info) {
      const commentIndex = db.comments.findIndex(comment => comment.id === args.id)

      if(commentIndex === -1) {
        throw new Error("Comment not found")
      }

      const deletedComments = db.comments.splice(commentIndex, 1)
      return deletedComments[0]
    }
  },
  Post: {
    author(parent, args, { db }, info) {
      return db.users.find((user) => user.id === parent.author)
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter((comment) => comment.post === parent.id)
    }
  },
  User: {
    posts(parent, args, { db }, info) {
      return db.posts.filter((post) => post.author === parent.id)
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter((comment) => comment.author === parent.id)
    }
  },
  Comment: {
    author(parent, args, { db }, info) {
      return db.users.find((user) => user.id === parent.author)
    },
    post(parent, args, { db }, info) {
      return db.posts.find((post) => post.id === parent.post)
    }
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db
  }
});

server.start(() => {
  console.log('Servier is Up');
});
