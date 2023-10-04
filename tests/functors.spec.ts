import { Option, Either, pipe, String, Predicate, Effect } from 'effect'
import { expect, test, describe } from 'bun:test'

import { User, getPost } from '..'

describe('Functors', () => {
  // Exercise 1
  test('Create a function that increments a value inside a functor (Option).', () => {
    const incrementF = Option.map((n: number) => n + 1)
    expect(incrementF(Option.some(1))).toEqual(Option.some(2))
    expect(incrementF(Option.none())).toEqual(Option.none())
  })

  // Exercise 2
  test('Implement head to safely get the first element of a list.', () => {
    // BONUS POINTS: Option.fromIterable
    const head = <A>(xs: ReadonlyArray<A>): Option.Option<A> =>
      xs.length > 0 ? Option.some(xs[0]) : Option.none()
    const xs = ['do', 'ray', 'me', 'fa', 'so', 'la', 'si', 'do']
    expect(head(xs)).toEqual(Option.some('do'))
    expect(head([])).toEqual(Option.none())
  })

  // Exercise 3
  test(`Use map/flatMap and String to return the first letter of the user's name.`, () => {
    const user: User = { id: 2, name: 'Albert' }
    // HINT: String.at(0) :: string -> Option<string>
    const initial = (user?: User) =>
      pipe(
        Option.fromNullable(user),
        Option.map((user) => user.name),
        Option.flatMap(String.at(0))
      )
    expect(initial(user)).toEqual(Option.some('A'))
    expect(initial()).toEqual(Option.none())
  })

  // Exercise 4
  test('Use Option to refactor `safeNum` without an if statement.', () => {
    // const safeNum = function(n) {
    //   if (n) {
    //     return Number(n)
    //   }
    // }
    // BONUS POINTS: Option.liftPredicate
    // MOAR BONUS POINTS: Predicate.not
    // safeNum :: string -> Option<number>
    const safeNum = (n: string) => pipe(n, Number, Option.liftPredicate(Predicate.not(isNaN)))
    expect(safeNum('4')).toEqual(Option.some(4))
    expect(safeNum('foo')).toEqual(Option.none())
  })

  // Exercise 5
  test("Write a function that will `getPost` then `String.toUpperCase` the post's title.", async () => {
    // getPost :: number -> Effect<never, never, Post>
    // getPostThenUpper :: Effect<never, never, Uppercase<string>>
    const getPostThenUpper = getPost(1).pipe(
      Effect.map((x) => x.title),
      Effect.map(String.toUpperCase)
    )
    const title = await Effect.runPromise(getPostThenUpper)
    expect(title).toBe('LOVE THEM FUTURES')
  })

  // Exercise 6
  test('Write a function that uses `checkActive` to grant access or return the error.', () => {
    const checkActive = (user: User): Either.Either<string, User> =>
      user.active ? Either.right(user) : Either.left('Your account is not active')
    // eitherWelcome :: User -> Either<string, string>
    const eitherWelcome = (user: User) =>
      pipe(
        user,
        checkActive,
        Either.map((x) => x.name),
        Either.map((x) => `Welcome ${x}`)
      )
    expect(eitherWelcome({ id: 1, name: 'Flavio', active: true })).toEqual(
      Either.right('Welcome Flavio')
    )
    expect(eitherWelcome({ id: 2, name: 'Yannick', active: false })).toEqual(
      Either.left('Your account is not active')
    )
  })

  // Exercise 7
  test('Write a validation function that checks for a length > 3.', () => {
    // validateName :: string -> Either<string, string>
    const validateName = (name: string): Either.Either<string, string> =>
      pipe(name, (x) => (x.length > 3 ? Either.right(name) : Either.left('You need > 3')))
    expect(validateName('hello')).toEqual(Either.right('hello'))
    expect(validateName('fla')).toEqual(Either.left('You need > 3'))
  })

  // Exercise 8
  test('Use `validateName` above and Either/Effect to save the user or return the error message.', () => {
    // save :: string -> Effect<never, never, User>
    const save = (name: string) => Effect.succeed({ name, id: 1 } as User)
    const validateName = (name: string): Either.Either<string, string> =>
      pipe(name, (x) => (x.length > 3 ? Either.right(name) : Either.left('You need > 3')))

    // HINT: Effect.match!
    // register :: string -> Effect<never, never, string>
    const register = (name: string) =>
      pipe(
        name,
        validateName,
        Effect.flatMap(save), // Either is a subtype of Effect! 😎
        Effect.match({
          onFailure: (error) => `Failure: ${error}`,
          onSuccess: (user) => `Success: ${user.name} saved!`,
        })
      )

    expect(Effect.runSync(register('flavio'))).toBe(`Success: flavio saved!`)
    expect(Effect.runSync(register('foo'))).toBe(`Failure: You need > 3`)
  })
})
