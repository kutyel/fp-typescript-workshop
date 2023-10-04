import { Option, pipe, Number } from 'effect'
import { expect, test, describe } from 'bun:test'

describe('Applicatives', () => {
  // Exercise 1
  test.skip('Write a function that adds two possibly null numbers together using Option.ap.', () => {
    // safeAdd :: Option<number> -> Option<number> -> Option<number>
    const safeAdd = (x: number | null, y: number | null) =>
      pipe(
        Option.some(Number.sum),
        Option.ap(Option.fromNullable(x)), // This errors out 😩
        Option.ap(Option.fromNullable(y))
      )
    expect(safeAdd(2, 3)).toEqual(Option.some(5))
    expect(safeAdd(null, 3)).toEqual(Option.some(3))
  })

  // Exercise 2
  test("Now write a function that takes 2 Maybe's and adds them. Use Option.lift2 instead of Option.ap.", () => {
    // safeAdd :: Option<number> -> Option<number> -> Option<number>
    const safeAdd = Option.lift2(Number.sum)
    expect(safeAdd(Option.some(2), Option.some(3))).toEqual(Option.some(5))
    expect(safeAdd(Option.none(), Option.some(3))).toEqual(Option.none())
  })
})
