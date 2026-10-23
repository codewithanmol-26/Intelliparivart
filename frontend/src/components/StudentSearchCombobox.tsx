'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, User, X, Check, Loader2, AlertCircle, Building2, BookOpen, Mail, Hash } from 'lucide-react';

export interface StudentRecord {
  id: string;
  student_id?: string;
  user_id?: string;
  name: string;
  full_name?: string;
  email?: string;
  roll_number?: string;
  batch_name?: string;
  institute_name?: string;
  target_exam?: string;
  has_assessment_data?: boolean;
  diagnostic_trigger?: string;
  source?: string;
}

interface StudentSearchComboboxProps {
  selectedStudent: StudentRecord | null;
  onSelectStudent: (student: StudentRecord | null) => void;
  tenantId?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export default function StudentSearchCombobox({
  selectedStudent,
  onSelectStudent,
  tenantId = 'INST_PATNA_01',
  label = 'Student',
  placeholder = 'Search by student name, ID, roll number, or email...',
  required = true,
}: StudentSearchComboboxProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StudentRecord[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search function
  const searchStudents = useCallback(
    async (searchTerm: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/students/search?q=${encodeURIComponent(searchTerm)}&tenant_id=${encodeURIComponent(tenantId)}`
        );
        if (!res.ok) {
          throw new Error(`Database query failed with status ${res.status}`);
        }
        const data = await res.json();
        if (data.status === 'error') {
          throw new Error(data.message || 'Database error while searching students');
        }
        setResults(data.students || []);
        setHighlightedIndex(-1);
      } catch (err: any) {
        console.error('Supabase student search error:', err);
        setError(err.message || 'Unable to connect to Supabase database. Please try again.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [tenantId]
  );

  // Trigger search on query change with 300ms debounce
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!isOpen && !query) {
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      searchStudents(query);
    }, 300);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query, isOpen, searchStudents]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        searchStudents(query);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          handleSelect(results[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleSelect = (student: StudentRecord) => {
    onSelectStudent(student);
    setIsOpen(false);
    setQuery('');
    setHighlightedIndex(-1);
  };

  const handleClear = () => {
    onSelectStudent(null);
    setQuery('');
    setResults([]);
    setIsOpen(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full space-y-1.5 text-xs">
      <div className="flex items-center justify-between">
        <label className="block font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {selectedStudent && (
          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md flex items-center space-x-1">
            <Check className="w-3 h-3 text-teal-600" />
            <span>Verified in Database</span>
          </span>
        )}
      </div>

      {/* Selected Student State View */}
      {selectedStudent ? (
        <div className="flex items-center justify-between p-3 rounded-xl bg-teal-50/70 border border-teal-300 shadow-2xs transition-all">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              {selectedStudent.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-xs truncate">
                  {selectedStudent.name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-teal-800 border border-teal-200">
                  {selectedStudent.id || selectedStudent.student_id}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-600 mt-0.5">
                {selectedStudent.email && (
                  <span className="flex items-center text-slate-500">
                    <Mail className="w-3 h-3 mr-1 text-slate-400" />
                    {selectedStudent.email}
                  </span>
                )}
                {selectedStudent.batch_name && (
                  <span className="flex items-center font-medium text-teal-900">
                    • {selectedStudent.batch_name}
                  </span>
                )}
                {selectedStudent.institute_name && (
                  <span className="hidden sm:inline text-slate-500 truncate">
                    • {selectedStudent.institute_name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-teal-100/60 transition cursor-pointer shrink-0 ml-2"
            title="Clear and search another student"
            aria-label="Clear student selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Search Input Box */
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!isOpen) setIsOpen(true);
              }}
              onFocus={() => {
                setIsOpen(true);
                searchStudents(query);
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 focus:bg-white text-xs transition"
              aria-expanded={isOpen}
              aria-autocomplete="list"
              aria-controls="student-search-results"
            />
            {isLoading && (
              <Loader2 className="w-4 h-4 text-teal-600 animate-spin absolute right-3 pointer-events-none" />
            )}
            {!isLoading && query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                  if (inputRef.current) inputRef.current.focus();
                }}
                className="p-1 rounded text-slate-400 hover:text-slate-600 absolute right-2.5 cursor-pointer"
                aria-label="Clear search input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div
              id="student-search-results"
              role="listbox"
              className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto overflow-x-hidden divide-y divide-slate-100"
            >
              {/* Loading State */}
              {isLoading && results.length === 0 && (
                <div className="p-4 text-center text-slate-500 space-y-1.5">
                  <Loader2 className="w-5 h-5 text-teal-600 animate-spin mx-auto" />
                  <p className="text-[11px] font-medium">Searching Supabase student database...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="p-4 text-center text-rose-600 bg-rose-50/50 space-y-1">
                  <AlertCircle className="w-4 h-4 text-rose-500 mx-auto" />
                  <p className="text-xs font-semibold">Database Search Error</p>
                  <p className="text-[11px] text-slate-600">{error}</p>
                </div>
              )}

              {/* No Results State */}
              {!isLoading && !error && results.length === 0 && (
                <div className="p-5 text-center text-slate-500 space-y-1">
                  <User className="w-6 h-6 text-slate-300 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">No matching students found</p>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    {query
                      ? `No student records in Supabase matched "${query}". Try searching by student ID, roll number, or email.`
                      : 'No student accounts currently enrolled for this institute in Supabase.'}
                  </p>
                </div>
              )}

              {/* Results List */}
              {!error && results.length > 0 && (
                <>
                  <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span>Matching Students from Supabase ({results.length})</span>
                    <span className="text-[9px] font-normal text-slate-400">Use ↑ ↓ & Enter to select</span>
                  </div>
                  {results.map((student, idx) => {
                    const isHighlighted = idx === highlightedIndex;
                    const studentId = student.id || student.student_id;
                    return (
                      <div
                        key={studentId || idx}
                        role="option"
                        aria-selected={isHighlighted}
                        onClick={() => handleSelect(student)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={`p-3 cursor-pointer transition flex items-center justify-between gap-3 ${
                          isHighlighted ? 'bg-teal-50/80 text-teal-950' : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            isHighlighted ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {student.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-xs text-slate-900 truncate">
                                {student.name}
                              </span>
                              <span className="font-mono text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded">
                                {studentId}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 mt-0.5">
                              {student.email && (
                                <span className="flex items-center text-slate-500">
                                  <Mail className="w-2.5 h-2.5 mr-1 text-slate-400" />
                                  {student.email}
                                </span>
                              )}
                              {student.batch_name && (
                                <span className="font-medium text-slate-700">
                                  • {student.batch_name}
                                </span>
                              )}
                              {student.institute_name && (
                                <span className="hidden sm:inline text-slate-400 truncate">
                                  • {student.institute_name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-1 rounded shrink-0 ${
                          isHighlighted ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          Select
                        </span>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
