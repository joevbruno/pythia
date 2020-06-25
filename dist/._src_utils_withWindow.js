export const withWindow = fn => {
  if (typeof window !== 'undefined') {
    fn(window)
  }
}
