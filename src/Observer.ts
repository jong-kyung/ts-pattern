abstract class Observer {
  abstract subscribe(v: Listener): void;
  abstract unsubscribe(name: string): void;
  abstract publish(): void;
}

interface Listener {
  name: string;
  publish(event: string): void;
}

export class SaveCompleteObserver extends Observer {
  private listeners: Listener[] = [];

  override subscribe(listener: Listener): void {
    this.listeners.push(listener);
  }

  override unsubscribe(name: string): void {
    this.listeners = this.listeners.filter((l) => l.name !== name);
  }

  override publish() {
    this.listeners.forEach((listener) => listener.publish("complete"));
  }
}
