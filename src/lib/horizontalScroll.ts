export function enableHorizontalScroll() {
  document.addEventListener('wheel', (e: WheelEvent) => {
    // Find closest scroll-wheel-horizontal container
    const target = e.target as HTMLElement;
    const container = target.closest('.scroll-wheel-horizontal');
    
    if (container) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    }
  }, { passive: false });
}
