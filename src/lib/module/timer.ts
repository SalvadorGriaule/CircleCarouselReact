const frame = 60;

export const timer = (
  time: number,
  fn: (frame: number) => void,
  fnComplete?: () => any 
) => {
  setTimeout(() => {
    if (time > 0) {
      fn(frame);
      timer(time - frame, fn,fnComplete);
    } else if (fnComplete) {
        fnComplete()
    }
  }, frame);
  return true;
};
