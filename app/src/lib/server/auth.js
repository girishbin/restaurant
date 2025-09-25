// A simple in-memory store for users.
// In a real application, this would be a database table.
const users = [
	{ id: '1', username: 'admin', password: 'password', role: 'admin' },
	{ id: '2', username: 'user', password: 'password', role: 'user' }
];

export function findUserByUsername(username) {
	return users.find((u) => u.username === username);
}

export function findUserById(id) {
	return users.find((u) => u.id === id);
}

