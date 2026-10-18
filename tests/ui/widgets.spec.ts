import { test, expect } from '../../src/fixtures';

test.describe('Form widgets', () => {
  test('checkboxes can be toggled', async ({ checkboxesPage, evidence }) => {
    await checkboxesPage.open();
    await expect(checkboxesPage.boxes).toHaveCount(2);

    await checkboxesPage.box(0).check();
    await checkboxesPage.box(1).uncheck();

    await expect(checkboxesPage.box(0)).toBeChecked();
    await expect(checkboxesPage.box(1)).not.toBeChecked();
    await evidence(checkboxesPage.box(0), 'checkbox 1 checked');
  });

  test('dropdown selection is applied', async ({ dropdownPage, evidence }) => {
    await dropdownPage.open();
    await dropdownPage.choose('Option 2');

    await expect(dropdownPage.select).toHaveValue('2');
    await evidence(dropdownPage.select, 'Option 2 selected');
  });

  test('dynamically rendered content appears after loading', async ({
    dynamicLoadingPage,
    evidence,
  }) => {
    await dynamicLoadingPage.open();
    await dynamicLoadingPage.start.click();

    await expect(dynamicLoadingPage.result).toHaveText('Hello World!', { timeout: 15_000 });
    await evidence(dynamicLoadingPage.result, 'loaded content');
  });
});
