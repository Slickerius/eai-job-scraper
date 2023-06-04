export function titleIncluder(x: string[]): string[] {
  let result: string[] = [...x];
  const arr = x.map((y) => y.toLowerCase());
  if (arr.includes("programmer")) {
    result = result.concat(["developer", "engineer", "software"]);
  }
  if (arr.includes("data")) {
    result = result.concat([]);
  }
  if (arr.includes("network")) {
    result = result.concat(["Jaringan"]);
  }
  if (arr.includes("security")) {
    result = result.concat(["hacker"]);
  }
  return result;
}
