import { Note } from 'pks-common'

export const note1: Partial<Note> = {
  text: 'Hello World!',
  links: null,
  archived: false,
  pinned: false,
}

export const note2: Partial<Note> = {
  text: 'Hello Again!',
  links: [
    { name: 'Google', url: 'https://www.google.com' },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com?key=value&something{weirdMi%21soft}syntax.here',
    },
  ],
  archived: false,
  pinned: false,
}

export const note3: Partial<Note> = {
  text: null,
  links: [{ name: 'Just a link', url: 'https://www.p-kin.com' }],
  archived: false,
  pinned: false,
}

export const note4: Partial<Note> = {
  text: 'Hello There!',
  links: null,
  archived: false,
  pinned: false,
}
