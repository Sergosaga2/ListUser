document.addEventListener('DOMContentLoaded', function () {
	const userForm = document.getElementById('userForm')
	const nameInput = document.getElementById('name')
	const ageInput = document.getElementById('age')
	const userList = document.getElementById('userList')
	const nameError = document.getElementById('nameError')
	const ageError = document.getElementById('ageError')

	let users = []

	// Функция для получения данных с сервера
	function fetchUsers() {
		fetch('http://localhost:3000/users')
			.then(response => response.json())
			.then(data => {
				users = data
				renderUserList()
			})
			.catch(error => console.error('Error fetching users:', error))
	}

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

		// Если данные валидны, добавляем пользователя на сервер
		if (isValid) {
			const newUser = { name, age }

			// Отправляем данные на сервер
			fetch('http://localhost:3000/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newUser),
			})
				.then(response => response.json())
				.then(() => {
					fetchUsers() // Обновляем список пользователей после добавления
				})
				.catch(error => console.error('Error adding user:', error))

			nameInput.value = ''
			ageInput.value = ''
		}
	})

	// Функция для редактирования пользователя
	window.editUser = function (index) {
		const user = users[index]
		nameInput.value = user.name
		ageInput.value = user.age

		// Удаляем пользователя перед редактированием
		fetch(`http://localhost:3000/users/${user.id}`, {
			method: 'DELETE',
		})
			.then(() => {
				users.splice(index, 1) // Удаляем из списка
				renderUserList()
			})
			.catch(error => console.error('Error deleting user:', error))
	}

	// Функция для удаления пользователя
	window.deleteUser = function (index) {
		const user = users[index]

		fetch(`http://localhost:3000/users/${user.id}`, {
			method: 'DELETE',
		})
			.then(() => {
				users.splice(index, 1) // Удаляем из списка
				renderUserList()
			})
			.catch(error => console.error('Error deleting user:', error))
	}

	// Загружаем пользователей при загрузке страницы
	fetchUsers()
})
