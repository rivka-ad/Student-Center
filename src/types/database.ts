export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          user_id: string
          full_name: string
          email: string
          phone: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          email: string
          phone?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          email?: string
          phone?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          color: string
          start_date: string | null
          end_date: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          color?: string
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          color?: string
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          id: string
          user_id: string
          course_id: string
          title: string
          description: string | null
          lesson_date: string
          duration_minutes: number
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          title: string
          description?: string | null
          lesson_date: string
          duration_minutes?: number
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          title?: string
          description?: string | null
          lesson_date?: string
          duration_minutes?: number
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          student_id: string
          course_id: string
          enrolled_at: string
          status: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          student_id: string
          course_id: string
          enrolled_at?: string
          status?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          student_id?: string
          course_id?: string
          enrolled_at?: string
          status?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          id: string
          user_id: string
          enrollment_id: string
          lesson_id: string
          status: string
          notes: string | null
          marked_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          enrollment_id: string
          lesson_id: string
          status: string
          notes?: string | null
          marked_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          enrollment_id?: string
          lesson_id?: string
          status?: string
          notes?: string | null
          marked_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          id: string
          user_id: string
          student_id: string
          subject: string
          body: string
          sent_at: string
          status: string
        }
        Insert: {
          id?: string
          user_id: string
          student_id: string
          subject: string
          body: string
          sent_at?: string
          status: string
        }
        Update: {
          id?: string
          user_id?: string
          student_id?: string
          subject?: string
          body?: string
          sent_at?: string
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type exports
export type Student = Database['public']['Tables']['students']['Row']
export type StudentInsert = Database['public']['Tables']['students']['Insert']
export type StudentUpdate = Database['public']['Tables']['students']['Update']

export type Course = Database['public']['Tables']['courses']['Row']
export type CourseInsert = Database['public']['Tables']['courses']['Insert']
export type CourseUpdate = Database['public']['Tables']['courses']['Update']

export type Lesson = Database['public']['Tables']['lessons']['Row']
export type LessonInsert = Database['public']['Tables']['lessons']['Insert']
export type LessonUpdate = Database['public']['Tables']['lessons']['Update']

export type Enrollment = Database['public']['Tables']['enrollments']['Row']
export type EnrollmentInsert = Database['public']['Tables']['enrollments']['Insert']
export type EnrollmentUpdate = Database['public']['Tables']['enrollments']['Update']

export type Attendance = Database['public']['Tables']['attendance']['Row']
export type AttendanceInsert = Database['public']['Tables']['attendance']['Insert']
export type AttendanceUpdate = Database['public']['Tables']['attendance']['Update']

export type EmailLog = Database['public']['Tables']['email_logs']['Row']
export type EmailLogInsert = Database['public']['Tables']['email_logs']['Insert']

// Extended types with relations
export type EnrollmentWithStudent = Enrollment & {
  students: Student
}

export type EnrollmentWithCourse = Enrollment & {
  courses: Course
}

export type LessonWithCourse = Lesson & {
  courses: Course
}

export type AttendanceWithDetails = Attendance & {
  enrollments: EnrollmentWithStudent
  lessons: LessonWithCourse
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'
export type EnrollmentStatus = 'active' | 'completed' | 'dropped'
