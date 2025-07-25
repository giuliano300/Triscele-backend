export class UpdateBookingDto {
  status?: 'pending' | 'confirmed' | 'cancelled';
  startTime?: string;
  endTime?: string;
}