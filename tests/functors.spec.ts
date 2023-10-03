import { Option, pipe, String, Predicate } from 'effect'
import { expect, test, describe } from 'bun:test'

interface User {
  readonly id: number
  readonly name: string
}

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
})
