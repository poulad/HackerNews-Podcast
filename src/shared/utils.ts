export function delay(miliseconds: number): Promise<void> {
  return parseInt(miliseconds?.toString()) > 0
    ? new Promise((resolve) => setTimeout(resolve, miliseconds))
    : null;
}
