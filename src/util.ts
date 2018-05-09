export function rnd(): number;
export function rnd(a: number): number;
export function rnd<T>(a: T[]): T;
export function rnd(a: number, b: number): number;
export function rnd<T>(a?: number | T, b?: number): T | number {

    if (typeof a == 'number' && b !== undefined) {
        return (a + (b - a) * Math.random()) | 0;
    }

    if (typeof a == 'number') {
        return (a * Math.random()) | 0;
    }

    if (a instanceof Array) {
        return a[(a.length * Math.random()) | 0];
    }

    return Math.random();
}
