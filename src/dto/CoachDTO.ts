export interface CoachApiResponse {
  id: string;
  user_id: string;
  full_name: string;
  average_rating: number;
  specialties: string[];
  hourly_rate_usd: number;
  is_available: boolean;
  profile_image_url?: string;
  bio_description?: string;
  created_at: string;
  updated_at: string;
}

export interface CoachApiRequest {
  user_id: string;
  full_name: string;
  specialties: string[];
  hourly_rate_usd: number;
  is_available: boolean;
  profile_image_url?: string;
  bio_description?: string;
}

export class CoachDTO {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly rating: number,
    public readonly specialties: string[],
    public readonly hourlyRate: number,
    public readonly available: boolean,
    public readonly profilePicture?: string,
    public readonly description?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  // Transform from API response to DTO
  public static fromApiResponse(apiData: CoachApiResponse): CoachDTO {
    return new CoachDTO(
      apiData.id,
      apiData.user_id,
      apiData.full_name,
      apiData.average_rating,
      apiData.specialties,
      apiData.hourly_rate_usd,
      apiData.is_available,
      apiData.profile_image_url,
      apiData.bio_description,
      new Date(apiData.created_at),
      new Date(apiData.updated_at)
    );
  }

  // Transform from DTO to API request
  public toApiRequest(): CoachApiRequest {
    return {
      user_id: this.userId,
      full_name: this.name,
      specialties: this.specialties,
      hourly_rate_usd: this.hourlyRate,
      is_available: this.available,
      profile_image_url: this.profilePicture,
      bio_description: this.description
    };
  }

  // Transform from form data to DTO
  public static fromFormData(formData: any): CoachDTO {
    return new CoachDTO(
      formData.id || '',
      formData.userId,
      formData.name,
      formData.rating || 0,
      formData.specialties || [],
      parseFloat(formData.hourlyRate),
      Boolean(formData.available),
      formData.profilePicture,
      formData.description
    );
  }

  // Helper methods
  public hasSpecialty(specialty: string): boolean {
    return this.specialties.includes(specialty);
  }

  public getFormattedHourlyRate(): string {
    return `$${this.hourlyRate.toFixed(2)}/hr`;
  }

  public isHighlyRated(): boolean {
    return this.rating >= 4.5;
  }
}
