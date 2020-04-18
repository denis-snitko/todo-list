// Форма
const FORM = document.querySelector('#newTaskForm');

// Список дел
const TASK_LIST = document.querySelector('#listGroup');

// Пустой элемент списка
const EMPTY_LIST_ITEM = document.querySelector('#empty-list-item');


/* Добавление задачи */
FORM.addEventListener('submit', function (event) {
    // Отмена действия по умолчанию
    event.preventDefault();

    // Поле ввода
    let taskInput = document.querySelector('#addNewTask');

    // Содержимое поля ввода
    let taskText = taskInput.value;

    // обрезаем пробелы вначале и конце строки
    taskText = taskText.trim();

    // Разметка новой задачи HTML
    let tplTaskHTML = `
        <li class="list-group-item d-flex justify-content-between">
            <span class="task-title" contenteditable="true" title="Редактировать">${taskText}</span>
            <div>
                <button type="button" data-action="success-task" class="btn btn-success align-self-end">
                    Готово
                </button>
                <button type="button" data-action="delete-task" class="btn btn-light align-self-end">
                    Удалить
                </button>
            </div>
        </li>
    `;

    // Добавление задачи, выше всего списка
    TASK_LIST.insertAdjacentHTML('afterbegin', tplTaskHTML);

    // Очистка содержимого порля ввода, после добавления задачи
    taskInput.value = '';

    // Вызов toggleEmptyLilsItem() 
    toggleEmptyLilsItem();

    // Вызов уведомления
    showNotification('taskAdd');
})

/* Удаление задачи и отметка о выполнении */

// Отслеживает клик по всему списку, а удаляет только при клике по кнопке
TASK_LIST.addEventListener('click', function (event) {
    // Ищем родителя -> родителя кнопки "готово" ('это наша задача)
    const PARENT_TASK = event.target.closest('.list-group-item');

    // Выполняем условие при клике по кнопке (event.target - это кнопка)
    if (event.target.getAttribute('data-action') == 'delete-task') {

        // Выбираем родителя кнопки - <li> и удвляем его (то есть саму задачу) 
        PARENT_TASK.remove();

        // Вызов уведомления
        showNotification('taskDelete');

        // Вызов toggleEmptyLilsItem()
        toggleEmptyLilsItem();

    } else if (event.target.getAttribute('data-action') == 'success-task') {

        // Выбираем <span> c задачей от <li> и добавляем класс
        PARENT_TASK.querySelector('.task-title').classList.add('task-title--done');

        // Перемещаем готовую задачу вниз списка
        TASK_LIST.insertAdjacentElement('beforeend', PARENT_TASK);

        // Отменяем возможность редактирования
        PARENT_TASK.querySelector('.task-title').setAttribute('contenteditable', false);
        PARENT_TASK.querySelector('.task-title').setAttribute('title', '');
        PARENT_TASK.querySelector('.task-title').style = 'cursor: default';

        //Неактивность кнопки
        event.target.setAttribute('disabled', 'disabled');

        // Вызов уведомления
        showNotification('taskFinish');
    }
})

/* Добавление/удаление "список дел пуст" */
function toggleEmptyLilsItem() {
    if (TASK_LIST.children.length > 1) {
        EMPTY_LIST_ITEM.style = 'display: none';
    } else {
        EMPTY_LIST_ITEM.style = 'display: block';
    }
}

/* Функция которая показывает уведомления сверху */
function showNotification(type) {
    const NOTIFY_HOLDER = document.querySelector('#notifyholder');

    const NOTIFY_EL = document.createElement('div');

    switch (type) {
        case 'taskAdd':
            NOTIFY_EL.className = 'alert alert-warning';
            NOTIFY_EL.textContent = 'Задача добавлена!';
            break;

        case 'taskDelete':
            NOTIFY_EL.className = 'alert alert-danger';
            NOTIFY_EL.textContent = 'Задача удалена!';
            break;

        case 'taskFinish':
            NOTIFY_EL.className = 'alert alert-success';
            NOTIFY_EL.textContent = 'Задача выполнена!';
            break;
    }

    NOTIFY_HOLDER.insertAdjacentElement('afterbegin', NOTIFY_EL);

    setTimeout(function () {
        NOTIFY_EL.style = 'opacity: .95';
    }, 100);

    setTimeout(function () {
        NOTIFY_EL.style = 'opacity: 0';
    }, 2300);

    setTimeout(function () {
        NOTIFY_EL.style = 'display: none';
    }, 2600);
}