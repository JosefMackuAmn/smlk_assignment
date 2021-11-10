// Calls async callback on every item in an input array
// and waits for them to finish before returning an array
// of callback's return values
const asyncMap = async <P, T>(arr: T[], cb: (item: T, idx: number) => Promise<P>) => {
    return Promise.all(arr.map((item, idx) => {
        return cb(item, idx);
    }));
}

export { asyncMap };