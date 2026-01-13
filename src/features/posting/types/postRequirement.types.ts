export type PostRequirementOption = 
  | 'post-to-buy-material'
  | 'post-to-sell-material'
  | 'post-to-sell-machine'
  | 'post-to-buy-machine'
  | 'post-to-find-jobwork'
  | 'post-to-give-jobwork'
  | 'post-regular-product-design';

export interface PostRequirementOptionConfig {
  id: PostRequirementOption;
  title: string;
  description: string;
  icon?: string;
}

export type UserRole = 'dealer' | 'machine-dealer' | 'converter' | 'brand';
