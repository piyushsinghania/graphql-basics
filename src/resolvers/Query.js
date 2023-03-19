const Query = {
  me() {
    return {
      id: '12345',
      name: 'Piyush',
      email: 'piyush@example.com',
      age: 22,
    };
  },
  post() {
    return {
      id: 'abc123',
      title: 'Hello Graphql',
      body: 'This is a graphql course I am learning...',
      published: true,
    };
  },
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }
    return db.users.filter((user) => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }
    return db.posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(args.query.toLowerCase()) ||
        post.body.toLowerCase().includes(args.query.toLowerCase())
      );
    });
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  },
};

export default Query;
