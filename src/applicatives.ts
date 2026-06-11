import { pipe, Option, Number, Result, Effect } from 'effect'

import { TODO, getPost, getComments, Post, Comment } from '..'

// Exercise 1
// Write a function that adds two possibly null numbers together using `Option.zipWith`.
export const safeAdd = (x: number | null, y: number | null): Option.Option<number> => TODO()

// Exercise 2
// Now write a function that takes 2 Option parameters and adds them. Use `Option.zipWith`.
export const safeAddWithZip = (
  op1: Option.Option<number>,
  op2: Option.Option<number>,
): Option.Option<number> => TODO()

// Exercise 3
// Now write a function that takes 2 Option parameters and adds them. Use `Option.lift2`.
// safeAdd :: Option<number> -> Option<number> -> Option<number>
export const safeAddWithLift: {
  (op1: Option.Option<number>, op2: Option.Option<number>): Option.Option<number>
  (op1: Option.Option<number>): (op2: Option.Option<number>) => Option.Option<number>
} = TODO

// Exercise 4
// Run both `getPost` and `getComments` then render the page with both.
const renderComments = (xs: Comment[]) =>
  xs.reduce((acc: string, c: Comment): string => `${acc}<li>${c.body}</li>`, '')

const render = (post: Post, comments: Comment[]) =>
  `<div>${post.title}</div><ul>${renderComments(comments)}</ul>`

// REMINDER: the postId is totally irrelevant
export const renderDOM: Effect.Effect<string, never, never> = Effect.sync(TODO)

// Exercise 5
// Do the same thing as above but now render all posts using `Effect.all`.
const renderAll = ([post, comments]: [Post, Comment[]]) =>
  `<div>${post.title}</div><ul>${renderComments(comments)}</ul>`

export const renderAllDOM: Effect.Effect<string, never, never> = Effect.sync(TODO)

// Exercise 6
// Do the same thing as above but now using generator syntax!
export const renderGenDOM: Effect.Effect<string, never, never> = Effect.sync(TODO)

// Exercise 7
// Write an Effect that gets both player1 and player2 from the cache and starts the game.
const storage = new Map<string, string>([
  ['player1', 'toby'],
  ['player2', 'sally'],
])
const getFromCache = (x: string) =>
  storage.has(x) ? Effect.succeed(storage.get(x) ?? 'Not found') : Effect.fail('Player not found')
const game = (p1: string, p2: string): string => `${p1} vs ${p2}`

// HINT: Effect.result
export const startGame = (
  p1: string,
  p2: string,
): Effect.Effect<Result.Result<string, string>, never, never> => TODO()
