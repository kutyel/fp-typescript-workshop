import { Option, Effect } from 'effect'
import { expect, test, describe } from 'bun:test'

import { User } from '..'
import { getStreetName, logFilename, getCommentsFromPost, joinMailingList } from '../src/monads'

describe('Monads', () => {
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
    expect(getStreetName()).toEqual(Option.none())
    expect(getStreetName({})).toEqual(Option.none())
    expect(getStreetName(user)).toEqual(Option.some('Walnut St'))
  })

  test("Use getFile to get the filename, remove the directory so it's just the file, then log it.", async () => {
    const result = await Effect.runSync(logFilename)
    expect(result).toBe('monads.ts')
  })

  test("Use `getPost` then pass the post's id to `getComments`.", async () => {
    const comments = await Effect.runPromise(getCommentsFromPost(13))
    expect(comments.map((x) => x.postId)).toEqual([13, 13])
    expect(comments.map((x) => x.body)).toEqual([
      'This book should be illegal',
      'Monads are like space burritos',
    ])
  })

  test('Use `validateEmail`, `addToMailingList`, and `emailBlast` to implement `joinMailingList`.', () => {
    expect(Effect.runSync(joinMailingList('notanemail'))).toBe('Failure: invalid email')
    expect(Effect.runSync(joinMailingList('flaviocorpa@gmail.com'))).toBe(
      'emailed: flaviocorpa@gmail.com'
    )
  })
})
