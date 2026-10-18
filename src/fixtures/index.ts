import { test as base, request as pwRequest } from '@playwright/test';
import { config, type AppConfig } from '../config/config';
import { PostsClient } from '../api/PostsClient';
import {
  CheckboxesPage,
  DropdownPage,
  DynamicLoadingPage,
  LoginPage,
  SecureAreaPage,
} from '../pages';
import { captureAnnotated } from '../utils/evidence';
import type { Locator } from '@playwright/test';

interface Fixtures {
  appConfig: AppConfig;
  loginPage: LoginPage;
  secureAreaPage: SecureAreaPage;
  checkboxesPage: CheckboxesPage;
  dropdownPage: DropdownPage;
  dynamicLoadingPage: DynamicLoadingPage;
  posts: PostsClient;
  evidence: (target: Locator, label: string) => Promise<void>;
}

export const test = base.extend<Fixtures>({
  // eslint-disable-next-line no-empty-pattern
  appConfig: async ({}, use) => use(config),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  secureAreaPage: async ({ page }, use) => use(new SecureAreaPage(page)),
  checkboxesPage: async ({ page }, use) => use(new CheckboxesPage(page)),
  dropdownPage: async ({ page }, use) => use(new DropdownPage(page)),
  dynamicLoadingPage: async ({ page }, use) => use(new DynamicLoadingPage(page)),
  posts: async ({ appConfig }, use) => {
    const baseURL = appConfig.api.baseUrl.replace(/\/?$/, '/');
    const ctx = await pwRequest.newContext({ baseURL });
    await use(new PostsClient(ctx));
    await ctx.dispose();
  },
  evidence: async ({ page }, use, testInfo) => {
    await use((target, label) => captureAnnotated(page, target, testInfo, label));
  },
});

export { expect } from '@playwright/test';
