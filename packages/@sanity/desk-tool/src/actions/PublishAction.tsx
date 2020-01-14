import * as React from 'react'
import {useDocumentOperation, useValidationStatus} from '@sanity/react-hooks'

export function PublishAction({id, type, onComplete}) {
  const {publish}: any = useDocumentOperation(id, type)
  const [publishing, setPublishing] = React.useState(false)
  const [didPublish, setDidPublish] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const validationStatus = useValidationStatus(id, type)

  const hasValidationErrors = validationStatus.errors.length > 0

  const title = publish.disabled
    ? publish.disabled
    : hasValidationErrors
    ? 'There are validation errors that needs to be fixed before this document can be published'
    : 'Publish this document'

  return {
    disabled: Boolean(
      validationStatus.isValidating || hasValidationErrors || publishing || publish.disabled
    ),
    label: publishing ? 'Publishing…' : 'Publish',
    title,
    shortcut: 'ctrl+alt+p',
    onHandle: () => {
      setPublishing(true)
      setError(null)
      setDidPublish(false)
      publish.execute().then(
        () => setDidPublish(true),
        err => setError(err)
      )
    },
    dialog:
      (error && {
        type: 'error',
        onClose: () => setError(null),
        title: 'An error occured when publishing the document',
        content: error.message
      }) ||
      (didPublish && {
        type: 'success',
        onClose: () => {
          setDidPublish(false)
          onComplete()
        },
        title: 'Succesfully published document'
      })
  }
}