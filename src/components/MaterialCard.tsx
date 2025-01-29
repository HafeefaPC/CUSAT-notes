import { StudyMaterial } from '@/types'
import { Download, FileText, FileQuestion } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { useState } from 'react'

export function MaterialCard({ material }: { material: StudyMaterial }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(`/api/download?fileId=${material.fileUrl}`);
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = data.url;
      link.download = material.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      // You might want to show an error toast here
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
    </Card>
  )
} 