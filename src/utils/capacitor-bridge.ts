'use client'

import { Capacitor } from '@capacitor/core'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { PushNotifications } from '@capacitor/push-notifications'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Network } from '@capacitor/network'
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'

export const isNative = Capacitor.isNativePlatform()

// ==========================================
// PUSH NOTIFICATIONS
// ==========================================
export const registerPushNotifications = async () => {
  if (!isNative) return false

  // Request permission
  let permStatus = await PushNotifications.checkPermissions()
  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions()
  }

  if (permStatus.receive !== 'granted') {
    throw new Error('User denied permissions!')
  }

  // Register with Apple / Google to receive token
  await PushNotifications.register()

  PushNotifications.addListener('registration', (token) => {
    console.log('Push registration success, token: ' + token.value)
    // Send token to Supabase for this user
  })

  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push received: ' + JSON.stringify(notification))
  })

  PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    console.log('Push action performed: ' + JSON.stringify(notification))
  })

  return true
}

// ==========================================
// CAMERA
// ==========================================
export const takePicture = async () => {
  if (!isNative) {
    throw new Error('Camera is only available on native devices')
  }

  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Base64,
    source: CameraSource.Prompt
  })

  return `data:image/jpeg;base64,${image.base64String}`
}

// ==========================================
// FILESYSTEM (Downloads)
// ==========================================
export const downloadFileNative = async (url: string, filename: string) => {
  if (!isNative) return false

  try {
    // Note: requires fetching blob and writing base64
    const response = await fetch(url)
    const blob = await response.blob()
    const reader = new FileReader()
    
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        const base64data = reader.result as string
        
        try {
          const savedFile = await Filesystem.writeFile({
            path: `HamroLearning/${filename}`,
            data: base64data,
            directory: Directory.Documents,
            recursive: true
          })
          resolve(savedFile)
        } catch (e) {
          reject(e)
        }
      }
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Download error:', error)
    throw error
  }
}

// ==========================================
// GOOGLE AUTH
// ==========================================
export const signInWithGoogleNative = async () => {
  if (!isNative) return null

  try {
    GoogleAuth.initialize({
      clientId: 'YOUR_GOOGLE_WEB_CLIENT_ID',
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    })

    const result = await GoogleAuth.signIn()
    // result.authentication.idToken can be passed to Supabase for auth
    return result
  } catch (error) {
    console.error('Google Auth Native Error:', error)
    throw error
  }
}

// ==========================================
// NETWORK STATUS
// ==========================================
export const getNetworkStatus = async () => {
  if (!isNative) return { connected: navigator.onLine }
  return await Network.getStatus()
}
