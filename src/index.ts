declare module 'ts-morse' {
/**
 * Detect SOS morse signal from the given element.
 * @param element - The html element.
 * @param callback - The function called when the signal is detected.
 */
  export function detectSos(element: HTMLElement, callback: () => void): void
}