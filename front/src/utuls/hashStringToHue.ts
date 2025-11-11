export const hashStringToHue = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (str.codePointAt(i) || 1) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 360);
};
