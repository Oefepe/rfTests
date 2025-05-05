type RecursiveObjectProps = Record<string, unknown>;

export const trimObjectValues = (
  obj: RecursiveObjectProps
): RecursiveObjectProps => {
  let currentDepth = 0;
  const maxDepth = 2;

  const trimRecursive = (obj: RecursiveObjectProps): RecursiveObjectProps => {
    currentDepth++;
    if (currentDepth > maxDepth) {
      currentDepth--;
      return obj;
    }

    const result: RecursiveObjectProps = { ...obj };

    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        result[key] = (obj[key] as string).trim();
      } else if (
        typeof obj[key] === 'object' &&
        !Array.isArray(obj[key]) &&
        !(obj[key] instanceof Set) &&
        !(obj[key] instanceof Map)
      ) {
        result[key] = trimRecursive(obj[key] as RecursiveObjectProps);
      }
    }

    currentDepth--;
    return result;
  };

  return trimRecursive(obj);
};
