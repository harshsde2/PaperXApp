# API Service Documentation

## Overview

This directory contains all API-related services using **TanStack Query (React Query)** for data fetching and **Axios** for HTTP requests.

## Architecture

```
api/
├── client.ts          # Axios instance with interceptors
├── queryClient.ts     # React Query QueryClient configuration
├── types.ts           # TypeScript type definitions
├── authApi.ts         # Authentication API hooks
└── index.ts           # Barrel exports
```

## Usage Examples

### 1. Using API Hooks (Recommended)

```typescript
import { useSendOTP, useVerifyOTP } from '@services/api';

const LoginScreen = () => {
  const sendOTPMutation = useSendOTP();
  const verifyOTPMutation = useVerifyOTP();

  const handleSendOTP = async () => {
    try {
      await sendOTPMutation.mutateAsync({
        mobile: '1234567890',
        purpose: 'login',
      });
      // OTP sent successfully
    } catch (error) {
      // Handle error
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    try {
      await verifyOTPMutation.mutateAsync({
        mobile: '1234567890',
        otp,
        purpose: 'login',
      });
      // OTP verified, user logged in
    } catch (error) {
      // Handle error
    }
  };

  return (
    // Your component JSX
  );
};
```

### 2. Creating Custom Query Hooks

```typescript
import { useQuery } from '@tanstack/react-query';
import { api } from '@services/api/client';
import { queryKeys } from '@services/api/queryClient';
import { USER_ENDPOINTS } from '@shared/constants/api';

export const useUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: async () => {
      const response = await api.get(USER_ENDPOINTS.PROFILE);
      return response.data.data;
    },
    enabled: true, // Only run if conditions are met
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### 3. Creating Custom Mutation Hooks

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@services/api/client';
import { queryKeys } from '@services/api/queryClient';
import { POST_ENDPOINTS } from '@shared/constants/api';

interface CreatePostRequest {
  title: string;
  description: string;
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostRequest) => {
      const response = await api.post(POST_ENDPOINTS.CREATE, data);
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate and refetch posts list
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
    },
    onError: (error) => {
      console.error('Create post error:', error);
    },
  });
};
```

### 4. Direct API Calls (If needed)

```typescript
import { api } from '@services/api/client';
import { USER_ENDPOINTS } from '@shared/constants/api';

// In a function or effect
const fetchUserProfile = async () => {
  try {
    const response = await api.get(USER_ENDPOINTS.PROFILE);
    const userData = response.data.data;
    return userData;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};
```

## API Client Features

### Request Interceptor
- Automatically adds `Authorization` header with Bearer token
- Adds `X-Request-ID` header for request tracking
- Logs requests in development mode

### Response Interceptor
- Transforms API responses
- Handles 401 errors and token refresh (when implemented)
- Logs responses in development mode
- Provides consistent error handling

### Error Handling
- Network errors
- HTTP status errors (400, 401, 403, 404, etc.)
- API-level errors (success: false responses)
- Token expiration and refresh

## Query Keys Organization

Query keys are organized using a factory pattern for better maintainability:

```typescript
queryKeys.posts.list({ page: 1, status: 'active' })
// Returns: ['posts', 'list', { page: 1, status: 'active' }]

queryKeys.posts.detail('post_123')
// Returns: ['posts', 'detail', 'post_123']
```

## Best Practices

1. **Always use typed hooks** - Get full TypeScript support
2. **Use query keys factory** - Consistent and maintainable
3. **Invalidate queries on mutations** - Keep data fresh
4. **Handle loading and error states** - Better UX
5. **Use optimistic updates** - For better perceived performance
6. **Set appropriate stale times** - Balance freshness and performance

## Example: Complete Feature API Service

```typescript
// src/services/api/postsApi.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './client';
import { queryKeys } from './queryClient';
import { POST_ENDPOINTS } from '@shared/constants/api';
import type { PaginationParams } from './types';

interface Post {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface CreatePostRequest {
  title: string;
  description: string;
}

// Query: Get posts list
export const usePosts = (params?: PaginationParams) => {
  return useQuery({
    queryKey: queryKeys.posts.list(params),
    queryFn: async () => {
      const response = await api.get<Post[]>(POST_ENDPOINTS.LIST, { params });
      return response.data.data;
    },
  });
};

// Query: Get single post
export const usePost = (id: string) => {
  return useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: async () => {
      const response = await api.get<Post>(POST_ENDPOINTS.DETAIL(id));
      return response.data.data;
    },
    enabled: !!id, // Only run if id exists
  });
};

// Mutation: Create post
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostRequest): Promise<Post> => {
      const response = await api.post<Post>(POST_ENDPOINTS.CREATE, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
    },
  });
};

// Mutation: Update post
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreatePostRequest> }): Promise<Post> => {
      const response = await api.patch<Post>(POST_ENDPOINTS.UPDATE(id), data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
    },
  });
};

// Mutation: Delete post
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(POST_ENDPOINTS.DELETE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
    },
  });
};
```

## Integration with Redux

Both React Query and Redux work together:

- **React Query**: Server state (API data, caching, refetching)
- **Redux**: Client state (UI state, user preferences, local data)

When API calls succeed, you can update Redux:

```typescript
onSuccess: (data) => {
  // Update Redux state
  dispatch(setUserData(data));
  
  // Invalidate React Query cache
  queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
}
```

