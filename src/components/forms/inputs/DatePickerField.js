/* eslint
  react/jsx-one-expression-per-line: 0 */
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'

const DatePickerCustomInput = React.forwardRef((props, ref) => (
  <input
    {...props}
    readOnly
    ref={ref}
    className="pc-final-form-datepicker-input"
  />
))

const buildPopperContainer = ({ current }) => ({ children }) => {
  if (!current) return null
  return ReactDOM.createPortal(children, current)
}

const DatePickerField = ({
  className,
  clearable,
  dateFormat,
  id,
  label,
  locale,
  name,
  placeholder,
  onChange,
  popperRefContainer,
  required,
  // NOTE -> Autres props du react-datepicker passées en option
  // github.com/Hacker0x01/react-datepicker/blob/master/docs/datepicker.md
  ...rest
}) => {
  const moreprops = { ...rest }
  if (popperRefContainer) {
    moreprops.popperContainer = buildPopperContainer(popperRefContainer)
  }
  return (
    <div className={`${className}`}>
      <label htmlFor={id || name} className="pc-final-form-datepicker">
        {label && (
          <span className="pc-final-form-label">
            <span>{label}</span>
            {required && <span className="pc-final-form-asterisk">*</span>}
          </span>
        )}
        <div className="pc-final-form-inner">
          <DatePicker
            id={id || name}
            locale={locale}
            onChange={onChange}
            dateFormat={dateFormat}
            isClearable={clearable}
            placeholderText={placeholder}
            customInput={<DatePickerCustomInput />}
            todayButton={"Aujourd'hui"}
            {...moreprops}
          />
        </div>
      </label>
    </div>
  )
}
/* <span className="icon">
    <Icon
      alt="Choisissez une date dans le calendrier"
      className="input-icon"
      svg="dropdown-disclosure-down"
    />
  </span> */

DatePickerField.defaultProps = {
  className: '',
  clearable: true,
  dateFormat: 'DD/MM/YYYY',
  icon: null,
  id: null,
  label: null,
  locale: 'fr',
  placeholder: 'Par date...',
  popperRefContainer: null,
  required: false,
}

DatePickerField.propTypes = {
  className: PropTypes.string,
  clearable: PropTypes.bool,
  dateFormat: PropTypes.string,
  icon: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  locale: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  popperRefContainer: PropTypes.object,
  required: PropTypes.bool,
}

export default DatePickerField