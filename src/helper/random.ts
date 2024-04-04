export function random() {
  function randomPassword() {
    const length = Math.floor(Math.random() * 5) + 8;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Characters to include in the password
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  function randomNumber() {
    const length = Math.floor(Math.random() * 5) + 8;
    console.log('🚀 ~ randomNumber ~ length:', length);
  }

  return {
    randomPassword,
    randomNumber,
  };
}
