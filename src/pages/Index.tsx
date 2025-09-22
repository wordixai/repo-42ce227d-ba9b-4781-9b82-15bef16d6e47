import React from 'react';
import { DocumentSidebar } from '@/components/Sidebar/DocumentSidebar';
import { DocumentHeader } from '@/components/Header/DocumentHeader';
import { CollaborativeEditor } from '@/components/Editor/CollaborativeEditor';
import { useDocumentStore } from '@/stores/documentStore';

const Index = () => {
  const { currentDocument } = useDocumentStore();

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <DocumentSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DocumentHeader />
        
        {/* Editor Area */}
        <div className="flex-1 overflow-auto">
          {currentDocument ? (
            <div className="max-w-4xl mx-auto p-8">
              <CollaborativeEditor documentId={currentDocument.id} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Welcome to CollabDocs
                  </h2>
                  <p className="text-muted-foreground max-w-md">
                    Select a document from the sidebar to start editing, or create a new one to begin collaborating.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;