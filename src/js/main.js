/* Полифил для IE11 чтоб forEach работал в IE11 */

/**
 * NodeList.prototype.forEach() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Polyfill
 */
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}


/* фильтр на мобильных устройствах */
const sidebarToggleBtn = document.querySelector('.menu-icon-wrapper');
const menuIcon = document.querySelector('.menu-icon');
const sideBar = document.querySelector('.sidebar');

if (!!sidebarToggleBtn) {
  sidebarToggleBtn.onclick = () => {
    menuIcon.classList.toggle('menu-icon-active');
    sideBar.classList.toggle('sidebar--mobile-active');
  }

}

/* Показать еще три карточки */
const btnShowMoreCards = document.querySelector('.btn-more');
const hiddenCards = document.querySelectorAll('.card-link--hidden');

if (!!btnShowMoreCards) {
  btnShowMoreCards.addEventListener('click', () => {

    hiddenCards.forEach(function (card) {
      card.classList.remove('card-link--hidden');
    });

  });
}

/* Показать/скрыть контент внутри виджетов */
const widgets = document.querySelectorAll('.widget');

if (!!widgets) {
  // Находим все widget на странице
  widgets.forEach(function (widget) {
    // Слушаем клик внутри виджета
    widget.addEventListener('click', function (e) {
      // если клик по заголовку тогда скрываем/показываем тело виджета
      if (e.target.classList.contains('widget__title')) {
        e.target.classList.toggle('widget__title--active');
        e.target.nextElementSibling.classList.toggle('widget__body--hidden');
      }
    });
  });
}

/* Location - кнопка Любая */
const checkBoxAny = document.querySelector('#location-05');
const topLocationCheckboxes = document.querySelectorAll('[data-location-param]');
/* Выбор по кнопке любая и отключение других чекбоксов */
checkBoxAny.addEventListener('change', function () {
  if (checkBoxAny.checked) {
    topLocationCheckboxes.forEach(function (item) {
      item.checked = false;
    });
  }
});
/*клик по другим кнопкам location кроме любая */
topLocationCheckboxes.forEach(function (item) {
  item.addEventListener('change', function () {
    if (checkBoxAny.checked) {
      checkBoxAny.checked = false;
    }

  });
});

/* Показать еще 3 доп опции с чекбоксами в фильтре */
const showMoreOptions = document.querySelector('.widget__show-hidden');
const hidenCheckboxes = document.querySelectorAll('.checkbox--hidden');

// if (!!showMoreOptions) {
showMoreOptions.onclick = (e) => {
  e.preventDefault();
  // Если блоки были скрыты значит показываем
  if (showMoreOptions.dataset.options == 'hidden') {
    hidenCheckboxes.forEach(function (item) {
      // console.log(item);
      // item.classList.remove('checkbox--hidden');
      item.style.display = 'block';
    });
    showMoreOptions.innerText = "Скрыть дополнительные опции";
    showMoreOptions.dataset.options = 'visible';
  }
  //если блоки были видны - значит скрываем
  else if (showMoreOptions.dataset.options == 'visible') {
    hidenCheckboxes.forEach(function (item) {
      // console.log(item);
      // item.classList.remove('checkbox--hidden');
      item.style.display = 'none';
    });
    showMoreOptions.innerText = "Показать еще";
    showMoreOptions.dataset.options = 'hidden';
  }


  // showMoreOptions.remove();

  // }
}