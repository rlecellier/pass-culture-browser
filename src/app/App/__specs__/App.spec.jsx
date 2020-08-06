import { shallow } from 'enzyme'
import React from 'react'
import { App } from '../App'
import NavBarContainer from '../../../components/layout/NavBar/NavBarContainer'
import RedirectToMaintenance from '../RedirectToMaintenance/RedirectToMaintenance'
import { StatusBarHelmet } from '../StatusBar/StatusBarHelmet'

jest.mock('../../../styles/variables/index.scss', () => {
  return { primary: 'primaryColor', black: 'defaultColor' }
})

describe('src | components | App', () => {
  it('should render a RedirectToMaintenance component when maintenance mode is activated', () => {
    // given
    const props = {
      children: <div />,
      history: {},
      isMaintenanceActivated: true,
      isUserLoggedIn: true,
      location: {},
    }

    // when
    const wrapper = shallow(
      <App {...props}>
        <p>
          {'Sub component'}
        </p>
      </App>
    )

    // then
    const redirectToMaintenance = wrapper.find(RedirectToMaintenance)
    expect(redirectToMaintenance).toHaveLength(1)
  })

  it('should render a StatusBarHelmet component', () => {
    // Given
    const props = {
      children: <div />,
      history: {},
      isMaintenanceActivated: false,
      isUserLoggedIn: true,
      location: {
        pathname: '/discovery',
      },
    }

    // When
    const wrapper = shallow(<App {...props} />)

    // Then
    const statusBarComponent = wrapper.find(StatusBarHelmet)
    expect(statusBarComponent).toHaveLength(1)
    expect(statusBarComponent.prop('pathname')).toBe('/discovery')
  })

  it('should render a navbar when user is logged in', () => {
    // Given
    const props = {
      children: <div />,
      history: {},
      isMaintenanceActivated: false,
      isUserLoggedIn: true,
      location: {
        pathname: '/discovery',
      },
    }

    // When
    const wrapper = shallow(<App {...props} />)

    // Then
    const navBar = wrapper.find(NavBarContainer)
    expect(navBar).toHaveLength(1)
  })

  it('should not render a navbar when user isnt logged in', () => {
    // Given
    const props = {
      children: <div />,
      history: {},
      isMaintenanceActivated: false,
      isUserLoggedIn: false,
      location: {
        pathname: '/discovery',
      },
    }

    // When
    const wrapper = shallow(<App {...props} />)

    // Then
    const navBar = wrapper.find(NavBarContainer)
    expect(navBar).toHaveLength(0)
  })
})
