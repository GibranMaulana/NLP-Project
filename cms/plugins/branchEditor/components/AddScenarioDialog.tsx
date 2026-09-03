import React from 'react'
import { Box, Stack, Select, Button, Dialog, TextInput, Label, Flex, TextArea, Text, Card } from '@sanity/ui'

interface AddScenarioDialogProps {
  isOpen: boolean
  onClose: () => void
  newScenarioData: any
  setNewScenarioData: (v: any) => void
  batches: any[]
  isCreating: boolean
  onCreate: () => void
}

export function AddScenarioDialog({
  isOpen, onClose, newScenarioData, setNewScenarioData, 
  batches, isCreating, onCreate
}: AddScenarioDialogProps) {
  if (!isOpen) return null

  return (
    <Dialog
      id="add-scenario-dialog"
      header="Create New Scenario"
      onClose={onClose}
      zOffset={1000}
      width={1}
    >
      <Box padding={4} style={{ background: '#020617', color: '#f8fafc' }}>
        <Flex direction="column" gap={5}>
          {/* Title and Batch */}
          <Flex gap={4}>
            <Box flex={1}>
              <Box paddingBottom={3}>
                <Label style={{ color: '#94a3b8' }}>Scenario Title</Label>
              </Box>
              <TextInput 
                padding={3}
                value={newScenarioData.title} 
                onChange={e => setNewScenarioData({...newScenarioData, title: e.currentTarget.value})} 
                placeholder="e.g. Sales Objection"
                style={{ background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }} 
              />
            </Box>
            <Box flex={1}>
              <Box paddingBottom={3}>
                <Label style={{ color: '#94a3b8' }}>Select Batch</Label>
              </Box>
              <Select 
                padding={3}
                value={newScenarioData.batchId} 
                onChange={e => setNewScenarioData({...newScenarioData, batchId: e.currentTarget.value})}
                disabled={batches.length === 0}
                style={{ background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }}
              >
                <option value="">Select a batch...</option>
                {batches.map(b => <option key={b._id} value={b._id}>{b.title}</option>)}
              </Select>
            </Box>
          </Flex>

          {/* Main Quest */}
          <Box>
            <Box paddingBottom={3}>
              <Label style={{ color: '#94a3b8' }}>Main Quest (Hoofddoel)</Label>
            </Box>
            <TextInput 
              padding={3}
              value={newScenarioData.mainQuest} 
              onChange={e => setNewScenarioData({...newScenarioData, mainQuest: e.currentTarget.value})} 
              placeholder="e.g. Overtuig de klant om de deal te sluiten"
              style={{ background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }} 
            />
          </Box>

          {/* Tension Settings */}
          <Card padding={4} radius={2} style={{ background: '#1e293b', border: '1px solid #334155' }}>
            <Flex direction="column" gap={4}>
              <Text weight="bold" size={1} style={{ color: '#e2e8f0' }}>Tension Settings</Text>
              <Flex gap={4}>
                <Box flex={1}>
                  <Box paddingBottom={3}>
                    <Label style={{ color: '#94a3b8' }}>Initial Tension</Label>
                  </Box>
                  <Select 
                    padding={3}
                    value={newScenarioData.initialTension} 
                    onChange={e => setNewScenarioData({...newScenarioData, initialTension: Number(e.currentTarget.value)})}
                    style={{ background: '#0f172a', color: '#fff', border: '1px solid #334155' }}
                  >
                    {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                  </Select>
                </Box>
                <Box flex={1}>
                  <Box paddingBottom={3}>
                    <Label style={{ color: '#94a3b8' }}>Max Tension</Label>
                  </Box>
                  <Select 
                    padding={3}
                    value={newScenarioData.maxTension} 
                    onChange={e => setNewScenarioData({...newScenarioData, maxTension: Number(e.currentTarget.value)})}
                    style={{ background: '#0f172a', color: '#fff', border: '1px solid #334155' }}
                  >
                    {[3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                  </Select>
                </Box>
              </Flex>
              <Box>
                <Box paddingBottom={3}>
                  <Label style={{ color: '#94a3b8' }}>Walkout Dialogue (Fallback)</Label>
                </Box>
                <TextArea 
                  padding={3}
                  rows={2}
                  value={newScenarioData.maxTensionDialogue} 
                  onChange={e => setNewScenarioData({...newScenarioData, maxTensionDialogue: e.currentTarget.value})} 
                  placeholder="Dialogue shown when max tension is reached..."
                  style={{ background: '#0f172a', color: '#fff', border: '1px solid #334155' }} 
                />
              </Box>
            </Flex>
          </Card>

          <Flex justify="flex-end" gap={3}>
            <Button text="Cancel" mode="ghost" onClick={onClose} style={{ color: '#94a3b8' }} />
            <Button 
              text={isCreating ? "Creating..." : "Create Scenario"} 
              tone="primary" 
              onClick={onCreate} 
              disabled={isCreating || !newScenarioData.title || !newScenarioData.batchId}
            />
          </Flex>
        </Flex>
      </Box>
    </Dialog>
  )
}
