import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Secure File
                </span>
                <br />
                <span className="text-surface-900 dark:text-surface-100">
                  Management
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-surface-600 dark:text-surface-400 max-w-4xl mx-auto leading-relaxed">
                Upload, organize, and manage your files with our intuitive drag-and-drop interface. 
                Experience lightning-fast uploads with real-time progress tracking.
              </p>
            </motion.div>

            {/* Feature Icons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 mt-8 lg:mt-12"
            >
              {[
                { icon: "Upload", label: "Drag & Drop", color: "from-primary to-primary-dark" },
                { icon: "Shield", label: "Secure Storage", color: "from-secondary to-secondary-dark" },
                { icon: "Zap", label: "Fast Upload", color: "from-accent to-green-600" },
                { icon: "FolderOpen", label: "Organize", color: "from-orange-500 to-red-500" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex flex-col items-center p-3 sm:p-4 lg:p-6 bg-white dark:bg-surface-800 rounded-2xl shadow-card hover:shadow-soft transition-all duration-300 group cursor-pointer"
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-tr ${feature.color} flex items-center justify-center mb-2 lg:mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <ApperIcon name={feature.icon} className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-surface-700 dark:text-surface-300">
                    {feature.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Feature Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto">
          <MainFeature />
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 dark:from-primary/10 dark:via-secondary/10 dark:to-accent/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {[
              { value: "10GB", label: "Free Storage", icon: "HardDrive" },
              { value: "256-bit", label: "Encryption", icon: "Lock" },
              { value: "99.9%", label: "Uptime", icon: "Activity" },
              { value: "24/7", label: "Support", icon: "HeadphonesIcon" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 lg:p-8 bg-white/50 dark:bg-surface-800/50 backdrop-blur-sm rounded-2xl border border-surface-200/50 dark:border-surface-700/50"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center">
                  <ApperIcon name={stat.icon} className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-surface-600 dark:text-surface-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home