import { mount, shallow } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { toast } from 'react-toastify'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import state from '../../../../../mocks/state'
import { fetchAlgolia } from '../../../../../vendor/algolia/algolia'
import HeaderContainer from '../../../../layout/Header/HeaderContainer'
import RelativeFooterContainer from '../../../../layout/RelativeFooter/RelativeFooterContainer'
import Spinner from '../../../../layout/Spinner/Spinner'
import Result from '../Result'
import SearchAlgoliaDetailsContainer from '../ResultDetail/ResultDetailContainer'
import SearchResults from '../SearchResults'

jest.mock('../../../../../vendor/algolia/algolia', () => ({
  fetchAlgolia: jest.fn(),
}))
jest.mock('react-toastify', () => ({
  toast: {
    info: jest.fn(),
  },
}))

describe('components | SearchResults', () => {
  let props
  let change
  let clear
  let parse
  let replace

  beforeEach(() => {
    change = jest.fn()
    clear = jest.fn()
    parse = jest.fn().mockReturnValue({})
    replace = jest.fn()
    props = {
      geolocation: {
        latitude: 40.1,
        longitude: 41.1,
      },
      history: {
        search: '',
        replace,
      },
      location: {
        search: '',
      },
      match: {
        params: {},
      },
      query: {
        change,
        clear,
        parse,
      },
      redirectToSearchMainPage: jest.fn(),
    }
    fetchAlgolia.mockReturnValue(
      new Promise(resolve => {
        resolve({
          hits: [],
          nbHits: 0,
          page: 0,
        })
      })
    )
  })

  afterEach(() => {
    fetchAlgolia.mockReset()
    parse.mockReset()
    replace.mockReset()
  })

  describe('when render', () => {
    it('should display a header with the right properties', () => {
      // when
      const wrapper = shallow(<SearchResults {...props} />)

      // then
      const header = wrapper.find(HeaderContainer)
      expect(header).toHaveLength(1)
    })

    it('should display a form element with an input text', () => {
      // when
      const wrapper = shallow(<SearchResults {...props} />)

      // then
      const form = wrapper.find('form')
      expect(form).toHaveLength(1)
      const textInput = form.find('input')
      expect(textInput).toHaveLength(1)
      expect(textInput.prop('name')).toBe('keywords')
      expect(textInput.prop('placeholder')).toBe('Artiste, auteur...')
      expect(textInput.prop('type')).toBe('text')
    })

    it('should display a form element with a submit button', () => {
      // when
      const wrapper = shallow(<SearchResults {...props} />)

      // then
      const form = wrapper.find('form')
      const submitButton = form.findWhere(node => node.prop('type') === 'submit').first()
      expect(submitButton).toHaveLength(1)
      expect(submitButton.text()).toBe('Rechercher')
    })

    it('should display a footer', () => {
      // when
      const wrapper = shallow(<SearchResults {...props} />)

      // then
      const footer = wrapper.find(RelativeFooterContainer)
      expect(footer).toHaveLength(1)
      expect(footer.prop('extraClassName')).toBe('dotted-top-red')
      expect(footer.prop('theme')).toBe('white')
    })

    it('should display spinner while loading', () => {
      // When
      const wrapper = shallow(<SearchResults {...props} />)

      // Then
      expect(wrapper.find(Spinner)).toHaveLength(1)
    })

    it('should not display spinner while loading is over', async () => {
      // When
      const wrapper = await shallow(<SearchResults {...props} />)

      // Then
      expect(wrapper.find(Spinner)).toHaveLength(0)
    })

    describe('when no keywords in url', () => {
      it('should fetch data with page 0, given categories and geolocation', () => {
        props.categoriesFilter = ['Cinéma']
        props.isSearchAroundMe = true

        // when
        shallow(<SearchResults {...props} />)

        // then
        expect(fetchAlgolia).toHaveBeenCalledWith('', 0, props.geolocation, props.categoriesFilter)
      })
    })

    describe('when keywords in url', () => {
      it('should fill search input, display keywords, number of results and fetch data with page 0', async () => {
        // given
        fetchAlgolia.mockReturnValue(
          new Promise(resolve => {
            resolve({
              hits: [],
              nbHits: 0,
              page: 0,
            })
          })
        )
        parse.mockReturnValue({
          'mots-cles': 'une librairie',
        })

        // when
        const wrapper = await shallow(<SearchResults {...props} />)

        // then
        const results = wrapper.find(Result)
        const searchInput = wrapper.find('input')
        const resultTitle = wrapper
          .findWhere(node => node.text() === '"une librairie" : 0 résultat')
          .first()
        expect(results).toHaveLength(0)
        expect(searchInput.prop('value')).toBe('une librairie')
        expect(resultTitle).toHaveLength(1)
        expect(fetchAlgolia).toHaveBeenCalledWith('une librairie', 0, null, [])
      })

      it('should fill search input and display keywords, number of results when results are found', async () => {
        // given
        fetchAlgolia.mockReturnValue(
          new Promise(resolve => {
            resolve({
              hits: [{ objectID: 'AA' }, { objectID: 'BB' }],
              nbHits: 2,
              page: 0,
            })
          })
        )
        parse.mockReturnValue({
          'mots-cles': 'une librairie',
        })

        // when
        const wrapper = await shallow(<SearchResults {...props} />)

        // then
        const results = wrapper.find(Result)
        const searchInput = wrapper.find('input')
        const resultTitle = wrapper
          .findWhere(node => node.text() === '"une librairie" : 2 résultats')
          .first()
        expect(results).toHaveLength(2)
        expect(searchInput.prop('value')).toBe('une librairie')
        expect(resultTitle).toHaveLength(1)
      })
    })

    describe('when geolocation is activated', () => {
      it('should fetch data using geolocation coordinates', () => {
        // given
        parse.mockReturnValue({
          'mots-cles': 'une librairie',
        })
        props.isSearchAroundMe = true
        props.geolocation = {
          latitude: 40.1,
          longitude: 41.1,
        }

        // when
        shallow(<SearchResults {...props} />)

        // then
        expect(fetchAlgolia).toHaveBeenCalledWith(
          'une librairie',
          0,
          {
            latitude: 40.1,
            longitude: 41.1,
          },
          []
        )
      })
    })
    describe('when filter is provided', () => {
      it('should fetch data using provided filter', () => {
        // given
        parse.mockReturnValue({
          'mots-cles': 'une librairie',
        })
        props.categoriesFilter = ['Cinéma']

        // when
        shallow(<SearchResults {...props} />)

        // then
        expect(fetchAlgolia).toHaveBeenCalledWith('une librairie', 0, null, ['Cinéma'])
      })
    })
  })

  describe('when searching', () => {
    it('should trigger search request when keywords have been provided', () => {
      // given
      const wrapper = shallow(<SearchResults {...props} />)
      const form = wrapper.find('form')

      // when
      form.simulate('submit', {
        target: {
          keywords: {
            value: 'un livre très cherché',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      expect(fetchAlgolia).toHaveBeenCalledWith('un livre très cherché', 0, null, [])
    })

    it('should trigger search request when keywords contains only spaces', () => {
      // given
      const wrapper = shallow(<SearchResults {...props} />)
      wrapper.setState({ searchedKeywords: 'different previous search' })
      const form = wrapper.find('form')

      // when
      form.simulate('submit', {
        target: {
          keywords: {
            value: ' ',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      expect(fetchAlgolia).toHaveBeenNthCalledWith(2, '', 0, null, [])
    })

    it('should trigger search request when no keywords', () => {
      // given
      const wrapper = shallow(<SearchResults {...props} />)
      wrapper.setState({ searchedKeywords: 'different previous search' })
      const form = wrapper.find('form')

      // when
      form.simulate('submit', {
        target: {
          keywords: {
            value: '',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      expect(fetchAlgolia).toHaveBeenNthCalledWith(2, '', 0, null, [])
    })

    it('should display search keywords and number of results when 0 result', async () => {
      // given
      const wrapper = shallow(<SearchResults {...props} />)
      const form = wrapper.find('form')
      fetchAlgolia.mockReturnValue(
        new Promise(resolve => {
          resolve({
            hits: [],
            page: 0,
            nbHits: 0,
            nbPages: 0,
            hitsPerPage: 2,
            processingTimeMS: 1,
            query: 'librairie',
            params: 'query=librairie&hitsPerPage=2',
          })
        })
      )

      // when
      await form.simulate('submit', {
        target: {
          keywords: {
            value: 'librairie',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      const resultTitle = wrapper
        .findWhere(node => node.text() === '"librairie" : 0 résultat')
        .first()
      expect(resultTitle).toHaveLength(1)
    })

    it('should display search keywords and number of results when 2 results', async () => {
      // given
      const wrapper = shallow(<SearchResults {...props} />)
      const form = wrapper.find('form')
      fetchAlgolia.mockReturnValue(
        new Promise(resolve => {
          resolve({
            hits: [{ objectID: 'AA' }, { objectID: 'BB' }],
            page: 0,
            nbHits: 2,
            nbPages: 0,
            hitsPerPage: 2,
            processingTimeMS: 1,
            query: 'librairie',
            params: 'query=librairie&hitsPerPage=2',
          })
        })
      )

      // when
      await form.simulate('submit', {
        target: {
          keywords: {
            value: 'librairie',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      const resultTitle = wrapper
        .findWhere(node => node.text() === '"librairie" : 2 résultats')
        .first()
      expect(resultTitle).toHaveLength(1)
    })

    it('should only display number of results when no search keywords', async () => {
      // given
      const wrapper = shallow(<SearchResults {...props} />)
      wrapper.setState({ searchedKeywords: 'different previous search' })
      const form = wrapper.find('form')
      fetchAlgolia.mockReturnValueOnce(
        new Promise(resolve => {
          resolve({
            hits: [{ objectID: 'AA' }, { objectID: 'BB' }],
            page: 0,
            nbHits: 2,
            nbPages: 0,
            hitsPerPage: 2,
            processingTimeMS: 1,
            query: '',
            params: 'hitsPerPage=2',
          })
        })
      )

      // when
      await form.simulate('submit', {
        target: {
          keywords: {
            value: '',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      const resultTitle = wrapper.findWhere(node => node.text() === '2 résultats').first()
      expect(resultTitle).toHaveLength(1)
    })

    it('should not display results when no results', () => {
      // given
      const wrapper = shallow(<SearchResults {...props} />)
      const form = wrapper.find('form')
      fetchAlgolia.mockReturnValue({
        hits: [],
        page: 0,
        nbHits: 0,
        nbPages: 0,
        hitsPerPage: 2,
        processingTimeMS: 1,
        query: '',
        params: 'hitsPerPage=2',
      })

      // when
      form.simulate('submit', {
        target: {
          keywords: {
            value: '',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      const results = wrapper.find(Result)
      expect(results).toHaveLength(0)
    })

    it('should display results when search succeeded with at least one result', async () => {
      // given
      const offer = { objectID: 'AE', offer: { name: 'Livre de folie' } }
      fetchAlgolia.mockReturnValueOnce(
        new Promise(resolve => {
          resolve({
            hits: [offer],
            page: 0,
            nbHits: 1,
            nbPages: 0,
            hitsPerPage: 2,
            processingTimeMS: 1,
            query: 'librairie',
            params: "query='librairie'&hitsPerPage=2",
          })
        })
      )
      const wrapper = shallow(<SearchResults {...props} />)
      const form = wrapper.find('form')

      // when
      await form.simulate('submit', {
        target: {
          keywords: {
            value: 'librairie',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      const results = wrapper.find(Result)
      expect(results).toHaveLength(1)
      expect(results.at(0).prop('geolocation')).toStrictEqual({ latitude: 40.1, longitude: 41.1 })
      expect(results.at(0).prop('result')).toStrictEqual(offer)
    })

    it('should clear previous results and page number when searching with new keywords', async () => {
      // given
      const offer1 = { objectID: 'AE', offer: { name: 'Livre de folie' } }
      const offer2 = { objectID: 'AF', offer: { name: 'Livre bien' } }
      const offer3 = { objectID: 'AG', offer: { name: 'Livre nul' } }
      fetchAlgolia.mockReturnValueOnce(
        new Promise(resolve => {
          resolve({
            hits: [offer1, offer2],
            page: 0,
            nbHits: 2,
            nbPages: 0,
            hitsPerPage: 2,
            processingTimeMS: 1,
            query: 'librairie',
            params: "query='librairie'&hitsPerPage=2",
          })
        })
      )
      const wrapper = shallow(<SearchResults {...props} />)
      const form = wrapper.find('form')

      // when
      await form.simulate('submit', {
        target: {
          keywords: {
            value: 'librairie',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      const resultsFirstFetch = wrapper.find(Result)
      expect(resultsFirstFetch).toHaveLength(2)

      // when
      await fetchAlgolia.mockReturnValueOnce(
        new Promise(resolve => {
          resolve({
            hits: [offer3],
            page: 0,
            nbHits: 1,
            nbPages: 0,
            hitsPerPage: 2,
            processingTimeMS: 1,
            query: 'vas-y',
            params: "query='vas-y'&hitsPerPage=2",
          })
        })
      )
      await form.simulate('submit', {
        target: {
          keywords: {
            value: 'vas-y',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      const resultSecondFetch = wrapper.find(Result)
      expect(resultSecondFetch).toHaveLength(1)
      expect(wrapper.state()).toStrictEqual({
        currentPage: 0,
        keywordsToSearch: 'vas-y',
        isLoading: false,
        results: [{ objectID: 'AG', offer: { name: 'Livre nul' } }],
        resultsCount: 1,
        searchedKeywords: 'vas-y',
        totalPagesNumber: 0,
      })
    })

    it('should not trigger a second search request when submitting same keywords twice', async () => {
      // given
      const offer1 = { objectID: 'AE', offer: { name: 'Livre de folie de la librairie' } }
      const offer2 = { objectID: 'AF', offer: { name: 'Livre bien de la librairie' } }
      fetchAlgolia.mockReturnValueOnce(
        new Promise(resolve => {
          resolve({
            hits: [offer1, offer2],
            page: 0,
            nbHits: 1,
            nbPages: 0,
            hitsPerPage: 2,
            processingTimeMS: 1,
            query: 'librairie',
            params: 'query=librairie&hitsPerPage=2',
          })
        })
      )
      const wrapper = shallow(<SearchResults {...props} />)
      const form = wrapper.find('form')

      // when
      await form.simulate('submit', {
        target: {
          keywords: {
            value: 'librairie',
          },
        },
        preventDefault: jest.fn(),
      })
      await form.simulate('submit', {
        target: {
          keywords: {
            value: 'librairie',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      expect(fetchAlgolia).toHaveBeenCalledTimes(2)
      expect(fetchAlgolia).toHaveBeenNthCalledWith(1, '', 0, null, [])
      expect(fetchAlgolia).toHaveBeenNthCalledWith(2, 'librairie', 0, null, [])
    })

    it('should display an error when search failed', async () => {
      // given
      fetchAlgolia.mockReturnValue(
        new Promise(reject => {
          reject()
        })
      )
      const wrapper = shallow(<SearchResults {...props} />)
      const form = wrapper.find('form')

      // when
      await form.simulate('submit', {
        target: {
          keywords: {
            value: 'librairie',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      await toast.info
      expect(toast.info).toHaveBeenCalledWith(
        "La recherche n'a pas pu aboutir, veuillez ré-essayer plus tard."
      )
    })

    it('should call replace to display search keywords in url when fetch succeeded', () => {
      // given
      const wrapper = shallow(<SearchResults {...props} />)
      const form = wrapper.find('form')
      fetchAlgolia.mockReturnValue(
        new Promise(resolve => {
          resolve({
            hits: [],
            page: 0,
            nbHits: 0,
            nbPages: 0,
            hitsPerPage: 2,
            processingTimeMS: 1,
            query: 'librairie',
            params: 'query=librairie&hitsPerPage=2',
          })
        })
      )

      // when
      form.simulate('submit', {
        target: {
          keywords: {
            value: 'librairie',
          },
        },
        preventDefault: jest.fn(),
      })

      // then
      expect(replace).toHaveBeenCalledWith({ search: '?mots-cles=librairie' })
    })

    describe('reset cross', () => {
      it('should not display reset cross when nothing is typed in text input', () => {
        // when
        const wrapper = shallow(<SearchResults {...props} />)

        // then
        const resetButton = wrapper.findWhere(node => node.prop('type') === 'reset').first()
        expect(resetButton).toHaveLength(0)
      })

      it('should display reset cross when something is typed in text input', () => {
        // given
        const wrapper = shallow(<SearchResults {...props} />)
        const form = wrapper.find('form')
        const input = form.find('input')

        // when
        input.simulate('change', {
          target: {
            name: 'keywords',
            value: 'typed search',
          },
          preventDefault: jest.fn(),
        })

        // then
        const resetButton = wrapper.findWhere(node => node.prop('type') === 'reset').first()
        expect(resetButton).toHaveLength(1)
      })

      it('should clear text input when clicking on reset cross', () => {
        // given
        const history = createMemoryHistory()
        history.push('/recherche-offres/resultats?mots-cles=librairie&page=2')
        const wrapper = mount(
          <Router history={history}>
            <SearchResults {...props} />
          </Router>
        )
        const form = wrapper.find('form')
        const input = form.find('input').first()
        input.simulate('change', {
          target: {
            name: 'keywords',
            value: 'typed search',
          },
        })
        const resetButton = wrapper.findWhere(node => node.prop('type') === 'reset').first()

        // when
        resetButton.simulate('click')

        // then
        const expectedMissingResetButton = wrapper
          .findWhere(node => node.prop('type') === 'reset')
          .first()
        const resettedInput = form.find('input').first()
        expect(expectedMissingResetButton).toHaveLength(0)
        expect(resettedInput.instance().value).toBe('')
      })
    })
  })

  describe('when navigating', () => {
    let history
    let store
    const buildStore = configureStore([thunk])

    beforeEach(() => {
      history = createMemoryHistory()
      store = buildStore(state)
    })

    it('should render search main page when current route is /recherche-offres/resultats', () => {
      // given
      history.push('/recherche-offres/resultats')

      // when
      const wrapper = mount(
        <Router history={history}>
          <Provider store={store}>
            <SearchResults {...props} />
          </Provider>
        </Router>
      )

      // then
      const form = wrapper.find('form')
      const searchDetails = wrapper.find(SearchAlgoliaDetailsContainer)
      expect(form).toHaveLength(1)
      expect(searchDetails).toHaveLength(0)
    })

    it('should render item details when current route is /recherche-offres/resultats/details/AE', () => {
      // given
      history.push('/recherche-offres/resultats/details/AE')

      // when
      const wrapper = mount(
        <Router history={history}>
          <Provider store={store}>
            <SearchResults {...props} />
          </Provider>
        </Router>
      )

      // then
      const form = wrapper.find('form')
      const searchDetails = wrapper.find(SearchAlgoliaDetailsContainer)
      expect(searchDetails).toHaveLength(1)
      expect(form).toHaveLength(0)
    })

    describe('come back icon', () => {
      it('should render an icon to come back to search main page when a research has been made', () => {
        // given
        fetchAlgolia.mockReturnValue(
          new Promise(resolve => {
            resolve({
              hits: [],
              nbHits: 0,
              page: 0,
            })
          })
        )
        parse.mockReturnValue({
          'mots-cles': 'une librairie',
        })

        // when
        const wrapper = shallow(<SearchResults {...props} />)

        // then
        const form = wrapper.find('form')
        const backIcon = form.findWhere(node => node.prop('svg') === 'picto-back-grey').first()
        expect(backIcon).toHaveLength(1)
      })

      it('should reset text input when clicking on come back arrow', async () => {
        // given
        fetchAlgolia.mockReturnValue(
          new Promise(resolve => {
            resolve({
              hits: [],
              nbHits: 0,
              page: 0,
            })
          })
        )
        parse.mockReturnValue({
          'mots-cles': 'une librairie',
        })
        const redirectToSearchMainPage = jest.fn()

        // when
        const wrapper = await shallow(
          <SearchResults
            {...props}
            redirectToSearchMainPage={redirectToSearchMainPage}
          />
        )

        const form = wrapper.find('form')
        const backButton = form.findWhere(node => node.prop('type') === 'button').first()
        expect(wrapper.state('keywordsToSearch')).toBe('une librairie')
        backButton.simulate('click')

        // then
        expect(redirectToSearchMainPage).toHaveBeenCalledTimes(1)
        expect(wrapper.state('keywordsToSearch')).toBe('')
      })
    })

    describe('header', () => {
      it('should not render header when search has been made', () => {
        // given
        history.push('/recherche-offres/resultats?mots-cles=librairie&page=1')
        const offer1 = { objectID: 'AE', offer: { name: 'Livre de folie de la librairie' } }
        const offer2 = { objectID: 'AF', offer: { name: 'Livre bien de la librairie' } }
        fetchAlgolia.mockReturnValueOnce(
          new Promise(resolve => {
            resolve({
              hits: [offer1, offer2],
              page: 0,
              nbHits: 1,
              nbPages: 0,
              hitsPerPage: 2,
              processingTimeMS: 1,
              query: 'librairie',
              params: 'query=librairie&hitsPerPage=2',
            })
          })
        )
        const wrapper = mount(
          <Router history={history}>
            <SearchResults {...props} />
          </Router>
        )
        const form = wrapper.find('form')

        // when
        form.simulate('submit', {
          target: {
            keywords: {
              value: 'librairie',
            },
          },
          preventDefault: jest.fn(),
        })
        wrapper.update()

        // then
        const header = wrapper.find(HeaderContainer)
        expect(header).toHaveLength(0)
      })

      it('should render header when on details page', () => {
        // given
        history.push('/recherche-offres/resultats/details/AE?mots-cles=librairie&page=1')

        // when
        const wrapper = mount(
          <Router history={history}>
            <Provider store={store}>
              <SearchResults {...props} />
            </Provider>
          </Router>
        )

        // then
        const header = wrapper.find(HeaderContainer)
        expect(header).toHaveLength(1)
      })
    })
  })
})
