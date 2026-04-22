export type Term = 'First Term' | 'Second Term' | 'Third Term';
export type UserRole = 'teacher' | 'student' | 'admin';

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  objectives: string[];
  vocabulary: string[];
  discussionText: string; // The deep educational content
  prompts: string[];
  activities: string[];
  teacherGuide: string;
  culturalContext: string;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'short-answer';
  text: string;
  options?: string[]; // For multiple-choice
  correctAnswer?: string; // Optional for auto-grading
}

export interface Assignment {
  id: string;
  lessonId?: string; // Optional for general activities
  title: string;
  instructions: string;
  points: number;
  dueDate: string; // ISO string
  createdAt: string;
  questions?: Question[]; // If present, it's a quiz
  deleted?: boolean;
}

export interface Broadcast {
  id: string;
  title: string;
  message: string;
  authorName: string;
  createdAt: string;
  priority: 'normal' | 'high';
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  content: string | Record<string, string>; // Record for quiz answers {questionId: answer}
  score?: number;
  feedback?: string;
  status: 'pending' | 'graded' | 'returned';
  timestamp: string;
  gradedAt?: string;
  returnedAt?: string;
}

export interface Unit {
  id: string;
  term: Term;
  title: string;
  description: string;
  lessonIds: string[];
}

export interface UserProfile {
  uid: string;
  role: UserRole;
  displayName: string;
  email: string;
  totalPoints?: number;
  badges?: string[];
  bio?: string;
  learningGoal?: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'video' | 'document';
  url: string;
  description: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  requiredPoints: number;
}
