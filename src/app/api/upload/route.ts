
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

        const fileType = (formData.get("type") as string) || "media";
        const entityName = (formData.get("entityName") as string) || "";
        const city = (formData.get("city") as string) || "";

        // Helper to slugify string
        const slugify = (str: string) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // Generate clean SEO filename
        let ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        if (ext === 'jpeg') ext = 'jpg';
        
        let seoPrefix = "climatisation-gainable";
        if (fileType === "logo") {
            seoPrefix = `logo-installateur-climatisation-rge${entityName ? '-' + slugify(entityName) : ''}${city ? '-' + slugify(city) : ''}`;
        } else if (fileType === "article" || fileType === "blog") {
            seoPrefix = `installation-climatisation-gainable${entityName ? '-' + slugify(entityName) : ''}`;
        } else if (entityName) {
            seoPrefix = `${seoPrefix}-${slugify(entityName)}`;
        }

        const uniqueSuffix = Date.now().toString().slice(-6);
        const filename = `${seoPrefix}-${uniqueSuffix}.${ext}`;
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
