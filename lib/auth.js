// This is a mock authentication service for demonstration purposes
// In a real application, these functions would make API calls to your backend

// Simulated user database
const users = [
  {
    id: 1,
    name: "Demo User",
    email: "demo@example.com",
    // In a real app, this would be a hashed password
    password: "Password123!",
  },
]

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Authenticate a user
export async function authenticateUser(email, password) {
  // Simulate API call
  await delay(1000)

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

  if (!user) {
    return { success: false, message: "No account found with this email" }
  }

  if (user.password !== password) {
    return { success: false, message: "Invalid password" }
  }

  // In a real app, this would set cookies, store tokens, etc.
  localStorage.setItem("currentUser", JSON.stringify({ id: user.id, name: user.name, email: user.email }))

  return { success: true, user: { id: user.id, name: user.name, email: user.email } }
}

// Create a new user
export async function createUser(name, email, password) {
  // Simulate API call
  await delay(1500)

  // Check if user already exists
  const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (existingUser) {
    return { success: false, message: "An account with this email already exists" }
  }

  // In a real app, this would create a user in your database
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password, // In a real app, this would be hashed
  }

  users.push(newUser)

  return { success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } }
}

// Reset password
export async function resetPassword(email) {
  // Simulate API call
  await delay(1500)

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

  if (!user) {
    // For security reasons, don't reveal if the email exists or not
    return { success: true }
  }

  // In a real app, this would send an email with a reset link
  return { success: true }
}

// Get current user
export function getCurrentUser() {
  if (typeof window === "undefined") return null

  const userJson = localStorage.getItem("currentUser")
  if (!userJson) return null

  try {
    return JSON.parse(userJson)
  } catch (e) {
    return null
  }
}

// Logout user
export function logoutUser() {
  if (typeof window === "undefined") return

  localStorage.removeItem("currentUser")
}

