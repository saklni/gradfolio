// =============================================================================
// Gradfolio — Cover Image Upload Route Handler
// =============================================================================
// Handles cover image upload to Cloudinary via server-side processing.
// Credentials are never exposed to the client.
// =============================================================================

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { CLOUDINARY_CONFIG } from "@/constants";

export async function POST(request: Request) {
  try {
    // Verify authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const oldPublicId = formData.get("oldPublicId") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File wajib diunggah" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!(CLOUDINARY_CONFIG.ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: `Format file tidak didukung. Gunakan: ${CLOUDINARY_CONFIG.ALLOWED_IMAGE_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > CLOUDINARY_CONFIG.MAX_FILE_SIZE) {
      const maxMB = (CLOUDINARY_CONFIG.MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
      return NextResponse.json(
        { success: false, message: `Ukuran file terlalu besar. Maksimal ${maxMB}MB.` },
        { status: 400 }
      );
    }

    // Delete old cover if exists
    if (oldPublicId) {
      await deleteFromCloudinary(oldPublicId);
    }

    // Upload to Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer, CLOUDINARY_CONFIG.COVER_FOLDER, {
      transformation: [
        { width: 1200, height: 630, crop: "limit", quality: "auto", format: "webp" },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "Cover berhasil diunggah",
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error) {
    console.error("Cover upload error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengunggah cover. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
