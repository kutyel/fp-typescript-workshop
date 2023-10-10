import { Option, Either, Effect } from 'effect'
import { expect, test, describe } from 'bun:test'

import {
  safeAdd,
  safeAddWithZip,
  safeAddWithLift,
  renderDOM,
  renderAllDOM,
  renderGenDOM,
  startGame,
} from '../src/applicatives'

describe('Applicatives', () => {
  test('Write a function that adds two possibly null numbers together using `Option.ap`.', () => {
    expect(safeAdd(2, 3)).toEqual(Option.some(5))
    expect(safeAdd(null, 3)).toEqual(Option.none())
  })

  test('Now write a function that takes 2 Option parameters and adds them. Use `Option.zipWith`.', () => {
    expect(safeAddWithZip(Option.some(2), Option.some(3))).toEqual(Option.some(5))
    expect(safeAddWithZip(Option.none(), Option.some(3))).toEqual(Option.none())
  })

  test('Now write a function that takes 2 Option parameters and adds them. Use `Option.lift2`.', () => {
    expect(safeAddWithLift(Option.some(2), Option.some(3))).toEqual(Option.some(5))
    expect(safeAddWithLift(Option.none())(Option.some(3))).toEqual(Option.none()) // curried!
  })

  test('Run both `getPost` and `getComments` then render the page with both.', async () => {
    const html = await Effect.runPromise(renderDOM)
    expect(html).toBe(
      '<div>Love them futures</div><ul><li>This book should be illegal</li><li>Monads are like space burritos</li></ul>'
    )
  })

  test('Do the same thing as above but now render all posts using `Effect.all`.', async () => {
    const html = await Effect.runPromise(renderAllDOM)
    expect(html).toBe(
      '<div>Love them futures</div><ul><li>This book should be illegal</li><li>Monads are like space burritos</li></ul>'
    )
  })

  test('Do the same thing as above but now using generator syntax!', async () => {
    const html = await Effect.runPromise(renderGenDOM)
    expect(html).toBe(
      '<div>Love them futures</div><ul><li>This book should be illegal</li><li>Monads are like space burritos</li></ul>'
    )
  })

  test('Write an Effect that gets both player1 and player2 from the cache and starts the game.', () => {
    expect(Effect.runSync(startGame('player1', 'player2'))).toEqual(Either.right('toby vs sally'))
    expect(Effect.runSync(startGame('player1', 'player3'))).toEqual(Either.left('Player not found'))
  })
})
