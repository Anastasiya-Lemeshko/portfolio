const addItem = () => {
  const backItem = document.createElement('li');
  backItem.classList.add('portfolio__item', 'portfolio__item--close', 'portfolio__item--back');
  backItem.style.zIndex = '-1';
  backItem.setAttribute('aria-hidden', 'true');

  return backItem;
};

export { addItem };
