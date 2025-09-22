import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface Document {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface User {
  id: string;
  name: string;
  color: string;
}

interface DocumentStore {
  documents: Document[];
  currentDocument: Document | null;
  currentUser: User;
  onlineUsers: User[];
  searchTerm: string;
  
  // Actions
  createDocument: (title: string, isPublic: boolean) => Document;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  setCurrentDocument: (document: Document | null) => void;
  setSearchTerm: (term: string) => void;
  addOnlineUser: (user: User) => void;
  removeOnlineUser: (userId: string) => void;
  getFilteredDocuments: () => Document[];
  getPublicDocuments: () => Document[];
  getPrivateDocuments: () => Document[];
}

// Generate random user for demo
const generateUser = (): User => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
  const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace'];
  
  return {
    id: uuidv4(),
    name: names[Math.floor(Math.random() * names.length)],
    color: colors[Math.floor(Math.random() * colors.length)]
  };
};

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [
    {
      id: '1',
      title: 'Welcome to CollabDocs',
      content: '<h1>Welcome to CollabDocs</h1><p>This is a collaborative text editor where you can create and share documents in real-time.</p><p>Features:</p><ul><li>Real-time collaboration</li><li>Public and private documents</li><li>Full-text search</li><li>Clean, minimal interface</li></ul>',
      isPublic: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
      createdBy: 'system'
    },
    {
      id: '2',
      title: 'Getting Started Guide',
      content: '<h1>Getting Started</h1><p>Here are some tips to get you started:</p><ol><li>Create a new document using the "New Document" button</li><li>Toggle between public and private visibility</li><li>Use the search bar to find documents quickly</li><li>Collaborate with others in real-time</li></ol>',
      isPublic: true,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date(),
      createdBy: 'system'
    }
  ],
  currentDocument: null,
  currentUser: generateUser(),
  onlineUsers: [],
  searchTerm: '',

  createDocument: (title: string, isPublic: boolean) => {
    const newDoc: Document = {
      id: uuidv4(),
      title,
      content: `<h1>${title}</h1><p>Start writing your document here...</p>`,
      isPublic,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: get().currentUser.id
    };
    
    set(state => ({
      documents: [...state.documents, newDoc]
    }));
    
    return newDoc;
  },

  updateDocument: (id: string, updates: Partial<Document>) => {
    set(state => ({
      documents: state.documents.map(doc =>
        doc.id === id ? { ...doc, ...updates, updatedAt: new Date() } : doc
      ),
      currentDocument: state.currentDocument?.id === id 
        ? { ...state.currentDocument, ...updates, updatedAt: new Date() }
        : state.currentDocument
    }));
  },

  deleteDocument: (id: string) => {
    set(state => ({
      documents: state.documents.filter(doc => doc.id !== id),
      currentDocument: state.currentDocument?.id === id ? null : state.currentDocument
    }));
  },

  setCurrentDocument: (document: Document | null) => {
    set({ currentDocument: document });
  },

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },

  addOnlineUser: (user: User) => {
    set(state => ({
      onlineUsers: state.onlineUsers.find(u => u.id === user.id) 
        ? state.onlineUsers 
        : [...state.onlineUsers, user]
    }));
  },

  removeOnlineUser: (userId: string) => {
    set(state => ({
      onlineUsers: state.onlineUsers.filter(u => u.id !== userId)
    }));
  },

  getFilteredDocuments: () => {
    const { documents, searchTerm } = get();
    if (!searchTerm) return documents;
    
    return documents.filter(doc =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  getPublicDocuments: () => {
    return get().getFilteredDocuments().filter(doc => doc.isPublic);
  },

  getPrivateDocuments: () => {
    const { currentUser } = get();
    return get().getFilteredDocuments().filter(doc => 
      !doc.isPublic && doc.createdBy === currentUser.id
    );
  }
}));