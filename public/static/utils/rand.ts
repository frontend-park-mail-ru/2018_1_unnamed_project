/**
 * Генерирует рандомное число в интервале [min, max).
 * @param min
 * @param max
 * @return {number}
 */
const rand = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min);

export default rand;
