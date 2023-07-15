import * as bcrypt from 'bcrypt';
// import { SALT_ROUNDS } from 'src/constants';

const encryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(7); // TODO: SALT_ROUNDS
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
};

const comparePasswords = async (
  enteredPassword: string,
  createdPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(enteredPassword, createdPassword);
};

export { encryptPassword, comparePasswords };
