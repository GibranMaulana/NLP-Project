import { Box, Flex, Text, Button, Card } from '@sanity/ui'

import React, { useCallback, useState, useEffect } from 'react'
import { useFormValue, useClient } from 'sanity'

declare const process: any;


function CopyUrlCard({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [url])

  return (
    <Card padding={3} radius={2} shadow={1} tone="primary">
      <Flex align="center" gap={3}>
        <Box flex={1}>
          <Text size={1} as="code">{url}</Text>
        </Box>
        <Button
          mode="ghost"
          onClick={handleCopy}
          text={copied ? "Copied!" : "Copy URL"}
          tone={copied ? "positive" : "primary"}
        />
      </Flex>
    </Card>
  )
}

function getBaseUrl() {
  // Access process.env directly so Vite can statically replace it at build time
  try {
    const envUrl = process.env.SANITY_STUDIO_FRONTEND_URL
    if (envUrl) {
      return envUrl
    }
  } catch (err) {
    // process is not defined
  }
  
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:3000'
    }
    // Fallback if env variable fails to load, but we shouldn't use the studio's domain.
    // We'll return a placeholder to make it obvious the env var is missing.
    return 'https://YOUR-FRONTEND-URL.com' 
  }
  
  return 'http://localhost:3000'
}

export function BatchUrlDisplay() {
  const slug = useFormValue(['slug', 'current']) as string | undefined
  
  if (!slug) {
    return <Text muted>Please generate a slug first</Text>
  }
  
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/b/${slug}`
  
  return <CopyUrlCard url={url} />
}

export function ScenarioUrlDisplay() {
  const slug = useFormValue(['slug', 'current']) as string | undefined
  const batchRef = useFormValue(['batch', '_ref']) as string | undefined
  
  const client = useClient({ apiVersion: '2024-01-01' })
  const [batchSlug, setBatchSlug] = useState<string | undefined>()

  useEffect(() => {
    if (batchRef) {
      client.fetch(`*[_id == $id][0].slug.current`, { id: batchRef }).then((res) => {
        setBatchSlug(res)
      }).catch(console.error)
    }
  }, [batchRef, client])

  if (!slug || !batchRef) {
    return <Text muted>Please select a batch and generate a slug first</Text>
  }
  
  if (!batchSlug) {
    return <Text muted>Loading batch information...</Text>
  }

  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/b/${batchSlug}/${slug}`
  
  return <CopyUrlCard url={url} />
}
