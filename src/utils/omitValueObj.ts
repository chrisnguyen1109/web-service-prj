export const omitValueObj = (obj: object, keys: string[]) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([k]) => !keys.includes(k))
    );
};
