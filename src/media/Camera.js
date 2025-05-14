/**
 * Camera utility for Reactive chmlsh
 * A utility for accessing device camera
 */

/**
 * Camera class
 */
class Camera {
  static _hasPermission = false;

  /**
   * Request permission to access camera
   * @returns {Promise<boolean>} Whether permission was granted
   */
  static async requestPermission() {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
      console.warn('Camera is not supported in this environment');
      return false;
    }
    
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      Camera._hasPermission = true;
      return true;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      Camera._hasPermission = false;
      return false;
    }
  }

  /**
   * Check if permission has been granted
   * @returns {Promise<boolean>} Whether permission has been granted
   */
  static async hasPermission() {
    if (Camera._hasPermission) {
      return true;
    }
    
    return Camera.requestPermission();
  }

  /**
   * Take a picture
   * @param {Object} options - Options for taking a picture
   * @returns {Promise<Object>} Picture object
   */
  static async takePicture(options = {}) {
    const {
      quality = 0.8,
      width,
      height,
      skipProcessing = false,
    } = options;
    
    if (!(await Camera.hasPermission())) {
      throw new Error('Camera permission not granted');
    }
    
    try {
      // Create video element
      const video = document.createElement('video');
      video.style.display = 'none';
      document.body.appendChild(video);
      
      // Get video stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: width || { ideal: 1920 },
          height: height || { ideal: 1080 },
        },
      });
      
      video.srcObject = stream;
      
      // Wait for video to load
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });
      
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Stop video stream
      stream.getTracks().forEach(track => track.stop());
      
      // Remove video element
      document.body.removeChild(video);
      
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      
      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      // Create object URL
      const uri = URL.createObjectURL(blob);
      
      return {
        uri,
        width: canvas.width,
        height: canvas.height,
        exif: null,
        base64: skipProcessing ? null : dataUrl.split(',')[1],
      };
    } catch (error) {
      console.error('Error taking picture:', error);
      throw error;
    }
  }

  /**
   * Record a video
   * @param {Object} options - Options for recording a video
   * @returns {Promise<Object>} Video object
   */
  static async recordVideo(options = {}) {
    const {
      maxDuration = 60,
      quality = 'high',
      mute = false,
    } = options;
    
    if (!(await Camera.hasPermission())) {
      throw new Error('Camera permission not granted');
    }
    
    try {
      // Create video element
      const video = document.createElement('video');
      video.style.display = 'none';
      document.body.appendChild(video);
      
      // Get video stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: !mute,
      });
      
      video.srcObject = stream;
      
      // Wait for video to load
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];
      
      // Set up recorder events
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      // Start recording
      mediaRecorder.start();
      
      // Create promise for recording completion
      const recordingPromise = new Promise((resolve, reject) => {
        // Set up timeout for max duration
        const timeout = setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, maxDuration * 1000);
        
        // Set up recorder stop event
        mediaRecorder.onstop = () => {
          clearTimeout(timeout);
          
          // Stop video stream
          stream.getTracks().forEach(track => track.stop());
          
          // Remove video element
          document.body.removeChild(video);
          
          // Create blob from chunks
          const blob = new Blob(chunks, { type: 'video/mp4' });
          
          // Create object URL
          const uri = URL.createObjectURL(blob);
          
          resolve({
            uri,
            codec: 'mp4',
            duration: 0, // Duration is not available in this implementation
          });
        };
        
        // Set up recorder error event
        mediaRecorder.onerror = (error) => {
          clearTimeout(timeout);
          reject(error);
        };
      });
      
      return recordingPromise;
    } catch (error) {
      console.error('Error recording video:', error);
      throw error;
    }
  }

  /**
   * Get available camera features
   * @returns {Promise<Object>} Camera features
   */
  static async getAvailableCameraFeatures() {
    if (!(await Camera.hasPermission())) {
      throw new Error('Camera permission not granted');
    }
    
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      return {
        hasFlash: false, // Flash is not available in browser
        hasFrontCamera: videoDevices.length > 1,
        hasBackCamera: videoDevices.length > 0,
        hasAutoFocus: true, // Auto focus is generally available
        hasZoom: true, // Zoom is generally available
      };
    } catch (error) {
      console.error('Error getting camera features:', error);
      throw error;
    }
  }
}

export { Camera };
