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
  email: 'main@test.com',
  name: 'testuser',
  loginCode: '$2b$10$RnNHkTXygMXChtKP0feIt.dl4r0ZAGHrZo193qGtGJ3edeGgE3OQm', // 509950
  loginCodeExpires: new Date(2147483647000),
  salt: '$2b$10$RnNHkTXygMXChtKP0feIt.',
  settings: {
    weatherApiKey: null,
    locationApiKey: null,
    shortcutIconBaseUrl: 'https://stuff.p-kin.com/start-tile-icons/',
    birthdaysUrl: null,
    koreanUrl: null,
    stravaClientId: null,
    stravaClientSecret: null,
    stravaRedirectUri: null,
  },
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

db.createCollection('shortcuts')

db.getCollection('shortcuts').insertMany([
  {
    id: '7c944ee3-01bd-48d1-920a-c83d7444fcbf',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    category: 'TOP',
    url: 'https://wolt.com/hu/',
    iconUrl: 'wolt.png',
    name: 'Wolt',
    priority: 2,
  },
  {
    id: '4a018e25-06a1-4ce3-8736-1e0264dff758',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    iconUrl: 'revolut.png',
    priority: 1,
    url: 'https://app.revolut.com/start',
    category: 'TOP',
    name: 'Revolut',
  },
  {
    id: 'fe1d0670-6e4c-4b7e-9fd6-271635e7d47b',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    url: 'https://stackoverflow.com/',
    name: 'StackOverflow',
    category: 'CODING',
    priority: 1,
    iconUrl: 'stacko.png',
  },
  {
    id: '37cc25df-92ba-464d-9d4e-d591e78a59be',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    iconUrl: 'devto.png',
    url: 'https://dev.to/',
    category: 'CODING',
    priority: 4,
    name: 'Dev.to',
  },
  {
    id: 'f1bf666c-a0ec-4f6a-9d3a-ad4c79390bcf',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    name: 'Keep',
    url: 'https://keep.google.com/',
    category: 'GOOGLE',
    priority: 7,
    iconUrl: 'gkeep.png',
  },
  {
    id: '35384344-d1f2-4635-a195-53d6ef9647c4',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    category: 'GOOGLE',
    priority: 2,
    iconUrl: 'gdocs.png',
    name: 'Docs',
    url: 'https://docs.google.com/',
  },
  {
    id: 'cf1c0ef2-17ec-44c6-98b6-fbe2c008058e',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    priority: 1,
    name: 'Netflix',
    url: 'https://www.netflix.com/',
    category: 'FUN',
    iconUrl: 'netflix.png',
  },
  {
    id: '89622cd0-5604-482f-ae35-9f3c6b86f02f',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    priority: 1,
    url: 'https://www.facebook.com/',
    category: 'FUN',
    name: 'Facebook',
    iconUrl: 'facebook.png',
  },
  {
    id: '190496e7-2a6f-45e7-b703-5b5fad2d71fa',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    name: 'YahooMail',
    category: 'OTHERS',
    url: 'https://mail.yahoo.com/',
    iconUrl: 'yahoomail.png',
    priority: 5,
  },
  {
    id: '11df7bba-81a9-471f-9652-1ca1376fc302',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    category: 'OTHERS',
    priority: 2,
    iconUrl: 'flickr.png',
    url: 'https://www.flickr.com/',
    name: 'Flickr',
  },
  {
    id: '02dc5644-561c-41ce-84bf-0f44f813f2d2',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    priority: 1,
    iconUrl: 'gcloud.png',
    url: 'https://console.cloud.google.com',
    category: 'GOOGLE',
    name: 'Cloud Console',
  },
])

db.createCollection('personal-data')

db.getCollection('personal-data').insertMany([
  {
    id: 'a11607ae-73b8-4854-9b38-0439876e0770',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    name: 'ID card',
    identifier: '123456HE',
    expiry: '2026-09-16',
  },
  {
    id: '8b81f8be-cb15-4d4d-97cb-bb1f26273404',
    userId: 'a06ef9a2-d1ff-417d-bce7-75188a6118c1',
    createdAt: new Date(),
    name: 'Address card',
    identifier: '654321YL',
    expiry: null,
  },
])
