# Flowfull Client - Complete Authentication Guide

## 📋 Overview

The Flowfull HTTP client provides **comprehensive authentication support** for all Flowless API endpoints. This includes login, registration, password management, social authentication, token-based auth, and session management.

**Key Features:**
- ✅ Email/Username login
- ✅ Public registration
- ✅ Password reset flow (request, validate, complete)
- ✅ Password change (authenticated users)
- ✅ Token-based authentication (passwordless)
- ✅ Social OAuth (Google, GitHub, Facebook, Apple, Discord, Microsoft)
- ✅ Session validation and management
- ✅ Profile management
- ✅ Automatic session handling

---

## 🚀 Quick Start

### Basic Setup

```typescript
import { createFlowfull } from '@pubflow/flowfull-client';

// Create client instance
const api = createFlowfull('https://your-instance.pubflow.com');

// Login
const result = await api.auth.login({
  email: 'user@example.com',
  password: 'SecurePass123!'
});

// Session is automatically stored and used for future requests
const user = await api.auth.me();
```

---

## 🔐 Core Authentication

### 1. Login

Login with email or username and password.

```typescript
// Login with email
const result = await api.auth.login({
  email: 'user@example.com',
  password: 'SecurePass123!'
});

// Login with username
const result = await api.auth.login({
  user_name: 'johndoe',
  password: 'SecurePass123!'
});

// Response
{
  success: true,
  user: {
    id: 'usr_123abc',
    email: 'user@example.com',
    name: 'John',
    last_name: 'Doe',
    user_name: 'johndoe',
    user_type: 'customer',
    picture: 'https://cdn.example.com/pic.jpg',
    phone: '+1234567890',
    is_verified: true,
    two_factor: false,
    created_at: '2025-12-07T10:00:00Z',
    updated_at: '2025-12-07T10:00:00Z'
  },
  session_id: 'ses_xyz789abc123',
  expires_at: '2025-12-15T10:00:00Z'
}
```

**API Endpoint:** `POST /auth/login`  
**Rate Limit:** 5 attempts per 15 minutes  
**Auto-Session:** Session is automatically stored after successful login

---

### 2. Register (Public)

Register a new user account (requires public registration to be enabled).

```typescript
const result = await api.auth.register({
  email: 'newuser@example.com',
  password: 'SecurePass123!',
  name: 'Jane',
  last_name: 'Smith',
  user_name: 'janesmith', // Optional
  phone: '+1234567890',   // Optional
  user_type: 'customer'   // Optional
});

// Response
{
  success: true,
  user: { /* user object */ },
  session_id: 'ses_xyz789abc123',
  expires_at: '2025-12-15T10:00:00Z',
  message: 'Registration successful. Please check your email to verify your account.'
}
```

**API Endpoint:** `POST /auth/register/public`  
**Rate Limit:** 3 attempts per 1 hour  
**Requirements:**
- Email must be unique and valid
- Password minimum 8 characters
- Requires `X-Bridge-Secret` header (automatically added by client)

**Email Verification:**
If `verify_registration` is enabled in AUTH config, users must verify their email before logging in.

---

### 3. Logout

Logout and invalidate the current session.

```typescript
await api.auth.logout();

// Response
{
  success: true,
  message: 'Logged out successfully'
}
```

**API Endpoint:** `POST /auth/logout`  
**Requires:** Active session  
**Auto-Session:** Session is automatically cleared after logout

---

### 4. Get Current User

Get the currently authenticated user's profile.

```typescript
const user = await api.auth.me();

// Response
{
  success: true,
  user: {
    id: 'usr_123abc',
    email: 'user@example.com',
    name: 'John',
    last_name: 'Doe',
    user_name: 'johndoe',
    user_type: 'customer',
    picture: 'https://cdn.example.com/pic.jpg',
    phone: '+1234567890',
    is_verified: true,
    two_factor: false,
    created_at: '2025-12-07T10:00:00Z',
    updated_at: '2025-12-07T10:00:00Z'
  }
}
```

**API Endpoint:** `GET /auth/me`  
**Requires:** Active session

---

## 🔑 Password Management

### 1. Request Password Reset

Request a password reset email.

```typescript
await api.auth.passwordReset.request({
  email: 'user@example.com',
  reset_url: 'https://myapp.com/reset-password' // Optional: custom reset page URL
});

// Response
{
  success: true,
  message: 'If your email is registered, you will receive password reset instructions.'
}
```

**API Endpoint:** `POST /auth/password-reset/request`  
**Rate Limit:** 3 attempts per 1 hour  
**Security:** Always returns success message (prevents email enumeration)

---

### 2. Validate Reset Token

Validate a password reset token (optional step).

```typescript
const result = await api.auth.passwordReset.validate({
  token: 'reset_token_from_email'
});

// Response
{
  success: true,
  valid: true,
  message: 'Token is valid'
}
```

**API Endpoint:** `POST /auth/password-reset/validate`

---

### 3. Complete Password Reset

Complete the password reset with a new password.

```typescript
await api.auth.passwordReset.complete({
  token: 'reset_token_from_email',
  password: 'NewSecurePass123!'
});

// Response
{
  success: true,
  message: 'Password reset successful. You can now login with your new password.'
}
```

