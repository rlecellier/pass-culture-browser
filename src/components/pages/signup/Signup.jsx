/* eslint
  react/jsx-one-expression-per-line: 0 */
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Form } from 'react-final-form'
import { getCanSubmit, parseSubmitErrors } from 'react-final-form-utils'
import { requestData } from 'redux-saga-data'

import FormHeader from './FormHeader'
import FormFields from './FormFields'
import FormFooter from './FormFooter'

class Signup extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { isFormLoading: false }
  }

  handleRequestFail = formResolver => (state, action) => {
    // we return API errors back to the form
    const { payload } = action
    const nextState = { isFormLoading: false }
    const errors = parseSubmitErrors(payload.errors)
    this.setState(nextState, () => formResolver(errors))
  }

  handleRequestSuccess = formResolver => () => {
    const { history } = this.props
    const nextState = { isFormLoading: false }
    this.setState(nextState, () => {
      formResolver()
      const nextUrl = '/decouverte'
      history.push(nextUrl)
    })
  }

  onFormSubmit = formValues => {
    const { dispatch } = this.props

    const apiPath = '/users/signup/webapp'
    const method = 'POST'

    this.setState({ isFormLoading: true })
    // NOTE: we need to promise the request callbacks
    // in order to inject their payloads into the form
    const formSubmitPromise = new Promise(resolve => {
      dispatch(requestData({
        apiPath,
        body: { ...formValues },
        handleFail: this.handleRequestFail(resolve),
        handleSuccess: this.handleRequestSuccess(resolve),
        method,
        resolve: userFromRequest => Object.assign({ isCurrent: true }, userFromRequest)
      }))
    })
    return formSubmitPromise
  }

  render () {
    const { isFormLoading } = this.state
    return (
      <main
        role="main"
        className="signup-page page with-footer"
      >
        <div className="section pc-final-form">
          <Form
            handleSuccessRedirect={() => '/decouverte'}
            onSubmit={this.onFormSubmit}
            render={formProps => {
              const { handleSubmit } = formProps
              const canSubmit = getCanSubmit(formProps)
              return (
                <form
                  className="pc-final-form flex-rows is-full-layout"
                  autoComplete="off"
                  disabled={isFormLoading}
                  noValidate
                  onSubmit={handleSubmit}
                >
                  <div className="flex-1 flex-rows flex-center padded-2x overflow-y">
                    <FormHeader />
                    <FormFields />
                  </div>
                  <FormFooter
                    canSubmit={canSubmit}
                    isLoading={isFormLoading}
                  />
                </form>
              )
            }}
          />
        </div>
      </main>
    )
  }
}

Signup.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
}

export default Signup