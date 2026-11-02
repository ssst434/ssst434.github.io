// Мобильное меню
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Toast «В корзину»
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

document.querySelectorAll('[data-add]').forEach(btn => {
  btn.addEventListener('click', () => {
    const title = btn.closest('.good').querySelector('.good__title').textContent;
    showToast('«' + title + '» добавлено в корзину');
  });
});

// Форма заказа
const form = document.getElementById('orderForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  if (!name || !phone) return;
  showToast('Спасибо, ' + name + '! Мы свяжемся с вами');
  form.reset();
});

// Плавное появление секций
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.feature, .good, .cat, .promo, .step, .store').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});
