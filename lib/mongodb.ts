import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/babymama'

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  var mongoose: any
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('✅ Connected to MongoDB:', MONGODB_URI)
        return mongoose
      })
    } catch (error) {
      console.error('❌ MongoDB connection error:', error)
      throw error
    }
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect
