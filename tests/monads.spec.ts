import { Option, pipe } from 'effect'
import { expect, test, describe } from 'bun:test'

import { User, EmptyObj } from '..'

describe('Monads', () => {
  // Exercise 1
  test('Use map/flatMap to safely get the street name when optionally given a user.', () => {
    const user: User = {
      id: 2,
      name: 'albert',
      address: {
        city: 'Oakland',
        street: {
          number: 22,
          name: 'Walnut St',
        },
      },
    }
    // getStreetName :: Nullable<User> -> Option<string>
    const getStreetName = (user?: User | EmptyObj) =>
      pipe(
        Option.fromNullable(user),
        Option.flatMap((u) => Option.fromNullable(u.address)),
        Option.map((a) => a.street.name)
      )
    expect(getStreetName()).toEqual(Option.none())
    expect(getStreetName({})).toEqual(Option.none())
    expect(getStreetName(user)).toEqual(Option.some('Walnut St'))
  })
})
