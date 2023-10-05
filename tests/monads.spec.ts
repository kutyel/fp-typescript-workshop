import { Option, pipe, Effect, String, ReadonlyArray } from 'effect'
import { expect, test, describe } from 'bun:test'
import { sep } from 'path'

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

  // Exercise 2
  test("Use getFile to get the filename, remove the directory so it's just the file, then log it.", async () => {
    // getFile :: Effect<never,never,string>
    const getFile = Effect.succeed(import.meta.path)
    // HINT: String.split, ReadonlyArray.last
    // logFilename :: Effect<never,NoSuchElementException,string>
    const logFilename = pipe(
      getFile,
      Effect.flatMap((x) => pipe(x, String.split(sep), ReadonlyArray.last))
    )

    const result = await Effect.runSync(logFilename)
    expect(result).toBe('monads.spec.ts')
  })
})
