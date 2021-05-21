import { Observable } from 'rxjs';

export const observeResizeOn = <T extends Element>(
  target: T,
  options?: ResizeObserverOptions,
) =>
  new Observable<T>(observer => {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        observer.next(entry.target as T);
      }
    });
    resizeObserver.observe(target, options);
    return () => {
      resizeObserver.unobserve(target);
      resizeObserver.disconnect();
    };
  });
