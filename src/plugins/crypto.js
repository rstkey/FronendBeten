import aes from 'crypto-js/aes'
import { enc } from 'crypto-js/core'

/* These two functions are injected into the global Vue application
as this.$encrypt and this.$decrypt accepting the string to encrypt
and the encrypted message to decrypt respectively
*/
const encrypt = (string) =>
  aes.encrypt(String(string), process.env.VUE_APP_ENCRYPTION_KEY)

const decrypt = (encrypted) =>
  aes.decrypt(encrypted, process.env.VUE_APP_ENCRYPTION_KEY).toString(enc.Utf8)

export { encrypt, decrypt }
