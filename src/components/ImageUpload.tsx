import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onUploadComplete?: (imageUrl: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setUploadSuccess(false);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const uploadToBackend = async () => {
    if (!selectedFile) return;
console.log("upload will call here........");
    setIsUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('visitingCard', selectedFile);

      // Replace with your backend API endpoint
      const response = await fetch('/api/upload-visiting-card', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadSuccess(true);
      onUploadComplete?.(data.imageUrl);
      
      toast({
        title: "Upload successful!",
        description: "Your visiting card has been uploaded and processed.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadSuccess(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };
console.log("selected file here",selectedFile);
  return (
    <Card className="p-8 shadow-card bg-gradient-card border-0">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Upload Visiting Card
          </h2>
          <p className="text-muted-foreground">
            Upload an image of a visiting card to extract and save the information
          </p>
        </div>

        {!selectedFile ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-smooth cursor-pointer bg-muted/30 hover:bg-muted/50"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                Drop your visiting card here
              </p>
              <p className="text-muted-foreground mb-4">
                or click to browse files
              </p>
              <Button variant="outline" type="button">
                Select Image
              </Button>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative bg-muted rounded-lg p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
              
              {previewUrl && (
                <div className="flex justify-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 rounded-md border border-border"
                  />
                </div>
              )}
              
              <div className="mt-4 text-center">
                <p className="font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="flex justify-center space-x-3">
              <Button
                onClick={uploadToBackend}
                disabled={isUploading || uploadSuccess}
                className="bg-gradient-primary text-primary-foreground shadow-primary hover:shadow-hover transition-smooth"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                    Uploading...
                  </>
                ) : uploadSuccess ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Uploaded Successfully
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload & Process
                  </>
                )}
              </Button>
              
              <Button variant="outline" onClick={clearSelection}>
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};