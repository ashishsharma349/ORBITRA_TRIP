const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  if (!password) return false;
  return password.length >= 6;
};

module.exports = {
  validateEmail,
  validatePassword,
};
