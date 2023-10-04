import { Option, pipe, Number, Effect } from 'effect'
import { expect, test, describe } from 'bun:test'

import { getPost, getComments, Post } from '..'

describe('Applicatives', () => {
  // Exercise 1
  test('Write a function that adds two possibly null numbers together using Option.ap.', () => {
    // safeAdd :: Option<number> -> Option<number> -> Option<number>
    const safeAdd = (x: number | null, y: number | null) =>
      pipe(
        // We need to force TypeScript here to pick the curried version of Number.sum 🤓
        Option.some<(a: number) => (b: number) => number>(Number.sum),
        Option.ap(Option.fromNullable(x)),
        Option.ap(Option.fromNullable(y))
      )
    expect(safeAdd(2, 3)).toEqual(Option.some(5))
    expect(safeAdd(null, 3)).toEqual(Option.none())
  })

  // Exercise 2
  test("Now write a function that takes 2 Maybe's and adds them. Use Option.lift2 instead of Option.ap.", () => {
    // safeAdd :: Option<number> -> Option<number> -> Option<number>
    const safeAdd = Option.lift2(Number.sum)
    expect(safeAdd(Option.some(2), Option.some(3))).toEqual(Option.some(5))
    expect(safeAdd(Option.none(), Option.some(3))).toEqual(Option.none())
  })

  // Exercise 3
  test.skip('Run both `getPost` and `getComments` then render the page with both.', async () => {
    const makeComments = (xs: string[]) =>
      xs.reduce((acc: string, c: string): string => `${acc}<li>${c}</li>`, '')
    const render =
      ({ title }: Post) =>
      (cs: string[]) =>
        `<div>${title}</div><ul>${makeComments(cs)}</ul>`
    // renderDOM :: Effect<never,never,HTML>
    const renderDOM = pipe(Option.lift2(render), getPost(2), getComments(2))
    const html = await Effect.runPromise(renderDOM)
    expect(html).toBe(
      '<div>Love them futures</div><ul><li>This book should be illegal</li><li>Monads are like space burritos</li></ul>'
    )
  })
})
