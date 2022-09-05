
export default class UserInterfaceMessageFactory {
  static buildForAPI({message, timeout}) {
    // eslint-disable-next-line no-undef
    return new Notice(message, timeout);
  }
}
