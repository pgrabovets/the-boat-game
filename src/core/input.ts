export function Input() {
  let events: any[] = [];

  const onKeyDown = (e: KeyboardEvent) => {
    events.forEach((item) => item(e));
  };

  return {
    subscribe(event: string, cl: any) {
      events.push(cl);
      document.addEventListener("keydown", onKeyDown);
    },
    dispose() {
      events = [];
      document.removeEventListener("keydown", onKeyDown);
    },
  };
}
