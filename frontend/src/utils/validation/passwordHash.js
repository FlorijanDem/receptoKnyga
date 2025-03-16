/**
 *
 * @param {*} password slaptazodis is formos
 * @returns uzsifruotas slaptazodis - stringas
 */
export const generateHash = async (password) => {
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", passwordData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };
  
  /**
   *
   * @param {*} inputPassword slaptazodis is formos
   * @param {*} storedHash slaptazodis sifruotas is db
   * @returns true arba false
   */
  export const checkPassword = async (inputPassword, storedHash) => {
    const inputHash = await generateHash(inputPassword);
    return inputHash === storedHash;
  };
  