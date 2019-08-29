import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'

import { FormFooter } from '../../forms'

const cancelOptions = {
  className: 'is-white-text',
  disabled: false,
  label: 'Recommencer',
  url: '/mot-de-passe-perdu',
}

const submitOptions = {
  className: 'is-bold is-white-text',
  disabled: false,
  label: 'Connexion',
  url: '/connexion',
}

class SuccessView extends Component {
  renderRequestSuccessMessage = () => (
    <Fragment>
      <p className="is-medium">
        {'Vous allez recevoir un e-mail avec les instructions de réinitialisation.'}
      </p>
      <p className="is-medium mt28">
        {
          'Si vous n’avez rien reçu d’ici une heure, merci de vérifier votre e-mail et de le saisir à nouveau.'
        }
      </p>
    </Fragment>
  )

  renderResetSuccessMessage = () => (
    <Fragment>
      <p className="is-medium">
        {'Votre mode de passe a bien été enregistré, vous pouvez l’utiliser pour vous connecter'}
      </p>
    </Fragment>
  )

  render() {
    const { token } = this.props
    const renderSuccessMessage = token
      ? this.renderResetSuccessMessage
      : this.renderRequestSuccessMessage
    return (
      <div
        className="is-full-layout flex-rows"
        id="reset-password-page-success"
      >
        <main
          className="pc-main padded-2x flex-rows flex-center flex-1"
          role="main"
        >
          <div className="is-italic fs22 is-white-text">{renderSuccessMessage()}</div>
        </main>
        <FormFooter
          cancel={(!token && cancelOptions) || null}
          submit={submitOptions}
        />
      </div>
    )
  }
}

SuccessView.defaultProps = {
  token: null,
}

SuccessView.propTypes = {
  token: PropTypes.string,
}

export default SuccessView