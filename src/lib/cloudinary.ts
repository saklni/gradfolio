// =============================================================================
// Gradfolio — Cloudinary Configuration
// =============================================================================
// Server-only Cloudinary setup. NEVER import this file in client components.
// All Cloudinary operations (upload, delete) must happen server-side.
// =============================================================================

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Upload a file buffer to Cloudinary.
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string,
  options?: {
    publicId?: string;
    transformation?: Record<string, unknown>[];
  }
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: options?.publicId,
        overwrite: true,
        resource_type: "image",
        transformation: options?.transformation || [
          { width: 1200, height: 630, crop: "limit", quality: "auto", format: "webp" },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Delete an asset from Cloudinary by its public_id.
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Failed to delete Cloudinary asset:", publicId, error);
    // Non-critical: don't throw — log and continue
  }
}
