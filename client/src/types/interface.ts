export interface Student {
    _id: string;
    name: string;
    email: string;
  }
  
export  interface Lesson {
    _id?: string;
    name?: string;
    coachName: string;
    coachId: string | null;
    date: string;
    time: string;
    type: string;
    students?: Student[];
    __v?: number;
  }