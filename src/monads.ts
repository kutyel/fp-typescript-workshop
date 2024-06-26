import { pipe, Option, Either, Effect, String, Array } from 'effect'
import { unify } from 'effect/Unify'
import { sep } from 'path'

import { User, EmptyObj, getPost, getComments } from '..'

// Exercise 1
// Use map/flatMap to safely get the street name when optionally given a user.
export const getStreetName = (user?: User | EmptyObj): Option.Option<string> =>
  pipe(
    Option.fromNullable(user),
    Option.flatMap((u) => Option.fromNullable(u.address)),
    Option.map((a) => a.street.name)
  )

// Exercise 2
// Use getFile to get the filename, remove the directory so it's just the file, then log it.
const getFile = Effect.succeed(import.meta.path)

// HINT: You can use maybe String.split and/or Array.last
export const logFilename = pipe(
  getFile,
  Effect.flatMap((x) => pipe(x, String.split(sep), Array.last))
)

// Exercise 3
// Use `getPost` then pass the post's id to `getComments`.
export const getCommentsFromPost = (id: number) =>
  pipe(
    getPost(id),
    Effect.flatMap((post) => getComments(post.id))
  )

// Exercise 4
// Use `validateEmail`, `addToMailingList`, and `emailBlast` to implement `joinMailingList`.
type Email = string
class InvalidEmail extends Error {
  readonly _tag = 'InvalidEmail'
}

// addToMailingList :: Email -> Effect<never,never,Email[]>
const addToMailingList = (email: Email) => Effect.succeed([email])
// emailBlast :: Email[] -> Effect<never,never,string>
const emailBlast = (list: Email[]) => Effect.succeed(`emailed: ${list.join(',')}`)
// validateEmail :: Email -> Either<InvalidEmail,Email>
const validateEmail = (x: Email) =>
  unify(x.match(/\S+@\S+\.\S+/) ? Either.right(x) : Either.left(new InvalidEmail()))

// HINT: Use `Effect.matchEffect` to avoid nested Effects.
// HINT: Use `Effect.catchTag` to catch the error.
// https://effect.website/docs/guides/error-management/expected-errors#catchtag
export const joinMailingList = (email: Email) =>
  pipe(
    validateEmail(email),
    Effect.catchTag('InvalidEmail', () => Effect.fail('invalid email')),
    Effect.matchEffect({
      onFailure: (error) => Effect.succeed(`Failure: ${error}`),
      onSuccess: (email) => pipe(email, addToMailingList, Effect.flatMap(emailBlast)),
    })
  )
