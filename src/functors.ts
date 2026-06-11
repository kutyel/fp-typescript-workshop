import { pipe, Option, Result, String, Predicate, Effect } from 'effect'

import { TODO, User, getPost } from '..'

// Exercise 1
// Create a function that increments a value inside a functor (Option).
export const incrementF = (fa: Option.Option<number>): Option.Option<number> => TODO()

// Exercise 2
// Implement head to safely get the first element of a list.

// BONUS POINTS: Option.fromIterable
export const head = <A>(xs: ReadonlyArray<A>): Option.Option<A> => TODO()

// Exercise 3
// Use map/flatMap and String to return the first letter of the user's name.

// HINT: String.at(0)
export const initial = (user?: User): Option.Option<string> => TODO()

// Exercise 4
// Use Option to refactor `safeNum` without an if statement
// const safeNum = function(n) {
//   if (n) {
//     return Number(n)
//   }
// }
// BONUS POINTS: Option.liftPredicate
// MOAR BONUS POINTS: Predicate.not
export const safeNum = (n: string): Option.Option<number> => TODO()

// Exercise 5
// Write a function that will `getPost` then `String.toUpperCase` the post's title.
export const getPostThenUpper: Effect.Effect<Uppercase<string>, never, never> = Effect.sync(TODO)

// Exercise 6
// Write a function that uses `checkActive` to grant access or return the error.
const checkActive = (user: User): Result.Result<User, string> =>
  user.active ? Result.succeed(user) : Result.fail('Your account is not active')

// eitherWelcome :: User -> Result<string, string>
export const eitherWelcome = (user: User): Result.Result<string, string> => TODO()

// Exercise 7
// Write a validation function that checks for a length > 3.
export const validateName = (name: string): Result.Result<string, string> => TODO()

// Exercise 8
// Use `validateName` above and Result/Effect to `save` the user or return the error message.
const save = (name: string) => Effect.succeed({ name, id: 1 })

// HINT: Effect.match!
export const register = (name: string): Effect.Effect<string, never, never> => TODO()
