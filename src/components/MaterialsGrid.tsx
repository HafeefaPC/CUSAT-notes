"use client"

import { StudyMaterial, FilterOptions } from '@/types'
import { MaterialCard } from './MaterialCard'
import { Button } from './ui/button'
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

interface MaterialsGridProps {
  materials: StudyMaterial[]
  filters: FilterOptions
  loading?: boolean
}

const ITEMS_PER_PAGE = 9

export function MaterialsGrid({ materials, filters, loading }: MaterialsGridProps) {
  const [page, setPage] = useState(1)
  const [filteredMaterials, setFilteredMaterials] = useState<StudyMaterial[]>([])

  useEffect(() => {
    const filtered = materials.filter(material => {
      return (
        (!filters.department || material.department === filters.department) &&
        (!filters.semester || material.semester === filters.semester) &&
        (!filters.subject || material.subject === filters.subject)
      )
    })
    setFilteredMaterials(filtered)
    setPage(1) // Reset to first page when filters change
  }, [materials, filters])

  const totalPages = Math.ceil(filteredMaterials.length / ITEMS_PER_PAGE)
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const displayedMaterials = filteredMaterials.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!filteredMaterials.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No materials found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayedMaterials.map((material) => (
          <MaterialCard key={material.id} material={material} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex h-9 items-center gap-1 text-sm font-medium">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
} 