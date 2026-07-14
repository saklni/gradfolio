// =============================================================================
// Gradfolio — Avatar Upload Route Handler
// =============================================================================
// Handles profile avatar upload to Cloudinary via server-side processing.
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

    // Delete old avatar if exists
    if (oldPublicId) {
      await deleteFromCloudinary(oldPublicId);
    }

    // Upload to Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer, CLOUDINARY_CONFIG.AVATAR_FOLDER, {
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face", quality: "auto", format: "webp" },
      ],
    });

    // Update profile with new avatar
    const { error } = await supabase
      .from("profiles")
      .update({
        avatar_url: result.url,
        avatar_public_id: result.publicId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Profile avatar update error:", error);
      return NextResponse.json(
        { success: false, message: "Gagal menyimpan avatar ke profil." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Avatar berhasil diunggah",
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengunggah avatar. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
