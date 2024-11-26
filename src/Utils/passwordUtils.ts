import bcrypt from "bcrypt";

/**
 * @TODO use this function instead of having the same code in multiple places
 * 
 * @param plainTextPassword 
 * @returns 
 */
export const hashPassword = async (
  plainTextPassword: string
): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

  return hashedPassword;
};