**API Endpoint:** `POST /auth/password-reset/complete`  
**Requirements:** Password minimum 8 characters

---

### 4. Change Password (Authenticated)

Change password for the currently logged-in user.

```typescript
await api.auth.passwordChange({
  current_password: 'OldPass123!',
  new_password: 'NewSecurePass123!'
});

// Response
{
  success: true,
  message: 'Password changed successfully'
}
```

**API Endpoint:** `POST /auth/password-change/self`  
**Requires:** Active session  
**Requirements:** Password minimum 8 characters

---

## 📧 Email Verification

### Resend Verification Email

Resend the email verification link.

```typescript
await api.auth.resendVerification({
  email: 'user@example.com'
});

// Response
{
  success: true,
  message: 'Verification email sent successfully'
}
```

**API Endpoint:** `POST /auth/resend-verification`  
**Rate Limit:** 3 attempts per 1 hour

---

## 🎫 Token-Based Authentication

Token-based authentication allows passwordless login via email or SMS.

### 1. Create Token (Request Login Link)

```typescript
// Email token
await api.auth.token.create({
  email: 'user@example.com',
  method: 'email',
  login_url: 'https://myapp.com/verify' // Optional: custom verification page
});

// SMS token
await api.auth.token.create({
  phone: '+1234567890',
  method: 'sms'
});

// Response
{
  success: true,
  message: 'Verification code sent successfully',
  method: 'email',
  expires_in: 600 // seconds (10 minutes)
}
```

**API Endpoint:** `POST /auth/token/login`  
**Rate Limit:** 10 attempts per 10 minutes  
**Methods:** `email` or `sms`  
**Token Expiry:** 10 minutes

---

### 2. Validate Token

Validate the token and login.

```typescript
const result = await api.auth.token.validate({
  token: 'token_from_email_or_sms'
});

// Response
{
  success: true,
  user: { /* user object */ },
  session_id: 'ses_xyz789abc123',
  expires_at: '2025-12-15T10:00:00Z'
}
```

**API Endpoint:** `POST /auth/token/validate` or `GET /auth/token/validate?token=xxx`  
**Rate Limit:** 20 attempts per 5 minutes  
**Auto-Session:** Session is automatically stored after successful validation

---

## 🌐 Social Authentication (OAuth)

Social authentication with Google, GitHub, Facebook, Apple, Discord, and Microsoft.

### 1. Get Available Providers

```typescript
const providers = await api.auth.social.getProviders();

// Response
{
  success: true,
  providers: [
    {
      provider: 'google',
      enabled: true,
      loginUrl: '/auth/social/google/login',
      apiLoginUrl: '/auth/social/google/login-api'
    },
    {
      provider: 'github',
      enabled: true,
      loginUrl: '/auth/social/github/login',
      apiLoginUrl: '/auth/social/github/login-api'
    }
  ]
}
```

**API Endpoint:** `GET /auth/social/providers`

---

### 2. Start OAuth Flow (Web)

For web applications, redirect to the OAuth URL:

```typescript
// Redirect to Google OAuth
window.location.href = `${api.baseUrl}/auth/social/google/login`;

// Or use the helper
api.auth.social.startOAuth('google');
```

**API Endpoint:** `GET /auth/social/{provider}/login`  
**Providers:** `google`, `github`, `facebook`, `apple`, `discord`, `microsoft`  
**Flow:** Redirects to provider → User authorizes → Redirects back to callback → Session created

---

### 3. API-Based Social Login (Mobile)

For mobile apps, use the API-based flow:

```typescript
const result = await api.auth.social.loginApi('google', {
  access_token: 'google_access_token_from_sdk'
});

// Response
{
  success: true,
  user: { /* user object */ },
  session_id: 'ses_xyz789abc123',
  expires_at: '2025-12-15T10:00:00Z',
  is_new_user: false
}
```

**API Endpoint:** `POST /auth/social/{provider}/login-api`  
**Rate Limit:** 20 attempts per 10 minutes  
**Use Case:** Mobile apps with native OAuth SDKs

---

### 4. Get Linked Social Accounts

```typescript
const accounts = await api.auth.social.getAccounts();

// Response
{
  success: true,
  accounts: [
    {
      provider: 'google',
      provider_user_id: '1234567890',
      email: 'user@gmail.com',
      linked_at: '2025-12-07T10:00:00Z'
    }
  ]
}
```

**API Endpoint:** `GET /auth/social/accounts`  
**Requires:** Active session

---

### 5. Unlink Social Account

```typescript
await api.auth.social.unlink('google');

// Response
{
  success: true,
  message: 'Google account unlinked successfully'
}
```

**API Endpoint:** `DELETE /auth/social/accounts/{provider}`  
**Requires:** Active session

---

## ✅ Session Validation

### 1. Validate Current Session

```typescript
const result = await api.auth.validateSession();

// Response
{
  success: true,
  valid: true,
  user: { /* user object */ },
  session: {
    id: 'ses_xyz789abc123',
    expires_at: '2025-12-15T10:00:00Z',
    ip_address: '192.168.1.1',
    user_agent: 'Mozilla/5.0...'
  }
}
```

