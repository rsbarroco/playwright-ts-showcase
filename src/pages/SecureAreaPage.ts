import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SecureAreaPage extends BasePage {
  protected readonly path = '/secure';
  readonly heading: Locator;
  readonly flash: Locator;
  readonly logout: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Secure Area', exact: true });
    this.flash = page.locator('#flash');
    this.logout = page.getByRole('link', { name: 'Logout' });
  }
}
