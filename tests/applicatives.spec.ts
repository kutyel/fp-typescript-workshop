import { Option, pipe, Number, Effect } from 'effect'
import { expect, test, describe } from 'bun:test'

import { getPost, getComments, Post, Comment } from '..'

describe('Applicatives', () => {
  // Exercise 1
  test('Write a function that adds two possibly null numbers together using `Option.ap`.', () => {
    // safeAdd :: Nullable<number> -> Nullable<number> -> Option<number>
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
  test('Now write a function that takes 2 Option parameters and adds them. Use `Option.zipWith`.', () => {
    // safeAdd :: Option<number> -> Option<number> -> Option<number>
    const safeAdd = (op1: Option.Option<number>, op2: Option.Option<number>) =>
      Option.zipWith(op1, op2, Number.sum)
    expect(safeAdd(Option.some(2), Option.some(3))).toEqual(Option.some(5))
    expect(safeAdd(Option.none(), Option.some(3))).toEqual(Option.none())
  })

  // Exercise 3
  test('Now write a function that takes 2 Option parameters and adds them. Use `Option.lift2`.', () => {
    // safeAdd :: Option<number> -> Option<number> -> Option<number>
    const safeAdd = Option.lift2(Number.sum)
    expect(safeAdd(Option.some(2), Option.some(3))).toEqual(Option.some(5))
    expect(safeAdd(Option.none(), Option.some(3))).toEqual(Option.none())
  })

  // Exercise 4
  test('Run both `getPost` and `getComments` then render the page with both.', async () => {
    const renderComments = (xs: Comment[]) =>
      xs.reduce((acc: string, c: Comment): string => `${acc}<li>${c.body}</li>`, '')
    const render = ([post, comments]: [Post, Comment[]]) =>
      `<div>${post.title}</div><ul>${renderComments(comments)}</ul>`

    // HINT: Effect.all
    // REMINDER: the postId is totally irrelevant for now
    // renderDOM :: Effect<never,never,string>
    const renderDOM = Effect.all([getPost(1), getComments(1)]).pipe(Effect.map(render))

    const html = await Effect.runPromise(renderDOM)
    expect(html).toBe(
      '<div>Love them futures</div><ul><li>This book should be illegal</li><li>Monads are like space burritos</li></ul>'
    )
  })

  // Exercise 5
  test('Write an Effect that gets both player1 and player2 from the cache and starts the game.', () => {
    const storage = new Map<string, string>([
      ['player1', 'toby'],
      ['player2', 'sally'],
    ])

    const getFromCache = (x: string): Effect.Effect<never, string, string> =>
      storage.has(x)
        ? Effect.succeed(storage.get(x) ?? 'Not found')
        : Effect.fail('Player not found')

    const game = ([p1, p2]: [string, string]): string => `${p1} vs ${p2}`

    // startGame :: Player -> Player -> Effect<never, never, string>
    const startGame = (p1: string, p2: string) =>
      pipe(
        Effect.all([getFromCache(p1), getFromCache(p2)]),
        Effect.map(game),
        Effect.match({
          onFailure: (error) => `Failure: ${error}`,
          onSuccess: (str) => `Game started: ${str}!`,
        })
      )

    expect(Effect.runSync(startGame('player1', 'player2'))).toBe('Game started: toby vs sally!')
    expect(Effect.runSync(startGame('player1', 'player3'))).toBe('Failure: Player not found')
  })
})
