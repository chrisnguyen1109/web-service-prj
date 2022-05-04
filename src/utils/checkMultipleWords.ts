export const checkMultipleWords = (value: string, length: number) => {
    return value.trim().split(' ').length >= length;
};
