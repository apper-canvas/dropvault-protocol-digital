import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { formatDistanceToNow } from 'date-fns'
import ApperIcon from './ApperIcon'

function MainFeature() {
  const [files, setFiles] = useState([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState("grid")
  const fileInputRef = useRef(null)

  // File validation
  const validateFile = (file) => {
    const maxSize = 100 * 1024 * 1024 // 100MB
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'application/zip',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (file.size > maxSize) {
      toast.error(`File "${file.name}" is too large. Maximum size is 100MB.`)
      return false
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error(`File type "${file.type}" is not supported.`)
      return false
    }

    return true
  }

  // Simulate file upload with progress
  const simulateUpload = (file) => {
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 15
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          setUploadProgress(prev => {
            const newProgress = { ...prev }
            delete newProgress[file.name]
            return newProgress
          })
          resolve()
        }
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: Math.round(progress)
        }))
      }, 200)
    })
  }

  // Handle file processing
  const processFiles = async (fileList) => {
    const validFiles = Array.from(fileList).filter(validateFile)
    
    if (validFiles.length === 0) return

    for (const file of validFiles) {
      const fileData = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        url: URL.createObjectURL(file),
        thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      }

      // Start upload simulation
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))
      
      try {
        await simulateUpload(file)
        setFiles(prev => [fileData, ...prev])
        toast.success(`"${file.name}" uploaded successfully!`)
      } catch (error) {
        toast.error(`Failed to upload "${file.name}"`)
        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[file.name]
          return newProgress
        })
      }
    }
  }

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    processFiles(e.dataTransfer.files)
  }, [])

  // File operations
  const deleteFile = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
    toast.success("File deleted successfully")
  }

  const renameFile = (fileId, newName) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, name: newName } : file
    ))
    toast.success("File renamed successfully")
  }

  // Filter and sort files
  const filteredFiles = files
    .filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name)
        case 'size': return b.size - a.size
        case 'date': return new Date(b.uploadedAt) - new Date(a.uploadedAt)
        case 'type': return a.type.localeCompare(b.type)
        default: return 0
      }
    })

  // Get file icon based on type
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return 'Image'
    if (type.includes('pdf')) return 'FileText'
    if (type.includes('zip')) return 'Archive'
    if (type.includes('word')) return 'FileText'
    return 'File'
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`upload-zone p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden ${
          isDragOver ? 'dragover' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-4 left-4 w-8 h-8 border-2 border-primary rotate-45" />
          <div className="absolute top-4 right-4 w-6 h-6 bg-secondary rounded-full" />
          <div className="absolute bottom-4 left-4 w-10 h-10 border-2 border-accent rounded-full" />
          <div className="absolute bottom-4 right-4 w-4 h-4 bg-primary rotate-45" />
        </div>

        <div className="relative z-10 space-y-6">
          <motion.div
            animate={isDragOver ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
            className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto bg-gradient-to-tr from-primary via-secondary to-accent rounded-2xl flex items-center justify-center shadow-glow"
          >
            <ApperIcon name="Upload" className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white" />
          </motion.div>

          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-surface-100">
              {isDragOver ? "Drop your files here!" : "Upload Your Files"}
            </h3>
            <p className="text-surface-600 dark:text-surface-400 text-lg sm:text-xl max-w-2xl mx-auto">
              Drag and drop files here, or click to browse. Supports images, PDFs, documents up to 100MB.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-card hover:shadow-glow transition-all duration-300"
          >
            <ApperIcon name="FolderOpen" className="w-5 h-5 mr-3" />
            Browse Files
          </motion.button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => processFiles(e.target.files)}
            className="hidden"
            accept="image/*,.pdf,.txt,.zip,.doc,.docx"
          />
        </div>
      </motion.div>

      {/* Upload Progress */}
      <AnimatePresence>
        {Object.keys(uploadProgress).length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="bg-white dark:bg-surface-800 p-4 rounded-xl border border-surface-200 dark:border-surface-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300 truncate">
                    {fileName}
                  </span>
                  <span className="text-sm text-surface-500 dark:text-surface-400">
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="progress-bar h-2 rounded-full"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Management Controls */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-surface-800 p-4 sm:p-6 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-card"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-100">
              My Files ({files.length})
            </h3>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="name">Sort by Name</option>
                <option value="size">Sort by Size</option>
                <option value="date">Sort by Date</option>
                <option value="type">Sort by Type</option>
              </select>

              {/* View Mode */}
              <div className="flex bg-surface-50 dark:bg-surface-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-surface-600 dark:text-surface-400'}`}
                >
                  <ApperIcon name="Grid3X3" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'text-surface-600 dark:text-surface-400'}`}
                >
                  <ApperIcon name="List" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* File Grid/List */}
          <AnimatePresence mode="wait">
            {filteredFiles.length > 0 ? (
              <motion.div
                key={viewMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    : "space-y-2"
                }
              >
                {filteredFiles.map((file, index) => (
                  <FileItem
                    key={file.id}
                    file={file}
                    viewMode={viewMode}
                    index={index}
                    onDelete={deleteFile}
                    onRename={renameFile}
                    getFileIcon={getFileIcon}
                    formatFileSize={formatFileSize}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <ApperIcon name="Search" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
                <p className="text-surface-500 dark:text-surface-400">
                  {searchTerm ? "No files found matching your search." : "No files uploaded yet."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

// File Item Component
function FileItem({ file, viewMode, index, onDelete, onRename, getFileIcon, formatFileSize }) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(file.name)

  const handleRename = () => {
    if (newName.trim() && newName !== file.name) {
      onRename(file.id, newName.trim())
    }
    setIsRenaming(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRename()
    } else if (e.key === 'Escape') {
      setNewName(file.name)
      setIsRenaming(false)
    }
  }

  if (viewMode === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group file-preview p-4 hover:shadow-card transition-all duration-300 border border-surface-200 dark:border-surface-700"
      >
        {/* File Preview */}
        <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
          {file.thumbnail ? (
            <img
              src={file.thumbnail}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ApperIcon
              name={getFileIcon(file.type)}
              className="w-12 h-12 text-surface-400"
            />
          )}
        </div>

        {/* File Info */}
        <div className="space-y-2">
          {isRenaming ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyPress}
              className="w-full text-sm font-medium bg-transparent border-b border-primary focus:outline-none text-surface-900 dark:text-surface-100"
              autoFocus
            />
          ) : (
            <h4 className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
              {file.name}
            </h4>
          )}
          
          <div className="flex items-center justify-between text-xs text-surface-500 dark:text-surface-400">
            <span>{formatFileSize(file.size)}</span>
            <span>{formatDistanceToNow(file.uploadedAt)} ago</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => setIsRenaming(true)}
            className="p-1.5 text-surface-400 hover:text-primary hover:bg-primary/10 rounded transition-colors duration-200"
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(file.id)}
            className="p-1.5 text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors duration-200"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </button>
          <a
            href={file.url}
            download={file.name}
            className="p-1.5 text-surface-400 hover:text-accent hover:bg-accent/10 rounded transition-colors duration-200"
          >
            <ApperIcon name="Download" className="w-4 h-4" />
          </a>
        </div>
      </motion.div>
    )
  }

  // List view
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="group flex items-center p-3 bg-surface-50 dark:bg-surface-700/50 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors duration-200"
    >
      {/* File Icon */}
      <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center mr-3">
        <ApperIcon name={getFileIcon(file.type)} className="w-5 h-5 text-primary" />
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        {isRenaming ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyPress}
            className="w-full text-sm font-medium bg-transparent border-b border-primary focus:outline-none text-surface-900 dark:text-surface-100"
            autoFocus
          />
        ) : (
          <h4 className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
            {file.name}
          </h4>
        )}
        <div className="flex items-center gap-4 mt-1 text-xs text-surface-500 dark:text-surface-400">
          <span>{formatFileSize(file.size)}</span>
          <span>{formatDistanceToNow(file.uploadedAt)} ago</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => setIsRenaming(true)}
          className="p-2 text-surface-400 hover:text-primary hover:bg-primary/10 rounded transition-colors duration-200"
        >
          <ApperIcon name="Edit2" className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(file.id)}
          className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors duration-200"
        >
          <ApperIcon name="Trash2" className="w-4 h-4" />
        </button>
        <a
          href={file.url}
          download={file.name}
          className="p-2 text-surface-400 hover:text-accent hover:bg-accent/10 rounded transition-colors duration-200"
        >
          <ApperIcon name="Download" className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  )
}

export default MainFeature