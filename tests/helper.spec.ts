import { expect, it } from 'vitest'
import helpers from '~/utils/helpers'

it('test helpers.timestampToTime()', () => {
    expect(helpers.timestampToTime(1588888888000))
        .toBe('2020-05-07 22:01:28')
})

it('test helpers.timestampToTime()', () => {
    expect(helpers.timestampToTime(1588888888000))
        .toBe('2020-05-07 22:01:28')
})

it('test helpers.timestampToDate()', () => {
    expect(helpers.timestampToDate(1588888888000))
        .toBe('2020-05-07')
})

it('helpers.roundPrice()', () => {
    // for smaller than 1, it should stay the same
    expect(helpers.roundPrice(0.123456789))
        .toBe(0.123456789)

    // for bigger than 1, it should round to 2 decimals
    expect(helpers.roundPrice(1.123456789))
        .toBe(1.12)
})