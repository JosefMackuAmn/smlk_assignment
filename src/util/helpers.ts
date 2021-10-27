export const asyncForEach = async <T>(arr: T[], cb: (item: T, idx: number) => Promise<void>) => {
    return Promise.all(arr.map((item, idx) => {
        return cb(item, idx);
    }));
}