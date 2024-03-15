import { copyFile, unlink } from 'fs/promises';
import sharp from 'sharp';

async function copyImage(file) {
    const { path, filename } = file;
    await copyFile(path, `public/images/${filename}`);
}

export async function compressImage(file, maxSize) {
    const { path, filename, size } = file;

    if (size < maxSize) {
        await copyImage(file);
    } else {
        await sharp(path)
            .resize(800)
            .jpeg({ quality: 80, chromaSubsampling: '4:2:0' })
            .toFile(`public/images/${filename}`);
    }

    await deleteImage(filename, true);
}

export async function deleteImage(filename, isTemp = false) {
    const path = isTemp ? `temp/${filename}` : `public/images/${filename}`;
    return await unlink(path);
}

export async function updateImage(req, maxSize) {
    await compressImage(req.file, maxSize);
    const oldImage = req.book.imageUrl.split('/images/')[1];
    await deleteImage(oldImage);
}
