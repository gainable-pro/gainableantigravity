
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const folder = (formData.get("folder") as string) || "uploads";

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        // Generate clean filename
        // 1. Sanitize original name
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        // 2. Add timestamp
        const filename = `${Date.now()}_${sanitizedName}`;
        // 3. Full Path in Bucket
        const filePath = `${folder}/${filename}`;

        const buffer = await file.arrayBuffer();

        // Upload to Supabase Storage (Bucket: 'gainable-assets')
        // Ensure you have a public bucket named 'gainable-assets'
        const { data, error } = await supabase
            .storage
            .from('gainable-assets')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (error) {
            console.error("Supabase Storage Error:", error);
            throw error;
        }

        // Get Public URL
        const { data: publicUrlData } = supabase
            .storage
            .from('gainable-assets')
            .getPublicUrl(filePath);

        return NextResponse.json({ url: publicUrlData.publicUrl });

    } catch (error: any) {
        console.error("Upload Error:", error);
        return NextResponse.json({
            error: "Upload failed.",
            details: error.message
        }, { status: 500 });
    }
}
