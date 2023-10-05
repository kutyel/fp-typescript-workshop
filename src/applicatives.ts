import { pipe, Option, Number, Effect } from 'effect'

import { getPost, getComments, Post, Comment } from '..'

// Exercise 1
// Write a function that adds two possibly null numbers together using `Option.ap`.
export const safeAdd = (x: number | null, y: number | null): Option.Option<number> =>
  pipe(
    // We need to force TypeScript here to pick the curried version of Number.sum 🤓
    Option.some<(a: number) => (b: number) => number>(Number.sum),
    Option.ap(Option.fromNullable(x)),
    Option.ap(Option.fromNullable(y))
  )

// Exercise 2
// Now write a function that takes 2 Option parameters and adds them. Use `Option.zipWith`.
export const safeAddWithZip = (
  op1: Option.Option<number>,
  op2: Option.Option<number>
): Option.Option<number> => Option.zipWith(op1, op2, Number.sum)

// Exercise 3
// Now write a function that takes 2 Option parameters and adds them. Use `Option.lift2`.
// safeAdd :: Option<number> -> Option<number> -> Option<number>
export const safeAddWithLift = Option.lift2(Number.sum)

// Exercise 4
// Run both `getPost` and `getComments` then render the page with both.
const renderComments = (xs: Comment[]) =>
  xs.reduce((acc: string, c: Comment): string => `${acc}<li>${c.body}</li>`, '')
const render = ([post, comments]: [Post, Comment[]]) =>
  `<div>${post.title}</div><ul>${renderComments(comments)}</ul>`

// HINT: Effect.all
// REMINDER: the postId is totally irrelevant
export const renderDOM: Effect.Effect<never, never, string> = Effect.all([
  getPost(1),
  getComments(1),
]).pipe(Effect.map(render))

// Exercise 5
// Write an Effect that gets both player1 and player2 from the cache and starts the game.
const storage = new Map<string, string>([
  ['player1', 'toby'],
  ['player2', 'sally'],
])
const getFromCache = (x: string): Effect.Effect<never, string, string> =>
  storage.has(x) ? Effect.succeed(storage.get(x) ?? 'Not found') : Effect.fail('Player not found')
const game = ([p1, p2]: [string, string]): string => `${p1} vs ${p2}`

export const startGame = (p1: string, p2: string): Effect.Effect<never, never, string> =>
  pipe(
    Effect.all([getFromCache(p1), getFromCache(p2)]),
    Effect.map(game),
    Effect.match({
      onFailure: (error) => `Failure: ${error}`,
      onSuccess: (str) => `Game started: ${str}!`,
    })
  )
