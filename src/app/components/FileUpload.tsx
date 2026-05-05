import { useState, useRef } from 'react';

interface FileUploadProps {
  onFileUpload: (file: File, url: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  multiple?: boolean;
}

export function FileUpload({ 
  onFileUpload, 
  accept = '*/*', 
  maxSize = 10, 
  label = 'Upload File',
  multiple = false 
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError('');
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setUploading(true);

    try {
      // Create a mock URL (in production, this would be an actual upload to a server)
      const url = URL.createObjectURL(file);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onFileUpload(file, url);
    } catch (err) {
      setError('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleFiles = async (files: FileList) => {
    if (multiple) {
      for (let i = 0; i < files.length; i++) {
        await handleFile(files[i]);
      }
    } else {
      await handleFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-[#0d9488] bg-[#f0fdf4]'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept={accept}
          multiple={multiple}
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div>
            <p className="font-['DM_Sans',sans-serif] text-gray-600">
              {uploading ? 'Uploading...' : label}
            </p>
            <p className="font-['DM_Sans',sans-serif] text-sm text-gray-500 mt-1">
              Drag and drop or click to browse
            </p>
            {maxSize && (
              <p className="font-['DM_Sans',sans-serif] text-xs text-gray-400 mt-1">
                Max file size: {maxSize}MB
              </p>
            )}
          </div>
          
          <button
            type="button"
            onClick={onButtonClick}
            disabled={uploading}
            className="bg-[#0d9488] text-white px-4 py-2 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-semibold disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Choose File'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
          <p className="font-['DM_Sans',sans-serif] text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadDate: string;
}

interface FileManagerProps {
  files: UploadedFile[];
  onFileDelete: (fileId: string) => void;
}

export function FileManager({ files, onFileDelete }: FileManagerProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    if (type.includes('powerpoint') || type.includes('presentation')) return '📽️';
    if (type.includes('zip') || type.includes('rar')) return '🗜️';
    return '📎';
  };

  return (
    <div className="space-y-4">
      {files.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="font-['DM_Sans',sans-serif] text-gray-500">No files uploaded yet</p>
        </div>
      ) : (
        files.map((file) => (
          <div key={file.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getFileIcon(file.type)}</span>
                <div>
                  <p className="font-['DM_Sans',sans-serif] font-medium text-gray-900">
                    {file.name}
                  </p>
                  <p className="font-['DM_Sans',sans-serif] text-sm text-gray-500">
                    {formatFileSize(file.size)} • {formatDate(file.uploadDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={file.url}
                  download={file.name}
                  className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded"
                  title="Download"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
                <button
                  onClick={() => onFileDelete(file.id)}
                  className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
