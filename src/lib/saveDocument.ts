import { apiFetch } from './api';

export async function saveToDocuments(
    title: string,
    type: string,
    icon: string,
    data: Record<string, unknown>
): Promise<unknown> {
    return apiFetch('/documents', {
        method: 'POST',
        body: JSON.stringify({ title, type, icon, data }),
    });
}
