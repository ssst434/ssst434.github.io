const PRODUCTS = [
  {
    id: 'pirouette',
    name: 'Вино Chateau la Pirouette, красное сухое, 0,75 л',
    country: 'Франция',
    category: 'wine',
    price: 1398.99,
    old: 2133.32,
    form: 'wine',
    color: '#5b1230',
    rating: 5.0,
    rank: 2
  },
  {
    id: 'lalande',
    name: 'Вино Chateau Lalande de Pez, красное сухое, 0,75 л',
    country: 'Франция',
    category: 'wine',
    price: 2799.99,
    old: 4255.54,
    form: 'wine',
    color: '#3f0f22',
    rating: 4.5,
    rank: 5
  },
  {
    id: 'citran',
    name: 'Вино Moulins de Citran, красное сухое, 0,75 л',
    country: 'Франция',
    category: 'wine',
    price: 2298.99,
    old: 3333.32,
    form: 'wine',
    color: '#4a1226',
    rating: 4.5,
    rank: 4
  },
  {
    id: 'bourg',
    name: 'Вино Chateau Joanna Cotes de Bourg, красное сухое, 0,75 л',
    country: 'Франция',
    category: 'wine',
    price: 1299.99,
    old: 1866.65,
    form: 'wine',
    color: '#55132c',
    rating: 5.0,
    rank: 3
  },
  {
    id: 'torres',
    name: 'Вино Torres San Valentin Sauvignon Blanc, белое полусухое, 0,75 л',
    country: 'Чили',
    category: 'wine',
    price: 849.99,
    old: 1222.21,
    form: 'wine',
    color: '#8a7a2e',
    rating: 4.2,
    rank: 1
  },
  {
    id: 'martini',
    name: 'Вермут Martini Bianco, 1 л',
    country: 'Италия',
    category: 'vermouth',
    price: 1499.99,
    old: 1777.77,
    form: 'vermouth',
    color: '#9c7c2f',
    rating: 4.4,
    rank: 6
  },
  {
    id: 'hunting',
    name: 'Ликёр Hunting Ягодный, 0,5 л',
    country: 'Россия',
    category: 'spirit',
    price: 699.99,
    old: 944.43,
    form: 'spirit',
    color: '#6b1c3c',
    rating: 4.0,
    rank: 7
  }
];

const money = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
const formatPrice = (value) => money.format(Math.round(value));

const discount = (product) => Math.round((1 - product.price / product.old) * 100);

function bottleSvg(product) {
  const wide = product.form !== 'wine';
  const body = wide
    ? 'M14 30h32v58a10 10 0 0 1-10 10H24a10 10 0 0 1-10-10Z'
    : 'M22 32h16v56a10 10 0 0 1-10 10h-6a10 10 0 0 1-10-10V44a12 12 0 0 1 10-12Z';
  const neck = wide ? 'M24 22h12v10H24z' : 'M24 12h12v22H24z';
  const cap = wide ? 'M23 16h14v7H23z' : 'M23 6h14v8H23z';
  return `<svg viewBox="0 0 60 110" width="120" height="200" role="img" aria-hidden="true">
    <rect x="${wide ? 23 : 23}" y="${wide ? 16 : 6}" width="14" height="8" rx="2" fill="#d7b46a"/>
    <path d="${neck}" fill="${product.color}"/>
    <path d="${body}" fill="${product.color}" opacity="0.96"/>
    <rect x="${wide ? 16 : 15}" y="58" width="${wide ? 26 : 24}" height="26" rx="3" fill="#f4f0ea" opacity="0.92"/>
    <rect x="${wide ? 19 : 18}" y="63" width="${wide ? 20 : 18}" height="3" rx="1.5" fill="#8e1f3f" opacity="0.7"/>
    <rect x="${wide ? 19 : 18}" y="69" width="${wide ? 14 : 12}" height="2" rx="1" fill="#5b5348" opacity="0.55"/>
    <rect x="${wide ? 19 : 18}" y="74" width="${wide ? 17 : 15}" height="2" rx="1" fill="#5b5348" opacity="0.35"/>
  </svg>`;
}

function productCard(product) {
  return `<article class="product">
    <div class="product__media">
      <span class="product__badge">−${discount(product)}%</span>
      ${bottleSvg(product)}
    </div>
    <div class="product__body">
      <p class="product__country">${product.country}</p>
      <h3 class="product__name">${product.name}</h3>
      <div class="product__prices">
        <span class="product__price">${formatPrice(product.price)}</span>
        <span class="product__old">${formatPrice(product.old)}</span>
      </div>
      <button class="product__add" type="button" data-add="${product.id}">В корзину</button>
    </div>
  </article>`;
}

const state = {
  category: 'all',
  search: '',
  sort: 'popular'
};

const productsEl = document.getElementById('products');
const emptyEl = document.getElementById('empty');
const searchEl = document.getElementById('search');
const sortEl = document.getElementById('sort');
const cartCountEl = document.getElementById('cartCount');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const drawerEl = document.getElementById('cartDrawer');
const overlayEl = document.getElementById('overlay');
const toastEl = document.getElementById('toast');