**API Endpoint:** `GET /auth/validation`  
**Requires:** Active session

---

### 2. Bridge Validation (Backend Integration)

For backend-to-backend session validation:

```typescript
const result = await api.auth.bridgeValidate({
  session_id: 'ses_xyz789abc123'
});

// Response
{
  success: true,
  valid: true,
  user: { /* user object */ },
  session: { /* session object */ }
}
```

**API Endpoint:** `POST /auth/bridge/validate`  
**Requires:** `X-Bridge-Secret` header (automatically added)

---

## 👤 Profile Management

### 1. Update Profile

```typescript
await api.auth.updateProfile({
  name: 'Jane',
  last_name: 'Doe',
  phone: '+1234567890',
  user_type: 'premium'
});

// Response
{
  success: true,
  user: { /* updated user object */ }
}
```

**API Endpoint:** `PUT /auth/profile`  
**Requires:** Active session

---

### 2. Upload Profile Picture

```typescript
const formData = new FormData();
formData.append('picture', fileInput.files[0]);

await api.auth.uploadPicture(formData);

// Response
{
  success: true,
  picture_url: 'https://storage.pubflow.com/users/usr_123/picture.jpg',
  user: { /* updated user object */ }
}
```

**API Endpoint:** `POST /auth/upload/picture`  
**Requires:** Active session  
**Formats:** JPG, PNG, GIF, WEBP  
**Max Size:** 5MB

---

### 3. Delete Profile Picture

```typescript
await api.auth.deletePicture();

// Response
{
  success: true,
  message: 'Profile picture deleted successfully',
  user: { /* updated user object */ }
}
```

**API Endpoint:** `DELETE /auth/upload/picture`  
**Requires:** Active session

---

## 🔧 Implementation Details

### Authentication Helper Class

The client provides an `AuthHelper` class with all authentication methods:

```typescript
class AuthHelper {
  // Core auth
  login(credentials: LoginCredentials): Promise<LoginResult>
  register(data: RegisterData): Promise<RegisterResult>
  logout(): Promise<void>
  me(): Promise<User>
  
  // Password management
  passwordReset: {
    request(data: PasswordResetRequest): Promise<void>
    validate(data: TokenValidation): Promise<ValidationResult>
    complete(data: PasswordResetComplete): Promise<void>
  }
  passwordChange(data: PasswordChange): Promise<void>
  
  // Email verification
  resendVerification(data: ResendVerification): Promise<void>
  
  // Token auth
  token: {
    create(data: TokenCreate): Promise<TokenCreateResult>
    validate(data: TokenValidation): Promise<LoginResult>
  }
  
  // Social auth
  social: {
    getProviders(): Promise<ProvidersResult>
    startOAuth(provider: SocialProvider): void
    loginApi(provider: SocialProvider, data: SocialLoginData): Promise<LoginResult>
    getAccounts(): Promise<SocialAccountsResult>
    unlink(provider: SocialProvider): Promise<void>
  }
  
  // Session validation
  validateSession(): Promise<SessionValidationResult>
  bridgeValidate(data: BridgeValidation): Promise<SessionValidationResult>
  
  // Profile management
  updateProfile(data: ProfileUpdate): Promise<User>
  uploadPicture(formData: FormData): Promise<PictureUploadResult>
  deletePicture(): Promise<void>
}
```

---

## 📊 Rate Limits

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| Login | 5 attempts | 15 minutes |
| Registration | 3 attempts | 1 hour |
| Password Reset | 3 attempts | 1 hour |
| Token Login | 10 attempts | 10 minutes |
| Token Validate | 20 attempts | 5 minutes |
| Social Login | 10 attempts | 15 minutes |
| Social API | 20 attempts | 10 minutes |

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 1733570460
```

---

## 🎯 Common Response Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `400` | Bad Request - Invalid input or validation failed |
| `401` | Unauthorized - Invalid or missing authentication |
| `403` | Forbidden - Insufficient permissions or email not verified |
| `404` | Not Found - Resource doesn't exist |
| `429` | Too Many Requests - Rate limit exceeded |
| `500` | Internal Server Error |
| `503` | Service Unavailable - Feature not configured |

---

## 🔒 Security Best Practices

1. **Always use HTTPS** in production
2. **Store sessions securely** (httpOnly cookies or secure storage)
3. **Validate sessions** before sensitive operations
4. **Handle rate limits** gracefully
5. **Never log passwords** or sensitive data
6. **Use strong passwords** (minimum 8 characters)
7. **Enable email verification** for production
8. **Implement CSRF protection** for web apps
9. **Use social OAuth** for better UX and security
10. **Rotate sessions** after password changes

---

## 📚 Next Steps

- [**Getting Started**](./getting-started.md) - Setup and basic usage
- [**Query Builder**](./query-builder.md) - Advanced querying
- [**Session Management**](./session-management.md) - Session handling
- [**Error Handling**](./error-handling.md) - Error handling patterns

---

**Status**: ✅ Complete Authentication Support  
**API Version**: 1.0.0  
**Last Updated**: 2025-12-13

