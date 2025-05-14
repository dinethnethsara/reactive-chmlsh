/**
 * Audio utility for Reactive chmlsh
 * A utility for playing and recording audio
 */

/**
 * Audio class
 */
class Audio {
  static _players = {};
  static _recorders = {};
  static _nextId = 1;

  /**
   * Create a new audio player
   * @returns {number} Player ID
   */
  static createPlayer() {
    const id = Audio._nextId++;
    Audio._players[id] = {
      audio: new window.Audio(),
      status: 'idle',
      position: 0,
      duration: 0,
    };
    
    const player = Audio._players[id];
    
    // Set up event listeners
    player.audio.addEventListener('playing', () => {
      player.status = 'playing';
    });
    
    player.audio.addEventListener('pause', () => {
      player.status = 'paused';
      player.position = player.audio.currentTime * 1000;
    });
    
    player.audio.addEventListener('ended', () => {
      player.status = 'stopped';
      player.position = 0;
    });
    
    player.audio.addEventListener('loadedmetadata', () => {
      player.duration = player.audio.duration * 1000;
    });
    
    player.audio.addEventListener('timeupdate', () => {
      player.position = player.audio.currentTime * 1000;
    });
    
    player.audio.addEventListener('error', () => {
      player.status = 'error';
    });
    
    return id;
  }

  /**
   * Load audio into player
   * @param {number} playerId - Player ID
   * @param {string} uri - Audio URI
   * @param {Object} options - Load options
   * @returns {Promise<Object>} Status object
   */
  static async loadAsync(playerId, uri, options = {}) {
    const player = Audio._players[playerId];
    
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }
    
