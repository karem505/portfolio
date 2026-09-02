import { describe, it, expect } from 'vitest'
import { paginationWindow } from './pagination'

describe('paginationWindow', () => {
  it('lists every page when there are few', () => {
    expect(paginationWindow(1, 1)).toEqual([1])
    expect(paginationWindow(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })
  it('keeps first, last, and one sibling each side with gaps', () => {
    expect(paginationWindow(1, 22)).toEqual([1, 2, 3, 4, 5, 'gap', 22])
    expect(paginationWindow(11, 22)).toEqual([1, 'gap', 10, 11, 12, 'gap', 22])
    expect(paginationWindow(22, 22)).toEqual([1, 'gap', 18, 19, 20, 21, 22])
  })
  it('never emits a gap for a single hidden page', () => {
    expect(paginationWindow(4, 8)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    expect(paginationWindow(5, 9)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
  it('clamps out-of-range current pages', () => {
    expect(paginationWindow(0, 22)).toEqual(paginationWindow(1, 22))
    expect(paginationWindow(99, 22)).toEqual(paginationWindow(22, 22))
  })
})
