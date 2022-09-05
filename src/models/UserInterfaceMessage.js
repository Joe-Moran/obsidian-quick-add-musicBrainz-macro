export default class UserInterfaceMessage {
  constructor({message, timeout = 5000}) {
    this.message = message;
    this.timeout = timeout;
  }
}
