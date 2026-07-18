# TheWrker - Complete User Flow Documentation

## Overview
This document outlines the complete user flow from signup through authentication to dashboard access, including what's currently implemented and what's missing.

---

## 🔄 **Complete User Flow**

### **1. Landing Page → Role Selection**
**Flow:**
- User visits `/` (home page)
- Clicks "Get Started Free" → redirects to `/register`
- On `/register`, user selects role: Trainee, Talent, or Recruiter
- Redirects to role-specific onboarding: `/register/trainee`, `/register/talent`, or `/register/recruiter`

**Status:** ✅ **COMPLETE**

---

### **2. Onboarding Process (Multi-Step Forms)**

#### **Trainee Onboarding** (`/register/trainee`)
**Steps:**
1. Basic Profile (firstName, lastName, email, password, country, preferredLanguage)
2. Career Intent (desiredRole: va, csr, sales)
3. Availability (weeklyAvailability, preferredWorkType, targetStartDate)
4. Background (remoteExperience, comfortableWith[], backgroundNote)
5. Learning Preferences (learningStyle[], learningSpeed)
6. Goals & Motivation (motivation, successVision)

**Features:**
- ✅ Progress indicator
- ✅ Auto-save to localStorage
- ✅ Step validation
- ✅ Multi-step navigation

**Status:** ✅ **UI COMPLETE** | ⚠️ **Data saving needs work**

---

#### **Talent Onboarding** (`/register/talent`)
**Steps:**
1. Identity (firstName, lastName, email, password, linkedinUrl, portfolioUrl)
2. Professional Summary (primaryRole, yearsExperience, summary)
3. Skills & Tools (coreSkills{}, secondarySkills[])
4. Resume Import (importSource: upload/linkedin/manual)
5. Availability & Preferences (weeklyAvailability, contractType, payExpectations)
6. Verification Path (verificationPath: assessment/proof/certification)

**Features:**
- ✅ Progress indicator
- ✅ Auto-save to localStorage
- ✅ Step validation

**Status:** ✅ **UI COMPLETE** | ⚠️ **Data saving needs work**

---

#### **Recruiter Onboarding** (`/register/recruiter`)
**Steps:**
1. Company Info (companyName, website, industry, companySize, hiringRegions[])
2. Recruiter Profile (fullName, workEmail, roleTitle, hiringAuthority)
3. Hiring Needs (rolesHiringFor[], skillPriorities[], requiredBadges[], experienceLevel)
4. Volume & Speed (expectedHiresPerMonth, urgency, interviewAvailability)
5. Work Style & Culture (teamSize, workExpectations, communicationStyle)
6. Matching Preferences (autoRecommend, enableSwipe, allowTrainees)

**Features:**
- ✅ Progress indicator
- ✅ Auto-save to localStorage
- ✅ Step validation

**Status:** ✅ **UI COMPLETE** | ⚠️ **Data saving needs work**

---

### **3. Registration API Call**

**Endpoint:** `POST /api/auth/register`

**Current Implementation:**
```typescript
{
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: "TRAINEE" | "TALENT" | "RECRUITER",
  onboardingData?: object  // ❌ NOT CURRENTLY SAVED
}
```

**What Happens:**
1. ✅ Validates required fields
2. ✅ Checks for duplicate email
3. ✅ Hashes password
4. ✅ Creates User in database
5. ✅ Creates Profile for TRAINEE/TALENT
6. ✅ Generates JWT tokens (accessToken, refreshToken)
7. ✅ Returns accessToken in response
8. ✅ Sets refreshToken as HTTP-only cookie

**Issues:**
- ❌ `onboardingData` is received but **NOT SAVED** to database
- ❌ Profile fields not populated with onboarding data
- ⚠️ Recruiter registration uses temporary password (`temp-password-${Date.now()}`)

**Status:** ⚠️ **PARTIALLY COMPLETE** - Basic registration works, but onboarding data is lost

---

### **4. Auto-Login After Registration**

**Flow:**
1. Onboarding form calls `/api/auth/register`
2. Receives `accessToken` in response
3. Stores token in `localStorage.setItem("accessToken", token)`
4. Redirects to role-specific dashboard:
   - Trainee → `/dashboard/trainee`
   - Talent → `/dashboard/talent`
   - Recruiter → `/dashboard/recruiter`

**Status:** ✅ **COMPLETE**

---

### **5. Login Flow** (`/login`)

**Flow:**
1. User enters email and password
2. Calls `POST /api/auth/login`
3. API validates credentials
4. Returns `accessToken` and user data
5. Stores token in localStorage
6. Redirects to `/dashboard/{role}`

**Status:** ✅ **COMPLETE**

---

### **6. Dashboard Access & Authentication**

**Route Protection:** `/app/(dashboard)/layout.tsx`

**Flow:**
1. User navigates to any `/dashboard/*` route
2. DashboardLayout component mounts
3. Checks for `accessToken` in localStorage
4. If no token → redirects to `/login`
5. If token exists → calls `GET /api/auth/me` with `Authorization: Bearer {token}`
6. If API returns user → renders dashboard
7. If API fails → redirects to `/login`

**Status:** ✅ **COMPLETE**

---

## 🔴 **What's Missing to Make It Work**

### **CRITICAL - Must Fix:**

#### **1. Save Onboarding Data to Database** ⚠️
**Problem:** Onboarding form data is collected but never saved to the database.

**Required Changes:**
- Update `/api/auth/register` to save `onboardingData` to Profile or User table
- Create Profile fields that map to onboarding data
- For Recruiters, might need a Company model or store in User/Profile JSON fields

