document.addEventListener('DOMContentLoaded', function () {
	const userForm = document.getElementById('userForm')
	const nameInput = document.getElementById('name')
	const ageInput = document.getElementById('age')
	const userList = document.getElementById('userList')
	const nameError = document.getElementById('nameError')
	const ageError = document.getElementById('ageError')

	let users = []

	// Функция для отображения пользователей
	function renderUserList() {
		userList.innerHTML = ''
		users.forEach((user, index) => {
			const li = document.createElement('li')
			li.innerHTML = `${user.name}, ${user.age} лет
        <button class="edit" onclick="editUser(${index})">✏️</button>
        <button class="delete" onclick="deleteUser(${index})">❌</button>`
			userList.appendChild(li)
		})
	}

	// Функция для добавления пользователя
	userForm.addEventListener('submit', function (e) {
		e.preventDefault()
		const name = nameInput.value.trim()
		const age = parseInt(ageInput.value)

		let isValid = true

		// Проверка на корректность данных имени
		if (
			!name ||
			name.length < 2 ||
			name.length > 50 ||
			/[^a-zA-Zа-яА-ЯёЁ\s-]/.test(name)
		) {
			nameError.textContent =
				'Имя должно быть от 2 до 50 символов и содержать только буквы и пробелы.'
			isValid = false
		} else {
			nameError.textContent = ''
		}

		// Проверка на корректность возраста
		if (isNaN(age) || age < 18 || age > 120) {
			ageError.textContent = 'Возраст должен быть числом от 18 до 120 лет.'
			isValid = false
		} else {
			ageError.textContent = ''
		}

		// Если данные валидны, добавляем пользователя в список
		if (isValid) {
			users.push({ name, age })
			renderUserList()
			nameInput.value = ''
			ageInput.value = ''
		}
	})

	// Функция для редактирования пользователя
	window.editUser = function (index) {
		const user = users[index]
		nameInput.value = user.name
		ageInput.value = user.age
		users.splice(index, 1) // Удаляем пользователя из списка перед редактированием
		renderUserList()
	}

	// Функция для удаления пользователя
	window.deleteUser = function (index) {
		users.splice(index, 1)
		renderUserList()
	}

	renderUserList()
})
