export function extractFilename(url: string): string {
  const regex = /%2F(.*?)\?alt/;
  const match = url.match(regex);
  return match ? decodeURIComponent(match[1]) : "";
}
