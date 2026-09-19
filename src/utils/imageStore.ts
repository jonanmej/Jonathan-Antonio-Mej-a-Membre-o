export const imageStore = new Map<string, string>();
const listeners: (() => void)[] = [];

export const subscribeToImages = (callback: () => void) => {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
  };
};

export const notifyImageChange = () => {
  listeners.forEach(cb => cb());
};
