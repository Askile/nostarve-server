import fs from "fs";

export default class FileUtils {
    public static getFolderSize(folderPath: string, folderSize: number = 0): number {
        const files = fs.readdirSync(folderPath);
        for (const file of files) {
            const filePath = `${folderPath}/${file}`;
            const stats = fs.statSync(filePath);
            if (stats.isFile()) {
                folderSize += stats.size;
            } else if (stats.isDirectory()) {
                folderSize += FileUtils.getFolderSize(filePath, folderSize);
            }
        }
        return folderSize;
    }
}