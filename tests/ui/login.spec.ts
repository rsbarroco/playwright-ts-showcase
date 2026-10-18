import { test, expect } from '../../src/fixtures';
import {
  MISSING_CREDENTIALS_MESSAGE,
  hasUiCredentials,
  requireUiCredentials,
} from '../../src/config/config';

test.describe('Authentication', () => {
  // eslint-disable-next-line playwright/no-skipped-test
  test.skip(!hasUiCredentials(), MISSING_CREDENTIALS_MESSAGE);

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('valid credentials reach the secure area @smoke', async ({
    loginPage,
    secureAreaPage,
    evidence,
  }) => {
    const { username, password } = requireUiCredentials();
    await loginPage.login(username, password);

    await expect(secureAreaPage.heading).toBeVisible();
    await expect(secureAreaPage.flash).toContainText('You logged into a secure area!');
    await evidence(secureAreaPage.flash, 'login success message');
  });

  test('invalid password shows an error', async ({ loginPage, evidence }) => {
    await loginPage.login(requireUiCredentials().username, 'wrong-password');

    await expect(loginPage.flash).toContainText('Your password is invalid!');
    await evidence(loginPage.flash, 'invalid password error');
  });

  test('logout returns to the login page', async ({ loginPage, secureAreaPage }) => {
    const { username, password } = requireUiCredentials();
    await loginPage.login(username, password);
    await secureAreaPage.logout.click();

    await expect(loginPage.flash).toContainText('You logged out of the secure area!');
    await expect(loginPage.submit).toBeVisible();
  });
});
