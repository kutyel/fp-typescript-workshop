import { pipe, Option, Result, Effect, String, Array } from 'effect'
import { sep } from 'path'

import { TODO, User, EmptyObj, getPost, getComments, Comment } from '..'

// Exercise 1
// Use map/flatMap to safely get the street name when optionally given a user.
export const getStreetName = (user?: User | EmptyObj): Option.Option<string> => TODO()

// Exercise 2
// Use getFile to get the filename, remove the directory so it's just the file, then log it.
const getFile = Effect.succeed(import.meta.path)

// HINT: You can use maybe String.split and/or Array.last
export const logFilename: Effect.Effect<string, never, never> = Effect.sync(TODO)

// Exercise 3
// Use `getPost` then pass the post's id to `getComments`.
export const getCommentsFromPost = (id: number): Effect.Effect<Comment[], never, never> => TODO()

// Exercise 4
// Use `validateEmail`, `addToMailingList`, and `emailBlast` to implement `joinMailingList`.
type Email = string
class InvalidEmail extends Error {
  readonly _tag = 'InvalidEmail'
}

const addToMailingList = (email: Email): Effect.Effect<Email[], never, never> =>
  Effect.succeed([email])
const emailBlast = (list: Email[]): Effect.Effect<string, never, never> =>
  Effect.succeed(`emailed: ${list.join(',')}`)
const validateEmail = (x: Email): Result.Result<Email, InvalidEmail> =>
  x.match(/\S+@\S+\.\S+/) ? Result.succeed(x) : Result.fail(new InvalidEmail())

// HINT: Use `Effect.matchEffect` to avoid nested Effects.
// HINT: Use `Effect.catchTag` to catch the error.
// https://effect.website/docs/guides/error-management/expected-errors#catchtag
export const joinMailingList = (email: Email): Effect.Effect<string, never, never> => TODO()
