export class KeyMapper {
  static map(key) {
    return {
      key: key.APIKey,
      secret: key.APISecret,
      signature: key.APISignature,
      nonce: key.nonce
    }
  }
}
