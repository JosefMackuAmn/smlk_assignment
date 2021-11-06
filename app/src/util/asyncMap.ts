export const asyncMap = async <P, T>(arr: T[], cb: (item: T, idx: number) => Promise<P>) => {
    return Promise.all(arr.map((item, idx) => {
        return cb(item, idx);
    }));
}