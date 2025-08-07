import type { Meta, StoryObj } from '@storybook/react'
import { HealthcareModal } from './HealthcareModal'
import * as React from 'react'

const meta: Meta<typeof HealthcareModal> = {
  title: 'Healthcare/Modal',
  component: HealthcareModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Healthcare Modal Component - Dialoge für medizinische Inhalte und Zustimmungsformulare

**Healthcare-Optimierungen:**
- GDPR-konforme Einverständniserklärungen
- Medizinische Notfall-Banner mit direkter Telefonnummer
- Ärztliche Schweigepflicht Indikatoren
- 44px Touch-Targets für alle interaktiven Elemente  
- WCAG 2.1 AA konform mit vollständiger Keyboard-Navigation
- Screen Reader optimiert mit ARIA Modal Pattern

**Medizinische Anwendungsfälle:**
- Einverständniserklärungen für medizinische Behandlungen
- Datenschutzerklärungen und GDPR-Compliance
- Notfall-Dialoge mit direkten Kontaktinformationen
- Medizinische Informationsdialoge
- Bestätigungen für sensible medizinische Daten
- Ärztliche Aufklärungsbögen

**Accessibility Features:**
- Focus Trap - Fokus bleibt im Modal
- Escape Key Handling für schnelles Schließen
- Screen Reader Support mit role="dialog"
- Keyboard Navigation zwischen allen Elementen
- Automatische Fokus-Wiederherstellung nach Schließen
        `
      }
    }
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Modal geöffnet'
    },
    title: {
      control: 'text',
      description: 'Modal Titel'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'fullscreen'],
      description: 'Modal-Größe'
    },
    type: {
      control: 'select', 
      options: ['default', 'consent', 'emergency', 'success', 'error', 'info'],
      description: 'Modal Typ für Styling'
    },
    medicalContext: {
      control: 'boolean',
      description: 'Medizinischer Kontext mit Datenschutz-Styling'
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Schließen-Button anzeigen'
    },
    closeOnOutsideClick: {
      control: 'boolean', 
      description: 'Schließen bei Klick außerhalb'
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Schließen mit Escape-Taste'
    },
    gdprCompliant: {
      control: 'boolean',
      description: 'GDPR-Compliance Hinweis anzeigen'
    }
  },
  args: {
    isOpen: true,
    title: 'Medizinische Information',
    size: 'medium',
    type: 'default',
    showCloseButton: true,
    closeOnOutsideClick: true,
    closeOnEscape: true,
    medicalContext: false,
    gdprCompliant: false,
    onClose: () => console.log('Modal closed')
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof HealthcareModal>

// Default Story - Basic Medical Information
export const Default: Story = {
  args: {
    children: React.createElement('div', { style: { padding: '20px' } }, [
      React.createElement('p', { key: 1 }, 'Dies ist ein grundlegender medizinischer Informationsdialog.'),
      React.createElement('p', { key: 2 }, 'Hier können wichtige Informationen für Patienten angezeigt werden.'),
      React.createElement('p', { key: 3 }, 'Der Dialog folgt den Healthcare-Richtlinien und ist vollständig barrierefrei.')
    ])
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard Modal für allgemeine medizinische Informationen mit grundlegenden Funktionen.'
      }
    }
  }
}

// Consent Modal - GDPR Compliance
export const ConsentModal: Story = {
  args: {
    title: 'Einverständniserklärung für medizinische Zweitmeinung',
    type: 'consent',
    medicalContext: true,
    gdprCompliant: true,
    size: 'large',
    children: React.createElement('div', { className: 'consent-content' }, [
      React.createElement('h3', { key: 1, style: { marginTop: 0 } }, 'Datenschutz und ärztliche Schweigepflicht'),
      React.createElement('p', { key: 2 }, 'Mit dieser Einverständniserklärung bestätigen Sie:'),
      React.createElement('ul', { key: 3 }, [
        React.createElement('li', { key: 'a' }, 'Die Weitergabe Ihrer medizinischen Daten an qualifizierte Fachärzte'),
        React.createElement('li', { key: 'b' }, 'Die elektronische Speicherung gemäß DSGVO-Richtlinien'),
        React.createElement('li', { key: 'c' }, 'Die Einhaltung der ärztlichen Schweigepflicht durch alle beteiligten Ärzte')
      ]),
      React.createElement('div', { key: 4, style: { marginTop: '24px', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px' } }, [
        React.createElement('h4', { key: 'title', style: { color: '#064e3b', margin: '0 0 8px 0' } }, 'Ihre Rechte:'),
        React.createElement('p', { key: 'rights', style: { color: '#166534', margin: 0, fontSize: '14px' } }, 'Sie können jederzeit die Löschung Ihrer Daten verlangen und haben ein Recht auf Auskunft über die gespeicherten Informationen.')
      ])
    ]),
    footer: React.createElement('div', { style: { display: 'flex', gap: '12px', justifyContent: 'flex-end' } }, [
      React.createElement('button', { 
        key: 'cancel',
        style: { 
          padding: '12px 24px', 
          border: '2px solid #e2e8f0', 
          borderRadius: '8px',
          backgroundColor: 'white',
          color: '#6b7280',
          cursor: 'pointer'
        }
      }, 'Ablehnen'),
      React.createElement('button', { 
        key: 'accept',
        style: { 
          padding: '12px 24px', 
          border: '2px solid #10b981', 
          borderRadius: '8px',
          backgroundColor: '#10b981',
          color: 'white',
          cursor: 'pointer'
        }
      }, 'Einverständnis erteilen')
    ])
  },
  parameters: {
    docs: {
      description: {
        story: 'GDPR-konforme Einverständniserklärung mit medizinischem Kontext und Datenschutzhinweisen.'
      }
    }
  }
}

// Emergency Modal - Critical Medical Situation
export const EmergencyModal: Story = {
  args: {
    title: 'Medizinischer Notfall erkannt',
    type: 'emergency',
    size: 'medium',
    closeOnOutsideClick: false,
    emergencyContact: {
      number: '+49 800 80 44 100',
      text: 'Sofort den Notdienst kontaktieren!'
    },
    children: React.createElement('div', { style: { textAlign: 'center', padding: '20px' } }, [
      React.createElement('div', { key: 1, style: { fontSize: '48px', marginBottom: '16px' } }, '🚨'),
      React.createElement('p', { key: 2, style: { fontSize: '18px', fontWeight: '600', color: '#dc2626' } }, 
        'Ihre Angaben deuten auf einen medizinischen Notfall hin.'
      ),
      React.createElement('p', { key: 3, style: { marginBottom: '24px' } }, 
        'Bei akuten medizinischen Notfällen wenden Sie sich bitte sofort an den Notdienst oder suchen Sie die nächste Notaufnahme auf.'
      ),
      React.createElement('div', { key: 4, style: { padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '2px solid #fecaca' } }, [
        React.createElement('h4', { key: 'title', style: { color: '#dc2626', margin: '0 0 8px 0' } }, 'Sofortige Hilfe:'),
        React.createElement('p', { key: 'help', style: { margin: 0 } }, '🚑 Notarzt: 112'),
        React.createElement('p', { key: 'poison', style: { margin: '4px 0 0 0' } }, '☎️ Giftnotruf: +49 800 80 44 100')
      ])
    ]),
    footer: React.createElement('div', { style: { display: 'flex', gap: '12px', justifyContent: 'center' } }, [
      React.createElement('a', { 
        key: 'call',
        href: 'tel:112',
        style: { 
          padding: '16px 32px', 
          border: 'none',
          borderRadius: '8px',
          backgroundColor: '#dc2626',
          color: 'white',
          fontSize: '18px',
          fontWeight: '700',
          textDecoration: 'none',
          display: 'inline-block'
        }
      }, '📞 112 anrufen')
    ])
  },
  parameters: {
    docs: {
      description: {
        story: 'Notfall-Modal mit Emergency-Banner und direkten Kontaktmöglichkeiten für kritische medizinische Situationen.'
      }
    }
  }
}

// Success Modal - Treatment Confirmation  
export const SuccessModal: Story = {
  args: {
    title: 'Medizinische Anfrage erfolgreich übermittelt',
    type: 'success',
    size: 'medium',
    children: React.createElement('div', { style: { textAlign: 'center', padding: '20px' } }, [
      React.createElement('div', { key: 1, style: { fontSize: '64px', marginBottom: '16px' } }, '✅'),
      React.createElement('h3', { key: 2, style: { color: '#10b981', marginBottom: '16px' } }, 'Erfolgreich übermittelt!'),
      React.createElement('p', { key: 3 }, 'Ihre medizinische Anfrage wurde an unsere Fachärzte weitergeleitet.'),
      React.createElement('div', { key: 4, style: { marginTop: '24px', padding: '16px', backgroundColor: '#ecfdf5', borderRadius: '8px' } }, [
        React.createElement('h4', { key: 'title', style: { color: '#064e3b', margin: '0 0 12px 0' } }, 'Nächste Schritte:'),
        React.createElement('ul', { key: 'steps', style: { textAlign: 'left', color: '#166534' } }, [
          React.createElement('li', { key: 'a' }, 'Erste Einschätzung binnen 48 Stunden'),
          React.createElement('li', { key: 'b' }, 'Detaillierte Zweitmeinung binnen 7 Tagen'),
          React.createElement('li', { key: 'c' }, 'Benachrichtigung per E-Mail und SMS')
        ])
      ])
    ]),
    footer: React.createElement('button', { 
      style: { 
        padding: '12px 24px', 
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#10b981',
        color: 'white',
        cursor: 'pointer',
        margin: '0 auto',
        display: 'block'
      }
    }, 'Dashboard öffnen')
  },
  parameters: {
    docs: {
      description: {
        story: 'Erfolgs-Modal nach erfolgreichem Absenden einer medizinischen Anfrage mit nächsten Schritten.'
      }
    }
  }
}

// Error Modal - Medical Data Validation Error
export const ErrorModal: Story = {
  args: {
    title: 'Unvollständige medizinische Angaben',
    type: 'error', 
    size: 'medium',
    children: React.createElement('div', { className: 'error-content' }, [
      React.createElement('div', { key: 1, style: { textAlign: 'center', marginBottom: '20px' } }, [
        React.createElement('div', { key: 'icon', style: { fontSize: '48px', marginBottom: '16px' } }, '⚠️'),
        React.createElement('p', { key: 'text', style: { color: '#dc2626', fontWeight: '600' } }, 
          'Ihre medizinischen Angaben sind unvollständig.'
        )
      ]),
      React.createElement('div', { key: 2, style: { padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' } }, [
        React.createElement('h4', { key: 'title', style: { color: '#dc2626', margin: '0 0 12px 0' } }, 'Fehlende Informationen:'),
        React.createElement('ul', { key: 'missing', style: { color: '#7f1d1d', margin: 0 } }, [
          React.createElement('li', { key: 'a' }, 'Aktuelle Symptome und Beschwerden'),
          React.createElement('li', { key: 'b' }, 'Medizinische Vorgeschichte'),
          React.createElement('li', { key: 'c' }, 'Aktuelle Medikamenteneinnahme')
        ])
      ]),
      React.createElement('p', { key: 3, style: { marginTop: '16px' } }, 
        'Für eine qualifizierte medizinische Zweitmeinung benötigen unsere Fachärzte vollständige Informationen über Ihren Gesundheitszustand.'
      )
    ]),
    footer: React.createElement('div', { style: { display: 'flex', gap: '12px', justifyContent: 'center' } }, [
      React.createElement('button', { 
        key: 'complete',
        style: { 
          padding: '12px 24px', 
          border: 'none',
          borderRadius: '8px',
          backgroundColor: '#dc2626',
          color: 'white',
          cursor: 'pointer'
        }
      }, 'Angaben vervollständigen')
    ])
  },
  parameters: {
    docs: {
      description: {
        story: 'Error-Modal bei unvollständigen medizinischen Angaben mit hilfreichen Hinweisen zur Vervollständigung.'
      }
    }
  }
}

// Info Modal - Medical Process Information
export const InfoModal: Story = {
  args: {
    title: 'Ablauf einer medizinischen Zweitmeinung',
    type: 'info',
    size: 'large',
    medicalContext: true,
    children: React.createElement('div', { className: 'info-content' }, [
      React.createElement('div', { key: 1, style: { marginBottom: '24px' } }, [
        React.createElement('h3', { key: 'title', style: { color: '#0ea5e9', marginBottom: '16px' } }, 'Ihr Weg zur Zweitmeinung'),
        React.createElement('div', { key: 'steps', style: { display: 'grid', gap: '16px' } }, [
          React.createElement('div', { key: 'step1', style: { display: 'flex', gap: '12px', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px' } }, [
            React.createElement('div', { key: 'number', style: { width: '32px', height: '32px', backgroundColor: '#0ea5e9', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 } }, '1'),
            React.createElement('div', { key: 'content' }, [
              React.createElement('h4', { key: 'title', style: { margin: '0 0 4px 0' } }, 'Medizinische Daten erfassen'),
              React.createElement('p', { key: 'desc', style: { margin: 0, color: '#0c4a6e' } }, 'Symptome, Vorgeschichte und aktuelle Medikation angeben')
            ])
          ]),
          React.createElement('div', { key: 'step2', style: { display: 'flex', gap: '12px', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px' } }, [
            React.createElement('div', { key: 'number', style: { width: '32px', height: '32px', backgroundColor: '#0ea5e9', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 } }, '2'),
            React.createElement('div', { key: 'content' }, [
              React.createElement('h4', { key: 'title', style: { margin: '0 0 4px 0' } }, 'Facharzt-Zuteilung'),
              React.createElement('p', { key: 'desc', style: { margin: 0, color: '#0c4a6e' } }, 'Automatische Weiterleitung an spezialisierten Facharzt')
            ])
          ]),
          React.createElement('div', { key: 'step3', style: { display: 'flex', gap: '12px', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px' } }, [
            React.createElement('div', { key: 'number', style: { width: '32px', height: '32px', backgroundColor: '#0ea5e9', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 } }, '3'),
            React.createElement('div', { key: 'content' }, [
              React.createElement('h4', { key: 'title', style: { margin: '0 0 4px 0' } }, 'Medizinische Bewertung'),
              React.createElement('p', { key: 'desc', style: { margin: 0, color: '#0c4a6e' } }, 'Detaillierte Analyse und Zweitmeinung binnen 7 Tagen')
            ])
          ])
        ])
      ]),
      React.createElement('div', { key: 2, style: { padding: '16px', backgroundColor: '#ecfdf5', borderRadius: '8px', border: '1px solid #bbf7d0' } }, [
        React.createElement('h4', { key: 'title', style: { color: '#064e3b', margin: '0 0 8px 0' } }, '🔒 Datenschutz garantiert'),
        React.createElement('p', { key: 'text', style: { color: '#166534', margin: 0, fontSize: '14px' } }, 
          'Alle medizinischen Daten werden verschlüsselt übertragen und unterliegen der ärztlichen Schweigepflicht. DSGVO-konform und sicher.'
        )
      ])
    ])
  },
  parameters: {
    docs: {
      description: {
        story: 'Info-Modal mit detaillierter Erklärung des medizinischen Zweitmeinungsprozesses und Datenschutzhinweisen.'
      }
    }
  }
}

// Small Size - Quick Confirmation
export const SmallSize: Story = {
  args: {
    title: 'Termin bestätigen',
    size: 'small',
    children: React.createElement('div', { style: { textAlign: 'center', padding: '16px' } }, [
      React.createElement('p', { key: 1, style: { marginBottom: '16px' } }, 'Möchten Sie den Termin am 15.03.2024 um 14:30 Uhr bestätigen?'),
      React.createElement('p', { key: 2, style: { fontSize: '14px', color: '#6b7280' } }, 'Dr. med. Schmidt - Kardiologie')
    ]),
    footer: React.createElement('div', { style: { display: 'flex', gap: '8px', justifyContent: 'center' } }, [
      React.createElement('button', { 
        key: 'cancel',
        style: { 
          padding: '8px 16px', 
          border: '1px solid #e2e8f0', 
          borderRadius: '6px',
          backgroundColor: 'white',
          color: '#6b7280',
          cursor: 'pointer'
        }
      }, 'Abbrechen'),
      React.createElement('button', { 
        key: 'confirm',
        style: { 
          padding: '8px 16px', 
          border: 'none',
          borderRadius: '6px',
          backgroundColor: '#10b981',
          color: 'white',
          cursor: 'pointer'
        }
      }, 'Bestätigen')
    ])
  },
  parameters: {
    docs: {
      description: {
        story: 'Kompaktes Modal für schnelle Bestätigungen und einfache Aktionen.'
      }
    }
  }
}

// Fullscreen Modal - Comprehensive Medical Form
export const FullscreenModal: Story = {
  args: {
    title: 'Umfassende medizinische Anamnese',
    size: 'fullscreen',
    type: 'consent',
    medicalContext: true,
    gdprCompliant: true,
    closeOnOutsideClick: false,
    children: React.createElement('div', { className: 'fullscreen-content' }, [
      React.createElement('div', { key: 1, style: { display: 'grid', gap: '32px', padding: '20px 0' } }, [
        React.createElement('section', { key: 'section1' }, [
          React.createElement('h3', { key: 'title1' }, 'Aktuelle Beschwerden'),
          React.createElement('textarea', { 
            key: 'textarea1',
            placeholder: 'Beschreiben Sie ausführlich Ihre aktuellen Beschwerden...',
            style: { width: '100%', minHeight: '120px', padding: '16px', border: '2px solid #e2e8f0', borderRadius: '8px' }
          })
        ]),
        React.createElement('section', { key: 'section2' }, [
          React.createElement('h3', { key: 'title2' }, 'Medizinische Vorgeschichte'),
          React.createElement('textarea', { 
            key: 'textarea2',
            placeholder: 'Chronische Erkrankungen, Operationen, Allergien...',
            style: { width: '100%', minHeight: '120px', padding: '16px', border: '2px solid #e2e8f0', borderRadius: '8px' }
          })
        ]),
        React.createElement('section', { key: 'section3' }, [
          React.createElement('h3', { key: 'title3' }, 'Aktuelle Medikation'),
          React.createElement('textarea', { 
            key: 'textarea3',
            placeholder: 'Alle aktuell eingenommenen Medikamente mit Dosierung...',
            style: { width: '100%', minHeight: '120px', padding: '16px', border: '2px solid #e2e8f0', borderRadius: '8px' }
          })
        ])
      ])
    ]),
    footer: React.createElement('div', { style: { display: 'flex', gap: '16px', justifyContent: 'flex-end' } }, [
      React.createElement('button', { 
        key: 'save',
        style: { 
          padding: '12px 24px', 
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          backgroundColor: 'white',
          color: '#6b7280',
          cursor: 'pointer'
        }
      }, 'Zwischenspeichern'),
      React.createElement('button', { 
        key: 'submit',
        style: { 
          padding: '12px 24px', 
          border: 'none',
          borderRadius: '8px',
          backgroundColor: '#1278B3',
          color: 'white',
          cursor: 'pointer'
        }
      }, 'Anamnese übermitteln')
    ])
  },
  parameters: {
    docs: {
      description: {
        story: 'Vollbild-Modal für umfassende medizinische Formulare und detaillierte Datenerfassung.'
      }
    }
  }
}

// No Close Button - Critical Information
export const NoCloseButton: Story = {
  args: {
    title: 'Wichtige medizinische Informationen',
    showCloseButton: false,
    closeOnOutsideClick: false,
    closeOnEscape: false,
    medicalContext: true,
    children: React.createElement('div', { style: { padding: '20px', textAlign: 'center' } }, [
      React.createElement('div', { key: 1, style: { fontSize: '48px', marginBottom: '16px' } }, '📋'),
      React.createElement('p', { key: 2, style: { fontWeight: '600', marginBottom: '16px' } }, 
        'Bitte lesen Sie diese wichtigen medizinischen Hinweise vollständig durch.'
      ),
      React.createElement('div', { key: 3, style: { padding: '16px', backgroundColor: '#fff7ed', borderRadius: '8px', textAlign: 'left' } }, [
        React.createElement('h4', { key: 'title', style: { color: '#ea580c', margin: '0 0 12px 0' } }, 'Wichtige Hinweise:'),
        React.createElement('ul', { key: 'list', style: { color: '#c2410c' } }, [
          React.createElement('li', { key: 'a' }, 'Diese Informationen ersetzen nicht den Besuch beim Arzt'),
          React.createElement('li', { key: 'b' }, 'Bei Notfällen wenden Sie sich an den Notdienst: 112'),
          React.createElement('li', { key: 'c' }, 'Alle medizinischen Empfehlungen sind unverbindlich')
        ])
      ])
    ]),
    footer: React.createElement('button', { 
      style: { 
        padding: '16px 32px', 
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#1278B3',
        color: 'white',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        margin: '0 auto',
        display: 'block'
      }
    }, 'Verstanden und Fortfahren')
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal ohne Schließen-Button für kritische medizinische Informationen, die vollständig gelesen werden müssen.'
      }
    }
  }
}