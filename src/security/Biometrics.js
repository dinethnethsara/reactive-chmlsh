/**
 * Biometrics utility for Reactive chmlsh
 * A utility for biometric authentication
 */

/**
 * Biometrics class
 */
class Biometrics {
  /**
   * Check if biometric authentication is available
   * @returns {Promise<boolean>} Whether biometric authentication is available
   */
  static async isAvailable() {
    if (typeof window === 'undefined' || !window.PublicKeyCredential) {
      return false;
    }
    
    try {
      // Check if platform authenticator is available
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  /**
   * Authenticate using biometrics
   * @param {Object} options - Authentication options
   * @returns {Promise<Object>} Authentication result
   */
  static async authenticate(options = {}) {
    const {
      promptMessage = 'Authenticate using biometrics',
      cancelLabel = 'Cancel',
      fallbackLabel = 'Use password',
    } = options;
    
    if (!(await Biometrics.isAvailable())) {
      throw new Error('Biometric authentication is not available');
    }
    
    try {
      // Create challenge
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      
      // Create credential options
      const publicKeyCredentialRequestOptions = {
        challenge,
        timeout: 60000,
        userVerification: 'required',
        rpId: window.location.hostname,
      };
      
      // Show authentication prompt
      if (typeof navigator.credentials.get !== 'function') {
        throw new Error('Credential Management API is not supported');
      }
      
      // Request credential
      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
        mediation: 'optional',
      });
      
      if (!credential) {
        throw new Error('Authentication failed');
      }
      
      return {
        success: true,
        credential,
      };
    } catch (error) {
      console.error('Error authenticating with biometrics:', error);
      
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Register biometric credentials
   * @param {Object} options - Registration options
   * @returns {Promise<Object>} Registration result
   */
  static async register(options = {}) {
    const {
      userId,
      username,
      displayName,
      promptMessage = 'Register biometric credentials',
    } = options;
    
    if (!(await Biometrics.isAvailable())) {
      throw new Error('Biometric authentication is not available');
    }
    
    if (!userId || !username || !displayName) {
      throw new Error('userId, username, and displayName are required');
    }
    
    try {
      // Create challenge
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      
      // Convert userId to ArrayBuffer
      const userIdBuffer = new TextEncoder().encode(userId);
      
      // Create credential options
      const publicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: document.title || window.location.hostname,
          id: window.location.hostname,
        },
        user: {
          id: userIdBuffer,
          name: username,
          displayName,
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 }, // ES256
          { type: 'public-key', alg: -257 }, // RS256
        ],
        timeout: 60000,
        attestation: 'none',
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          requireResidentKey: false,
        },
      };
      
      // Show registration prompt
      if (typeof navigator.credentials.create !== 'function') {
        throw new Error('Credential Management API is not supported');
      }
      
      // Create credential
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      });
      
      if (!credential) {
        throw new Error('Registration failed');
      }
      
      return {
        success: true,
        credential,
      };
    } catch (error) {
      console.error('Error registering biometric credentials:', error);
      
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Check if a specific biometric type is supported
   * @param {string} biometricType - Biometric type to check
   * @returns {Promise<boolean>} Whether the biometric type is supported
   */
  static async isBiometricTypeSupported(biometricType) {
    if (!(await Biometrics.isAvailable())) {
      return false;
    }
    
    // Web Authentication API doesn't provide a way to check specific biometric types
    // This is a mock implementation
    
    switch (biometricType.toLowerCase()) {
      case 'fingerprint':
        return true;
      case 'faceid':
        return true;
      case 'iris':
        return false;
      default:
        return false;
    }
  }

  /**
   * Cancel biometric authentication
   * @returns {Promise<void>}
   */
  static async cancel() {
    // Web Authentication API doesn't provide a way to cancel authentication
    // This is a mock implementation
    
    console.warn('Biometric authentication cancellation is not supported in the web environment');
  }
}

export { Biometrics };
