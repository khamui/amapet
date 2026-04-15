const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

export const uploadToImgBB = async (imageBuffer: Buffer): Promise<string> => {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error('IMGBB_API_KEY is not configured');
  }

  const base64Image = imageBuffer.toString('base64');

  const formData = new URLSearchParams();
  formData.append('key', apiKey);
  formData.append('image', base64Image);

  const response = await fetch(IMGBB_API_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ImgBB upload failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(`ImgBB upload failed: ${JSON.stringify(data)}`);
  }

  return data.data.display_url;
};
