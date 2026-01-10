
export const ACTIVE_PROVIDER = 'supabase';

// Supabase Configuration
export const SUPABASE_CONFIG = {
  url: 'https://ukjcyzyhsoxhsaodrjoa.supabase.co',      // TODO: Replace with your Project URL
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVramN5enloc294aHNhb2Ryam9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMzc4NzgsImV4cCI6MjA4MzYxMzg3OH0.QDAy7SD41m6lVRQDFytLjNMfRcFHIdNu3qySjhHvOWw',      // TODO: Replace with your Anon Public Key
  bucket: 'Rentkar',      // Your public bucket name
};

// Cloudinary Configuration
export const CLOUDINARY_CONFIG = {
  cloudName: 'dsvnpsenh',      // TODO: Replace with your Cloudinary cloud name
  uploadPreset: 'rentkar', // TODO: Replace with your unsigned upload preset
  folder: 'rentkar',                  // Base folder for all uploads
};

// Firebase Configuration (legacy - for reference)
export const FIREBASE_CONFIG = {
  // Uses @react-native-firebase/storage which reads from google-services.json
};

// AWS S3 Configuration (future)
export const S3_CONFIG = {
  bucket: '',
  region: '',
  accessKeyId: '',
  secretAccessKey: '',
};

export default {
  activeProvider: ACTIVE_PROVIDER,
  supabase: SUPABASE_CONFIG,
  cloudinary: CLOUDINARY_CONFIG,
  firebase: FIREBASE_CONFIG,
  s3: S3_CONFIG,
};
