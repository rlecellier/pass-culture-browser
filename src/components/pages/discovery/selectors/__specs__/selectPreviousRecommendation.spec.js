import selectPreviousRecommendation from '../selectPreviousRecommendation'

describe('components | selectPreviousRecommendation', () => {
  it('should return the previous recommendation when exist', () => {
    // given
    const currentRecommendation = {
      id: 'BF',
      offerId: 'AE',
    }
    const previousRecommendation = {
      offerId: 'BF',
    }
    const state = {
      data: {
        recommendations: [previousRecommendation, currentRecommendation],
      },
    }

    // when
    const result = selectPreviousRecommendation(state, 'AE')

    // then
    expect(result).toStrictEqual({
      index: 0,
      offerId: 'BF',
    })
  })

  it('should not return previous recommendation when not exist', () => {
    // given
    const currentRecommendation = {
      id: 'BF',
      offerId: 'AE',
    }
    const state = {
      data: {
        recommendations: [currentRecommendation],
      },
    }

    // when
    const result = selectPreviousRecommendation(state, 'AE')

    // then
    expect(result).toBeNull()
  })

  it('should return null when no current recommendation', () => {
    // given
    const currentRecommendation = {}
    const state = {
      data: {
        recommendations: [currentRecommendation],
      },
    }

    // when
    const result = selectPreviousRecommendation(state, 'AE')

    // then
    expect(result).toBeNull()
  })
})
