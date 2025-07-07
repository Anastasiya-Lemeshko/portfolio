import { TRANSFORM_X } from './constants';

const showDescription = (active) => {
  active.classList.add('portfolio__item--open');
  const description = active.querySelector('.portfolio__description');
  description.style.width = '100%';
  description.style.maxHeight = `${description.scrollHeight + TRANSFORM_X}px`;
};

const hideDescription = (previous) => {
  previous.classList.remove('portfolio__item--open');
  const description = previous.querySelector('.portfolio__description');
  description.style.width = '0';
  description.style.maxHeight = '0';
};

export { showDescription, hideDescription };
