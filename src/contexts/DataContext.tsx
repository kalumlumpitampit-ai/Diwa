import React, { createContext, useContext, useEffect, useState } from 'react';
import { db, handleFirestoreError } from '../firebase';
import { collection, doc, getDoc, setDoc, onSnapshot, updateDoc, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { UserProfile, Submission, UserRole, Assignment, Broadcast, Resource, Note } from '../types';

interface DataContextType {
  profile: UserProfile | null;
  submissions: Submission[];
  assignments: Assignment[];
  broadcasts: Broadcast[];
  resources: Resource[];
  notes: Note[];
  allStudents: UserProfile[];
  setRole: (role: UserRole) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateUserProfile: (uid: string, data: Partial<UserProfile>) => Promise<void>;
  submitAssignment: (submission: Omit<Submission, 'id' | 'status' | 'timestamp'>) => Promise<void>;
  gradeSubmission: (id: string, score: number, feedback: string) => Promise<void>;
  returnSubmission: (id: string, feedback: string) => Promise<void>;
  createAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
  postBroadcast: (broadcast: Omit<Broadcast, 'id' | 'createdAt' | 'authorName'>) => Promise<void>;
  addResource: (resource: Omit<Resource, 'id' | 'createdAt'>) => Promise<void>;
  addNote: (note: Omit<Note, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [allStudents, setAllStudents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setSubmissions([]);
      setAssignments([]);
      setBroadcasts([]);
      setResources([]);
      setNotes([]);
      setAllStudents([]);
      setLoading(false);
      return;
    }

    // Profile listener
    const profileRef = doc(db, 'profiles', user.uid);
    const unsubProfile = onSnapshot(profileRef, (snap) => {
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      } else {
        const intendedRole = localStorage.getItem('intendedRole') as UserRole || 'student';
        let role: UserRole = intendedRole;
        const email = user.email || '';
        
        // Final sanity check on domains
        if (role === 'teacher' && !email.endsWith('@deped.gov.ph')) {
          role = 'student'; 
        } else if (role === 'student' && !email.endsWith('@gmail.com')) {
          role = 'student'; 
        }

        // Upgrade to admin if deped domain
        if (email.endsWith('@deped.gov.ph')) {
          role = 'admin';
        }

        const initialProfile: UserProfile = {
          uid: user.uid,
          role,
          displayName: user.displayName || 'Learner',
          email,
          totalPoints: 0,
          badges: [],
          bio: '',
          learningGoal: ''
        };
        setDoc(profileRef, initialProfile);
        setProfile(initialProfile);
        localStorage.removeItem('intendedRole'); // Clean up
      }
    });

    // Assignments listener
    const unsubAssignments = onSnapshot(query(collection(db, 'assignments'), where('status', '==', 'active')), (snap) => {
      const v = snap.docs.map(d => ({ id: d.id, ...d.data() } as Assignment));
      setAssignments(v.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });

    // Broadcasts listener
    const unsubBroadcasts = onSnapshot(query(collection(db, 'broadcasts'), where('visibility', '==', 'public')), (snap) => {
      const v = snap.docs.map(d => ({ id: d.id, ...d.data() } as Broadcast));
      setBroadcasts(v.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });

    // Resources listener
    const unsubResources = onSnapshot(query(collection(db, 'resources')), (snap) => {
      const v = snap.docs.map(d => ({ id: d.id, ...d.data() } as Resource));
      setResources(v.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });

    // Notes listener
    const unsubNotes = onSnapshot(query(collection(db, 'notes'), where('userId', '==', user.uid)), (snap) => {
      const v = snap.docs.map(d => ({ id: d.id, ...d.data() } as Note));
      setNotes(v.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });

    return () => {
      unsubProfile();
      unsubAssignments();
      unsubBroadcasts();
      unsubResources();
      unsubNotes();
    };
  }, [user]);

  // Submissions & Students listener
  useEffect(() => {
    if (!user || !profile) return;

    let subQuery;
    if (profile.role === 'teacher' || profile.role === 'admin') {
      subQuery = query(collection(db, 'submissions'));
      
      // Fetch all students for teacher monitoring
      const unsubStudents = onSnapshot(query(collection(db, 'profiles'), where('role', '==', 'student')), (snap) => {
        setAllStudents(snap.docs.map(d => d.data() as UserProfile));
      });
      
      const unsubSubs = onSnapshot(subQuery, (snap) => {
        const subs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Submission));
        setSubmissions(subs);
        setLoading(false);
      });

      return () => {
        unsubSubs();
        unsubStudents();
      };
    } else {
      subQuery = query(collection(db, 'submissions'), where('studentId', '==', user.uid));
      const unsubSubs = onSnapshot(subQuery, (snap) => {
        const subs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Submission));
        setSubmissions(subs);
        setLoading(false);
      });
      return () => unsubSubs();
    }
  }, [user, profile]);

  const setRole = async (role: UserRole) => {
    if (!user) return;
    await updateDoc(doc(db, 'profiles', user.uid), { role });
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'profiles', user.uid), data);
    } catch (e) {
      handleFirestoreError(e, 'update', `profiles/${user.uid}`);
    }
  };

  const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    try {
      await updateDoc(doc(db, 'profiles', uid), data);
    } catch (e) {
      handleFirestoreError(e, 'update', `profiles/${uid}`);
    }
  };

  const addNote = async (data: Omit<Note, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'notes'), {
        ...data,
        userId: user.uid,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, 'create', 'notes');
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'notes', id));
    } catch (e) {
      handleFirestoreError(e, 'delete', `notes/${id}`);
    }
  };

  const submitAssignment = async (data: Omit<Submission, 'id' | 'status' | 'timestamp'>) => {
    try {
      await addDoc(collection(db, 'submissions'), {
        ...data,
        status: 'pending',
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, 'create', 'submissions');
    }
  };

  const createAssignment = async (data: Omit<Assignment, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'assignments'), {
        ...data,
        status: 'active',
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, 'create', 'assignments');
    }
  };

  const deleteAssignment = async (id: string) => {
    try {
      await updateDoc(doc(db, 'assignments', id), {
        deleted: true
      });
    } catch (e) {
      handleFirestoreError(e, 'update', `assignments/${id}`);
    }
  };

  const postBroadcast = async (data: Omit<Broadcast, 'id' | 'createdAt' | 'authorName'>) => {
    try {
      await addDoc(collection(db, 'broadcasts'), {
        ...data,
        visibility: 'public',
        authorName: profile?.displayName || 'Teacher',
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, 'create', 'broadcasts');
    }
  };

  const addResource = async (data: Omit<Resource, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'resources'), {
        ...data,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, 'create', 'resources');
    }
  };

  const gradeSubmission = async (id: string, score: number, feedback: string) => {
    try {
      const submissionRef = doc(db, 'submissions', id);
      const submissionSnap = await getDoc(submissionRef);
      
      if (submissionSnap.exists()) {
        const subData = submissionSnap.data() as Submission;
        const studentId = subData.studentId;
        
        await updateDoc(submissionRef, {
          score,
          feedback,
          status: 'graded',
          gradedAt: new Date().toISOString()
        });

        // Update student total points
        const studentRef = doc(db, 'profiles', studentId);
        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
          const currentPoints = studentSnap.data().totalPoints || 0;
          await updateDoc(studentRef, { totalPoints: currentPoints + score });
        }
      }
    } catch (e) {
      handleFirestoreError(e, 'update', `submissions/${id}`);
    }
  };

  const returnSubmission = async (id: string, feedback: string) => {
    try {
      await updateDoc(doc(db, 'submissions', id), {
        status: 'returned',
        feedback,
        returnedAt: new Date().toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, 'update', `submissions/${id}`);
    }
  };

  return (
    <DataContext.Provider value={{ 
      profile, submissions, assignments, broadcasts, resources, notes, allStudents,
      setRole, updateProfile, updateUserProfile, submitAssignment, gradeSubmission, returnSubmission, createAssignment, deleteAssignment, postBroadcast, addResource,
      addNote, deleteNote,
      loading 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
