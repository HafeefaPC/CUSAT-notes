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

export function AdminDashboard() {
  const router = useRouter();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
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
      
      if (!response.ok) throw new Error('Action failed');
      
      // Update local state immediately
      setMaterials(prevMaterials => {
        if (action === 'delete') {
          return prevMaterials.filter(m => m.id !== id);
        }
        return prevMaterials.map(m => 
          m.id === id ? { ...m, status: action === 'accept' ? 'accepted' : 'rejected' } : m
        );
      });
    } catch (error) {
      console.error(`Failed to ${action} material:`, error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handlePreview = async (material: StudyMaterial) => {
    try {
      const response = await fetch(`/api/download?fileId=${material.fileUrl}`);
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      setPreviewUrl(data.url);
      setSelectedMaterial(material);
    } catch (error) {
      console.error('Preview failed:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      pending: 'default',
      accepted: 'secondary',
      rejected: 'destructive'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
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
                  <TableCell>{getStatusBadge(material.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePreview(material)}
                      >
                        <Eye className="h-4 w-4" />
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

      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedMaterial?.title}</DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <iframe
              src={`${previewUrl}#toolbar=0`}
              className="w-full h-full"
              title="PDF Preview"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 