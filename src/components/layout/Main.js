import PropTypes from 'prop-types'
import classnames from 'classnames'
import get from 'lodash.get'
import {
  Modal,
  resetForm,
  showNotification,
  withLogin,
} from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose, bindActionCreators } from 'redux'

import BackButton from './BackButton'
import Footer from './Footer'

class Main extends Component {
  constructor(props) {
    super(props)
    const { dispatch } = props
    const actions = { resetForm, showNotification }
    this.actions = bindActionCreators(actions, dispatch)
  }

  componentDidMount() {
    this.handleHistoryBlock()
    const { user } = this.props
    // si un utilisateur est connecte ?
    // FIXME -> cela doit etre gere par un composant private
    // heritage de ReactRouter
    // NOTE -> https://reacttraining.com/react-router/web/example/auth-workflow
    if (!user) return
    this.dataRequestHandler()
  }

  componentDidUpdate(prevProps) {
    const { blockers, user, location } = this.props
    const blockersChanged = prevProps.blockers !== blockers
    const userChanged = !prevProps.user && user // User just loaded
    const searchChanged = location.search !== prevProps.location.search

    if (blockersChanged) {
      this.handleHistoryBlock()
    }
    if (userChanged || searchChanged) {
      this.dataRequestHandler()
    }
  }

  componentWillUnmount() {
    if (this.unblock) this.unblock()
    this.actions.resetForm()
  }

  handleDataFail = (state, action) => {
    const error = get(action, 'errors.global', []).join('\n')
    this.actions.showNotification({
      text: error || 'Erreur de chargement',
      type: 'danger',
    })
  }

  dataRequestHandler = () => {
    const { handleDataRequest } = this.props
    // la definition d'une propriete `handleDataRequest`
    // dans un composant lance une requete
    if (!handleDataRequest) return
    // possibility of the handleDataRequest to return
    // false in order to not trigger the loading
    handleDataRequest(this.handleDataSuccess, this.handleDataFail)
  }

  handleHistoryBlock = () => {
    const { blockers, history } = this.props
    if (this.unblock) this.unblock()
    this.unblock = history.block(() => {
      if (!blockers) {
        return false
      }
      // test all the blockers
      for (const blocker of blockers) {
        const { block } = blocker || {}
        const shouldBlock = block && block(this.props)
        if (shouldBlock) {
          return false
        }
      }
      // return true by default, which means that we don't block
      // the change of pathname
      return true
    })
  }

  render() {
    const {
      backButton,
      children,
      footer: footerProps,
      name,
      noPadding,
      redBg,
    } = this.props
    // FIXME [PERFS] -> ne pas faire une itération
    // utiliser plutot une propriete avec un composant
    const header = [].concat(children).find(e => e.type === 'header')
    const footer = [].concat(children).find(e => e.type === 'footer')
    const content = []
      .concat(children)
      .filter(e => e.type !== 'header' && e.type !== 'footer')

    return (
      <React.Fragment>
        <main
          className={classnames({
            [`${name}-page`]: true,
            'no-padding': noPadding,
            page: true,
            'red-bg': redBg,
            'with-footer': Boolean(footer) || Boolean(footerProps),
            'with-header': Boolean(header),
          })}
          key="main"
        >
          {header}
          {backButton && <BackButton {...backButton} />}
          <div className="page-content is-relative">
            {content}
          </div>
          {footer || (footerProps && <Footer {...footerProps} />)}
        </main>
        <Modal key="modal" />
      </React.Fragment>
    )
  }
}

Main.defaultProps = {
  backButton: false,
  footer: null,
  handleDataRequest: null,
  noPadding: false,
  redBg: false,
  user: null,
}

Main.propTypes = {
  backButton: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  blockers: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
  dispatch: PropTypes.func.isRequired,
  footer: PropTypes.object,
  handleDataRequest: PropTypes.func,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  noPadding: PropTypes.bool,
  redBg: PropTypes.bool,
  user: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
}

const mapStateToProps = state => ({
  blockers: state.blockers,
  notification: state.notification,
  user: state.user,
})

export default compose(
  withRouter,
  withLogin({ failRedirect: '/connexion' }),
  connect(mapStateToProps)
)(Main)
