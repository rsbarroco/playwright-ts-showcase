import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DropdownPage extends BasePage {
  protected readonly path = '/dropdown';
  readonly select: Locator;

  constructor(page: Page) {
    super(page);
    this.select = page.locator('#dropdown');
  }

  async choose(label: string): Promise<void> {
    await this.select.selectOption({ label });
  }
}
