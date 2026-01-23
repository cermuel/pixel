import React, { createContext, ReactNode, useEffect, useState, useRef } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import useAuth from '@/context/useAuth';
import useSocket from '@/context/chat-socket';

interface CallContextInterface {
  peerId: string | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isInCall: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  callUser: (userId: number) => Promise<void>;
  answerCall: () => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  incomingCall: { from: string; fromUserId: number } | null;
  declineCall: () => void;
  hasPermissions: boolean;
  requestPermissions: () => Promise<void>;
}

export const CallContext = createContext<CallContextInterface | undefined>(undefined);

const CallProvider = ({ children }: { children: ReactNode }) => {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();

  const [peerId, setPeerId] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{ from: string; fromUserId: number } | null>(
    null
  );

  const peerRef = useRef<Peer | null>(null);
  const currentCallRef = useRef<MediaConnection | null>(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const audioStatus = await Audio.requestPermissionsAsync();

      if (cameraStatus.status === 'granted' && audioStatus.status === 'granted') {
        setHasPermissions(true);

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } else {
        console.warn('Permissions not granted');
        setHasPermissions(false);
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      setHasPermissions(false);
    }
  };

  useEffect(() => {
    if (!isConnected || !user) return;

    const peer = new Peer(`${user.phone}`, {
      host: 'peerjs-server.herokuapp.com',
      port: 443,
      secure: true,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      },
    });

    peer.on('open', (id) => {
      console.log('PeerJS ID:', id);
      setPeerId(id);
      socket?.emit('register-peer', { peerId: id, userId: user.userId });
    });

    peer.on('call', (call) => {
      currentCallRef.current = call;
      socket?.emit('get-caller-info', { peerId: call.peer });
    });

    peer.on('error', (error) => {
      console.error('PeerJS error:', error);
    });

    peerRef.current = peer;

    return () => {
      peer.destroy();
      peerRef.current = null;
    };
  }, [isConnected, user, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on('incoming-call', ({ from, fromUserId }: { from: string; fromUserId: number }) => {
      setIncomingCall({ from, fromUserId });
    });

    socket.on('call-declined', () => {
      endCall();
    });

    socket.on('call-ended', () => {
      endCall();
    });

    return () => {
      socket.off('incoming-call');
      socket.off('call-declined');
      socket.off('call-ended');
    };
  }, [socket]);

  const getLocalStream = async (): Promise<MediaStream | null> => {
    try {
      if (!hasPermissions) {
        console.error('Permissions not granted');
        return null;
      }

      // Use browser's getUserMedia for WebRTC compatibility
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: {
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        });

        setLocalStream(stream);
        return stream;
      } else {
        console.error('getUserMedia not supported');
        return null;
      }
    } catch (error) {
      console.error('Error accessing media:', error);
      return null;
    }
  };

  const callUser = async (userId: number) => {
    console.log('clicked');
    if (!peerRef.current || !socket) return;

    socket.emit('get-peer-id', { userId }, async (response: { peerId: string }) => {
      if (!response.peerId) {
        console.error('User not available');
        return;
      }

      const stream = await getLocalStream();
      if (!stream) return;

      const call = peerRef.current!.call(response.peerId, stream);
      currentCallRef.current = call;

      call.on('stream', (remoteMediaStream) => {
        setRemoteStream(remoteMediaStream);
        setIsInCall(true);
      });

      call.on('close', () => {
        endCall();
      });

      socket.emit('initiate-call', {
        toUserId: userId,
        fromPeerId: peerId,
      });
    });
  };

  const answerCall = async () => {
    if (!currentCallRef.current || !incomingCall) return;

    const stream = await getLocalStream();
    if (!stream) return;

    currentCallRef.current.answer(stream);

    currentCallRef.current.on('stream', (remoteMediaStream) => {
      setRemoteStream(remoteMediaStream);
      setIsInCall(true);
      setIncomingCall(null);
    });

    currentCallRef.current.on('close', () => {
      endCall();
    });

    socket?.emit('call-answered', { to: incomingCall.fromUserId });
  };

  const declineCall = () => {
    if (currentCallRef.current) {
      currentCallRef.current.close();
      currentCallRef.current = null;
    }
    if (incomingCall) {
      socket?.emit('call-declined', { to: incomingCall.fromUserId });
    }
    setIncomingCall(null);
  };

  const endCall = () => {
    if (currentCallRef.current) {
      currentCallRef.current.close();
      currentCallRef.current = null;
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    setRemoteStream(null);
    setIsInCall(false);
    setIsMuted(false);
    setIsCameraOff(false);
    setIncomingCall(null);

    socket?.emit('end-call');
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOff(!videoTrack.enabled);
      }
    }
  };

  return (
    <CallContext.Provider
      value={{
        peerId,
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
      }}>
      {children}
    </CallContext.Provider>
  );
};

export default CallProvider;
