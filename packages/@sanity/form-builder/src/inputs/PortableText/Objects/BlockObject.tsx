/* eslint-disable react/prop-types */
import React, {FunctionComponent, SyntheticEvent} from 'react'
import classNames from 'classnames'
import {
  PortableTextEditor,
  PortableTextBlock,
  Type,
  RenderAttributes
} from '@sanity/portable-text-editor'
import {FOCUS_TERMINATOR} from '@sanity/util/paths'

import {Marker} from '../../../typedefs'
import {Path} from '../../../typedefs/path'
import {PatchEvent} from '../../../PatchEvent'
import {BlockObjectPreview} from './BlockObjectPreview'
import styles from './BlockObject.css'

type Props = {
  attributes: RenderAttributes
  editorRef: React.RefObject<PortableTextEditor>
  focusPath: Path
  markers: Marker[]
  onChange: (patchEvent: PatchEvent, path: Path) => void
  onFocus: (arg0: Path) => void
  readOnly: boolean
  type: Type
  value: PortableTextBlock
}

export const BlockObject: FunctionComponent<Props> = ({
  attributes: {focused, selected, path},
  editorRef,
  markers,
  onFocus,
  readOnly,
  type,
  value
}): JSX.Element => {
  const validation = markers.filter(marker => marker.type === 'validation')
  const errors = validation.filter(marker => marker.level === 'error')
  const classnames = classNames([
    styles.root,
    focused && styles.focused,
    selected && styles.selected,
    errors.length > 0 && styles.hasErrors
  ])

  const handleClickToOpen = (event: SyntheticEvent<HTMLElement>): void => {
    if (focused) {
      event.preventDefault()
      event.stopPropagation()
      onFocus(path.concat(FOCUS_TERMINATOR))
    } else {
      onFocus(path)
    }
  }

  const handleEdit = (): void => {
    onFocus(path.concat(FOCUS_TERMINATOR))
  }

  const handleDelete = (): void => {
    if (editorRef && editorRef.current) {
      PortableTextEditor.remove(
        editorRef.current,
        {focus: {path, offset: 0}, anchor: {path, offset: 0}},
        {mode: 'block'}
      )
      PortableTextEditor.focus(editorRef.current)
    }
  }

  return (
    <div className={classnames} onDoubleClick={handleClickToOpen}>
      <div className={styles.previewContainer} style={readOnly ? {cursor: 'default'} : {}}>
        <BlockObjectPreview
          type={type}
          value={value}
          path={path}
          readOnly={readOnly}
          onFocus={onFocus}
          onClickingDelete={handleDelete}
          onClickingEdit={handleEdit}
        />
      </div>
    </div>
  )
}
