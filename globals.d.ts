declare module '*.css' {
  const styles: { [className: string]: string };
  export default styles;
}

declare function gtag(
  command: 'event',
  eventName: string,
  params?: Record<string, unknown>
): void;
