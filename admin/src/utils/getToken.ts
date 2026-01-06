/**
 * Because of this BUG https://github.com/strapi/strapi/issues/24846
 * the token may live in local storage or in the cookies
 */

const getToken = () => {
  // 1. Try the local storage first
  const token = localStorage.getItem('jwtToken');
  if (token) return token;

  // 2. If empty, try the cookies
  const cookieToken = getCookie('jwtToken');
  if (cookieToken) return cookieToken;

  // 3. Else, throw an error
  throw new Error('No token found');
};

function getCookie(cname: string): string | null {
  let name = cname + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export default getToken;
