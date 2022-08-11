export function omitObjectId<T extends { _id: string }>(item: T): any {
  const omitted = { ...item }
  delete omitted._id
  return omitted
}
