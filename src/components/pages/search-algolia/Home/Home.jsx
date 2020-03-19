import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import HeaderContainer from '../../../layout/Header/HeaderContainer'
import Icon from '../../../layout/Icon/Icon'
import RelativeFooterContainer from '../../../layout/RelativeFooter/RelativeFooterContainer'
import { CriterionItem } from './CriterionItem/CriterionItem'

export class Home extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      keywordsToSearch: '',
    }
    this.inputRef = React.createRef()
  }

  handleOnSubmit = event => {
    event.preventDefault()
    const { history } = this.props
    const { keywordsToSearch } = this.state
    keywordsToSearch
      ? history.push(`/recherche-offres/resultats?mots-cles=${keywordsToSearch}`)
      : history.push(`/recherche-offres/resultats`)
  }

  handleResetButtonClick = () => {
    this.setState({
      keywordsToSearch: '',
    })
    this.inputRef.current.focus()
  }

  handleOnTextInputChange = event => {
    this.setState({
      keywordsToSearch: event.target.value,
    })
  }

  render() {
    const { keywordsToSearch } = this.state
    const { categoryCriterion, geolocationCriterion, sortCriterion } = this.props
    return (
      <main className="search-page-algolia">
        <div className="home-header-wrapper">
          <HeaderContainer
            closeTitle="Retourner à la page découverte"
            closeTo="/decouverte"
            extraClassName="header-search-main-page"
            title="Recherche"
          />
          <form
            className="home-text-input-form"
            id="home-form"
            onSubmit={this.handleOnSubmit}
          >
            <div className="home-text-input-wrapper">
              <div className="home-text-input-back">
                <Icon svg="picto-search" />
              </div>
              <input
                className="home-text-input"
                name="keywords"
                onChange={this.handleOnTextInputChange}
                placeholder="Titre, artiste..."
                ref={this.inputRef}
                type="text"
                value={keywordsToSearch}
              />
              <div className="home-text-input-reset">
                {keywordsToSearch && (
                  <button
                    className="home-text-input-reset-button"
                    onClick={this.handleResetButtonClick}
                    type="reset"
                  >
                    <Icon
                      alt="Supprimer la saisie"
                      svg="picto-reset"
                    />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        <ul className="home-filter-list">
          <CriterionItem
            icon={categoryCriterion.icon}
            label="Je cherche"
            linkTo="/recherche-offres/criteres-categorie"
            selectedFilter={categoryCriterion.label}
          />
          <span className="search-criteria-separator" />
          <CriterionItem
            icon={geolocationCriterion.params.icon}
            label="Où"
            linkTo="/recherche-offres/criteres-localisation"
            selectedFilter={geolocationCriterion.params.label}
          />
          <span className="search-criteria-separator" />
          <CriterionItem
            icon={sortCriterion.icon}
            label="Trier par"
            linkTo="/recherche-offres/criteres-tri"
            selectedFilter={sortCriterion.label}
          />
        </ul>
        <div className="home-main-search-button-wrapper">
          <button
            className="home-search-button"
            form="home-form"
            type="submit"
          >
            {'Rechercher'}
          </button>
        </div>
        <RelativeFooterContainer
          extraClassName="dotted-top-red"
          theme="white"
        />
      </main>
    )
  }
}

Home.propTypes = {
  categoryCriterion: PropTypes.shape({
    filters: PropTypes.arrayOf(String),
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  geolocationCriterion: PropTypes.shape({
    params: PropTypes.shape({
      icon: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      requiresGeolocation: PropTypes.bool.isRequired,
    }),
  }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  sortCriterion: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    index: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    requiresGeolocation: PropTypes.bool.isRequired,
  }).isRequired,
}