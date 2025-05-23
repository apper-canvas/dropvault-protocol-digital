import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* 404 Illustration */}
          <div className="relative">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-32 h-32 sm:w-40 sm:h-40 mx-auto bg-gradient-to-tr from-primary via-secondary to-accent rounded-full flex items-center justify-center shadow-glow"
            >
              <ApperIcon name="FileX" className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
            </motion.div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{ 
                y: [-10, 10, -10],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-0 -right-4 w-8 h-8 bg-primary/20 rounded-lg"
            />
            <motion.div
              animate={{ 
                y: [10, -10, 10],
                rotate: [360, 180, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-0 -left-4 w-6 h-6 bg-secondary/20 rounded-full"
            />
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-100">
              File Not Found
            </h2>
            <p className="text-surface-600 dark:text-surface-400 text-lg leading-relaxed">
              The file you're looking for seems to have been moved, deleted, or never existed in the first place.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-medium rounded-xl hover:shadow-glow transition-all duration-300 transform hover:scale-105"
            >
              <ApperIcon name="Home" className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Back to Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="group inline-flex items-center justify-center px-6 py-3 bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 font-medium rounded-xl hover:bg-surface-200 dark:hover:bg-surface-700 transition-all duration-300 transform hover:scale-105"
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Go Back
            </button>
          </div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-8 border-t border-surface-200 dark:border-surface-700"
          >
            <p className="text-sm text-surface-500 dark:text-surface-500">
              Need help? Try searching for your files or contact our support team.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound