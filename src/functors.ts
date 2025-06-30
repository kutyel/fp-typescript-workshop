import { pipe, Option, Either, String, Predicate, Effect } from 'effect'

import { User, getPost } from '..'

// Exercise 1
// Create a function that increments a value inside a functor (Option).
export const incrementF = Option.map((n: number) => n + 1)

// Exercise 2
// Implement head to safely get the first element of a list.

// BONUS POINTS: Option.fromIterable
export const head = <A>(xs: ReadonlyArray<A>): Option.Option<A> =>
  xs.length > 0 ? Option.some(xs[0]) : Option.none()

// Exercise 3
// Use map/flatMap and String to return the first letter of the user's name.

// HINT: String.at(0) :: string -> Option<string>
export const initial = (user?: User) =>
  pipe(
    Option.fromNullable(user),
    Option.map((user) => user.name),
    Option.flatMap(String.at(0))
  )

// Exercise 4
// Use Option to refactor `safeNum` without an if statement
// const safeNum = function(n) {
//   if (n) {
//     return Number(n)
//   }
// }
// BONUS POINTS: Option.liftPredicate
// MOAR BONUS POINTS: Predicate.not
export const safeNum = (n: string): Option.Option<number> =>
  pipe(Number(n), Option.liftPredicate(Predicate.not(isNaN)))

// Exercise 5
// Write a function that will `getPost` then `String.toUpperCase` the post's title.
export const getPostThenUpper: Effect.Effect<Uppercase<string>, never, never> = getPost(1).pipe(
  Effect.map((x) => x.title),
  Effect.map(String.toUpperCase)
)

// Exercise 6
// Write a function that uses `checkActive` to grant access or return the error.
const checkActive = (user: User): Either.Either<User, string> =>
  user.active ? Either.right(user) : Either.left('Your account is not active')

// eitherWelcome :: User -> Either<string, string>
export const eitherWelcome = (user: User) =>
  pipe(
    checkActive(user),
    Either.map((x) => x.name),
    Either.map((x) => `Welcome ${x}`)
  )

// Exercise 7
// Write a validation function that checks for a length > 3.
export const validateName = (name: string): Either.Either<string, string> =>
  name.length > 3 ? Either.right(name) : Either.left('You need > 3')

// Exercise 8
// Use `validateName` above and Either/Effect to `save` the user or return the error message.
const save = (name: string) => Effect.succeed({ name, id: 1 })

// HINT: Effect.match!
export const register = (name: string) =>
  pipe(
    validateName(name),
    Effect.flatMap(save), // Either is a subtype of Effect! 😎
    Effect.match({
      onFailure: (error) => `Failure: ${error}`,
      onSuccess: (user) => `Success: ${user.name} saved!`,
    })
  )