    try {
      player.status = 'loading';
      player.audio.src = uri;
      player.audio.load();
      
      // Wait for audio to load
      await new Promise((resolve, reject) => {
        player.audio.addEventListener('loadedmetadata', resolve, { once: true });
        player.audio.addEventListener('error', reject, { once: true });
      });
      
      player.status = 'loaded';
      player.position = 0;
      player.duration = player.audio.duration * 1000;
      
      return {
        isLoaded: true,
        uri,
        status: player.status,
        durationMillis: player.duration,
        positionMillis: player.position,
      };
    } catch (error) {
      player.status = 'error';
      console.error('Error loading audio:', error);
      
      return {
        isLoaded: false,
        uri,
        status: 'error',
        error: error.message,
      };
    }
  }

  /**
   * Play audio
   * @param {number} playerId - Player ID
   * @param {Object} options - Play options
   * @returns {Promise<Object>} Status object
   */
  static async playAsync(playerId, options = {}) {
    const player = Audio._players[playerId];
    
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }
    
    try {
      // Set volume if provided
      if (options.volume !== undefined) {
        player.audio.volume = Math.max(0, Math.min(1, options.volume));
      }
      
      // Set position if provided
      if (options.positionMillis !== undefined) {
        player.audio.currentTime = options.positionMillis / 1000;
      }
      
      // Set loop if provided
      if (options.shouldLoop !== undefined) {
        player.audio.loop = options.shouldLoop;
      }
      
      // Play audio
      await player.audio.play();
      
      player.status = 'playing';
      
      return {
        uri: player.audio.src,
        status: player.status,
        durationMillis: player.duration,
        positionMillis: player.position,
        isLooping: player.audio.loop,
        volume: player.audio.volume,
      };
    } catch (error) {
      player.status = 'error';
      console.error('Error playing audio:', error);
      
      return {
        uri: player.audio.src,
        status: 'error',
        error: error.message,
      };
    }
  }

  /**
   * Pause audio
   * @param {number} playerId - Player ID
   * @returns {Promise<Object>} Status object
   */
  static async pauseAsync(playerId) {
    const player = Audio._players[playerId];
    
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }
    
    try {
      player.audio.pause();
      player.status = 'paused';
      player.position = player.audio.currentTime * 1000;
      
      return {
        uri: player.audio.src,
        status: player.status,
        durationMillis: player.duration,
        positionMillis: player.position,
        isLooping: player.audio.loop,
        volume: player.audio.volume,
      };
    } catch (error) {
      player.status = 'error';
      console.error('Error pausing audio:', error);
      
      return {
        uri: player.audio.src,
        status: 'error',
        error: error.message,
      };
    }
  }

  /**
   * Stop audio
   * @param {number} playerId - Player ID
   * @returns {Promise<Object>} Status object
   */
  static async stopAsync(playerId) {
    const player = Audio._players[playerId];
    
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }
    
    try {
      player.audio.pause();
      player.audio.currentTime = 0;
      player.status = 'stopped';
      player.position = 0;
      
      return {
        uri: player.audio.src,
        status: player.status,
        durationMillis: player.duration,
        positionMillis: player.position,
        isLooping: player.audio.loop,
        volume: player.audio.volume,
      };
    } catch (error) {
      player.status = 'error';
      console.error('Error stopping audio:', error);
      
      return {
        uri: player.audio.src,
        status: 'error',
        error: error.message,
      };
    }
  }

  /**
   * Get status of audio player
   * @param {number} playerId - Player ID
   * @returns {Promise<Object>} Status object
   */
  static async getStatusAsync(playerId) {
    const player = Audio._players[playerId];
    
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }
    
    return {
      uri: player.audio.src,
      status: player.status,
      durationMillis: player.duration,
      positionMillis: player.position,
      isLooping: player.audio.loop,
      volume: player.audio.volume,
    };
  }

  /**
   * Unload audio player
   * @param {number} playerId - Player ID
   * @returns {Promise<Object>} Status object
   */
  static async unloadAsync(playerId) {
    const player = Audio._players[playerId];
    
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }
    
    try {
      player.audio.pause();
      player.audio.src = '';
      player.status = 'idle';
      player.position = 0;
      player.duration = 0;
      
      return {
        status: player.status,
      };
    } catch (error) {
      player.status = 'error';
      console.error('Error unloading audio:', error);
      
      return {
        status: 'error',
        error: error.message,
      };
    }
  }

  /**
   * Create a new audio recorder
   * @returns {Promise<number>} Recorder ID
   */
  static async createRecorder() {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
      throw new Error('Audio recording is not supported in this environment');
    }
    
    try {
      // Request permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const id = Audio._nextId++;
      Audio._recorders[id] = {
        mediaRecorder: null,
        stream: null,
        chunks: [],
        status: 'idle',
        uri: null,
      };
      
      return id;
    } catch (error) {
      console.error('Error creating audio recorder:', error);
      throw error;
    }
  }

  /**
   * Start recording
   * @param {number} recorderId - Recorder ID
   * @param {Object} options - Recording options
   * @returns {Promise<Object>} Status object
   */
  static async startRecordingAsync(recorderId, options = {}) {
    const recorder = Audio._recorders[recorderId];
    
    if (!recorder) {
      throw new Error(`Recorder ${recorderId} not found`);
    }
    
    try {
      // Get audio stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorder.stream = stream;
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      recorder.mediaRecorder = mediaRecorder;
      
      // Set up recorder events
      recorder.chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recorder.chunks.push(event.data);
        }
      };
      
      // Start recording
      mediaRecorder.start();
      recorder.status = 'recording';
      
      return {
        status: recorder.status,
        canRecord: true,
        isRecording: true,
        durationMillis: 0,
      };
    } catch (error) {
      recorder.status = 'error';
      console.error('Error starting recording:', error);
      
      return {
        status: 'error',
        error: error.message,
      };
    }
  }

  /**
   * Stop recording
   * @param {number} recorderId - Recorder ID
   * @returns {Promise<Object>} Status object
   */
  static async stopRecordingAsync(recorderId) {
    const recorder = Audio._recorders[recorderId];
    
    if (!recorder) {
      throw new Error(`Recorder ${recorderId} not found`);
    }
    
    if (recorder.status !== 'recording') {
      return {
        status: recorder.status,
        canRecord: true,
        isRecording: false,
        uri: recorder.uri,
      };
    }
    
    try {
      // Create promise for recording completion
      const recordingPromise = new Promise((resolve, reject) => {
        recorder.mediaRecorder.onstop = () => {
          // Stop audio stream
          recorder.stream.getTracks().forEach(track => track.stop());
          
          // Create blob from chunks
          const blob = new Blob(recorder.chunks, { type: 'audio/webm' });
          
          // Create object URL
          const uri = URL.createObjectURL(blob);
          recorder.uri = uri;
          
          recorder.status = 'stopped';
          
          resolve({
            status: recorder.status,
            canRecord: true,
            isRecording: false,
            uri,
          });
        };
        
        recorder.mediaRecorder.onerror = (error) => {
          reject(error);
        };
      });
      
      // Stop recording
      recorder.mediaRecorder.stop();
      
      return await recordingPromise;
    } catch (error) {
      recorder.status = 'error';
      console.error('Error stopping recording:', error);
      
      return {
        status: 'error',
        error: error.message,
      };
    }
  }

  /**
   * Get status of audio recorder
   * @param {number} recorderId - Recorder ID
   * @returns {Promise<Object>} Status object
   */
  static async getRecordingStatusAsync(recorderId) {
    const recorder = Audio._recorders[recorderId];
    
    if (!recorder) {
      throw new Error(`Recorder ${recorderId} not found`);
    }
    
    return {
      status: recorder.status,
      canRecord: true,
      isRecording: recorder.status === 'recording',
      uri: recorder.uri,
    };
  }

  /**
   * Unload audio recorder
   * @param {number} recorderId - Recorder ID
   * @returns {Promise<Object>} Status object
   */
  static async unloadRecorderAsync(recorderId) {
    const recorder = Audio._recorders[recorderId];
    
    if (!recorder) {
      throw new Error(`Recorder ${recorderId} not found`);
    }
    
    try {
      if (recorder.status === 'recording') {
        // Stop recording
        recorder.mediaRecorder.stop();
        
        // Stop audio stream
        recorder.stream.getTracks().forEach(track => track.stop());
      }
      
      // Reset recorder
      recorder.mediaRecorder = null;
      recorder.stream = null;
      recorder.chunks = [];
      recorder.status = 'idle';
      recorder.uri = null;
      
      return {
        status: recorder.status,
      };
    } catch (error) {
      recorder.status = 'error';
      console.error('Error unloading recorder:', error);
      
      return {
        status: 'error',
        error: error.message,
      };
    }
  }
}

export { Audio };