function visibleProducts() {
  const query = state.search.trim().toLowerCase();
  const list = PRODUCTS.filter((product) => {
    const matchCategory = state.category === 'all' || product.category === state.category;
    const matchQuery = !query || product.name.toLowerCase().includes(query) || product.country.toLowerCase().includes(query);
    return matchCategory && matchQuery;
  });

  const sorters = {
    popular: (a, b) => a.rank - b.rank,
    cheap: (a, b) => a.price - b.price,
    expensive: (a, b) => b.price - a.price,
    discount: (a, b) => discount(b) - discount(a)
  };

  return list.sort(sorters[state.sort]);
}

function renderProducts() {
  const list = visibleProducts();
  productsEl.innerHTML = list.map(productCard).join('');
  emptyEl.hidden = list.length > 0;
}

function readCart() {
  try {
    const raw = JSON.parse(localStorage.getItem('winelab-cart') || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch (error) {
    return [];
  }
}

let cart = readCart();

function saveCart() {
  localStorage.setItem('winelab-cart', JSON.stringify(cart));
}

function cartItems() {
  return cart
    .map((line) => ({ ...line, product: PRODUCTS.find((item) => item.id === line.id) }))
    .filter((line) => line.product);
}

function renderCart() {
  const lines = cartItems();
  const total = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
  const count = lines.reduce((sum, line) => sum + line.qty, 0);

  cartCountEl.textContent = count;
  cartTotalEl.textContent = formatPrice(total);

  if (!lines.length) {
    cartItemsEl.innerHTML = '<p class="cart-drawer__empty">Корзина пока пуста. Добавьте напитки из каталога — соберём заказ за 15 минут.</p>';
    return;
  }

  cartItemsEl.innerHTML = lines
    .map(
      (line) => `<div class="cart-item">
        <span class="cart-item__name">${line.product.name}</span>
        <span class="cart-item__price">${formatPrice(line.product.price * line.qty)}</span>
        <div class="cart-item__controls">
          <div class="qty">
            <button type="button" data-qty="${line.id}" data-delta="-1" aria-label="Уменьшить количество">−</button>
            <span>${line.qty}</span>
            <button type="button" data-qty="${line.id}" data-delta="1" aria-label="Увеличить количество">+</button>
          </div>
          <button class="cart-item__remove" type="button" data-remove="${line.id}">удалить</button>
        </div>
      </div>`
    )
    .join('');
}

function addToCart(id) {
  const line = cart.find((item) => item.id === id);
  if (line) {
    line.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  saveCart();
  renderCart();
  const product = PRODUCTS.find((item) => item.id === id);
  showToast(`«${product.name}» — в корзине`);
}

function changeQty(id, delta) {
  const line = cart.find((item) => item.id === id);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) {
    cart = cart.filter((item) => item.id !== id);
  }
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  renderCart();
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('is-visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toastEl.classList.remove('is-visible'), 2400);
}

function openCart() {
  drawerEl.classList.add('is-open');
  drawerEl.setAttribute('aria-hidden', 'false');
  overlayEl.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  drawerEl.classList.remove('is-open');
  drawerEl.setAttribute('aria-hidden', 'true');
  overlayEl.hidden = true;
  document.body.style.overflow = '';
}

productsEl.addEventListener('click', (event) => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  addToCart(button.dataset.add);
  button.classList.add('is-added');
  button.textContent = 'Добавлено';
  window.setTimeout(() => {
    button.classList.remove('is-added');
    button.textContent = 'В корзину';
  }, 1400);
});

document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach((item) => item.classList.remove('is-active'));
    chip.classList.add('is-active');
    state.category = chip.dataset.category;
    renderProducts();
  });
});

searchEl.addEventListener('input', (event) => {
  state.search = event.target.value;
  renderProducts();
});

sortEl.addEventListener('change', (event) => {
  state.sort = event.target.value;
  renderProducts();
});

document.getElementById('cartOpen').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
overlayEl.addEventListener('click', closeCart);

cartItemsEl.addEventListener('click', (event) => {
  const qtyButton = event.target.closest('[data-qty]');
  const removeButton = event.target.closest('[data-remove]');
  if (qtyButton) changeQty(qtyButton.dataset.qty, Number(qtyButton.dataset.delta));
  if (removeButton) removeFromCart(removeButton.dataset.remove);
});

document.getElementById('checkout').addEventListener('click', () => {
  if (!cart.length) {
    showToast('Сначала добавьте напитки в корзину');
    return;
  }
  cart = [];
  saveCart();
  renderCart();
  closeCart();
  showToast('Заказ оформлен. Ждём вас на Кронштадтском бульваре, 9 к2');
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeCart();
});

const burger = document.getElementById('burger');
const navEl = document.querySelector('.nav');
burger.addEventListener('click', () => {
  const isOpen = navEl.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', String(isOpen));
});
navEl.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    navEl.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

const ageGate = document.getElementById('ageGate');
if (localStorage.getItem('winelab-age') !== 'ok') {
  ageGate.hidden = false;
  document.body.style.overflow = 'hidden';
}
document.getElementById('ageYes').addEventListener('click', () => {
  localStorage.setItem('winelab-age', 'ok');
  ageGate.hidden = true;
  document.body.style.overflow = '';
});

renderProducts();
renderCart();
