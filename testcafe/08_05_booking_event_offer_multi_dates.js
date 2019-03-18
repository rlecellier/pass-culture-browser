import moment from 'moment-timezone'
import { Selector } from 'testcafe'

import { fetchSandbox } from './helpers/sandboxes'
import getMenuWalletValue from './helpers/getMenuWalletValue'
import getPageUrl from './helpers/getPageUrl'
import { ROOT_PATH } from '../src/utils/config'
import { createUserRole } from './helpers/roles'

let offerPage = null
let offerPageVerso = null
let offerBookingPage = null
let currentBookedToken = null
let currentSelectedDay = null
let currentSelectedTime = null
let previousWalletValue = null
const myProfileURL = `${ROOT_PATH}profil`
const discoverURL = `${ROOT_PATH}decouverte`
const myBookingsURL = `${ROOT_PATH}reservations`

const bookingToken = Selector('#booking-booked-token')
const bookOfferButton = Selector('#verso-booking-button')
const alreadyBookedOfferButton = Selector('#verso-already-booked-button')
const bookingSuccessButton = Selector('#booking-success-ok-button')
const closeMenu = Selector('#main-menu-close-button')
const openMenuFromVerso = Selector('#verso-footer .profile-button')
const bookingErrorReasons = Selector('#booking-error-reasons p')
const openVerso = Selector('#deck-open-verso-button')
const timeSelectBox = Selector('#booking-form-time-picker-field')
const dateSelectBox = Selector('#booking-form-date-picker-field')
const sendBookingButton = Selector('#booking-validation-button')
const myBookingsMenuButton = Selector('#main-menu-reservations-button')
const profileWalletAllValue = Selector('#profile-wallet-balance-value')
const pickerPopper = Selector('#datepicker-popper-container')
const selectableDates = pickerPopper.find(
  '.react-datepicker__day:not(.react-datepicker__day--disabled)'
)
const selectedTime = timeSelectBox.find('.ant-select-selection-selected-value')

fixture(`08_05 Réservation d'une offre type event à dates multiple`).beforeEach(
  async t => {
    const { user } = await fetchSandbox(
      'webapp_08_booking',
      'get_existing_webapp_user_can_book_multidates'
    )
    const { offer } = await fetchSandbox(
      'webapp_08_booking',
      'get_non_free_event_offer'
    )
    offerPage = `${discoverURL}/${offer.id}`
    offerPageVerso = `${offerPage}/verso`
    offerBookingPage = `${offerPage}/booking`
    await t
      .useRole(createUserRole(user))
      .navigateTo(offerPage)
      .click(openVerso)
  }
)

test(`Le formulaire de réservation contient un selecteur de date et d'horaire`, async t => {
  await t
    .click(bookOfferButton)
    .expect(getPageUrl())
    .eql(offerBookingPage)
    .expect(dateSelectBox.exists)
    .ok()
    .expect(timeSelectBox.exists)
    .ok()
    .expect(pickerPopper.exists)
    .ok()
})

// FIXME -> gerer la requete dans la sandbox,
// quand on saute de mois
test.skip(`Le formulaire de réservation contient de multiple dates`, async t => {
  await t
    .click(bookOfferButton)
    .expect(dateSelectBox.exists)
    .ok()
    .click(dateSelectBox)
    .expect(selectableDates.count)
    .gt(1)
})

test(`Je selectionne la premiere date, le champs de date se met à jour, une horaire est selectionée`, async t => {
  await t
    .click(bookOfferButton)
    .expect(dateSelectBox.exists)
    .ok()
    .click(dateSelectBox)
    .click(selectableDates.nth(0))
    .expect(dateSelectBox.value)
    .match(/^[0-9]{2}\s[a-zéû]{3,9}\s[0-9]{4}$/gi)
    .expect(selectedTime.textContent)
    .match(/^[0-9]{2}:[0-9]{2}\s-\s[0-9]+\s€$/gi)
})

test(`Parcours complet de réservation d'une offre event à date unique`, async t => {
  await t.click(openMenuFromVerso).wait(500)
  previousWalletValue = await getMenuWalletValue()
  await t
    .expect(previousWalletValue)
    .gt(0)
    .click(closeMenu)
    .click(bookOfferButton)
    .click(dateSelectBox)
    .click(selectableDates.nth(0))

  currentSelectedDay = await dateSelectBox.value
  currentSelectedTime = await selectedTime.textContent
  currentSelectedTime = currentSelectedTime.slice(0, 5)

  await t
    .click(sendBookingButton)
    .expect(bookingErrorReasons.count)
    .eql(0)
    .expect(bookingToken.exists)
    .ok()

  currentBookedToken = await bookingToken.textContent
  await t
    .click(bookingSuccessButton)
    .expect(getPageUrl())
    .eql(offerPage)
    .expect(alreadyBookedOfferButton.textContent)
    .eql(`Réservé`)
    .click(openMenuFromVerso)

  const currentWalletValue = await getMenuWalletValue()
  await t
    .expect(currentWalletValue)
    .gte(0)
    .expect(currentWalletValue)
    .lt(previousWalletValue)
  previousWalletValue = await getMenuWalletValue()

  const bookedOffer = Selector(
    `.booking-item[data-token="${currentBookedToken}"]`
  )
  await t
    .click(myBookingsMenuButton)
    .expect(bookedOffer.exists)
    .ok()
    .click(bookedOffer)
    .expect(getPageUrl())
    .eql(offerPageVerso)
    .expect(alreadyBookedOfferButton.textContent)
    .eql(`Réservé`)
})

// test(`Parcours complet de réservation d'une offre digitale`)

test(`Je vérifie mes réservations, après reconnexion`, async t => {
  const bookedOffer = Selector(
    `.booking-item[data-token="${currentBookedToken}"]`
  )

  await t
    .navigateTo(myBookingsURL)
    .expect(bookedOffer.exists)
    .ok()

  const bookedTimezone = await bookedOffer.getAttribute('data-booked-timezone')

  let bookedDate = await bookedOffer.getAttribute('data-booked-date')
  bookedDate = moment(bookedDate).toISOString()

  const format = 'DD MMMM YYYY h:m'
  let date = `${currentSelectedDay} ${currentSelectedTime}`
  date = moment.tz(date, format, bookedTimezone).toISOString()

  await t
    .expect(bookedDate)
    .eql(date)
    .click(bookedOffer)
    .click(openVerso)
    .expect(alreadyBookedOfferButton.textContent)
    .eql(`Réservé`)
    .click(alreadyBookedOfferButton)
    .expect(getPageUrl())
    .eql(myBookingsURL)
})

test(`Je vérifie le montant de mon pass, après reconnexion`, async t => {
  const walletInfoSentence = `Il reste ${previousWalletValue} €`
  await t
    .navigateTo(myProfileURL)
    .expect(profileWalletAllValue.textContent)
    .eql(walletInfoSentence)
})

test(`Je ne peux plus réserver cette offre, après reconnexion`, async t => {
  await t
    .click(openMenuFromVerso)
    .expect(bookOfferButton.exists)
    .notOk()
    .expect(alreadyBookedOfferButton.exists)
    .ok()
})