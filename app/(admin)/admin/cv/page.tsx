"use client";

import { useState, useEffect, useRef } from 'react';
import { CVFile } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { SaveIcon, UploadIcon, FileTextIcon, TrashIcon, StarIcon, StarOffIcon } from 'lucide-react';

export default function AdminCVPage() {
  const [cvFiles, setCvFiles] = useState<CVFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCVFiles();
  }, []);

  const fetchCVFiles = async () => {
    try {
      const response = await fetch('/api/cv');
      if (response.ok) {
        const data = await response.json();
        setCvFiles(data);
      }
    } catch (error) {
      console.error('Error fetching CV files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !newFileName.trim()) {
      alert('Please provide both a file and a name');
      return;
    }

    setIsUploading(true);
    try {
      const token = localStorage.getItem('admin-token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', newFileName.trim());

      const response = await fetch('/api/cv', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const newFile = await response.json();
        setCvFiles(prev => [newFile, ...prev]);
        setNewFileName('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        alert('CV file uploaded successfully!');
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error uploading CV file:', error);
      alert('Failed to upload CV file');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleActiveStatus = async (cvFile: CVFile) => {
    try {
      const token = localStorage.getItem('admin-token');
      const response = await fetch(`/api/cv/${cvFile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_active: !cvFile.is_active,
        }),
      });

      if (response.ok) {
        const updatedFile = await response.json();
        setCvFiles(prev => prev.map(file =>
          file.id === cvFile.id ? updatedFile : file
        ));
        alert(`CV file ${updatedFile.is_active ? 'activated' : 'deactivated'} successfully!`);
      } else {
        const error = await response.json();
        alert(`Failed to update CV file: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating CV file:', error);
      alert('Failed to update CV file');
    }
  };

  const deleteCVFile = async (cvFile: CVFile) => {
    if (!confirm(`Are you sure you want to delete "${cvFile.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('admin-token');
      const response = await fetch(`/api/cv/${cvFile.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCvFiles(prev => prev.filter(file => file.id !== cvFile.id));
        alert('CV file deleted successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to delete CV file: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting CV file:', error);
      alert('Failed to delete CV file');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--accent)' }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Heading level={1} className="text-3xl font-bold mb-2">
          CV/Resume Management
        </Heading>
        <p style={{ color: 'var(--foreground-secondary)' }}>
          Upload and manage your CV/resume files. Set one as active to be downloadable from your portfolio.
        </p>
      </div>

      {/* Upload New CV Section */}
      <Card className="card-premium">
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
            <UploadIcon className="w-5 h-5" />
            Upload New CV/Resume
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                File Name *
              </label>
              <Input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="e.g., Resume 2024, CV - Software Developer"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Select File *
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={isUploading || !newFileName.trim()}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium"
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>
          </div>
          <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
            Supported formats: PDF, DOC, DOCX (max 10MB)
          </p>
          {isUploading && (
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--accent)' }}>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              Uploading CV file...
            </div>
          )}
        </CardContent>
      </Card>

      {/* CV Files List */}
      <Card className="card-premium">
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
            <FileTextIcon className="w-5 h-5" />
            CV/Resume Files ({cvFiles.length})
          </h3>
        </CardHeader>
        <CardContent>
          {cvFiles.length === 0 ? (
            <div className="text-center py-8">
              <FileTextIcon className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--foreground-secondary)' }} />
              <p style={{ color: 'var(--foreground-secondary)' }}>No CV files uploaded yet</p>
              <p className="text-sm mt-1" style={{ color: 'var(--foreground-secondary)' }}>
                Upload your first CV/resume file above
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cvFiles.map((cvFile) => (
                <div
                  key={cvFile.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hover)' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--background)' }}>
                      <FileTextIcon className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium" style={{ color: 'var(--foreground)' }}>
                          {cvFile.name}
                        </h4>
                        {cvFile.is_active && (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
                        {formatFileSize(cvFile.file_size)} • Uploaded {formatDate(cvFile.uploaded_at)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActiveStatus(cvFile)}
                      className="flex items-center gap-1"
                    >
                      {cvFile.is_active ? (
                        <>
                          <StarOffIcon className="w-4 h-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <StarIcon className="w-4 h-4" />
                          Set Active
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(cvFile.file_url, '_blank')}
                      className="flex items-center gap-1"
                    >
                      <FileTextIcon className="w-4 h-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteCVFile(cvFile)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="card-premium">
        <CardHeader>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
            How It Works
          </h3>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <strong>Upload:</strong> Add new CV/resume files with descriptive names. Files are stored securely in Supabase Storage.
          </p>
          <p>
            <strong>Set Active:</strong> Mark one CV as &ldquo;Active&rdquo; - this will be the file downloaded when visitors click &ldquo;Download Resume&rdquo; on your portfolio.
          </p>
          <p>
            <strong>Manage:</strong> View, download, or delete old CV versions. Only one file can be active at a time.
          </p>
          <p>
            <strong>Automatic Updates:</strong> When you set a new CV as active, the portfolio navbar will automatically link to the new file.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}