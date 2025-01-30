'use client';

import { useState, useEffect } from 'react';
import { StudyMaterial } from '@/types';
import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { Check, X, Trash2, Loader2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from '@/hooks/use-toast';

export function AdminDashboard() {
  const router = useRouter();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/materials');
      if (!response.ok) throw new Error('Failed to fetch materials');
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error('Failed to fetch materials:', error);
      setMaterials([]);
      toast({
        variant: "destructive",
        title: "Error fetching materials",
        description: error instanceof Error ? error.message : 'Failed to fetch materials'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'accept' | 'reject' | 'delete', messageId?: string) => {
    try {
      const response = await fetch(`/api/admin/materials/${id}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Action failed');
      }
      
      setMaterials(prevMaterials => {
        if (action === 'delete') {
          return prevMaterials.filter(m => m.id !== id);
        }
        return prevMaterials.map(m => 
          m.id === id ? { 
            ...m, 
            status: action === 'accept' ? 'accepted' : 'rejected'
          } : m
        );
      });

      toast({
        title: "Success",
        description: `Material ${action}ed successfully`
      });
    } catch (error) {
      console.error(`Failed to ${action} material:`, error);
      toast({
        variant: "destructive",
        title: `Failed to ${action} material`,
        description: error instanceof Error ? error.message : 'Action failed'
      });
    }
  };

  const handlePreview = async (material: StudyMaterial) => {
    try {
      setPreviewLoading(true);
      setSelectedMaterial(material);
      
      // Validate fileUrl exists
      if (!material.fileUrl) {
        throw new Error('No file URL available');
      }

      // Add error handling for invalid file IDs
      if (!/^[a-zA-Z0-9-_]+$/.test(material.fileUrl)) {
        throw new Error('Invalid file ID format');
      }

      const response = await fetch(`/api/download?fileId=${encodeURIComponent(material.fileUrl)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get file URL');
      }
      
      // Validate returned URL
      if (!data.url || typeof data.url !== 'string') {
        throw new Error('Invalid URL received from server');
      }

      // For preview, we'll open in a new tab instead of iframe
      window.open(data.url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Preview failed:', error);
      toast({
        variant: "destructive",
        title: "Preview failed",
        description: error instanceof Error ? error.message : 'Failed to preview file'
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Logout failed');
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error instanceof Error ? error.message : 'Failed to logout'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      pending: 'default',
      accepted: 'secondary',
      rejected: 'destructive'
    };
    const displayStatus = status || 'pending';
    return <Badge variant={variants[displayStatus] || 'default'}>{displayStatus}</Badge>;
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell>{material.title}</TableCell>
                  <TableCell>
                    <Badge variant={material.type === 'notes' ? 'default' : 'secondary'}>
                      {material.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{material.department}</TableCell>
                  <TableCell>{material.semester}</TableCell>
                  <TableCell>{material.subject}</TableCell>
                  <TableCell>{getStatusBadge(material.status || 'pending')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePreview(material)}
                        disabled={previewLoading}
                      >
                        {previewLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAction(material.id, 'accept')}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAction(material.id, 'reject')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => handleAction(material.id, 'delete', material.messageId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!previewUrl} onOpenChange={() => {
        setPreviewUrl(null);
        setSelectedMaterial(null);
      }}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedMaterial?.title}</DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title="Document Preview"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}