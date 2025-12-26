
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Function to recursively get all files
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });

    return arrayOfFiles;
}

async function main() {
    console.log("--- RANDOMIZING ARTICLE IMAGES ---");

    const assetsDir = path.join(process.cwd(), 'public', 'assets', 'images');
    const allFiles = getAllFiles(assetsDir);

    // Filter for images
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const validImages = allFiles
        .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
        .map(file => {
            // Convert absolute path to relative public path
            // e.g., C:\...\public\assets\images\foo.jpg -> /assets/images/foo.jpg
            const relativePath = file.split('public')[1].replace(/\\/g, '/');
            return relativePath;
        });

    console.log(`Found ${validImages.length} images.`);
    if (validImages.length === 0) {
        console.error("No images found!");
        return;
    }

    // Get all articles
    const articles = await prisma.article.findMany({
        select: { id: true }
    });
    console.log(`Found ${articles.length} articles to update.`);

    // Batch update to avoid overwhelming DB
    const BATCH_SIZE = 50;
    for (let i = 0; i < articles.length; i += BATCH_SIZE) {
        const batch = articles.slice(i, i + BATCH_SIZE);
        const updates = batch.map(article => {
            const randomImage = validImages[Math.floor(Math.random() * validImages.length)];
            return prisma.article.update({
                where: { id: article.id },
                data: { mainImage: randomImage }
            });
        });

        await prisma.$transaction(updates);
        console.log(`Updated articles ${i + 1} to ${Math.min(i + BATCH_SIZE, articles.length)}`);
    }

    console.log("Done!");
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
