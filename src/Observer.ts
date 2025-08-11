abstract class Observer {
  abstract subscribe(v: Listener): void;
  abstract unsubscribe(name: string): void;
  abstract publish(): void;
}

interface Listener {
  name: string;
  publish(event: string): void;
}

// sub/pub 패턴은 singleton으로 구현해주는게 좋음
export class SubscriptionManager {
  listeners: {
    [key: string]: Listener[];
  } = {};
  private static instance: SubscriptionManager;

  private constructor() {}

  addEvent(event: string) {
    if (this.listeners[event]) {
      return this.listeners[event];
    }
    this.listeners[event] = [];
    return this.listeners[event];
  }

  subscribe(event: string, listener: Listener): void {
    this.listeners[event].push(listener);
  }

  unsubscribe(event: string, name: string): void {
    this.listeners[event] = this.listeners[event].filter((l) => l.name !== name);
  }

  publish(event: string) {
    this.listeners[event].forEach((listener) => listener.publish(event));
  }

  static getInstance(): SubscriptionManager {
    if (!this.instance) {
      this.instance = new SubscriptionManager();
    }
    return this.instance;
  }
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
