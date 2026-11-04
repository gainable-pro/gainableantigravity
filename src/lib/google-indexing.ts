import { google } from 'googleapis';
import path from 'path';

const KEY_FILE = path.join(process.cwd(), 'gsc-credentials.json');

export async function notifyGoogleIndexing(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED') {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: KEY_FILE,
            scopes: ['https://www.googleapis.com/auth/indexing'],
        });

        const indexing = google.indexing({ version: 'v3', auth });

        const res = await indexing.urlNotifications.publish({
            requestBody: {
                url,
                type,
            },
        });

        console.log(`[Google Indexing API] Successfully notified for ${url}`);
        return { success: true, data: res.data };
    } catch (error: any) {
        console.warn(`[Google Indexing API Warning] Could not notify for ${url}:`, error.message);
        return { success: false, error: error.message };
    }
}
