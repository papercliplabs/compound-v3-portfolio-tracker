// Extract the nested value of an object usign keypath like a.b.c => obj[a][b][c]
export function extractNestedValue<O>(obj: object, keyPath: string): O {
  let intermediate = obj;
  for (let key of keyPath.split(".")) {
    intermediate = (intermediate as any)[key];
  }
  return intermediate as any as O;
}
