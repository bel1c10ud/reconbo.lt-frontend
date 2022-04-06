export function cookieStrParser(str: string): object[] {
  const cookieStrArray = str.split(';');
  const cookies = cookieStrArray.map((el: string) => {
    const [key, value] = el.trim().split('=');
    return { name: key, value: value }
  })

  return cookies;
}