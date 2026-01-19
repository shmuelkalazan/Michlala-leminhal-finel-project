export interface Student {
  _id: string;
  name: string;
  email: string;
}

export interface Lesson {
  _id?: string;
  title?: string;
  name?: string;
  coachName: string;
  coachId: string | null;
  date: string | Date;
  startTime?: string;
  endTime?: string;
  time?: string;
  type?: string;
  students?: Student[];
  __v?: number;
}