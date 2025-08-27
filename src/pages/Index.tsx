import React from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { UserTable } from '@/components/UserTable';

const Index = () => {
  const handleUploadComplete = (imageUrl: string) => {
    console.log('Image uploaded successfully:', imageUrl);
    // You can add additional logic here if needed
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Visiting Card Manager
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload visiting cards, extract information, and manage your professional contacts
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Upload Section */}
        <section>
          <ImageUpload onUploadComplete={handleUploadComplete} />
        </section>

        {/* User Table Section */}
        <section>
          <UserTable />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background/80 backdrop-blur-sm border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-muted-foreground">
            Manage your professional network efficiently
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;