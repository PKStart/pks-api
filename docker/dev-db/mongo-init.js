db.createUser({
  user: 'pkstartdev',
  pwd: 'pkstartdev',
  roles: [
    {
      role: 'readWrite',
      db: 'pkstartdev',
    },
  ],
})

db = db.getSiblingDB('pkstartdev')

db.createCollection('init')

db.getCollection('init').insertOne({ initialized: new Date() })

db.createCollection('users')

db.getCollection('users').insertOne({
  id: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
  createdAt: new Date(),
  email: 'test@test.com',
  name: 'testuser',
  loginCode: '$2b$10$RnNHkTXygMXChtKP0feIt.dl4r0ZAGHrZo193qGtGJ3edeGgE3OQm', // 509950
  loginCodeExpires: new Date(2147483647000),
  salt: '$2b$10$RnNHkTXygMXChtKP0feIt.',
})

db.createCollection('notes')

db.getCollection('notes').insertMany([
  {
    id: '5f53f1fa-87b6-4511-8bbc-e1b0ed4c4a4e',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    text: 'This is the latest note with links',
    archived: false,
    pinned: false,
    links: [
      { name: 'Google', url: 'https://www.google.com' },
      { name: 'Facebook', url: 'https://www.facebook.com' },
    ],
  },
  {
    id: 'b3b332e0-56fa-4302-9fee-54ee17a1df56',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(1626173700000),
    text: null,
    archived: false,
    pinned: false,
    links: [{ name: 'Only a link', url: 'https://www.angular.io' }],
  },
  {
    id: 'e07e7e53-23e0-43de-a998-94bdc0691781',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(1623217380000),
    text: 'This is a pinned note \nIt should have line breaks \nMore than one',
    archived: false,
    pinned: true,
    links: null,
  },
  {
    id: 'a6c488d9-25c6-4f74-98d3-659b138a0426',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(1622741100000),
    text: 'This is an archived note',
    archived: true,
    pinned: false,
    links: null,
  },
])