**Files to Update:**
- `app/api/auth/register/route.ts`
- `prisma/schema.prisma` (if new fields needed)

---

#### **2. Recruiter Password Handling** ⚠️
**Problem:** Recruiter registration uses temporary password:
```typescript
password: "temp-password-" + Date.now()
```

**Required Changes:**
- Add password field to recruiter onboarding form (Step 1 or Step 2)
- OR implement password setup flow after registration
- OR send password via email (requires email service)

---

#### **3. Environment Variables** ⚠️
**Problem:** Missing `.env` file with required secrets.

**Required:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/thewrker?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Action:** Create `.env` file in root directory

---

#### **4. Database Setup** ⚠️
**Problem:** Database might not be initialized.

**Required Steps:**
1. Install PostgreSQL
2. Create database: `CREATE DATABASE thewrker;`
3. Run Prisma migrations: `npx prisma migrate dev --name init`
4. Generate Prisma client: `npx prisma generate`

---

### **IMPORTANT - Should Add:**

#### **5. Onboarding Data API Endpoint** 📝
**Problem:** No way to update/save onboarding data after initial registration.

**Suggestion:**
Create `PUT /api/auth/onboarding` endpoint to:
- Save onboarding data after user is created
- Update Profile with onboarding fields
- Handle partial updates

---

#### **6. Error Handling in Registration** 📝
**Problem:** Registration forms don't show API errors properly.

**Current:** Only logs to console
**Should:** Display error messages to user

---

#### **7. Profile Data Mapping** 📝
**Problem:** Database Profile model uses JSON fields, but onboarding data structure needs to be mapped.

**Example Mapping Needed:**
```typescript
// Trainee onboarding → Profile
availability: {
  hoursPerWeek: formData.weeklyAvailability,
  preferredWorkType: formData.preferredWorkType,
  timezone: formData.timezone,
  targetStartDate: formData.targetStartDate
}

skillScores: {
  // Initialize based on desiredRole
}

// Talent onboarding → Profile
skillScores: {
  // Map from formData.coreSkills
  "customer_support": formData.coreSkills["Customer Support"] || 0,
  ...
}

workExperience: formData.summary ? [{ summary: formData.summary }] : []
```

---

#### **8. Refresh Token Handling** 📝
**Problem:** Access tokens expire in 15 minutes, but no refresh mechanism implemented on client.

**Required:**
- Create `POST /api/auth/refresh` endpoint
- Implement token refresh logic in DashboardLayout
- Handle token expiration gracefully

---

#### **9. Logout Flow** 📝
**Problem:** Logout only clears localStorage, doesn't invalidate refresh token cookie.

**Current:** `localStorage.removeItem("accessToken")`
**Should:** Call logout API to invalidate refresh token

---

### **NICE TO HAVE:**

#### **10. Email Verification** 💡
- Add `isVerified` workflow
- Send verification email on registration
- Verify email endpoint

#### **11. Password Reset Flow** 💡
- Forgot password functionality
- Password reset email
- Reset password endpoint

#### **12. Social Login** 💡
- Google OAuth integration
- LinkedIn OAuth integration
- Store social auth tokens

---

## 📋 **Step-by-Step Setup Checklist**

### **Initial Setup:**
- [ ] Install Node.js 18+
- [ ] Install PostgreSQL
- [ ] Create `.env` file with required variables
- [ ] Run `npm install`
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma migrate dev --name init`
- [ ] Verify database connection

### **Testing Registration Flow:**
- [ ] Test Trainee registration → Check if user created in DB
- [ ] Test Talent registration → Check if user and profile created
- [ ] Test Recruiter registration → Fix password issue
- [ ] Verify onboarding data is saved (once implemented)
- [ ] Test auto-login redirects to correct dashboard

### **Testing Authentication:**
- [ ] Test login with valid credentials
- [ ] Test login with invalid credentials
- [ ] Test protected routes (should redirect if no token)
- [ ] Test token expiration handling
- [ ] Test logout functionality

### **Testing Dashboard:**
- [ ] Test dashboard loads with valid token
- [ ] Test dashboard redirects without token
- [ ] Verify user data displays correctly
- [ ] Test role-based navigation

---

## 🔧 **Quick Fixes Needed (Priority Order)**

1. **Create `.env` file** - Without this, app won't run
2. **Setup database** - Run migrations
3. **Fix onboarding data saving** - Critical for user experience
4. **Fix recruiter password** - Add password field to form
5. **Add error handling** - Show errors to users
6. **Implement token refresh** - Handle token expiration

---

## 📊 **Current Status Summary**

| Component | Status | Notes |
|-----------|--------|-------|
| UI/UX Design | ✅ Complete | Beautiful, responsive, mobile-optimized |
| Registration Forms | ✅ Complete | All 3 roles with multi-step flows |
| Login Page | ✅ Complete | Clean design matching signup |
| Authentication API | ✅ Complete | Login, Register, Me endpoints work |
| Dashboard Layout | ✅ Complete | Role-based navigation, auth check |
| Database Schema | ✅ Complete | Well-designed Prisma schema |
| Onboarding Data Save | ❌ Missing | Data collected but not persisted |
| Error Handling | ⚠️ Basic | Needs improvement |
| Token Refresh | ❌ Missing | No refresh mechanism |
| Environment Setup | ❌ Missing | Need .env file |

---

## 🚀 **Next Immediate Steps**

1. Create `.env` file with database URL and JWT secrets
2. Run database migrations
3. Implement onboarding data saving in register API
4. Add password field to recruiter onboarding
5. Test complete flow end-to-end
6. Add proper error handling and user feedback

