import React, { useState, useEffect } from 'react'
import { Box, Card, Stack, Text, Flex, Button, Dialog, Checkbox, Label } from '@sanity/ui'

interface ManageDiagnosesDialogProps {
  isOpen: boolean
  onClose: () => void
  scenario: any
  allDiagnoses: any[]
  isSaving: boolean
  onSave: (selectedIds: string[]) => void
}

export function ManageDiagnosesDialog({
  isOpen, onClose, scenario, allDiagnoses, isSaving, onSave
}: ManageDiagnosesDialogProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Reset selected IDs when dialog opens based on current scenario
  useEffect(() => {
    if (isOpen && scenario?.diagnoses) {
      setSelectedIds(scenario.diagnoses.map((d: any) => d._ref).filter(Boolean))
    } else if (isOpen) {
      setSelectedIds([])
    }
  }, [isOpen, scenario])

  const toggleDiagnosis = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  if (!isOpen) return null

  return (
    <Dialog 
      id="manage-diagnoses-dialog" 
      header="Manage Attached Diagnoses" 
      onClose={onClose} 
      zOffset={1000} 
      width={1}
    >
      <Box padding={5} style={{ background: '#020617', color: '#f8fafc' }}>
        <Flex direction="column" gap={5}>
          <Box paddingY={2}>
            <Box paddingBottom={3}>
              <Label style={{ color: '#94a3b8' }}>Select Possible Outcomes</Label>
              <Text size={1} style={{ marginTop: '8px', color: '#64748b' }}>
                These are the diagnoses the user can achieve at the end of this scenario based on their choices.
              </Text>
            </Box>
            
            <Card padding={4} radius={3} style={{ background: '#0f172a', border: '1px solid #1e293b', maxHeight: '400px', overflowY: 'auto' }}>
              <Flex direction="column" gap={3}>
                {allDiagnoses.map((diag) => (
                  <Flex 
                    key={diag._id} 
                    align="center" 
                    gap={4} 
                    padding={4} 
                    style={{ 
                      background: selectedIds.includes(diag._id) ? '#1e293b' : 'transparent',
                      border: '1px solid',
                      borderColor: selectedIds.includes(diag._id) ? '#3b82f6' : '#334155',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onClick={() => toggleDiagnosis(diag._id)}
                  >
                    <Box 
                      style={{ 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '6px', 
                        border: '2px solid', 
                        borderColor: selectedIds.includes(diag._id) ? '#3b82f6' : '#475569', 
                        background: selectedIds.includes(diag._id) ? '#3b82f6' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      {selectedIds.includes(diag._id) && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </Box>
                    <Box flex={1}>
                      <Text weight="bold" size={2} style={{ color: '#f8fafc', lineHeight: '1.4' }}>{diag.title}</Text>
                      <Text size={1} style={{ color: '#94a3b8', marginTop: '8px', lineHeight: '1.5' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{diag.conditionType}</span> • {diag.headline}
                      </Text>
                    </Box>
                  </Flex>
                ))}
                {allDiagnoses.length === 0 && (
                  <Text size={1} style={{ color: '#64748b' }}>No diagnoses found in database.</Text>
                )}
              </Flex>
            </Card>
          </Box>

          <Flex justify="flex-end" gap={2}>
            <Button text="Cancel" mode="ghost" onClick={onClose} style={{ color: '#94a3b8' }} />
            <Button 
              text={isSaving ? "Saving..." : "Save Diagnoses"} 
              tone="primary" 
              onClick={() => onSave(selectedIds)} 
              disabled={isSaving} 
            />
          </Flex>
        </Flex>
      </Box>
    </Dialog>
  )
}
