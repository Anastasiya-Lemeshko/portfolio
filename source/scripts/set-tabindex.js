const portfolio = document.querySelector('.portfolio');
const portfolioLinks = portfolio.querySelectorAll('a');

const hideFocus = (links) => {
  links.forEach((link) => {
    link.setAttribute('tabindex', '-1');
  });
};

const setTabIndex = (activeLinks) => {
  activeLinks.forEach((link) => {
    link.setAttribute('tabindex', '0');
  });
};

hideFocus(portfolioLinks);

export { hideFocus, setTabIndex };
