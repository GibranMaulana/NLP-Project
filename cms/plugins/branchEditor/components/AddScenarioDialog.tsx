import React from 'react'
import { Box, Stack, Select, Button, Dialog, TextInput, Label, Flex } from '@sanity/ui'

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
        <Flex direction="column" gap={4}>
          <Box>
            <Box paddingBottom={2}>
              <Label>Scenario Title</Label>
            </Box>
            <TextInput 
              value={newScenarioTitle} 
              onChange={e => setNewScenarioTitle(e.currentTarget.value)} 
              placeholder="e.g. Sales Objection" 
            />
          </Box>
          <Box>
            <Box paddingBottom={2}>
              <Label>Select Batch</Label>
            </Box>
            <Select 
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
        </Flex>
      </Box>
    </Dialog>
  )
}
