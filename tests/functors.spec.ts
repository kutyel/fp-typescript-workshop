import { Option } from 'effect'
import { expect, test, describe } from 'bun:test'

describe('Functors', () => {
  test('2 + 2', () => {
    expect(2 + 2).toBe(4)
  })

  test('2 * 2', () => {
    expect(2 * 2).toBe(4)
  })
})
