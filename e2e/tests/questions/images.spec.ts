import { test, expect } from '../../fixtures/test-data.fixture';
import { selectors } from '../../support/helpers/selectors';
import path from 'path';

const TEST_IMAGE_PATH = path.resolve(__dirname, '../../fixtures/assets/test-image.png');

// A publicly accessible test image URL for API-seeded questions
const TEST_IMAGE_URL = 'https://placehold.co/300x200.png';

test.describe('Questions - Images', () => {
  test.use({ storageState: '.auth/user.json' });

  test('question with images shows gallery on detail page', async ({
    page,
    api,
    testUser,
    testCircle,
  }) => {
    // Create a question with images via API
    const question = await api.createQuestion(
      testUser.token,
      testCircle._id,
      {
        title: `Image Gallery Test ${Date.now()}`,
        body: 'Question with images',
        ownerId: testUser.user._id,
        ownerName: testUser.user.username,
        images: [TEST_IMAGE_URL],
      }
    );

    const circleName = testCircle.name.replace('c/', '');

    // Navigate to the question detail page
    await page.goto(`/c/${circleName}/questions/${question.slug || question._id}`);
    await page.waitForLoadState('networkidle');

    // Verify the gallery is visible
    await expect(page.locator(selectors.images.gallery)).toBeVisible({ timeout: 5000 });
  });

  test('image upload UI shows preview and allows removal', async ({
    page,
    testCircle,
  }) => {
    const circleName = testCircle.name.replace('c/', '');

    // Navigate to question creation form
    await page.goto(`/c/${circleName}/questions/create`);
    await page.waitForLoadState('networkidle');

    // The PrimeNG FileUpload basic mode renders an input[type=file] inside the component
    const fileInput = page.locator(`${selectors.images.uploadInput} input[type="file"]`);

    // Upload a test image
    await fileInput.setInputFiles(TEST_IMAGE_PATH);

    // Verify image preview is shown
    await expect(page.locator('img[alt="Image preview"]')).toBeVisible({ timeout: 5000 });

    // Verify remove button is visible
    await expect(page.locator(selectors.images.removeButton)).toBeVisible();

    // Remove the image
    await page.click(selectors.images.removeButton);

    // Verify preview is gone
    await expect(page.locator('img[alt="Image preview"]')).not.toBeVisible();
  });

  test('edit question: remove image and submit succeeds', async ({
    page,
    api,
    testUser,
    testCircle,
  }) => {
    // Create a question with an image via API
    const question = await api.createQuestion(
      testUser.token,
      testCircle._id,
      {
        title: `Edit Image Test ${Date.now()}`,
        body: '<p>Question with image to remove</p>',
        ownerId: testUser.user._id,
        ownerName: testUser.user.username,
        images: [TEST_IMAGE_URL],
      }
    );

    const circleName = testCircle.name.replace('c/', '');

    // Navigate to edit page
    await page.goto(`/c/${circleName}/questions/${question.slug || question._id}/edit`);
    await page.waitForLoadState('networkidle');

    // Wait for the image preview to appear (existing image loaded)
    await expect(page.locator('img[alt="Image preview"]')).toBeVisible({ timeout: 10000 });

    // Remove the image
    await page.click(selectors.images.removeButton);
    await expect(page.locator('img[alt="Image preview"]')).not.toBeVisible();

    // Submit the form
    await page.locator('p-button[type="submit"]').click();

    // Should navigate to the question detail page on success
    await page.waitForURL(new RegExp(`${circleName}/questions/`), { timeout: 10000 });

    // Verify the gallery is no longer visible (image was removed)
    await expect(page.locator(selectors.images.gallery)).not.toBeVisible({ timeout: 5000 });
  });
});
