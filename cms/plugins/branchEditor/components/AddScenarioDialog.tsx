import React from 'react'
import { Box, Stack, Select, Button, Dialog, TextInput, Label } from '@sanity/ui'

interface AddScenarioDialogProps {
  isOpen: boolean
  onClose: () => void
  newScenarioTitle: string
  setNewScenarioTitle: (v: string) => void
  batches: any[]
  selectedBatchId: string
  setSelectedBatchId: (v: string) => void
  isCreating: boolean
  onCreate: () => void
}

export function AddScenarioDialog({
  isOpen, onClose, newScenarioTitle, setNewScenarioTitle, 
  batches, selectedBatchId, setSelectedBatchId, isCreating, onCreate
}: AddScenarioDialogProps) {
  if (!isOpen) return null

  return (
    <Dialog
      id="add-scenario-dialog"
      header="Create New Scenario"
      onClose={onClose}
      zOffset={1000}
    >
      <Box padding={4}>
        <Stack space={4}>
          <Box>
            <Label>Scenario Title</Label>
            <TextInput 
              marginTop={2}
              value={newScenarioTitle} 
              onChange={e => setNewScenarioTitle(e.currentTarget.value)} 
              placeholder="e.g. Sales Objection" 
            />
          </Box>
          <Box>
            <Label>Select Batch</Label>
            <Select 
              marginTop={2}
              value={selectedBatchId} 
              onChange={e => setSelectedBatchId(e.currentTarget.value)}
              disabled={batches.length === 0}
            >
              {batches.map(b => <option key={b._id} value={b._id}>{b.title}</option>)}
            </Select>
          </Box>
          <Button 
            text={isCreating ? "Creating..." : "Create Scenario"} 
            tone="primary" 
            onClick={onCreate} 
            disabled={isCreating || !newScenarioTitle || !selectedBatchId}
          />
        </Stack>
      </Box>
    </Dialog>
  )
}
