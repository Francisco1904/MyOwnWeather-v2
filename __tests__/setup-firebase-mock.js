// Mock Firebase for testing
jest.mock('@/lib/firebase', () => {
  // Mock app
  const app = {
    name: 'mock-app',
    options: {},
  };

  // Mock auth
  const auth = {
    currentUser: null,
    onAuthStateChanged: jest.fn(callback => {
      callback(null);
      return jest.fn(); // Return unsubscribe function
    }),
    signInWithEmailAndPassword: jest.fn().mockResolvedValue({
      user: { uid: 'mock-user-id', email: 'test@example.com' },
    }),
    signOut: jest.fn().mockResolvedValue({}),
    createUserWithEmailAndPassword: jest.fn().mockResolvedValue({
      user: { uid: 'mock-user-id', email: 'test@example.com' },
    }),
  };

  // Mock firestore
  const db = {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({
      exists: true,
      data: () => ({ name: 'Mock Data' }),
    }),
    set: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  };

  return {
    app,
    auth,
    db,
    getAuth: jest.fn().mockReturnValue(auth),
    getFirestore: jest.fn().mockReturnValue(db),
  };
});

// Mock Firebase functions
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
}));

// Mock Firebase app
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn().mockReturnValue({
    name: 'mock-app',
    options: {},
  }),
}));
