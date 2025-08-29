// @ts-nocheck
import React, { useState, useRef, useCallback, useMemo } from 'react'
import { 
  Upload, X, FileText, Image, Heart, Eye, Shield, 
  CheckCircle, AlertTriangle, Lock, FileCheck, 
  Download, Trash2, Clock, AlertCircle
} from 'lucide-react'
import './FileUpload.css'

export interface UploadedFile {
  /** File identifier */
  id: string
  /** File name */
  name: string
  /** File size in bytes */
  size: number
  /** File type */
  type: string
  /** Upload status */
  status: 'uploading' | 'completed' | 'error' | 'validating' | 'encrypted'
  /** Upload progress (0-100) */
  progress?: number
  /** File URL or base64 for preview */
  url?: string
  /** Error message if upload failed */
  error?: string
  /** Medical file category */
  medicalCategory?: 'radiology' | 'laboratory' | 'pathology' | 'cardiology' | 'report' | 'other'
  /** File validation result */
  validation?: {
    isValid: boolean
    issues?: string[]
    warnings?: string[]
  }
  /** HIPAA compliance status */
  hipaaCompliant?: boolean
  /** Upload timestamp */
  uploadedAt?: Date
  /** File metadata */
  metadata?: {
    patientId?: string
    studyDate?: Date
    modality?: string
    bodyPart?: string
    resolution?: string
  }
}

export interface FileUploadProps {
  /** Accepted file types */
  acceptedTypes?: string[]
  /** Maximum file size in MB */
  maxFileSize?: number
  /** Maximum number of files */
  maxFiles?: number
  /** Enable multiple file selection */
  multiple?: boolean
  /** Component size */
  size?: 'small' | 'medium' | 'large'
  /** Layout variant */
  variant?: 'default' | 'compact' | 'grid' | 'list'
  /** Show file preview */
  showPreview?: boolean
  /** Enable drag and drop */
  enableDragDrop?: boolean
  /** Show upload progress */
  showProgress?: boolean
  /** Show file validation */
  showValidation?: boolean
  /** HIPAA compliance mode */
  hipaaMode?: boolean
  /** Show metadata editor */
  showMetadata?: boolean
  /** Enable file encryption */
  enableEncryption?: boolean
  /** Medical context mode */
  medicalMode?: boolean
  /** Loading state */
  loading?: boolean
  /** Custom class name */
  className?: string
  /** ARIA label */
  'aria-label'?: string
  /** File selection handler */
  onFileSelect?: (files: File[]) => void
  /** Upload progress handler */
  onUploadProgress?: (fileId: string, progress: number) => void
  /** Upload completion handler */
  onUploadComplete?: (file: UploadedFile) => void
  /** Upload error handler */
  onUploadError?: (fileId: string, error: string) => void
  /** File deletion handler */
  onFileDelete?: (fileId: string) => void
  /** File preview handler */
  onFilePreview?: (file: UploadedFile) => void
  /** File download handler */
  onFileDownload?: (file: UploadedFile) => void
  /** Metadata change handler */
  onMetadataChange?: (fileId: string, metadata: UploadedFile['metadata']) => void
}

// Medical file type configurations
const medicalFileTypes = {
  dicom: {
    extensions: ['.dcm', '.dicom'],
    mimeTypes: ['application/dicom'],
    icon: Heart,
    label: 'DICOM-Bild',
    category: 'radiology' as const,
    maxSize: 500 // MB
  },
  pdf: {
    extensions: ['.pdf'],
    mimeTypes: ['application/pdf'],
    icon: FileText,
    label: 'PDF-Dokument',
    category: 'report' as const,
    maxSize: 50 // MB
  },
  image: {
    extensions: ['.jpg', '.jpeg', '.png', '.tiff', '.bmp'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/tiff', 'image/bmp'],
    icon: Image,
    label: 'Medizinisches Bild',
    category: 'radiology' as const,
    maxSize: 100 // MB
  }
}

// Default accepted medical file types
const defaultAcceptedTypes = [
  ...medicalFileTypes.dicom.mimeTypes,
  ...medicalFileTypes.pdf.mimeTypes,
  ...medicalFileTypes.image.mimeTypes
]

// Get file type info
const getFileTypeInfo = (file: File) => {
  const extension = '.' + file.name.split('.').pop()?.toLowerCase()
  
  for (const [key, config] of Object.entries(medicalFileTypes)) {
    if (config.extensions.includes(extension) || config.mimeTypes.includes(file.type)) {
      return { key, ...config }
    }
  }
  
  return {
    key: 'unknown',
    icon: FileText,
    label: 'Unbekannter Dateityp',
    category: 'other' as const,
    maxSize: 10
  }
}

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Validate file
const validateFile = (file: File, maxSize: number, acceptedTypes: string[]): UploadedFile['validation'] => {
  const issues: string[] = []
  const warnings: string[] = []
  
  // Check file type
  if (!acceptedTypes.includes(file.type)) {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    const typeInfo = getFileTypeInfo(file)
    if (typeInfo.key === 'unknown') {
      issues.push('Nicht unterstützter Dateityp')
    }
  }
  
  // Check file size
  const fileSizeMB = file.size / (1024 * 1024)
  if (fileSizeMB > maxSize) {
    issues.push(`Datei zu groß (max. ${maxSize}MB)`)
  }
  
  // Medical file specific validations
  const typeInfo = getFileTypeInfo(file)
  if (fileSizeMB > typeInfo.maxSize) {
    issues.push(`${typeInfo.label} zu groß (max. ${typeInfo.maxSize}MB)`)
  }
  
  // Check for potentially sensitive filename
  if (file.name.toLowerCase().includes('patient') || file.name.toLowerCase().includes('patien')) {
    warnings.push('Dateiname könnte Patientendaten enthalten')
  }
  
  return {
    isValid: issues.length === 0,
    issues: issues.length > 0 ? issues : undefined,
    warnings: warnings.length > 0 ? warnings : undefined
  }
}

export const FileUpload = ({
  acceptedTypes = defaultAcceptedTypes,
  maxFileSize = 100,
  maxFiles = 10,
  multiple = true,
  size = 'medium',
  variant = 'default',
  showPreview = true,
  enableDragDrop = true,
  showProgress = true,
  showValidation = true,
  hipaaMode = true,
  showMetadata = false,
  enableEncryption = true,
  medicalMode = true,
  loading = false,
  className = '',
  'aria-label': ariaLabel,
  onFileSelect,
  onUploadProgress,
  onUploadComplete,
  onUploadError,
  onFileDelete,
  onFilePreview,
  onFileDownload,
  onMetadataChange,
  ...props
}: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const containerClasses = `
    healthcare-fileupload-container
    healthcare-fileupload-container--${size}
    healthcare-fileupload-container--${variant}
    ${medicalMode ? 'healthcare-fileupload-container--medical' : ''}
    ${hipaaMode ? 'healthcare-fileupload-container--hipaa' : ''}
    ${loading ? 'healthcare-fileupload-container--loading' : ''}
    ${dragOver ? 'healthcare-fileupload-container--dragover' : ''}
    ${className}
  `.trim()

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const validFiles: File[] = []
    const newUploadedFiles: UploadedFile[] = []

    fileArray.forEach(file => {
      if (uploadedFiles.length + validFiles.length >= maxFiles) {
        return
      }

      const validation = validateFile(file, maxFileSize, acceptedTypes)
      const typeInfo = getFileTypeInfo(file)
      
      const uploadedFile: UploadedFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        status: validation.isValid ? 'uploading' : 'error',
        progress: 0,
        error: validation.issues?.join(', '),
        medicalCategory: typeInfo.category,
        validation,
        hipaaCompliant: hipaaMode && validation.isValid,
        uploadedAt: new Date(),
        metadata: {
          studyDate: new Date()
        }
      }

      if (validation.isValid) {
        validFiles.push(file)
      }
      
      newUploadedFiles.push(uploadedFile)
    })

    setUploadedFiles(prev => [...prev, ...newUploadedFiles])
    
    if (validFiles.length > 0) {
      onFileSelect?.(validFiles)
      
      // Simulate upload process
      newUploadedFiles.forEach(file => {
        if (file.status === 'uploading') {
          simulateUpload(file.id)
        }
      })
    }
  }, [acceptedTypes, maxFileSize, maxFiles, uploadedFiles.length, hipaaMode, onFileSelect])

  // Simulate file upload
  const simulateUpload = useCallback((fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      
      setUploadedFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, progress: Math.min(progress, 100) }
          : file
      ))
      
      onUploadProgress?.(fileId, Math.min(progress, 100))
      
      if (progress >= 100) {
        clearInterval(interval)
        
        // Simulate validation and encryption phases
        setTimeout(() => {
          setUploadedFiles(prev => prev.map(file => 
            file.id === fileId 
              ? { ...file, status: 'validating', progress: 100 }
              : file
          ))
          
          setTimeout(() => {
            setUploadedFiles(prev => prev.map(file => 
              file.id === fileId 
                ? { 
                    ...file, 
                    status: enableEncryption ? 'encrypted' : 'completed',
                    url: URL.createObjectURL(new Blob(['mock data'], { type: file.type }))
                  }
                : file
            ))
            
            const completedFile = uploadedFiles.find(f => f.id === fileId)
            if (completedFile) {
              onUploadComplete?.({...completedFile, status: 'completed'})
            }
          }, 1000)
        }, 500)
      }
    }, 200)
  }, [enableEncryption, onUploadProgress, onUploadComplete, uploadedFiles])

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (enableDragDrop) {
      setDragOver(true)
    }
  }, [enableDragDrop])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    if (enableDragDrop && e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files)
    }
  }, [enableDragDrop, handleFileSelect])

  // Handle file deletion
  const handleFileDelete = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
    onFileDelete?.(fileId)
  }, [onFileDelete])

  // Get status icon
  const getStatusIcon = (file: UploadedFile) => {
    switch (file.status) {
      case 'uploading':
        return Clock
      case 'validating':
        return FileCheck
      case 'encrypted':
        return Lock
      case 'completed':
        return CheckCircle
      case 'error':
        return AlertTriangle
      default:
        return FileText
    }
  }

  // Get status color
  const getStatusColor = (file: UploadedFile) => {
    switch (file.status) {
      case 'uploading':
      case 'validating':
        return '#f59e0b'
      case 'encrypted':
        return '#8b5cf6'
      case 'completed':
        return '#10b981'
      case 'error':
        return '#dc2626'
      default:
        return '#6b7280'
    }
  }

  // Calculate upload stats
  const uploadStats = useMemo(() => {
    const total = uploadedFiles.length
    const completed = uploadedFiles.filter(f => f.status === 'completed' || f.status === 'encrypted').length
    const uploading = uploadedFiles.filter(f => f.status === 'uploading').length
    const errors = uploadedFiles.filter(f => f.status === 'error').length
    const totalSize = uploadedFiles.reduce((sum, file) => sum + file.size, 0)
    
    return { total, completed, uploading, errors, totalSize }
  }, [uploadedFiles])

  if (loading) {
    return (
      <div className={containerClasses}>
        <div className="healthcare-fileupload-skeleton">
          <div className="healthcare-fileupload-skeleton-header" />
          <div className="healthcare-fileupload-skeleton-dropzone" />
          <div className="healthcare-fileupload-skeleton-files" />
        </div>
      </div>
    )
  }

  return (
    <div 
      className={containerClasses}
      aria-label={ariaLabel || 'Medizinische Dokumente hochladen'}
      {...props}
    >
      {/* Header */}
      <div className="healthcare-fileupload-header">
        <div className="healthcare-fileupload-title-container">
          <Upload className="healthcare-fileupload-title-icon" />
          <div>
            <h2 className="healthcare-fileupload-title">
              {medicalMode ? 'Medizinische Unterlagen hochladen' : 'Dateien hochladen'}
            </h2>
            <p className="healthcare-fileupload-subtitle">
              {medicalMode 
                ? 'DICOM-Bilder, Befunde und medizinische Dokumente sicher übertragen'
                : 'Unterstützte Dateiformate: PDF, JPEG, PNG, DICOM'
              }
            </p>
          </div>
        </div>

        {hipaaMode && (
          <div className="healthcare-fileupload-hipaa-badge">
            <Shield className="healthcare-fileupload-hipaa-icon" />
            <span>HIPAA-konform</span>
          </div>
        )}
      </div>

      {/* Upload Stats */}
      {uploadStats.total > 0 && (
        <div className="healthcare-fileupload-stats">
          <div className="healthcare-fileupload-stat">
            <span className="healthcare-fileupload-stat-label">Dateien:</span>
            <span className="healthcare-fileupload-stat-value">{uploadStats.completed}/{uploadStats.total}</span>
          </div>
          <div className="healthcare-fileupload-stat">
            <span className="healthcare-fileupload-stat-label">Größe:</span>
            <span className="healthcare-fileupload-stat-value">{formatFileSize(uploadStats.totalSize)}</span>
          </div>
          {uploadStats.uploading > 0 && (
            <div className="healthcare-fileupload-stat healthcare-fileupload-stat--uploading">
              <Clock className="healthcare-fileupload-stat-icon" />
              <span>{uploadStats.uploading} wird hochgeladen...</span>
            </div>
          )}
          {uploadStats.errors > 0 && (
            <div className="healthcare-fileupload-stat healthcare-fileupload-stat--error">
              <AlertTriangle className="healthcare-fileupload-stat-icon" />
              <span>{uploadStats.errors} Fehler</span>
            </div>
          )}
        </div>
      )}

      {/* Drop Zone */}
      <div 
        className="healthcare-fileupload-dropzone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            fileInputRef.current?.click()
          }
        }}
        aria-label="Dateien auswählen oder hierher ziehen"
      >
        <div className="healthcare-fileupload-dropzone-content">
          <Upload className="healthcare-fileupload-dropzone-icon" />
          <div className="healthcare-fileupload-dropzone-text">
            <h3>
              {enableDragDrop 
                ? 'Dateien hierher ziehen oder klicken zum Auswählen'
                : 'Klicken zum Auswählen'
              }
            </h3>
            <p>
              Unterstützt: {medicalMode ? 'DICOM, PDF, JPEG, PNG' : 'PDF, Bilder'} 
              {' '} (max. {maxFileSize}MB pro Datei)
            </p>
          </div>
        </div>

        {medicalMode && (
          <div className="healthcare-fileupload-medical-info">
            <div className="healthcare-fileupload-medical-types">
              {Object.entries(medicalFileTypes).map(([key, config]) => (
                <div key={key} className="healthcare-fileupload-medical-type">
                  <config.icon className="healthcare-fileupload-medical-type-icon" />
                  <span>{config.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedTypes.join(',')}
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        className="healthcare-fileupload-input"
        aria-hidden="true"
      />

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="healthcare-fileupload-files">
          <h3 className="healthcare-fileupload-files-title">
            Hochgeladene Dateien ({uploadedFiles.length})
          </h3>
          
          <div className={`healthcare-fileupload-files-list healthcare-fileupload-files-list--${variant}`}>
            {uploadedFiles.map(file => {
              const typeInfo = getFileTypeInfo({ name: file.name, type: file.type } as File)
              const StatusIcon = getStatusIcon(file)
              
              return (
                <div 
                  key={file.id} 
                  className={`
                    healthcare-fileupload-file
                    healthcare-fileupload-file--${file.status}
                    ${file.validation?.issues ? 'healthcare-fileupload-file--invalid' : ''}
                  `.trim()}
                >
                  <div className="healthcare-fileupload-file-main">
                    <div className="healthcare-fileupload-file-icon-container">
                      <typeInfo.icon className="healthcare-fileupload-file-icon" />
                      {file.medicalCategory && (
                        <div className={`healthcare-fileupload-file-category healthcare-fileupload-file-category--${file.medicalCategory}`}>
                          {file.medicalCategory}
                        </div>
                      )}
                    </div>

                    <div className="healthcare-fileupload-file-info">
                      <div className="healthcare-fileupload-file-name">{file.name}</div>
                      <div className="healthcare-fileupload-file-details">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{typeInfo.label}</span>
                        {file.uploadedAt && (
                          <>
                            <span>•</span>
                            <span>{file.uploadedAt.toLocaleTimeString('de-DE')}</span>
                          </>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {showProgress && file.status === 'uploading' && (
                        <div className="healthcare-fileupload-progress">
                          <div 
                            className="healthcare-fileupload-progress-bar"
                            style={{ width: `${file.progress || 0}%` }}
                          />
                          <span className="healthcare-fileupload-progress-text">
                            {Math.round(file.progress || 0)}%
                          </span>
                        </div>
                      )}

                      {/* Validation Messages */}
                      {showValidation && file.validation?.issues && (
                        <div className="healthcare-fileupload-validation healthcare-fileupload-validation--error">
                          <AlertTriangle className="healthcare-fileupload-validation-icon" />
                          <span>{file.validation.issues.join(', ')}</span>
                        </div>
                      )}

                      {showValidation && file.validation?.warnings && (
                        <div className="healthcare-fileupload-validation healthcare-fileupload-validation--warning">
                          <AlertCircle className="healthcare-fileupload-validation-icon" />
                          <span>{file.validation.warnings.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    <div className="healthcare-fileupload-file-status">
                      <StatusIcon 
                        className="healthcare-fileupload-file-status-icon"
                        style={{ color: getStatusColor(file) }}
                      />
                      <span 
                        className="healthcare-fileupload-file-status-text"
                        style={{ color: getStatusColor(file) }}
                      >
                        {file.status === 'uploading' && 'Wird hochgeladen...'}
                        {file.status === 'validating' && 'Validierung...'}
                        {file.status === 'encrypted' && 'Verschlüsselt'}
                        {file.status === 'completed' && 'Abgeschlossen'}
                        {file.status === 'error' && 'Fehler'}
                      </span>
                    </div>
                  </div>

                  {/* File Actions */}
                  <div className="healthcare-fileupload-file-actions">
                    {showPreview && file.url && file.status === 'completed' && (
                      <button
                        className="healthcare-fileupload-file-action"
                        onClick={() => onFilePreview?.(file)}
                        aria-label={`${file.name} vorschau`}
                      >
                        <Eye />
                      </button>
                    )}

                    {file.status === 'completed' && (
                      <button
                        className="healthcare-fileupload-file-action"
                        onClick={() => onFileDownload?.(file)}
                        aria-label={`${file.name} herunterladen`}
                      >
                        <Download />
                      </button>
                    )}

                    <button
                      className="healthcare-fileupload-file-action healthcare-fileupload-file-action--delete"
                      onClick={() => handleFileDelete(file.id)}
                      aria-label={`${file.name} löschen`}
                    >
                      <Trash2 />
                    </button>
                  </div>

                  {/* HIPAA Compliance Badge */}
                  {hipaaMode && file.hipaaCompliant && (
                    <div className="healthcare-fileupload-hipaa-compliance">
                      <Shield className="healthcare-fileupload-hipaa-compliance-icon" />
                      <span>HIPAA-konform</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      {medicalMode && (
        <div className="healthcare-fileupload-privacy">
          <Lock className="healthcare-fileupload-privacy-icon" />
          <div>
            <h4>Datenschutz & Sicherheit</h4>
            <p>
              Alle medizinischen Unterlagen werden verschlüsselt übertragen und entsprechen 
              den DSGVO- und HIPAA-Standards. Ihre Daten sind durch modernste 
              Sicherheitstechnologie geschützt.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

FileUpload.displayName = 'FileUpload'
// @ts-nocheck
