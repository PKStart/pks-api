import { BaseEntity, IdObject, UUID } from './misc'

export interface PersonalData extends BaseEntity {
  userId: UUID
  name: string
  identifier: string
  expiry?: Date
}

export type CreatePersonalDataRequest = Omit<PersonalData, 'createdAt' | 'id' | 'userId'>
export type UpdatePersonalDataRequest = Omit<PersonalData, 'createdAt' | 'userId'>

export type PersonalDataIdResponse = IdObject
export type DeletePersonalDataRequest = IdObject
