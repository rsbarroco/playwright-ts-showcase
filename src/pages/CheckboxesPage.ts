import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckboxesPage extends BasePage {
  protected readonly path = '/checkboxes';
  readonly boxes: Locator;

  constructor(page: Page) {
    super(page);
    this.boxes = page.locator('#checkboxes input[type="checkbox"]');
  }

  box(index: number): Locator {
    return this.boxes.nth(index);
  }
}
