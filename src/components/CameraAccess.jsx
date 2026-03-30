import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { initializeAppWallet, logAttendanceOnChain } from '../services/stellarService';
import AttendanceLogger from './AttendanceLogger';
import { useNotification } from '../context/NotificationContext';

const CameraAccess = ({ onCameraActive }) => {
  const { addNotification } = useNotification();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Class configuration (could be dynamic later)
  const CLASS_START_TIME = "09:00:00"; 
  
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  
  // Registry states
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerMessage, setRegisterMessage] = useState({ text: '', type: '' });
  
  // Blockchain states
  const [appWallet, setAppWallet] = useState(null);
  const appWalletRef = useRef(null);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const loggedTodayRef = useRef(new Set()); // Prevents duplicate logging
  
  const currentDetectionsRef = useRef([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('registeredStudents');
      if (stored) {
        const parsed = JSON.parse(stored).map(s => ({
          name: s.name,
          descriptor: new Float32Array(s.descriptor)
        }));
        setRegisteredStudents(parsed);
      }
    } catch (err) {
      console.error("Failed to parse local storage registry", err);
    }
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Failed to load models", err);
        setError("Failed to load face detection models.");
      }
    };
    loadModels();
  }, []);

  // Initialize Stellar Blockchain Service
  useEffect(() => {
    initializeAppWallet()
      .then(kp => {
        setAppWallet(kp);
        appWalletRef.current = kp;
      })
      .catch(err => {
        console.error("Stellar Init Error", err);
      });
  }, []);

  const startCamera = async () => {
    setError('');
    setRegisterMessage({ text: '', type: '' });
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      if (onCameraActive) onCameraActive(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please ensure permissions are granted.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (onCameraActive) onCameraActive(false);
      
      if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleVideoPlay = () => {
    if (!modelsLoaded || !videoRef.current || !canvasRef.current) return;
    
    const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
    faceapi.matchDimensions(canvasRef.current, displaySize);

    const detectInterval = setInterval(async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
        clearInterval(detectInterval);
        return;
      }

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
      
      currentDetectionsRef.current = detections;

      let faceMatcher = null;
      if (registeredStudents.length > 0) {
        const labeledDescriptors = registeredStudents.map(student => 
          new faceapi.LabeledFaceDescriptors(student.name, [student.descriptor])
        );
        faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
      }

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      
      if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        context.save();
        context.translate(canvasRef.current.width, 0);
        context.scale(-1, 1);
        
        resizedDetections.forEach(res => {
          const box = res.detection.box;
          let label = 'Unknown';
          let color = '#ef4444'; // Red for unknown

          if (faceMatcher) {
            const bestMatch = faceMatcher.findBestMatch(res.descriptor);
            label = bestMatch.toString(); 
            if (bestMatch.label !== 'unknown') {
              const name = bestMatch.label;
              const wallet = appWalletRef.current;
              
              // Trigger blockchain logging if valid confidence and not logged yet
              if (wallet && bestMatch.distance < 0.55 && !loggedTodayRef.current.has(name)) {
                loggedTodayRef.current.add(name); // Mark instantly to prevent re-triggering for next frames
                
                // Smart Late Detection
                const now = new Date();
                const currentTimeStr = now.toTimeString().split(' ')[0];
                const isLate = currentTimeStr > CLASS_START_TIME;
                const statusLabel = isLate ? "LATE" : "PRESENT";
                
                color = isLate ? '#facc15' : '#4ade80';

                // Send live toast
                addNotification(
                  isLate ? 'warning' : 'success', 
                  `Arrival Detected: ${name}`, 
                  `Logged as ${statusLabel} at ${now.toLocaleTimeString()}`
                );
                
                logAttendanceOnChain(wallet, `${name}:${statusLabel}`)
                  .then(hash => {
                    const now = new Date();
                    const newRecord = { 
                      id: Date.now(),
                      student: name, 
                      txHash: hash.substring(0, 8) + '...' + hash.substring(hash.length - 4), 
                      fullHash: hash,
                      time: now.toLocaleTimeString(), 
                      date: now.toLocaleDateString(),
                      timestamp: now.toISOString(),
                      status: statusLabel 
                    };
                    
                    setAttendanceLogs(prev => [newRecord, ...prev]);

                    // Sync with localStorage for the Dashboard
                    const existingLogs = JSON.parse(localStorage.getItem('attendance_records') || '[]');
                    localStorage.setItem('attendance_records', JSON.stringify([newRecord, ...existingLogs]));
                  })
                  .catch(err => {
                    console.error("Failed to log attendance", err);
                    loggedTodayRef.current.delete(name); // Allow retry if tx failed
                  });
              }

              // Set color for live box based on status
              const nowCheck = new Date();
              if (nowCheck.toTimeString().split(' ')[0] > CLASS_START_TIME) {
                color = '#facc15';
              } else {
                color = '#4ade80';
              }
            }
          }

          const drawBox = new faceapi.draw.DrawBox(box, { label, boxColor: color });
          drawBox.draw(canvasRef.current);
        });
        
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        context.restore();
      }
    }, 150);

    videoRef.current.__detectInterval = detectInterval;
  };

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.__detectInterval) {
        clearInterval(videoRef.current.__detectInterval);
      }
    };
  }, [registeredStudents]); 

  const handleRegisterFace = () => {
    setRegisterMessage({ text: '', type: '' });
    
    if (!newStudentName.trim()) {
      setRegisterMessage({ text: 'Please enter a valid name.', type: 'error' });
      return;
    }
    
    if (currentDetectionsRef.current.length === 0) {
      setRegisterMessage({ text: 'No face detected in the frame.', type: 'error' });
      return;
    }
    
    if (currentDetectionsRef.current.length > 1) {
      setRegisterMessage({ text: 'Multiple faces detected. Please show only one face.', type: 'error' });
      return;
    }

    setIsRegistering(true);
    
    try {
      const descriptor = currentDetectionsRef.current[0].descriptor;
      const newStudent = { 
        name: newStudentName.trim(), 
        descriptor: Array.from(descriptor)
      };
      
      const filtered = registeredStudents.filter(s => s.name.toLowerCase() !== newStudent.name.toLowerCase());
      const updatedList = [...filtered, { name: newStudent.name, descriptor: new Float32Array(newStudent.descriptor) }];
      
      setRegisteredStudents(updatedList);
      
      const persistList = updatedList.map(s => ({
        name: s.name,
        descriptor: Array.from(s.descriptor)
      }));
      localStorage.setItem('registeredStudents', JSON.stringify(persistList));
      
      setNewStudentName('');
      setRegisterMessage({ text: `Successfully registered: ${newStudent.name}!`, type: 'success' });
      
      // Clear their logged status so they can be logged immediately
      loggedTodayRef.current.delete(newStudent.name);
      
    } catch (err) {
      console.error(err);
      setRegisterMessage({ text: 'Failed to capture face descriptor.', type: 'error' });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleClearRegistry = () => {
    if (window.confirm("Are you sure you want to clear all registered faces?")) {
      setRegisteredStudents([]);
      localStorage.removeItem('registeredStudents');
      setRegisterMessage({ text: 'Registry cleared successfully.', type: 'success' });
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="glass-panel" style={{
        padding: 'var(--spacing-md)',
        width: '100%',
        maxWidth: '640px',
        margin: '0 auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--border-color)'
        }}>
          
          {!modelsLoaded && !error && (
            <div style={{ position: 'absolute', zIndex: 10, color: 'var(--accent-primary)', textAlign: 'center' }}>
              <p style={{ fontWeight: 600 }}>Loading Deep Learning Models...</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Gathering Face Detection Neural Networks</p>
            </div>
          )}

          <video 
            ref={videoRef}
            onPlay={handleVideoPlay}
            autoPlay 
            playsInline 
            muted 
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              display: stream ? 'block' : 'none',
              transform: 'scaleX(-1)',
              zIndex: 1
            }}
          />
          
          <canvas 
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              display: stream ? 'block' : 'none',
              zIndex: 2,
              pointerEvents: 'none'
            }}
          />

          {!stream && !error && modelsLoaded && (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', zIndex: 1 }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: 'var(--spacing-sm)' }}>📷</span>
              <p>Ready. Start camera to detect faces.</p>
            </div>
          )}

          {error && (
            <div style={{ color: '#ef4444', textAlign: 'center', padding: 'var(--spacing-md)', zIndex: 3 }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: 'var(--spacing-sm)' }}>⚠️</span>
              <p>{error}</p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'center' }}>
          {!stream ? (
            <button 
              className="btn-primary" 
              onClick={startCamera}
              disabled={!modelsLoaded}
              style={{ opacity: modelsLoaded ? 1 : 0.5, cursor: modelsLoaded ? 'pointer' : 'not-allowed' }}
            >
              Start Camera
            </button>
          ) : (
            <button 
              onClick={stopCamera}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-round)',
                fontFamily: 'inherit',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
            >
              Stop Camera
            </button>
          )}
        </div>

        {stream && (
          <div style={{ 
            marginTop: 'var(--spacing-md)',
            padding: 'var(--spacing-md)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-sm)'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '600' }}>Register New Face</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Enter Student Name..."
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0, 0, 0, 0.2)',
                  border: '1px solid var(--border-color)',
                  color: 'white',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              <button 
                onClick={handleRegisterFace}
                disabled={isRegistering || !newStudentName.trim()}
                style={{
                  background: 'var(--accent-primary)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: '600',
                  cursor: (isRegistering || !newStudentName.trim()) ? 'not-allowed' : 'pointer',
                  opacity: (isRegistering || !newStudentName.trim()) ? 0.5 : 1,
                  transition: 'all var(--transition-fast)'
                }}
              >
                {isRegistering ? 'Scanning...' : 'Capture'}
              </button>
            </div>
            
            {registerMessage.text && (
              <p style={{ 
                fontSize: '0.875rem', 
                color: registerMessage.type === 'error' ? '#f87171' : '#4ade80',
                marginTop: '0.25rem'
              }}>
                {registerMessage.text}
              </p>
            )}

            {registeredStudents.length > 0 && (
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {registeredStudents.length} {registeredStudents.length === 1 ? 'student' : 'students'} tracked.
                </span>
                <button 
                  onClick={handleClearRegistry}
                  style={{
                    background: 'none', border: 'none',
                    color: 'var(--text-secondary)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Clear Database
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stellar Attendance Logger */}
      <AttendanceLogger 
        transactions={attendanceLogs} 
        walletAddress={appWallet ? appWallet.publicKey() : null}
        isWalletReady={!!appWallet} 
      />
    </div>
  );
};

export default CameraAccess;
