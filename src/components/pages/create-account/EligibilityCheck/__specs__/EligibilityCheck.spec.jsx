import React from 'react'
import { MemoryRouter } from 'react-router'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import EligibilityCheck from '../EligibilityCheck'
import { checkIfAgeIsEligible, ELIGIBLE } from '../../domain/checkIfAgeIsEligible'
import { checkIfDepartmentIsEligible } from '../../domain/checkIfDepartmentIsEligible'

jest.mock('../../domain/checkIfAgeIsEligible', () => {
  const originalModule = jest.requireActual('../../domain/checkIfAgeIsEligible')

  return {
    ...originalModule,
    checkIfAgeIsEligible: jest.fn(),
  }
})

jest.mock('../../domain/checkIfDepartmentIsEligible', () => {
  return {
    checkIfDepartmentIsEligible: jest.fn(),
  }
})

describe('eligibility check page', () => {
  let props
  const getFullYear = Date.prototype.getFullYear

  beforeEach(() => {
    props = {
      historyPush: jest.fn(),
      pathname: '/verification-eligibilite/',
    }
    Date.prototype.getFullYear = () => 2020
  })

  afterEach(() => {
    Date.prototype.getFullYear = getFullYear
  })

  describe('when rendering', () => {
    it('should display the title "Créer un compte"', () => {
      // when
      const wrapper = mount(
        <MemoryRouter>
          <EligibilityCheck {...props} />
        </MemoryRouter>
      )

      // then
      const eligibilityTitle = wrapper.find({ children: 'Créer un compte' })
      expect(eligibilityTitle).toHaveLength(1)
    })

    it('should display a back to beta page link', () => {
      // when
      const wrapper = mount(
        <MemoryRouter>
          <EligibilityCheck {...props} />
        </MemoryRouter>
      )

      // then
      const backLink = wrapper.find('a[href="/beta"]')
      expect(backLink).toHaveLength(1)
    })

    it('should display a postal code input label', () => {
      // when
      const wrapper = mount(
        <MemoryRouter>
          <EligibilityCheck {...props} />
        </MemoryRouter>
      )

      // then
      const eligibilityPostalCodeInputLabel = wrapper
        .find('label')
        .at(0)
        .text()
      expect(eligibilityPostalCodeInputLabel).toBe('Quel est ton code postal de résidence ?')
    })

    it('should display a date of birth input label', () => {
      // when
      const wrapper = mount(
        <MemoryRouter>
          <EligibilityCheck {...props} />
        </MemoryRouter>
      )

      // then
      const eligibilityDobInputLabel = wrapper
        .find('label')
        .at(1)
        .text()
      expect(eligibilityDobInputLabel).toBe('Quelle est ta date de naissance ?')
    })

    it('should display a submit button', () => {
      // when
      const wrapper = mount(
        <MemoryRouter>
          <EligibilityCheck {...props} />
        </MemoryRouter>
      )

      // then
      const eligibilitySubmitBtn = wrapper.find('input[value="Vérifier mon éligibilité"]')
      expect(eligibilitySubmitBtn).toHaveLength(1)
    })
  })

  describe('when user submits form', () => {
    it('should properly format url for redirection when necessary', () => {
      // given
      checkIfAgeIsEligible.mockReturnValue(ELIGIBLE)
      checkIfDepartmentIsEligible.mockReturnValue(false)
      props.pathname = '/verification-eligibilite'

      const wrapper = mount(
        <MemoryRouter>
          <EligibilityCheck {...props} />
        </MemoryRouter>
      )

      const eligibilityPostalCodeInput = wrapper.find('input[placeholder="Ex: 75017"]')
      const eligibilityDateOfBirthInput = wrapper.find('input[placeholder="JJ/MM/AAAA"]')

      act(() => {
        eligibilityPostalCodeInput.invoke('onChange')({ target: { value: '27200' } })
        eligibilityDateOfBirthInput.invoke('onChange')({ target: { value: '05/03/2002' } })
      })
      wrapper.update()

      const eligibilityForm = wrapper.find('form')

      // when
      eligibilityForm.invoke('onSubmit')({
        preventDefault: jest.fn(),
      })

      // Then
      expect(props.historyPush).toHaveBeenCalledWith(
        '/verification-eligibilite/departement-non-eligible'
      )
    })

    it("should check if age is eligible based on user's date of birth", () => {
      // given
      const wrapper = mount(
        <MemoryRouter>
          <EligibilityCheck {...props} />
        </MemoryRouter>
      )

      const eligibilityPostalCodeInput = wrapper.find('input[placeholder="Ex: 75017"]')
      const eligibilityDateOfBirthInput = wrapper.find('input[placeholder="JJ/MM/AAAA"]')
      const dateOfBirth = '05/03/2002'

      act(() => {
        eligibilityPostalCodeInput.invoke('onChange')({ target: { value: '93800' } })
        eligibilityDateOfBirthInput.invoke('onChange')({ target: { value: dateOfBirth } })
      })
      wrapper.update()

      const eligibilityForm = wrapper.find('form')

      // when
      eligibilityForm.invoke('onSubmit')({
        preventDefault: jest.fn(),
      })

      // then
      expect(checkIfAgeIsEligible).toHaveBeenCalledWith(dateOfBirth)
    })

    describe('when user age is eligible', () => {
      beforeEach(() => {
        checkIfAgeIsEligible.mockReturnValue('eligible')
      })

      it("should check if department is eligible based on user's postal code", () => {
        // given
        const wrapper = mount(
          <MemoryRouter>
            <EligibilityCheck {...props} />
          </MemoryRouter>
        )

        const eligibilityPostalCodeInput = wrapper.find('input[placeholder="Ex: 75017"]')
        const eligibilityDateOfBirthInput = wrapper.find('input[placeholder="JJ/MM/AAAA"]')
        const postalCode = '93800'

        act(() => {
          eligibilityPostalCodeInput.invoke('onChange')({ target: { value: postalCode } })
          eligibilityDateOfBirthInput.invoke('onChange')({ target: { value: '05/03/2002' } })
        })
        wrapper.update()

        const eligibilityForm = wrapper.find('form')

        // when
        eligibilityForm.invoke('onSubmit')({
          preventDefault: jest.fn(),
        })

        // then
        expect(checkIfDepartmentIsEligible).toHaveBeenCalledWith(postalCode)
      })

      it('should redirect to /eligible when department is eligible', () => {
        // given
        checkIfDepartmentIsEligible.mockReturnValue(true)

        const wrapper = mount(
          <MemoryRouter>
            <EligibilityCheck {...props} />
          </MemoryRouter>
        )

        const eligibilityPostalCodeInput = wrapper.find('input[placeholder="Ex: 75017"]')
        const eligibilityDateOfBirthInput = wrapper.find('input[placeholder="JJ/MM/AAAA"]')

        act(() => {
          eligibilityPostalCodeInput.invoke('onChange')({ target: { value: '93800' } })
          eligibilityDateOfBirthInput.invoke('onChange')({ target: { value: '05/03/2002' } })
        })
        wrapper.update()

        const eligibilityForm = wrapper.find('form')

        // when
        eligibilityForm.invoke('onSubmit')({
          preventDefault: jest.fn(),
        })

        // then
        expect(props.historyPush).toHaveBeenCalledWith('/verification-eligibilite/eligible')
      })

      it('should redirect to /department-non-eligible when department is not eligible', () => {
        // given
        checkIfDepartmentIsEligible.mockReturnValue(false)

        const wrapper = mount(
          <MemoryRouter>
            <EligibilityCheck {...props} />
          </MemoryRouter>
        )

        const eligibilityPostalCodeInput = wrapper.find('input[placeholder="Ex: 75017"]')
        const eligibilityDateOfBirthInput = wrapper.find('input[placeholder="JJ/MM/AAAA"]')

        act(() => {
          eligibilityPostalCodeInput.invoke('onChange')({ target: { value: '27200' } })
          eligibilityDateOfBirthInput.invoke('onChange')({ target: { value: '05/03/2002' } })
        })
        wrapper.update()

        const eligibilityForm = wrapper.find('form')

        // when
        eligibilityForm.invoke('onSubmit')({
          preventDefault: jest.fn(),
        })

        // then
        expect(props.historyPush).toHaveBeenCalledWith(
          '/verification-eligibilite/departement-non-eligible'
        )
      })
    })

    describe('when user age is not eligible', () => {
      beforeEach(() => {
        checkIfDepartmentIsEligible.mockReturnValue(true)
      })

      it('should redirect to /bientot when user is soon to be eligible', () => {
        // given
        checkIfAgeIsEligible.mockReturnValue('soon')

        const wrapper = mount(
          <MemoryRouter>
            <EligibilityCheck {...props} />
          </MemoryRouter>
        )

        const eligibilityPostalCodeInput = wrapper.find('input[placeholder="Ex: 75017"]')
        const eligibilityDateOfBirthInput = wrapper.find('input[placeholder="JJ/MM/AAAA"]')

        act(() => {
          eligibilityPostalCodeInput.invoke('onChange')({ target: { value: '93800' } })
          eligibilityDateOfBirthInput.invoke('onChange')({ target: { value: '05/03/2003' } })
        })
        wrapper.update()

        const eligibilityForm = wrapper.find('form')

        // when
        eligibilityForm.invoke('onSubmit')({
          preventDefault: jest.fn(),
        })

        // then
        expect(props.historyPush).toHaveBeenCalledWith('/verification-eligibilite/bientot')
      })

      it('should redirect to /pas-eligible when user is not eligible anymore', () => {
        // given
        checkIfAgeIsEligible.mockReturnValue('tooOld')

        const wrapper = mount(
          <MemoryRouter>
            <EligibilityCheck {...props} />
          </MemoryRouter>
        )

        const eligibilityPostalCodeInput = wrapper.find('input[placeholder="Ex: 75017"]')
        const eligibilityDateOfBirthInput = wrapper.find('input[placeholder="JJ/MM/AAAA"]')

        act(() => {
          eligibilityPostalCodeInput.invoke('onChange')({ target: { value: '93800' } })
          eligibilityDateOfBirthInput.invoke('onChange')({ target: { value: '05/03/1997' } })
        })
        wrapper.update()

        const eligibilityForm = wrapper.find('form')

        // when
        eligibilityForm.invoke('onSubmit')({
          preventDefault: jest.fn(),
        })

        // then
        expect(props.historyPush).toHaveBeenCalledWith('/verification-eligibilite/pas-eligible')
      })

      it('should redirect to /trop-tot when user is not eligible yet', () => {
        // given
        checkIfAgeIsEligible.mockReturnValue('tooYoung')

        const wrapper = mount(
          <MemoryRouter>
            <EligibilityCheck {...props} />
          </MemoryRouter>
        )

        const eligibilityPostalCodeInput = wrapper.find('input[placeholder="Ex: 75017"]')
        const eligibilityDateOfBirthInput = wrapper.find('input[placeholder="JJ/MM/AAAA"]')

        act(() => {
          eligibilityPostalCodeInput.invoke('onChange')({ target: { value: '93800' } })
          eligibilityDateOfBirthInput.invoke('onChange')({ target: { value: '05/03/2005' } })
        })
        wrapper.update()

        const eligibilityForm = wrapper.find('form')

        // when
        eligibilityForm.invoke('onSubmit')({
          preventDefault: jest.fn(),
        })

        // then
        expect(props.historyPush).toHaveBeenCalledWith('/verification-eligibilite/trop-tot')
      })
    })

    describe('when checking date', () => {
      beforeEach(() => {
        checkIfDepartmentIsEligible.mockReturnValue(true)
      })

      it('should redirect to /pas-eligible when day is invalid', () => {
        // given
        const wrapper = mount(
          <MemoryRouter>
            <EligibilityCheck {...props} />
          </MemoryRouter>
        )

        const eligibilityPostalCodeInput = wrapper.find('input[placeholder="Ex: 75017"]')
        const eligibilityDateOfBirthInput = wrapper.find('input[placeholder="JJ/MM/AAAA"]')

        act(() => {
          eligibilityPostalCodeInput.invoke('onChange')({ target: { value: '93800' } })
          eligibilityDateOfBirthInput.invoke('onChange')({ target: { value: '99/02/2002' } })
        })
        wrapper.update()

        const eligibilityForm = wrapper.find('form')

        // when
        eligibilityForm.invoke('onSubmit')({
          preventDefault: jest.fn(),
        })

        // then
        expect(props.historyPush).toHaveBeenCalledWith('/verification-eligibilite/pas-eligible')
      })

      it('should redirect to /pas-eligible when month is invalid', () => {
        // given
        const wrapper = mount(
          <MemoryRouter>
            <EligibilityCheck {...props} />
          </MemoryRouter>
        )

        const eligibilityPostalCodeInput = wrapper.find('input[placeholder="Ex: 75017"]')
        const eligibilityDateOfBirthInput = wrapper.find('input[placeholder="JJ/MM/AAAA"]')

        act(() => {
          eligibilityPostalCodeInput.invoke('onChange')({ target: { value: '93800' } })
          eligibilityDateOfBirthInput.invoke('onChange')({ target: { value: '03/99/2002' } })
        })
        wrapper.update()

        const eligibilityForm = wrapper.find('form')

        // when
        eligibilityForm.invoke('onSubmit')({
          preventDefault: jest.fn(),
        })

        // then
        expect(props.historyPush).toHaveBeenCalledWith('/verification-eligibilite/pas-eligible')
      })

      it('should redirect to /pas-eligible when birth year is over current year', () => {
        // given
        const wrapper = mount(
          <MemoryRouter>
            <EligibilityCheck {...props} />
          </MemoryRouter>
        )

        const eligibilityPostalCodeInput = wrapper.find('input[placeholder="Ex: 75017"]')
        const eligibilityDateOfBirthInput = wrapper.find('input[placeholder="JJ/MM/AAAA"]')

        act(() => {
          eligibilityPostalCodeInput.invoke('onChange')({ target: { value: '93800' } })
          eligibilityDateOfBirthInput.invoke('onChange')({ target: { value: '99/02/2021' } })
        })
        wrapper.update()

        const eligibilityForm = wrapper.find('form')

        // when
        eligibilityForm.invoke('onSubmit')({
          preventDefault: jest.fn(),
        })

        // then
        expect(props.historyPush).toHaveBeenCalledWith('/verification-eligibilite/pas-eligible')
      })
    })
  })

  describe('when user fills in birthdate input', () => {
    it('should add slash if two characters', () => {
      // given
      const wrapper = mount(
        <MemoryRouter>
          <EligibilityCheck {...props} />
        </MemoryRouter>
      )
      const eligibilityBirthDateInput = wrapper.find('input[placeholder="JJ/MM/AAAA"]')

      // when
      act(() => {
        eligibilityBirthDateInput.invoke('onChange')({
          target: { value: '02' },
          nativeEvent: { inputType: 'insertText' },
        })
      })
      wrapper.update()

      // then
      const eligibilityBirthDateInputUpdated = wrapper.find('input[placeholder="JJ/MM/AAAA"]')
      expect(eligibilityBirthDateInputUpdated.prop('value')).toBe('02/')
    })

    it('should add slash if four characters', () => {
      // given
      const wrapper = mount(
        <MemoryRouter>
          <EligibilityCheck {...props} />
        </MemoryRouter>
      )
      const eligibilityBirthDateInput = wrapper.find('input[placeholder="JJ/MM/AAAA"]')

      // when
      act(() => {
        eligibilityBirthDateInput.invoke('onChange')({
          target: { value: '0203' },
          nativeEvent: { inputType: 'insertText' },
        })
      })
      wrapper.update()

      // then
      const eligibilityBirthDateInputUpdated = wrapper.find('input[placeholder="JJ/MM/AAAA"]')
      expect(eligibilityBirthDateInputUpdated.prop('value')).toBe('02/03/')
    })

    it('should add two slashes if at least four characters', () => {
      // given
      const wrapper = mount(
        <MemoryRouter>
          <EligibilityCheck {...props} />
        </MemoryRouter>
      )
      const eligibilityBirthDateInput = wrapper.find('input[placeholder="JJ/MM/AAAA"]')

      // when
      act(() => {
        eligibilityBirthDateInput.invoke('onChange')({
          target: { value: '02032002' },
          nativeEvent: { inputType: 'insertText' },
        })
      })
      wrapper.update()

      // then
      const eligibilityBirthDateInputUpdated = wrapper.find('input[placeholder="JJ/MM/AAAA"]')
      expect(eligibilityBirthDateInputUpdated.prop('value')).toBe('02/03/2002')
    })

    it('should not add slash if one character', () => {
      // given
      const wrapper = mount(
        <MemoryRouter>
          <EligibilityCheck {...props} />
        </MemoryRouter>
      )
      const eligibilityBirthDateInput = wrapper.find('input[placeholder="JJ/MM/AAAA"]')

      // when
      act(() => {
        eligibilityBirthDateInput.invoke('onChange')({
          target: { value: '1' },
          nativeEvent: { inputType: 'insertText' },
        })
      })
      wrapper.update()

      // then
      const eligibilityBirthDateInputUpdated = wrapper.find('input[placeholder="JJ/MM/AAAA"]')
      expect(eligibilityBirthDateInputUpdated.prop('value')).toBe('1')
    })

    it('should not add slash at the end if three characters', () => {
      // given
      const wrapper = mount(
        <MemoryRouter>
          <EligibilityCheck {...props} />
        </MemoryRouter>
      )
      const eligibilityBirthDateInput = wrapper.find('input[placeholder="JJ/MM/AAAA"]')

      // when
      act(() => {
        eligibilityBirthDateInput.invoke('onChange')({
          target: { value: '021' },
          nativeEvent: { inputType: 'insertText' },
        })
      })
      wrapper.update()

      // then
      const eligibilityBirthDateInputUpdated = wrapper.find('input[placeholder="JJ/MM/AAAA"]')
      expect(eligibilityBirthDateInputUpdated.prop('value')).toBe('02/1')
    })

    it('should not add slash at the end if five characters', () => {
      // given
      const wrapper = mount(
        <MemoryRouter>
          <EligibilityCheck {...props} />
        </MemoryRouter>
      )
      const eligibilityBirthDateInput = wrapper.find('input[placeholder="JJ/MM/AAAA"]')

      // when
      act(() => {
        eligibilityBirthDateInput.invoke('onChange')({
          target: { value: '02102' },
          nativeEvent: { inputType: 'insertText' },
        })
      })
      wrapper.update()

      // then
      const eligibilityBirthDateInputUpdated = wrapper.find('input[placeholder="JJ/MM/AAAA"]')
      expect(eligibilityBirthDateInputUpdated.prop('value')).toBe('02/10/2')
    })

    it('should not be able to fill input with anything other than a number', () => {
      // given
      const wrapper = mount(
        <MemoryRouter>
          <EligibilityCheck {...props} />
        </MemoryRouter>
      )
      const eligibilityBirthDateInput = wrapper.find('input[placeholder="JJ/MM/AAAA"]')

      // when
      act(() => {
        eligibilityBirthDateInput.invoke('onChange')({
          target: { value: '0/2Ab1+' },
          nativeEvent: { inputType: 'insertText' },
        })
      })
      wrapper.update()

      // then
      const eligibilityBirthDateInputUpdated = wrapper.find('input[placeholder="JJ/MM/AAAA"]')
      expect(eligibilityBirthDateInputUpdated.prop('value')).toBe('02/1')
    })
  })
})