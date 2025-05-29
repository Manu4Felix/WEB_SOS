document.addEventListener('DOMContentLoaded', () => {
  const isLiveServer = location.port === "5500" || location.port === "5501";
  document.querySelectorAll('a[data-page]').forEach(a => {
    if (isLiveServer) {
      a.setAttribute('href', a.getAttribute('data-page') + '.html');
    } else {
      a.setAttribute('href', '/' + a.getAttribute('data-page'));
    }
  });
});