import { Selector } from 'testcafe'

import { ROOT_PATH } from '../src/utils/config'
import createUserRoleFromUserSandbox from './helpers/createUserRoleFromUserSandbox'
import getPageUrl from './helpers/getPageUrl'

fixture('Navbar,')

test('quand je me connecte à l’app je peux naviguer sur le site via la navbar', async t => {
  const userRole = await createUserRoleFromUserSandbox(
    'webapp_10_menu',
    'get_existing_webapp_validated_user_with_has_filled_cultural_survey'
  )
  const linksOfNavBar = Selector('nav ul li a')
  const navBarDiscoveryLink = linksOfNavBar.nth(0)
  const navBarSearchLink = linksOfNavBar.nth(0)
  const navBarHomeLink = linksOfNavBar.nth(1)
  const navBarBookingsLink = linksOfNavBar.nth(2)
  const navBarFavoritesLink = linksOfNavBar.nth(3)

  await t
    .useRole(userRole)
    .navigateTo(`${ROOT_PATH}profil`)

    // je peux naviguer vers le carrousel
    .click(navBarDiscoveryLink)
    .expect(getPageUrl())
    .contains(`${ROOT_PATH}decouverte`)

    // je peux naviguer vers la recherche
    .click(navBarSearchLink)
    .expect(getPageUrl())
    .eql(`${ROOT_PATH}recherche`)

    // je peux naviguer vers la page accueil
    .click(navBarHomeLink)
    .expect(getPageUrl())
    .eql(`${ROOT_PATH}accueil`)

    // je peux naviguer vers la page reservations
    .click(navBarBookingsLink)
    .expect(getPageUrl())
    .eql(`${ROOT_PATH}reservations`)

    // je peux naviguer vers la page favoris
    .click(navBarFavoritesLink)
    .expect(getPageUrl())
    .eql(`${ROOT_PATH}favoris`)
})
