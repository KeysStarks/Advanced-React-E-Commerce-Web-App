export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  address: string;
  createdAt?: { seconds: number } | null;
}
