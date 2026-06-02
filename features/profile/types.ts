export type UpdateProfileInput = {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string | null;
  latitude?: number;
  longitude?: number;
  placeName?: string;
  city?: string | null;
  avatarUri?: string | null;
  removeAvatar?: boolean;
};

export type UpdateInterestsInput = {
  interestIds: number[];
};
