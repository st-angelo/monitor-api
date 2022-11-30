export const mockPromise = () => new Promise(resolve => setTimeout(resolve, 0));

export const trimNested = (input: any) => {
  if (typeof input === 'string') return input.trim();
  if (input !== null && typeof input === 'object') {
    Object.keys(input).forEach(key => {
      input[key] = trimNested(input[key]);
    });
  }
  return input;
};
