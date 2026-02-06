import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Upload, X } from 'lucide-react';

type FileUploadFieldProps = {
  value?: any;
  onChange: (value: any) => void;
  required?: boolean;
};

export default function FileUploadField({ value, onChange, required }: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFileName(file.name);
    setUploadProgress(0);

    try {
      // Read file as bytes
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      // Store file reference (in real implementation, would use ExternalBlob)
      onChange({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        bytes: Array.from(bytes),
      });
    } catch (error) {
      console.error('File upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setFileName(null);
    setUploadProgress(0);
  };

  return (
    <div className="space-y-2">
      {!value && !uploading && (
        <div className="flex items-center gap-2">
          <Input
            type="file"
            onChange={handleFileChange}
            required={required}
            className="flex-1"
          />
          <Button type="button" variant="outline" size="icon" disabled>
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Uploading {fileName}...</div>
          <Progress value={uploadProgress} />
        </div>
      )}

      {value && !uploading && (
        <div className="flex items-center justify-between p-3 border rounded-md">
          <div className="text-sm">
            <div className="font-medium">{value.fileName}</div>
            <div className="text-muted-foreground">{(value.fileSize / 1024).toFixed(2)} KB</div>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={handleRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
