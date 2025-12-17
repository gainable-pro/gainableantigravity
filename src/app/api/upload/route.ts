
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");

        const folder = (formData.get("folder") as string) || "uploads";

        // Security check: ensure folder is one of allowed list to prevent traversal
        const allowedFolders = ["uploads", "articles", "avatars", "logos"];
        const safeFolder = allowedFolders.includes(folder) ? folder : "uploads";

        // Save to public/[folder] directory
        const uploadDir = path.join(process.cwd(), "public", safeFolder);

        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        // Return relative path for frontend access
        return NextResponse.json({ url: `/${safeFolder}/${filename}` });

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Upload failed." }, { status: 500 });
    }
}
