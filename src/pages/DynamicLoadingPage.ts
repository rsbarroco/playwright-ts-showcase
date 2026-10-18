import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DynamicLoadingPage extends BasePage {
  protected readonly path = '/dynamic_loading/2';
  readonly start: Locator;
  readonly result: Locator;

  constructor(page: Page) {
    super(page);
    this.start = page.getByRole('button', { name: 'Start' });
    this.result = page.locator('#finish');
  }
}
