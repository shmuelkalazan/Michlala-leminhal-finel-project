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
  branchId?: string | { _id: string; name: string; address: string };
  date: string | Date;
  startTime?: string;
  endTime?: string;
  time?: string;
  type?: string;
  students?: Student[];
  __v?: number;
}

export interface Branch {
  _id: string;
  name: string;
  address: string;
  phone: string;
  latitude?: number;
  longitude?: number;
}