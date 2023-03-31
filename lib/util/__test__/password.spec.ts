import { comparePassword, encryptPassword } from '@util/password';

describe('encryptPassword() function', () => {
  test('should return an encrypted password', async () => {
    const password = 'password';
    const encryptedPassword = await encryptPassword(password);

    expect(password.length).toBeLessThanOrEqual(encryptedPassword.length);

    expect(password).not.toEqual(encryptedPassword);
    expect(encryptedPassword).not.toBeNull();
    expect(encryptedPassword).not.toBeUndefined();
  });
});

describe('comparePassword() function', () => {
  test('should return true when compare an encrypted password and an original password', async () => {
    const password = 'password';
    const encryptedPassword = await encryptPassword(password);
    const isMatch = await comparePassword(password, encryptedPassword);

    expect(isMatch).toEqual(true);

    expect(encryptedPassword).not.toBeNull();
    expect(encryptedPassword).not.toBeUndefined();
  });

  test('should return false when compare an encrypted password and not original password', async () => {
    const password = 'password';
    const wrongPassword = 'wrongPassword';
    const encryptedPassword = await encryptPassword(password);
    const isMatch = await comparePassword(wrongPassword, encryptedPassword);

    expect(isMatch).toEqual(false);

    expect(encryptedPassword).not.toBeNull();
    expect(encryptedPassword).not.toBeUndefined();
  });
});
