export const toggleOnfilters = (array: string[], item: string): string[] => {
    const index = array.indexOf(item);
    if (index === -1) {
      return [...array, item];
    } else {
      return [...array.slice(0, index), ...array.slice(index + 1)];
    }
  };