// Dummy data
const users = [
  {
    id: '1',
    name: 'piyush',
    email: 'piyush@example.com',
    age: 22,
  },
  {
    id: '2',
    name: 'siddharth',
    email: 'siddharth@example.com',
    age: 22,
  },
  {
    id: '3',
    name: 'abhishek',
    email: 'abhishek@example.com',
    age: 23,
  },
];

const posts = [
  {
    id: '10',
    title: 'GraphQL 101',
    body: 'learning graphql with Andrew',
    published: true,
    author: '1',
  },
  {
    id: '20',
    title: 'Modern React',
    body: 'learning react with net ninja',
    published: true,
    author: '1',
  },
  {
    id: '30',
    title: 'Ruby on Rails',
    body: 'learning ruby on rails with mashrur',
    published: false,
    author: '3',
  },
];

const comments = [
  {
    id: '101',
    text: 'This graphql material is very useful',
    author: '1',
    post: '10',
  },
  {
    id: '102',
    text: 'I like the challenges andrew provides',
    author: '1',
    post: '10',
  },
  {
    id: '103',
    text: 'Challenges feel natural and are great way to learn',
    author: '2',
    post: '20',
  },
  {
    id: '104',
    text: 'Will try sarahs music someday',
    author: '3',
    post: '30',
  },
];

const db = {
  users,
  posts,
  comments,
};

export default db;
