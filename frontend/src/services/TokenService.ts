const isValid = (value: string | null): value is string =>
  [null, undefined, ''].includes(value);

class TokenService {
  getUserInfo(): { refreshToken?: string; token?: string } {
    const userInfo: string | null = localStorage.getItem('userInfo');

    if (!isValid(userInfo)) {
      return {};
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user: { refreshToken?: string; token?: string } =
      JSON.parse(userInfo);
    return user;
  }

  getLocalRefreshToken(): string {
    const user = this.getUserInfo();
    return user?.refreshToken || '';
  }

  getLocalAccessToken(): string {
    const user = this.getUserInfo();
    return user?.token || '';
  }

  updateLocalAccessToken(token: string, refresh: string) {
    const user = this.getUserInfo();
    user.token = token;
    user.refreshToken = refresh;
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  removeUser() {
    localStorage.removeItem('userInfo');
  }
}

export default TokenService;
