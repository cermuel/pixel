import useCall from '@/context/call-socket';
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const VideoCallScreen = ({ userId, userName }: { userId: number; userName: string }) => {
  const {
    localStream,
    remoteStream,
    isInCall,
    isMuted,
    isCameraOff,
    callUser,
    answerCall,
    endCall,
    toggleMute,
    toggleCamera,
    incomingCall,
    declineCall,
    hasPermissions,
    requestPermissions,
  } = useCall();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Set up local video stream
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Set up remote video stream
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleStartCall = () => {
    if (!hasPermissions) {
      Alert.alert('Permissions Required', 'Please grant camera and microphone permissions', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Grant', onPress: requestPermissions },
      ]);
      return;
    }

    Alert.alert('Video Call', `Call ${userName}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => callUser(userId) },
    ]);
  };

  if (!hasPermissions) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera and microphone access required</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
          <Text style={styles.permissionButtonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Incoming Call Modal */}
      <Modal visible={!!incomingCall} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Incoming Call</Text>
            <Text style={styles.modalText}>{userName} is calling...</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.declineButton]}
                onPress={declineCall}>
                <Text style={styles.buttonText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.acceptButton]}
                onPress={answerCall}>
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Call UI */}
      {!isInCall ? (
        <View style={styles.idleContainer}>
          <TouchableOpacity style={styles.callButton} onPress={handleStartCall}>
            <Text style={styles.callButtonText}>📹 Video Call</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.callContainer}>
          {/* Remote Video */}
          <View style={styles.remoteVideoContainer}>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                backgroundColor: '#1a1a1a',
              }}
            />
          </View>

          {/* Local Video */}
          <View style={styles.localVideoContainer}>
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)', // Mirror effect
              }}
            />
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.controlButton, isMuted && styles.activeControl]}
              onPress={toggleMute}>
              <Text style={styles.controlText}>{isMuted ? '🔇' : '🎤'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.endCallButton]}
              onPress={endCall}>
              <Text style={styles.controlText}>📞</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, isCameraOff && styles.activeControl]}
              onPress={toggleCamera}>
              <Text style={styles.controlText}>{isCameraOff ? '📷' : '📹'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  idleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  callButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  callContainer: {
    flex: 1,
  },
  remoteVideoContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  localVideoContainer: {
    position: 'absolute',
    width: 120,
    height: 160,
    top: 50,
    right: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallButton: {
    backgroundColor: '#FF3B30',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  activeControl: {
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
  },
  controlText: {
    fontSize: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  modalButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: '#FF3B30',
  },
  acceptButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VideoCallScreen;
