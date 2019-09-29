import './assets/scss/index.scss';

let dom = document.querySelector('#app');
if (dom) {
  dom.innerHTML = 'index html';
} else {
  console.log('no #app');
}
