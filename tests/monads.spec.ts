import { pipe, Option, Either, Effect, String, ReadonlyArray } from 'effect'
import { expect, test, describe } from 'bun:test'
import { sep } from 'path'

import { User, EmptyObj, getPost, getComments } from '..'

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

  // Exercise 3
  test("Use `getPost` then pass the post's id to `getComments`.", async () => {
    // getCommentsFromPost :: number -> Effect<never,never,Comment[]>
    const getCommentsFromPost = (id: number) =>
      pipe(
        getPost(id),
        Effect.flatMap((post) => getComments(post.id))
      )

    const comments = await Effect.runPromise(getCommentsFromPost(13))
    expect(comments.map((x) => x.postId)).toEqual([13, 13])
    expect(comments.map((x) => x.body)).toEqual([
      'This book should be illegal',
      'Monads are like space burritos',
    ])
  })

  // Exercise 4
  test('Use `validateEmail`, `addToMailingList`, and `emailBlast` to implement `joinMailingList`.', () => {
    class InvalidEmail extends Error {
      readonly _tag = 'InvalidEmail'
    }

    //  addToMailingList :: Email -> Effect<never,never,Email[]>
    const addToMailingList = (email: string) => Effect.succeed([email])
    // emailBlast :: Email[] -> Effect<never,never,string>
    const emailBlast = (list: string[]) => Effect.succeed(`emailed: ${list.join(',')}`)
    // validateEmail :: Email -> Either<InvalidEmail,Email>
    const validateEmail = (x: string): Either.Either<InvalidEmail, string> =>
      x.match(/\S+@\S+\.\S+/) ? Either.right(x) : Either.left(new InvalidEmail())
    // joinMailingList :: Email -> Either<never,string,Effect<never,never,string>>
    const joinMailingList = (email: string) =>
      pipe(
        validateEmail(email),
        // type safe error catching!! 🚷
        Effect.catchTag('InvalidEmail', () => Effect.fail('invalid email')),
        Effect.match({
          onFailure: (error) => `Failure: ${error}`,
          onSuccess: (email) => pipe(email, addToMailingList, Effect.flatMap(emailBlast)),
        })
      )

    expect(Effect.runSync(joinMailingList('notanemail'))).toBe('Failure: invalid email')
    const program = Effect.runSync(joinMailingList('flaviocorpa@gmail.com'))
    if (typeof program !== 'string') {
      expect(Effect.runSync(program)).toBe('emailed: flaviocorpa@gmail.com')
    }
  })
})
