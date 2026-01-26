export function isRequestData(data) {
    if (typeof data !== 'object' || data === null)
        return false;
    const obj = data;
    return typeof obj.body === 'string';
}
