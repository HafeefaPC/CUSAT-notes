import React from 'react'
import { StudyMaterial } from '@/types'
import { Download, FileText, FileQuestion } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { useState } from 'react'
import { toast } from '@/hooks/use-toast'

interface MaterialCardProps {
  material: StudyMaterial;
  children?: React.ReactNode;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, children }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Validate file URL
      if (!material.fileUrl) {
        throw new Error('No file URL available');
      }

      const response = await fetch(`/api/download?fileId=${encodeURIComponent(material.fileUrl)}`);
      const data = await response.json();
      
      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Failed to get file URL');
      }

      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = data.url;
      link.download = material.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: error instanceof Error ? error.message : 'Failed to download file'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium leading-tight">
          {material.title}
        </CardTitle>
        <Badge variant={material.type === 'notes' ? 'default' : 'secondary'}>
          {material.type === 'notes' ? (
            <FileText className="mr-1 h-3 w-3" />
          ) : (
            <FileQuestion className="mr-1 h-3 w-3" />
          )}
          {material.type === 'notes' ? 'Note' : 'Question Paper'}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>{material.department} • {material.semester}</p>
          <p>{material.subject}</p>
          <p>Uploaded by {material.uploadedBy}</p>
          <p>{new Date(material.uploadDate).toLocaleDateString()}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleDownload}
          disabled={isDownloading}
        >
          <Download className="mr-2 h-4 w-4" />
          {isDownloading ? 'Downloading...' : 'Download'}
        </Button>
      </CardFooter>
      {children}
    </Card>
  )
}

export default MaterialCard; 