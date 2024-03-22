export default (key?: string) => {
  if (!key || key.length < 20) return key;

  // Shorten the key to make it more readable
  return `${key?.substring(0, 8)}...${key?.substring(key.length - 8)}`
};
