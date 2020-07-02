import React, { useCallback, useState } from 'react'
import InputMask from 'react-input-mask'
import PropTypes from 'prop-types'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'

import BackLink from '../../../layout/Header/BackLink/BackLink'
import { checkIfDepartmentIsEligible } from '../domain/checkIfDepartmentIsEligible'
import { checkIfAgeIsEligible } from '../domain/checkIfAgeIsEligible'
import { eligibilityPaths } from './eligibilityPaths'

const EligibilityCheck = ({ historyPush, pathname }) => {
  const [postalCodeInputValue, setPostalCodeInputValue] = useState('')
  const [dateOfBirthInputValue, setDateOfBirthInputValue] = useState('')

  const keepNumbersOnly = string => string.replace(/[^0-9]/g, '')

  const handlePostalCodeInputChange = useCallback(event => {
    let newValue = keepNumbersOnly(event.target.value)
    setPostalCodeInputValue(newValue)
  }, [])

  const handleDOBInputChange = useCallback(event => {
    const newValue = event.target.value
    setDateOfBirthInputValue(newValue)
  }, [])

  const dateFormatRegex = RegExp('[0-9]{2}/[0-9]{2}/[0-9]{4}', 'g')
  const isMissingField =
    postalCodeInputValue.length < 5 || !dateFormatRegex.test(dateOfBirthInputValue)

  const getCurrentPathName = () => {
    const currentPathname = pathname

    return currentPathname.slice(-1) !== '/' ? currentPathname + '/' : currentPathname
  }

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()
      const currentPathName = getCurrentPathName()
      const splittedBirthDate = dateOfBirthInputValue.split('/')
      const birthDay = splittedBirthDate[0]
      const birthMonth = splittedBirthDate[1]
      const birthYear = splittedBirthDate[2]
      const currentYear = new Date().getFullYear()
      const isDateFormatValid = Date.parse(`${birthDay}-${birthMonth}-${birthDay}`)

      if (!isDateFormatValid || birthYear > currentYear) {
        return historyPush('/verification-eligibilite/pas-eligible')
      }

      const ageEligibilityValue = checkIfAgeIsEligible(dateOfBirthInputValue)

      if (ageEligibilityValue === 'eligible') {
        const isDepartmentEligible = checkIfDepartmentIsEligible(postalCodeInputValue)

        isDepartmentEligible
          ? historyPush(currentPathName + eligibilityPaths[ageEligibilityValue])
          : historyPush(currentPathName + 'departement-non-eligible')
      } else {
        historyPush(currentPathName + eligibilityPaths[ageEligibilityValue])
      }
    },
    [postalCodeInputValue, dateOfBirthInputValue]
  )

  return (
    <main className="eligibility-check-page">
      <BackLink backTo="/beta" />
      <span css={titleStyle}>
        {'Créer un compte'}
      </span>
      <form
        className="eligibility-form"
        onSubmit={handleSubmit}
      >
        <div>
          <label>
            {'Quel est ton code postal de résidence ?'}
            <input
              css={inputStyle}
              inputMode="numeric"
              maxLength="5"
              onChange={handlePostalCodeInputChange}
              placeholder="Ex: 75017"
              type="text"
              value={postalCodeInputValue}
            />
          </label>
          <label>
            {'Quelle est ta date de naissance ?'}
            <InputMask
              css={inputStyle}
              inputMode="numeric"
              mask="99/99/9999"
              onChange={handleDOBInputChange}
              placeholder="JJ/MM/AAAA"
              value={dateOfBirthInputValue}
            />
          </label>
        </div>
        <input
          className="eligibility-submit"
          disabled={isMissingField}
          type="submit"
          value="Vérifier mon éligibilité"
        />
      </form>
    </main>
  )
}

EligibilityCheck.propTypes = {
  historyPush: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
}

const whiteColor = '#FFF'
const titleStyle = {
  gridRow: ' 1/2',
  gridColumn: '1/3',
  placeSelf: 'center',
  color: whiteColor,
  fontSize: '18px',
}
const inputStyle = {
  border:'1px solid #C7C7CC',
  borderRadius:'24px',
  fontSize:'22px',
  fontWeight:'500',
  margin:'16px 0',
  outline:'none',
  padding:'11px 0',
  textAlign:'center',

  '&::placeholder': {
    color:'#C7C7CC',
  },

  '&:focus': {
    border:'2px solid #EB0055',
    caretColor:'#EB0055',
  }
}

export default EligibilityCheck
