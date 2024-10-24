export const pluralizeName = (username: string): string => {
  username = username?.trim();
  if (username?.toLowerCase().endsWith('s') && 
      (username?.toLowerCase().endsWith('s') !== username?.endsWith('s'))) {
    return `${username}'`;
  }
  return `${username}'s`;
}