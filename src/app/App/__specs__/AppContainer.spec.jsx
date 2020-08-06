import { mapStateToProps } from '../AppContainer'

jest.mock('../../../styles/variables/index.scss', () => {
  return { primary: 'primaryColor', black: 'defaultColor' }
})

describe('src | AppContainer', () => {
  it('should map maintenance status to App', () => {
    // given
    const state = {
      location: {},
      history: {},
      maintenance: { isActivated: true },
    }

    // when
    const result = mapStateToProps(state)

    // then
    expect(result).toHaveProperty('isMaintenanceActivated', true)
  })

  it('should map currentUser to App', () => {
    // given
    const state = {
      currentUser: { lastName: 'Nom-DeFamille' },
      location: {},
      history: {},
      maintenance: { isActivated: true },
    }

    // when
    const result = mapStateToProps(state)

    // then
    expect(result).toHaveProperty('isUserLoggedIn', {
      departementCode: undefined,
      email: undefined,
      expenses: undefined,
      firstName: undefined,
      id: undefined,
      lastName: 'Nom-DeFamille',
      publicName: undefined,
      wallet_balance: undefined,
      wallet_date_created: undefined,
    })
  })
})
