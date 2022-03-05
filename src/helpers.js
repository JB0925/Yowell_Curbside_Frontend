const debounce = (func) => {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => func(), 150);
  };
};

export { debounce };
