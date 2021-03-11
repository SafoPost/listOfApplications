'use strict';

document.addEventListener('DOMContentLoaded', function () {

  const newModalOpen = document.getElementById('new-modal-open');
  const filterModalOpen = document.getElementById('filter-modal-open');

  const modalOverlay = document.querySelector('.overlay');
  const newAppModal = document.getElementById('new-app-modal');
  const filterAppModal = document.getElementById('filter-app-modal');

  const newModalClose = document.getElementById('newModalClose');
  const filterModalClose = document.getElementById('filterModalClose');

  const appList = document.getElementById('appList');
  const addAppBtn = document.getElementById('addApplication');
  const filterAppBtn = document.getElementById('filterApplication');
  const filterResetBtn = document.getElementById('filterReset');

  let elements = document.getElementsByClassName('phone');
  for (let i = 0; i < elements.length; i++) {
    maskPhone(elements[i]);
  }

  const toggleAppModal = () => {
    modalOverlay.classList.toggle('visible');
    newAppModal.classList.toggle('visible');
  };

  const toggleFilterModal = () => {
    modalOverlay.classList.toggle('visible');
    filterAppModal.classList.toggle('visible');
  };
  // показываем/скрываем модалки
  newModalOpen.addEventListener('click', toggleAppModal);
  newModalClose.addEventListener('click', toggleAppModal);
  filterModalOpen.addEventListener('click', toggleFilterModal);
  filterModalClose.addEventListener('click', toggleFilterModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target.classList.contains('overlay')) {
      if (newAppModal.classList.contains('visible')) {
        toggleAppModal();
      } else if (filterAppModal.classList.contains('visible')) {
        toggleFilterModal();
      }
    }
  });

  // объект для хранения данных
  let data = {
    applications: []
  };

  // проверяем, есть ли данные в localStorage
  if (localStorage.getItem('localData')) {
    data = JSON.parse(localStorage.getItem('localData'));
  }

  // рендерим данные, если они есть в localStorage
  const renderItemsForUpdate = () => {
    if (!data.applications) {
      return;
    }
    for (let i = 0; i < data.applications.length; i++) {
      renderItem(data.applications[i]);
    }
  };

  // функция, которая очищает таблицу
  const clearList = () => {
    let items = document.querySelectorAll('.appItem');
    for (let i = 0; i < items.length; i++) {
      appList.removeChild(items[i]);
    }
  }
  // функция, которая фильтрует заявки
  const findAddItems = () => {
    let appPhone = document.getElementById('filterAppPhone').value;
    let appStartDate = document.getElementById('filterStartDate').value;
    let appFinishDate = document.getElementById('filterFinishDate').value;

    if (appPhone && appStartDate && appFinishDate) {
      let start = new Date(appStartDate.split('.').reverse().join('.'));
      let finish = new Date(appFinishDate.split('.').reverse().join('.'));
      data.applications.forEach((elem, i) => {
        let elemDate = new Date(elem.date.split('.').reverse().join('.'));
        if (elemDate >= start && elemDate <= finish && elem.phone) {
          renderItem(data.applications[i]);
        }
      });
    } else if (appPhone) {
      data.applications.forEach((elem, i) => {
        if (elem.phone === appPhone) {
          renderItem(data.applications[i]);
        }
      })
    } else if (appStartDate && appFinishDate) {
      let start = new Date(appStartDate.split('.').reverse().join('.'));
      let finish = new Date(appFinishDate.split('.').reverse().join('.'));
      data.applications.forEach((elem, i) => {
        let elemDate = new Date(elem.date.split('.').reverse().join('.'));
        if (elemDate >= start && elemDate <= finish) {
          renderItem(data.applications[i]);
        }
      });
    }
  };

  // Редактировать/сохранить заявку
  const itemEdit = (elem, str) => {
    const item = elem.parentNode.parentNode;
    const number = +item.id.slice(5);

    // если клик по кнопке "Сохранить", то обновляем данные в объекте data
    if (str === 'save') {
      data.applications.forEach((elem, i) => {
        if (elem.count === number) {
          data.applications[i].date = item.children[1].children[0].value;
          data.applications[i].name = item.children[2].children[0].value;
          data.applications[i].text = item.children[3].children[0].value;
          data.applications[i].phone = item.children[4].children[0].value;
        }
      })
      // обновляем данные в localStorage
      dataUpdateToLocalStorage();
    }

    for (let i = 1; i < 5; i++) {
      let editElem = item.children[i].children[0];
      editElem.classList.toggle('active');
      editElem.hasAttribute('readonly') ?
        editElem.removeAttribute('readonly') :
        editElem.setAttribute('readonly', '');
    }
    for (let i = 0; i < 3; i++) {
      let editBtn = item.children[5].children[i];
      editBtn.classList.toggle('btn-hidden');
    }
  }

  // Удалить заявку
  const itemDelete = (elem) => {
    const item = elem.parentNode.parentNode;
    const itemParent = item.parentNode;
    const number = +item.id.slice(5);
    console.log('number: ', number);

    // удаляем соответствующий объект из массива data.application
    let index;
    data.applications.forEach((elem, i) => {
      // console.log(number, elem.count, i);
      if (elem.count === number) {
        return index = i;
      }
    })
    data.applications.splice(index, 1);

    // удаляем соответствующую строку
    itemParent.removeChild(item);
    // обновляем данные в localStorage
    dataUpdateToLocalStorage();
  };

  // создаём элемент, помещаем в него нужные классы и контент
  const renderItem = (item) => {
    // console.log('item.count: ', item.count);

    const newApp = document.createElement('tr');
    newApp.classList.add('appItem');
    newApp.id = 'trId-' + item.count;

    newApp.insertAdjacentHTML('afterbegin', `
      <td></td>
      <td>
        <input type="text" class="td-input" readonly value="${item.date}">
      </td>
      <td>
        <input type="text" class="td-input" readonly value="${item.name}">
      </td>
      <td>
        <textarea type="text" class="td-input" readonly>${item.text}</textarea>
      </td>
      <td>
        <input type="text" class="td-input phone" readonly value="${item.phone}">
      </td>
      <td class="action-block">
        <button class="button save btn-hidden">Сохранить</button>
        <button class="action edit">Ред.</button>
        <button class="action delete">Уд.</button>
      </td>
    `);

    // добавляем элемент в таблицу
    appList.appendChild(newApp);

    let inputs = document.querySelectorAll('.phone');
    for (let i = 0; i < inputs.length; i++) {
      maskPhone(inputs[i]);
    }

    // Слушаем клики по кнопкам в соответствующей заявке
    newApp.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit')) {
        itemEdit(e.target, 'edit');
      } else if (e.target.classList.contains('delete')) {
        itemDelete(e.target);
      } else if (e.target.classList.contains('save')) {
        itemEdit(e.target, 'save');
      }
    })
  };

  // Запускаем рендер одного элемента
  const addItem = (count, date, name, text, phone) => {
    const item = {
      count, date, name, text, phone
    };
    renderItem(item);
    data.applications.push(item);

    // обновляем данные в localStorage
    dataUpdateToLocalStorage();
  };

  // Клик по кнопке "Добавить" в модальном окне
  addAppBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Текущая дата
    let options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      timezone: 'UTC'
    };
    let date = new Date().toLocaleString("ru", options);

    let appCount = document.querySelectorAll('tr').length;

    const numEquality = (elem) => {
      return appCount = elem.count;
    };
    if (data.applications.every(numEquality)) {
      appCount++;
    }

    // Данные из инпутов
    let appName = document.getElementById('modalAppName').value;
    let appText = document.getElementById('modalAppText').value;
    let appPhone = document.getElementById('modalAppPhone').value;

    addItem(appCount, date, appName, appText, appPhone);

    // очищаем поля формы и закрываем ее
    document.getElementById('addAppForm').reset();
    toggleAppModal();
  });

  // слушаем клик по кнопке "Найти" в фильтер-модалке
  filterAppBtn.addEventListener('click', (e) => {
    e.preventDefault();
    clearList();
    findAddItems();
  });

  // слушаем клик по кнопке "Сбросить" в фильтер-модалке
  filterResetBtn.addEventListener('click', (e) => {
    e.preventDefault();
    clearList();
    // очищаем поля формы и рендерим все строки 
    document.getElementById('filterAppForm').reset();
    renderItemsForUpdate();
  });

  // Вносим данные в localStorage
  const dataUpdateToLocalStorage = () => {
    localStorage.setItem('localData', JSON.stringify(data));
  };

  // рендерим данные, если они есть в localStorage
  renderItemsForUpdate();
});
