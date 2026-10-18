import type { Locator, Page, TestInfo } from '@playwright/test';
import { config } from '../config/config';

const OVERLAY_ID = '__evidence_highlight__';

/**
 * Draws a box around the target element, captures a full-page screenshot,
 * attaches it to the HTML report and removes the overlay again.
 */
export async function captureAnnotated(
  page: Page,
  target: Locator,
  testInfo: TestInfo,
  label: string,
): Promise<void> {
  await target.scrollIntoViewIfNeeded();
  const box = await target.boundingBox();
  if (!box) throw new Error(`Cannot annotate "${label}": element is not visible`);
  const { highlightColor, highlightWidthPx } = config.evidence;

  await page.evaluate(
    ({ id, box, color, width, text }) => {
      const overlay = document.createElement('div');
      overlay.id = id;
      Object.assign(overlay.style, {
        position: 'absolute',
        left: `${box.x + window.scrollX - width}px`,
        top: `${box.y + window.scrollY - width}px`,
        width: `${box.width + width * 2}px`,
        height: `${box.height + width * 2}px`,
        border: `${width}px solid ${color}`,
        borderRadius: '4px',
        boxSizing: 'border-box',
        pointerEvents: 'none',
        zIndex: '2147483647',
      });
      const tag = document.createElement('span');
      tag.textContent = text;
      Object.assign(tag.style, {
        position: 'absolute',
        top: '-24px',
        left: '0',
        background: color,
        color: '#fff',
        font: 'bold 12px sans-serif',
        padding: '2px 6px',
        whiteSpace: 'nowrap',
      });
      overlay.appendChild(tag);
      document.body.appendChild(overlay);
    },
    { id: OVERLAY_ID, box, color: highlightColor, width: highlightWidthPx, text: label },
  );

  try {
    const body = await page.screenshot({ fullPage: true });
    await testInfo.attach(`evidence: ${label}`, { body, contentType: 'image/png' });
  } finally {
    await page.evaluate((id) => document.getElementById(id)?.remove(), OVERLAY_ID);
  }
}
