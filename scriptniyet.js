document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const todosContainer = document.querySelector('.todos-container');

    const saveTasks = () => {
        const tasks = [...taskList.querySelectorAll('li')].map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));
        try {
            localStorage.setItem('todoTasks', JSON.stringify(tasks));
        } catch (e) { /* storage unavailable (e.g. private mode) */ }
    };

    const toggleEmptyState = () => {
        const hasTasks = taskList.children.length > 0;
        emptyImage.style.display = hasTasks ? 'none' : 'block';
        todosContainer.style.width = hasTasks ? '100%' : '50%';
    };

    const setCompleted = (li, editBtn, isChecked) => {
        li.classList.toggle('completed', isChecked);
        editBtn.disabled = isChecked;
        editBtn.style.opacity = isChecked ? '0.5' : '1';
        editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
    };

    const addTask = (text, completed = false) => {
        const taskText = (text ?? taskInput.value).trim();
        if (!taskText) return;

        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="checkbox" />
            <span></span>
            <div class="task-buttons">
                <button type="button" class="edit-btn" aria-label="Edit"><i class="fa-solid fa-pen"></i></button>
                <button type="button" class="delete-btn" aria-label="Delete"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        li.querySelector('span').textContent = taskText; // safe from HTML injection

        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');

        checkbox.checked = completed;
        setCompleted(li, editBtn, completed);

        checkbox.addEventListener('change', () => {
            setCompleted(li, editBtn, checkbox.checked);
            saveTasks();
        });

        editBtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                taskInput.value = li.querySelector('span').textContent;
                li.remove();
                toggleEmptyState();
                saveTasks();
                taskInput.focus();
            }
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
            saveTasks();
        });

        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmptyState();
        saveTasks();
    };

    const loadTasks = () => {
        try {
            const saved = JSON.parse(localStorage.getItem('todoTasks') || '[]');
            saved.forEach(t => addTask(t.text, t.completed));
        } catch (e) { /* ignore corrupted data */ }
        toggleEmptyState();
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();  
        addTask();
    });

    loadTasks();
});