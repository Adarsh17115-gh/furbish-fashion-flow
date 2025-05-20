import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

interface MultipleImageUploadProps {
  existingImages: string[];
  onImagesChange: (files: File[]) => void;
  onImageRemove: (url: string) => void;
  isUploading?: boolean;
}

const MultipleImageUpload = ({ 
  existingImages, 
  onImagesChange, 
  onImageRemove,
  isUploading = false
}: MultipleImageUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    
    // Create preview URLs for new files
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    
    // Notify parent component
    onImagesChange(files);
    
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };
  
  const handleRemoveFile = (index: number) => {
    // Release the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleRemoveExistingImage = (url: string) => {
    onImageRemove(url);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Product Images</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={triggerFileInput}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          Add Images
        </Button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          multiple 
          onChange={handleFileChange}
        />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Existing images */}
        {existingImages.map((url, index) => (
          <Card key={`existing-${index}`} className="overflow-hidden">
            <CardContent className="p-0 relative">
              <img 
                src={url} 
                alt={`Product ${index}`} 
                className="w-full h-32 object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => handleRemoveExistingImage(url)}
              >
                <X className="h-3 w-3" />
              </Button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                  Main
                </span>
              )}
            </CardContent>
          </Card>
        ))}
        
        {/* New image previews */}
        {previewUrls.map((url, index) => (
          <Card key={`preview-${index}`} className="overflow-hidden">
            <CardContent className="p-0 relative">
              <img 
                src={url} 
                alt={`New upload ${index}`} 
                className="w-full h-32 object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => handleRemoveFile(index)}
              >
                <X className="h-3 w-3" />
              </Button>
              {existingImages.length === 0 && index === 0 && (
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                  Main
                </span>
              )}
            </CardContent>
          </Card>
        ))}
        
        {/* Empty placeholder when no images */}
        {existingImages.length === 0 && previewUrls.length === 0 && (
          <Card className="border-dashed border-2 flex items-center justify-center cursor-pointer" onClick={triggerFileInput}>
            <CardContent className="flex flex-col items-center justify-center h-32 p-4">
              <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                No images yet
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        Upload up to 5 images. First image will be used as the main product image.
      </p>
    </div>
  );
};

export default MultipleImageUpload;
