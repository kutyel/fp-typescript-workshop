import { Option, Result, Effect } from 'effect'
import { expect, test, describe } from 'bun:test'

import { User } from '..'
import {
  incrementF,
  head,
  initial,
  safeNum,
  getPostThenUpper,
  eitherWelcome,
  validateName,
  register,
} from '../src/functors'

describe('Functors', () => {
  test('Create a function that increments a value inside a functor (Option).', () => {
    expect(incrementF(Option.some(1))).toEqual(Option.some(2))
    expect(incrementF(Option.none())).toEqual(Option.none())
  })

  test('Implement head to safely get the first element of a list.', () => {
    const xs = ['do', 'ray', 'me', 'fa', 'so', 'la', 'si', 'do']
    expect(head(xs)).toEqual(Option.some('do'))
    expect(head([])).toEqual(Option.none())
  })

  test(`Use map/flatMap and String to return the first letter of the user's name.`, () => {
    const user: User = { id: 2, name: 'Albert' }
    expect(initial(user)).toEqual(Option.some('A'))
    expect(initial()).toEqual(Option.none())
  })

  test('Use Option to refactor `safeNum` without an if statement.', () => {
    expect(safeNum('4')).toEqual(Option.some(4))
    expect(safeNum('foo')).toEqual(Option.none())
  })

  test("Write a function that will `getPost` then `String.toUpperCase` the post's title.", async () => {
    const title = await Effect.runPromise(getPostThenUpper)
    expect(title).toBe('LOVE THEM FUTURES')
  })

  test('Write a function that uses `checkActive` to grant access or return the error.', () => {
    expect(eitherWelcome({ id: 1, name: 'Flavio', active: true })).toEqual(
      Result.succeed('Welcome Flavio')
    )
    expect(eitherWelcome({ id: 2, name: 'Yannick', active: false })).toEqual(
      Result.fail('Your account is not active')
    )
  })

  test('Write a validation function that checks for a length > 3.', () => {
    expect(validateName('hello')).toEqual(Result.succeed('hello'))
    expect(validateName('fla')).toEqual(Result.fail('You need > 3'))
  })

  test('Use `validateName` above and Either/Effect to save the user or return the error message.', () => {
    expect(Effect.runSync(register('flavio'))).toBe(`Success: flavio saved!`)
    expect(Effect.runSync(register('foo'))).toBe(`Failure: You need > 3`)
  })
})
