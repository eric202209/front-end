import React, { useState, useEffect } from 'react';
import { Download, Upload, RefreshCw, FileWarning } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const DocumentList = ({ onFileSelect }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8090/api/documents");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDocuments(data.documents);
    } catch (error) {
      setError("Failed to fetch documents: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-2xl font-bold">Document Repository</CardTitle>
        <Button 
          variant="outline" 
          size="icon"
          onClick={fetchDocuments}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="rounded-md border">
          <div className="grid grid-cols-7 gap-4 p-4 font-medium text-sm text-gray-500 bg-gray-50 rounded-t-md">
            <div className="col-span-2">File Name</div>
            <div>Company</div>
            <div>Size</div>
            <div>Upload Date</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          
          <div className="divide-y">
            {documents.map((doc, index) => (
              <div key={index} className="grid grid-cols-7 gap-4 p-4 items-center hover:bg-gray-50">
                <div className="col-span-2 font-medium flex items-center">
                  {doc.content_type !== 'application/pdf' && (
                    <FileWarning className="h-4 w-4 text-yellow-500 mr-2" />
                  )}
                  {doc.file_name}
                </div>
                <div>{doc.company_name}</div>
                <div>{formatFileSize(doc.size)}</div>
                <div>{formatDate(doc.upload_date)}</div>
                <div>
                  <Badge variant={doc.processed === 'true' ? 'success' : 'secondary'}>
                    {doc.processed === 'true' ? 'Processed' : 'Pending'}
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => window.open(doc.file_url, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onFileSelect(doc)}
                    disabled={doc.content_type !== 'application/pdf' || doc.processed === 'true'}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {documents.length === 0 && !loading && !error && (
          <div className="text-center py-8 text-gray-500">
            No documents found
          </div>
        )}
        
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading documents...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentList;