import type { Meta, StoryObj } from '@storybook/react'
import { FileUpload, UploadedFile } from './FileUpload'

// Sample file data for different scenarios
const sampleMedicalFiles: UploadedFile[] = [
  {
    id: 'file-1',
    name: 'Herz_MRT_2024.dcm',
    size: 25600000, // 25.6MB
    type: 'application/dicom',
    status: 'completed',
    progress: 100,
    medicalCategory: 'radiology',
    validation: {
      isValid: true
    },
    hipaaCompliant: true,
    uploadedAt: new Date('2024-08-07T10:30:00'),
    metadata: {
      patientId: 'masked-patient-id',
      studyDate: new Date('2024-08-05'),
      modality: 'MRT',
      bodyPart: 'Herz',
      resolution: '512x512'
    }
  },
  {
    id: 'file-2',
    name: 'Laborwerte_Juli_2024.pdf',
    size: 847392, // 847KB
    type: 'application/pdf',
    status: 'completed',
    progress: 100,
    medicalCategory: 'laboratory',
    validation: {
      isValid: true,
      warnings: ['Datei enthält möglicherweise persönliche Daten']
    },
    hipaaCompliant: true,
    uploadedAt: new Date('2024-08-07T10:25:00'),
    metadata: {
      patientId: 'masked-patient-id',
      studyDate: new Date('2024-07-15')
    }
  },
  {
    id: 'file-3',
    name: 'Röntgen_Thorax.jpg',
    size: 3840000, // 3.84MB
    type: 'image/jpeg',
    status: 'encrypted',
    progress: 100,
    medicalCategory: 'radiology',
    validation: {
      isValid: true
    },
    hipaaCompliant: true,
    uploadedAt: new Date('2024-08-07T10:20:00'),
    metadata: {
      patientId: 'masked-patient-id',
      studyDate: new Date('2024-08-03'),
      modality: 'Röntgen',
      bodyPart: 'Thorax'
    }
  }
]

const emergencyFiles: UploadedFile[] = [
  {
    id: 'emergency-1',
    name: 'Notfall_EKG.pdf',
    size: 1200000, // 1.2MB
    type: 'application/pdf',
    status: 'uploading',
    progress: 67,
    medicalCategory: 'cardiology',
    validation: {
      isValid: true
    },
    hipaaCompliant: true,
    uploadedAt: new Date(),
    metadata: {
      patientId: 'emergency-case',
      studyDate: new Date()
    }
  }
]

const errorFiles: UploadedFile[] = [
  {
    id: 'error-1',
    name: 'large_file_too_big.dcm',
    size: 600000000, // 600MB - too large
    type: 'application/dicom',
    status: 'error',
    error: 'Datei zu groß (max. 500MB für DICOM)',
    medicalCategory: 'radiology',
    validation: {
      isValid: false,
      issues: ['Datei zu groß (max. 500MB)', 'Upload-Timeout erreicht']
    },
    hipaaCompliant: false,
    uploadedAt: new Date()
  },
  {
    id: 'error-2',
    name: 'patient_data_unsecure.txt',
    size: 15000,
    type: 'text/plain',
    status: 'error',
    error: 'Nicht unterstützter Dateityp',
    medicalCategory: 'other',
    validation: {
      isValid: false,
      issues: ['Nicht unterstützter Dateityp'],
      warnings: ['Dateiname könnte Patientendaten enthalten']
    },
    hipaaCompliant: false,
    uploadedAt: new Date()
  }
]

const meta: Meta<typeof FileUpload> = {
  title: 'Healthcare/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Healthcare File Upload Component - HIPAA-konforme medizinische Dokumentenverwaltung

**Healthcare-Optimierungen:**
- DICOM, PDF, und medizinische Bildformate unterstützt
- HIPAA-konforme Verschlüsselung und Datenübertragung
- Medizinische Dateikategorisierung (Radiologie, Labor, Pathologie, etc.)
- Fortschrittsanzeigen für große medizinische Dateien
- Automatische Validierung medizinischer Metadaten
- WCAG 2.1 AA konform mit Drag & Drop Accessibility

**Medizinische Dateitypen:**
- DICOM (.dcm) - Medizinische Bildgebung bis 500MB
- PDF (.pdf) - Arztberichte und Befunde bis 50MB  
- JPEG/PNG/TIFF (.jpg, .png, .tiff) - Medizinische Bilder bis 100MB
- Automatische Kategorisierung nach Fachbereich

**HIPAA-Compliance Features:**
- End-to-End Verschlüsselung während Upload
- Sichere Metadaten-Verarbeitung ohne Patientendaten
- Audit-Trail für alle Upload-Aktivitäten
- Automatische Datenschutz-Validierung

**Anwendungsfälle:**
- Medizinische Befunde für Zweitmeinungen hochladen
- DICOM-Bilder von Radiologen übertragen
- Laborwerte und Arztberichte sammeln
- Notfall-Dokumente schnell und sicher übermitteln
- Batch-Upload mehrerer medizinischer Unterlagen

**Accessibility Features:**
- Drag & Drop mit Keyboard-Alternative
- Screen Reader Support für Upload-Status
- Touch-optimiert für Healthcare-Tablets (56px+ Targets)
- High Contrast Mode für medizinische Arbeitsplätze
- Progress Announcements für assistive Technologien
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'grid', 'list'],
      description: 'Layout-Variante'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Komponentengröße'
    },
    maxFileSize: {
      control: { type: 'number', min: 1, max: 1000 },
      description: 'Maximale Dateigröße in MB'
    },
    maxFiles: {
      control: { type: 'number', min: 1, max: 50 },
      description: 'Maximale Anzahl Dateien'
    },
    multiple: {
      control: 'boolean',
      description: 'Mehrfachauswahl aktivieren'
    },
    showPreview: {
      control: 'boolean',
      description: 'Datei-Vorschau anzeigen'
    },
    enableDragDrop: {
      control: 'boolean',
      description: 'Drag & Drop aktivieren'
    },
    showProgress: {
      control: 'boolean',
      description: 'Upload-Fortschritt anzeigen'
    },
    showValidation: {
      control: 'boolean',
      description: 'Validierungsmeldungen anzeigen'
    },
    hipaaMode: {
      control: 'boolean',
      description: 'HIPAA-Compliance-Modus'
    },
    showMetadata: {
      control: 'boolean',
      description: 'Metadaten-Editor anzeigen'
    },
    enableEncryption: {
      control: 'boolean',
      description: 'Dateiverschlüsselung aktivieren'
    },
    medicalMode: {
      control: 'boolean',
      description: 'Medizinischer Modus für Healthcare'
    },
    loading: {
      control: 'boolean',
      description: 'Ladezustand anzeigen'
    }
  },
  args: {
    variant: 'default',
    size: 'medium',
    acceptedTypes: [
      'application/dicom',
      'application/pdf', 
      'image/jpeg',
      'image/png',
      'image/tiff'
    ],
    maxFileSize: 100,
    maxFiles: 10,
    multiple: true,
    showPreview: true,
    enableDragDrop: true,
    showProgress: true,
    showValidation: true,
    hipaaMode: true,
    showMetadata: false,
    enableEncryption: true,
    medicalMode: true,
    loading: false
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof FileUpload>

// Default Story - Standard Medical File Upload
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Standard medizinischer Datei-Upload mit HIPAA-Compliance und medizinischen Dateityp-Unterstützung.'
      }
    }
  }
}

// DICOM Upload - Medical Imaging Files
export const DICOMUpload: Story = {
  args: {
    acceptedTypes: ['application/dicom'],
    maxFileSize: 500,
    maxFiles: 20,
    title: 'DICOM-Bilder hochladen',
    subtitle: 'Medizinische Bildgebung für radiologische Zweitmeinung',
    onFileSelect: (files) => {
      console.log('DICOM files selected:', files.map(f => ({
        name: f.name,
        size: f.size,
        type: f.type
      })))
    },
    onUploadComplete: (file) => {
      console.log('DICOM upload completed:', {
        name: file.name,
        category: file.medicalCategory,
        metadata: file.metadata
      })
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Spezialisierter Upload für DICOM-Dateien mit erhöhter Größengrenze und radiologischen Metadaten.'
      }
    }
  }
}

// Emergency Upload - Critical Medical Documents
export const EmergencyUpload: Story = {
  args: {
    size: 'large',
    variant: 'default',
    hipaaMode: true,
    enableEncryption: true,
    maxFileSize: 200,
    title: '🚨 Notfall-Dokumente hochladen',
    subtitle: 'Kritische medizinische Unterlagen für sofortige Bearbeitung',
    className: 'emergency-upload',
    onFileSelect: (files) => {
      console.log('🚨 Emergency files uploaded:', files)
      // Simulate priority handling
      files.forEach(file => {
        console.log(`Priority upload initiated for: ${file.name}`)
      })
    },
    onUploadProgress: (fileId, progress) => {
      console.log(`Emergency upload progress: ${progress}%`)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Notfall-Upload-Modus für kritische medizinische Dokumente mit priorisierter Verarbeitung.'
      }
    }
  }
}

// Grid Layout - Multiple Files Overview
export const GridLayout: Story = {
  args: {
    variant: 'grid',
    size: 'medium',
    multiple: true,
    maxFiles: 20,
    showPreview: true,
    showMetadata: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Grid-Layout für bessere Übersicht bei mehreren hochgeladenen medizinischen Dokumenten.'
      }
    }
  }
}

// Compact Variant - Sidebar Integration
export const CompactVariant: Story = {
  args: {
    variant: 'compact',
    size: 'small',
    maxFiles: 5,
    showPreview: false,
    showMetadata: false,
    enableDragDrop: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Kompakte Darstellung für Integration in Seitenbereiche oder Modal-Dialoge.'
      }
    }
  }
}

// List Layout - Minimal File Management
export const ListLayout: Story = {
  args: {
    variant: 'list',
    showPreview: true,
    showProgress: true,
    showValidation: true,
    enableDragDrop: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Listen-Layout für effiziente Dateiverwaltung mit minimaler visueller Ablenkung.'
      }
    }
  }
}

// Large Files - DICOM and Medical Imaging
export const LargeFiles: Story = {
  args: {
    size: 'large',
    maxFileSize: 1000, // 1GB for large DICOM series
    maxFiles: 5,
    acceptedTypes: ['application/dicom', 'image/tiff'],
    title: 'Große medizinische Dateien',
    subtitle: 'DICOM-Serien und hochauflösende medizinische Bilder bis 1GB',
    onUploadProgress: (fileId, progress) => {
      console.log(`Large file upload: ${progress}% (${fileId})`)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Upload für große medizinische Dateien wie DICOM-Serien mit erhöhten Größenlimits.'
      }
    }
  }
}

// Multiple File Categories - Mixed Medical Documents
export const MultipleFileCategories: Story = {
  args: {
    acceptedTypes: [
      'application/dicom',
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/tiff'
    ],
    maxFiles: 15,
    showPreview: true,
    showValidation: true,
    showMetadata: true,
    onFileSelect: (files) => {
      console.log('Mixed medical files:', files.map(f => ({
        name: f.name,
        type: f.type,
        category: f.type.includes('dicom') ? 'radiology' : 
                  f.type.includes('pdf') ? 'report' : 'image'
      })))
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Upload verschiedener medizinischer Dateitypen mit automatischer Kategorisierung.'
      }
    }
  }
}

// Pre-uploaded Files - Existing Medical Documents
export const PreUploadedFiles: Story = {
  render: (args) => {
    // Mock component with pre-loaded files
    return (
      <div style={{ position: 'relative' }}>
        <FileUpload {...args} />
        <div style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          background: '#e0f7fa', 
          padding: '8px 12px', 
          borderRadius: '8px',
          fontSize: '12px',
          color: '#006064'
        }}>
          Simuliert 3 bereits hochgeladene Dateien
        </div>
      </div>
    )
  },
  args: {
    showPreview: true,
    showValidation: true,
    showMetadata: false,
    onFilePreview: (file) => {
      console.log('Previewing file:', file.name)
      alert(`Vorschau für: ${file.name}\nKategorie: ${file.medicalCategory}\nGröße: ${Math.round(file.size / 1024 / 1024 * 100) / 100}MB`)
    },
    onFileDownload: (file) => {
      console.log('Downloading file:', file.name)
      alert(`Download wird vorbereitet: ${file.name}`)
    },
    onFileDelete: (fileId) => {
      console.log('Deleting file:', fileId)
      if (confirm('Datei wirklich löschen?')) {
        alert('Datei wurde gelöscht')
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Darstellung bereits hochgeladener medizinischer Dokumente mit Vorschau- und Download-Funktionen.'
      }
    }
  }
}

// Upload Progress - Active File Transfer
export const UploadProgress: Story = {
  render: (args) => {
    return (
      <div>
        <FileUpload {...args} />
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          background: '#fff3cd', 
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          ⏳ Simulation: Upload-Fortschritt wird automatisch angezeigt
        </div>
      </div>
    )
  },
  args: {
    showProgress: true,
    showValidation: true,
    onUploadProgress: (fileId, progress) => {
      console.log(`Upload progress: ${fileId} - ${progress}%`)
    },
    onUploadComplete: (file) => {
      console.log('Upload completed:', file.name)
      alert(`✅ Upload abgeschlossen: ${file.name}`)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Live-Darstellung des Upload-Fortschritts mit Echtzeit-Updates und Completion-Events.'
      }
    }
  }
}

// Error Handling - Upload Failures
export const ErrorHandling: Story = {
  render: (args) => {
    return (
      <div>
        <FileUpload {...args} />
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          background: '#f8d7da', 
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#721c24'
        }}>
          🚫 Test: Versuchen Sie eine Datei &gt; 10MB oder unsupported Format hochzuladen
        </div>
      </div>
    )
  },
  args: {
    maxFileSize: 10, // Low limit to trigger errors easily
    showValidation: true,
    acceptedTypes: ['application/pdf', 'image/jpeg'], // Limited types
    onUploadError: (fileId, error) => {
      console.error('Upload error:', { fileId, error })
      alert(`❌ Upload-Fehler: ${error}`)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Behandlung von Upload-Fehlern mit benutzerfreundlichen Fehlermeldungen und Recovery-Optionen.'
      }
    }
  }
}

// Accessibility Demo - Screen Reader Optimized
export const AccessibilityDemo: Story = {
  args: {
    'aria-label': 'Medizinische Dokumente für Zweitmeinung hochladen',
    enableDragDrop: true,
    showValidation: true,
    showProgress: true,
    hipaaMode: true,
    title: 'Barrierefreier Datei-Upload',
    subtitle: 'Optimiert für Screen Reader und Keyboard-Navigation',
    onFileSelect: (files) => {
      // Announce file selection to screen readers
      console.log('Accessibility announcement: Dateien ausgewählt', files.length)
      files.forEach((file, index) => {
        console.log(`Datei ${index + 1}: ${file.name}, ${Math.round(file.size / 1024)}KB`)
      })
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Barrierefreier Upload mit ARIA-Labels, Keyboard-Navigation und Screen-Reader-Announcements.'
      }
    }
  }
}

// Mobile Optimized - Touch Friendly
export const MobileOptimized: Story = {
  args: {
    size: 'small',
    variant: 'list',
    enableDragDrop: false, // Better for mobile
    maxFiles: 8,
    showMetadata: false,
    title: 'Mobile Datei-Upload',
    subtitle: 'Touch-optimiert für Smartphone und Tablet'
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile-optimierter Upload mit Touch-freundlichen Controls und vereinfachter Oberfläche.'
      }
    }
  }
}

// Loading State - Data Fetching
export const LoadingState: Story = {
  args: {
    loading: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Ladezustand während der Initialisierung der Upload-Komponente mit Skeleton-Elementen.'
      }
    }
  }
}

// Interactive Example - Full Functionality
export const InteractiveExample: Story = {
  args: {
    showPreview: true,
    showProgress: true,
    showValidation: true,
    showMetadata: false,
    hipaaMode: true,
    enableEncryption: true,
    maxFiles: 12,
    onFileSelect: (files) => {
      console.log(`📄 ${files.length} file(s) selected for medical upload:`)
      files.forEach((file, index) => {
        const sizeInMB = Math.round(file.size / 1024 / 1024 * 100) / 100
        console.log(`  ${index + 1}. ${file.name} (${sizeInMB}MB, ${file.type})`)
      })
    },
    onUploadProgress: (fileId, progress) => {
      console.log(`📊 Upload Progress: ${fileId.slice(-8)} - ${progress}%`)
      if (progress === 100) {
        console.log(`✨ Upload completed: ${fileId}`)
      }
    },
    onUploadComplete: (file) => {
      console.log(`🎉 Medical document uploaded successfully:`, {
        name: file.name,
        category: file.medicalCategory,
        size: `${Math.round(file.size / 1024 / 1024 * 100) / 100}MB`,
        hipaaCompliant: file.hipaaCompliant,
        encrypted: file.status === 'encrypted',
        uploadTime: file.uploadedAt?.toLocaleTimeString()
      })
    },
    onUploadError: (fileId, error) => {
      console.error(`❌ Upload failed for ${fileId}:`, error)
    },
    onFilePreview: (file) => {
      console.log(`👁️ Previewing: ${file.name}`)
      alert(`Vorschau für medizinische Datei:

📁 Name: ${file.name}
📋 Kategorie: ${file.medicalCategory}
📏 Größe: ${Math.round(file.size / 1024 / 1024 * 100) / 100}MB
🔒 HIPAA-konform: ${file.hipaaCompliant ? '✅ Ja' : '❌ Nein'}
📅 Hochgeladen: ${file.uploadedAt?.toLocaleString('de-DE') || 'Gerade eben'}`)
    },
    onFileDownload: (file) => {
      console.log(`💾 Downloading: ${file.name}`)
      alert(`Download wird vorbereitet...

Datei: ${file.name}
Sicherer Download mit End-to-End Verschlüsselung`)
    },
    onFileDelete: (fileId) => {
      console.log(`🗑️ Delete requested: ${fileId}`)
      if (confirm('Medizinische Datei wirklich löschen?\n\nDieser Vorgang kann nicht rückgängig gemacht werden.')) {
        console.log(`✅ File deleted: ${fileId}`)
        alert('Datei wurde sicher gelöscht')
      }
    },
    onMetadataChange: (fileId, metadata) => {
      console.log(`📝 Metadata updated for ${fileId}:`, metadata)
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Vollständig interaktiver Upload mit allen Event-Handlers und detailliertem Logging für die Produktionsintegration.'
      }
    }
  }
}