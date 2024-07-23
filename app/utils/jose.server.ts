import * as jose from "jose";

const secret = jose.base64url.decode(process.env.JWT_SECRET);

const encryptedDataJWT = async (data: any) => {
  const jwt = await new jose.EncryptJWT({ ...data })
    .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
    .setExpirationTime("2h")
    .encrypt(secret);

  return jwt;
};

const decryptToken = async (token: string) => {
  try {
    const { payload, protectedHeader } = await jose.jwtDecrypt(token, secret);
    return payload;
  } catch (error) {
    return { payload: null };
  }
};

export { encryptedDataJWT, decryptToken };

// console.log("approval", jwt);
