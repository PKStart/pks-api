import { PersonalData } from 'pks-common'

export const data1: Partial<PersonalData> = {
  name: 'ID Card',
  identifier: 'BA3322112',
  expiry: new Date('2022.09.23'),
}

export const data2: Partial<PersonalData> = {
  name: 'Public insurance',
  identifier: '123 332 122',
}

export const data3: Partial<PersonalData> = {
  name: 'ID Card',
  identifier: 'BC2112543',
  expiry: new Date('2024.11.12'),
}
