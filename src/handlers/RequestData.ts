export interface RequestData {
    body: string;
}
export function isRequestData(data: unknown): data is RequestData {
    if (typeof data !== 'object' || data === null) return false;
    const obj = data as Record<string, unknown>;
    return typeof obj.body === 'string';
}
