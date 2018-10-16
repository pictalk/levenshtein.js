import { reqIdleCb, cancelIdleCb } from "./shim/requestIdle";

const enum M {
  None,
  Some,
}

type Maybe<T> = [M.None] | [M.Some, T];

export class IdleValue<T> {
  private $val: Maybe<T> = [M.None];
  private handle: Maybe<number>;

  constructor(private factory: () => T) {
    this.handle = [
      M.Some,
      reqIdleCb(() => {
        this.$val = [M.Some, this.factory()];
      }),
    ];
  }

  private cancelIdleCb(): void {
    if (this.handle[0]) {
      cancelIdleCb(this.handle[1]);
      this.handle = [M.None];
    }
  }

  get value(): T {
    if (this.$val[0]) {
      return this.$val[1];
    }

    this.cancelIdleCb();
    this.$val = [M.Some, this.factory()];

    return this.$val[1];
  }

  set value(new_value: T) {
    this.cancelIdleCb();
    this.$val = [M.Some, new_value];
  }
}
