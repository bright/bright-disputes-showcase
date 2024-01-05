export default (key?: string) => {
  if (!key || key.length < 20) return key;

  return `${key?.substring(0, 8)}...${key?.substring(key.length - 8)}`
};
