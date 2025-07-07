import { debounce } from './utils.js';
import { showDescription, hideDescription } from './show-description.js';
import { hideFocus, setTabIndex } from './set-tabindex.js';
import { addItem } from './add-item.js';
import { SLIDER_WIDTH } from './constants.js';

const portfolio = document.querySelector('.portfolio');
const projectList = portfolio.querySelector('.portfolio__list');
const projects = Array.from(projectList.querySelectorAll('.portfolio__item'));
let isTablet = false;

let gapStyle = null;
let rowGap = null;
let projectHeight = null;

const setSize = () => {
  gapStyle = window.getComputedStyle(projectList).gap.split(' ');
  rowGap = parseFloat(gapStyle[0]);
  projectHeight = projects[0].offsetHeight + rowGap;
};

const setActiveProject = (active) => {
  const activeLinks = active.querySelectorAll('a');
  setTabIndex(activeLinks);

  active.classList.remove('portfolio__item--close');
  active.style.gridRow = `1 / ${projects.length + 2}`;

  setTimeout(() => {
    showDescription(active);
  }, 100);
};

const replacePreviousProject = (previousCard, indexPreviousCard, indexActiveCard) => {
  const previousLinks = previousCard.querySelectorAll('a');
  const backItem = portfolio.querySelector('.portfolio__item--back');
  backItem.style.gridRow = `${indexActiveCard + 1} / ${indexActiveCard + 2}`;

  previousCard.classList.add('portfolio__item--changed');
  hideDescription(previousCard);
  hideFocus(previousLinks);
  previousCard.classList.add('portfolio__item--close');
  previousCard.style.gridRow = `${indexPreviousCard + 1} / ${indexPreviousCard + 2}`;
};

const moveThumbs = (indexActive) => {
  projects.forEach((project, index) => {

    if (index > indexActive) {
      project.style.transform = `translateY(-${projectHeight}px)`;
    } else {
      project.style.transform = 'translateY(0)';
    }
  });
};

const isprojectOpen = () => projectList.classList.contains('portfolio__list--open') || document.querySelector('.portfolio__item--open');

const onProjectFirstClick = (active, indexActive) => {
  const newItem = addItem();
  projectList.classList.add('portfolio__list--changed');

  setTimeout(() => {
    projectList.classList.add('portfolio__list--open');
    projectList.appendChild(newItem);

    projects.forEach((project, index) => {
      project.classList.add('portfolio__item--close');

      if (index === indexActive) {
        newItem.style.height = `${project.scrollHeight}px`;
        newItem.style.gridRow = `${index + 1} / ${index + 2}`;
      } else {
        project.style.gridRow = `${index + 1} / ${index + 2}`;
      }
    });

    setSize();

    projectList.classList.remove('portfolio__list--changed');

    setActiveProject(active);
    moveThumbs(indexActive);
  }, 200);
};

const onProjectClick = (activeCard) => {
  const currentCard = portfolio.querySelector('.portfolio__item--open');

  if (activeCard && SLIDER_WIDTH.matches && activeCard !== currentCard) {

    const previousCard = projectList.querySelector('.portfolio__item--open');
    const indexPreviousCard = projects.indexOf(previousCard);
    const indexActiveCard = projects.indexOf(activeCard);

    if (!isprojectOpen()) {
      onProjectFirstClick(activeCard, indexActiveCard);
      isTablet = true;
      return;
    }

    activeCard.classList.add('portfolio__item--changed');
    moveThumbs(indexActiveCard);
    replacePreviousProject(previousCard, indexPreviousCard, indexActiveCard);

    setTimeout(() => {
      setActiveProject(activeCard, indexActiveCard);
      activeCard.classList.remove('portfolio__item--changed');
      previousCard.classList.remove('portfolio__item--changed');
    }, 100);
  }

  if (activeCard && !SLIDER_WIDTH.matches) {
    const previousCard = projectList.querySelector('.portfolio__item--open');

    if (!activeCard.classList.contains('portfolio__item--open')) {
      if (previousCard) {
        hideDescription(previousCard);
      }

      showDescription(activeCard);
    } else {
      hideDescription(activeCard);
    }
  }
};

projectList.addEventListener('click', (evt) => {
  if (document.activeElement.contains(evt.target) && document.activeElement.classList.contains('portfolio__item--open')) {
    return;
  }

  const activeCard = evt.target.closest('li');
  onProjectClick(activeCard);
});

projectList.addEventListener('keydown', (evt) => {
  const activeCard = document.activeElement;

  if (evt.key === 'Enter' && document.activeElement.tagName === 'LI') {
    onProjectClick(activeCard);
  }
});


const checkLayout = () => {
  if (isprojectOpen()) {
    const currentCard = projectList.querySelector('.portfolio__item--open');
    const indexCurrentCard = projects.indexOf(currentCard);

    if (SLIDER_WIDTH.matches && !isTablet) {
      projects.forEach((project) => {
        project.classList.remove('portfolio__item--mobile');
      });

      hideDescription(currentCard);
      setTimeout(() => {
        onProjectFirstClick(currentCard, indexCurrentCard);
      }, 50);

      isTablet = true;
    }

    if (!SLIDER_WIDTH.matches && isTablet) {
      hideDescription(currentCard);
      portfolio.querySelector('.portfolio__item--back').remove();
      projectList.classList.remove('portfolio__list--open');

      projects.forEach((project) => {
        project.classList.remove('portfolio__item--close');
        project.classList.add('portfolio__item--mobile');
        project.style.gridRow = 'unset';
        project.style.transform = 'translateY(0)';
      });

      showDescription(currentCard);

      isTablet = false;
    }
  }
};

const debouncedCheckLayout = debounce(checkLayout, 50);

window.addEventListener('resize', debouncedCheckLayout);
