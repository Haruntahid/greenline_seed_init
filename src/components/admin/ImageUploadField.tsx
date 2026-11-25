import React, { useRef, useState } from 'react'
import { UploadCloud, Image as ImageIcon, Trash2, Loader2, Link as LinkIcon } from 'lucide-react'
import { uploadImageFile } from '../../utils/image-upload'
import { getGoogleDriveImageUrl } from '../../utils/google-drive-image'
import './ImageUploadField.css'

interface ImageUploadFieldProps {
  label?: string
  value: string
  onChange: (url: string) => void
  placeholder?: string
  helpText?: string
  previewHeight?: string
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label = 'Image URL or Upload File',
  value,
  onChange,
  placeholder = 'https://drive.google.com/file/d/... or image URL',
  helpText,
  previewHeight = '140px',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError('')

    try {
      const directUrl = await uploadImageFile(file)
      onChange(directUrl)
    } catch (err) {
      console.error('Image upload failed:', err)
      setUploadError(err instanceof Error ? err.message : 'Upload failed. Please try again or paste a link.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleClear = () => {
    onChange('')
    setUploadError('')
  }

  const previewSrc = value ? getGoogleDriveImageUrl(value) : ''

  return (
    <div className="image-upload-field-container">
      {label && <label className="image-upload-field-label">{label}</label>}
      {helpText && <p className="image-upload-field-help">{helpText}</p>}

      <div className="image-upload-controls">
        <div className="image-upload-url-input-wrap">
          <LinkIcon size={16} className="image-upload-url-icon" />
          <input
            type="url"
            value={value}
            placeholder={placeholder}
            onChange={(e) => {
              setUploadError('')
              onChange(e.target.value)
            }}
            className="image-upload-url-input"
          />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />

        <button
          type="button"
          className="image-upload-btn"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          title="Upload image from computer"
        >
          {isUploading ? (
            <>
              <Loader2 size={16} className="image-upload-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <UploadCloud size={16} />
              <span>Upload Image</span>
            </>
          )}
        </button>
      </div>

      {uploadError && <div className="image-upload-error">{uploadError}</div>}

      {previewSrc ? (
        <div className="image-upload-preview-box" style={{ minHeight: previewHeight }}>
          <img
            src={previewSrc}
            alt="Preview"
            className="image-upload-preview-img"
            onError={() => {
              // Gracefully handle invalid URL
            }}
          />
          <div className="image-upload-preview-overlay">
            <button
              type="button"
              className="image-upload-remove-btn"
              onClick={handleClear}
              title="Remove image"
            >
              <Trash2 size={14} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="image-upload-empty-placeholder" style={{ height: previewHeight }}>
          <ImageIcon size={28} className="image-upload-placeholder-icon" />
          <span>Upload an image file or paste an image link above</span>
        </div>
      )}
    </div>
  )
}
