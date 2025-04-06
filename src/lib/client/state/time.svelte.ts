class Time {
  #now = $state(new Date());

  constructor() {
    $effect.root(() => {
      const interval = setInterval(() => {
        this.#now = new Date();
      }, 10);
      return () => clearInterval(interval);
    });
  }

  get now() {
    return this.#now;
  }
}

export default new Time();
