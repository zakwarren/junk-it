import bcrypt from "bcrypt";

const saltRounds = 12;

export class PasswordManager {
  static async toHash(password: string) {
    return bcrypt.hash(password, saltRounds);
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    return bcrypt.compare(suppliedPassword, storedPassword);
  }
}
