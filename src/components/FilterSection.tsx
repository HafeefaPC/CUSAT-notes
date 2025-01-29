"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import categories from "@/content/catogories.json"

interface FilterSectionProps {
  onFilterChange: (type: string, value: string) => void;
}

export default function FilterSection({ onFilterChange }: FilterSectionProps) {
  const [selectedDept, setSelectedDept] = useState("")
  const [selectedSem, setSelectedSem] = useState("")

  const departments = categories["/"].resources[0].departments
  
  const getCurrentDepartment = () => {
    return departments.find(d => d.name === selectedDept)
  }

  const getCurrentSemester = () => {
    const dept = getCurrentDepartment()
    return dept?.semesters.find(s => s.name === selectedSem)
  }

  const handleDepartmentChange = (value: string) => {
    setSelectedDept(value)
    setSelectedSem("") // Reset semester when department changes
    onFilterChange('department', value)
    onFilterChange('semester', '') // Reset semester filter
    onFilterChange('subject', '') // Reset subject filter
  }

  const handleSemesterChange = (value: string) => {
    setSelectedSem(value)
    onFilterChange('semester', value)
    onFilterChange('subject', '') // Reset subject filter
  }

  return (
    <div className="flex flex-wrap gap-4">
      <Select 
        value={selectedDept}
        onValueChange={handleDepartmentChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Department" />
        </SelectTrigger>
        <SelectContent>
          {departments.map((dept) => (
            <SelectItem key={dept.slug} value={dept.name}>
              {dept.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={selectedSem}
        onValueChange={handleSemesterChange}
        disabled={!selectedDept}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Semester" />
        </SelectTrigger>
        <SelectContent>
          {getCurrentDepartment()?.semesters.map((sem) => (
            <SelectItem key={sem.slug} value={sem.name}>
              {sem.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        onValueChange={(value) => onFilterChange('subject', value)}
        disabled={!selectedSem}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Subject" />
        </SelectTrigger>
        <SelectContent>
          {getCurrentSemester()?.subjects.map((subject) => (
            <SelectItem key={subject.slug} value={subject.name}>
              {subject.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 