# Login Troubleshooting Guide

## Issue: Cannot Login After Entering Credentials

I've updated the login page to show detailed error messages. Here's how to diagnose the issue:

## Steps to Debug

### 1. Open Browser Developer Console
- Press `F12` or `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (Mac)
- Go to the **Console** tab

### 2. Try to Login
- Enter your credentials
- Click "Sign In"
- Watch the console for messages

### 3. Check Console Output

You should see logs like:
```
Attempting login with: { UserId: "your-user-id" }
```

Then one of these:
- **Success**: `Login response: { token: "...", user: {...} }`
- **Error**: `Login error details: ...`

## Common Issues and Solutions

### Issue 1: CORS Error
**Console shows**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
- The backend API needs to allow requests from `http://localhost:3000`
- Contact backend team to add CORS headers
- Or use a proxy in `next.config.mjs`

### Issue 2: Network Error
**Console shows**: `Network Error` or `ERR_CONNECTION_REFUSED`

**Solution**:
- Check if the backend API is running
- Verify the API URL: `https://orthosquareportal.com/ManagementApi`
- Try accessing the API in browser: `https://orthosquareportal.com/ManagementApi/api/Auth/Login`

### Issue 3: Invalid Credentials
**Console shows**: `Error status: 401` or `Error status: 403`

**Solution**:
- Double-check your username and password
- Verify credentials with the backend team
- Ensure account is active

### Issue 4: Wrong API Response Format
**Console shows**: `Login response:` but no redirect happens

**Solution**:
Check if the response has this structure:
```json
{
  "token": "your-jwt-token",
  "user": {
    "UserId": "USER001",
    "UserName": "Your Name",
    "RoleId": 1,
    "RoleName": "Administrator"
  }
}
```

If the format is different, we need to adjust the code.

## API Configuration

The app connects to:
```
Base URL: https://orthosquareportal.com/ManagementApi
Login Endpoint: /api/Auth/Login
Method: POST
Payload: { UserId: "xxx", UserPassword: "xxx" }
```

## Testing the API Directly

You can test if the API is working using curl or Postman:

### Using curl:
```bash
curl -X POST https://orthosquareportal.com/ManagementApi/api/Auth/Login \
  -H "Content-Type: application/json" \
  -d '{"UserId":"your-user-id","UserPassword":"your-password"}'
```

### Using Postman:
1. Create POST request to: `https://orthosquareportal.com/ManagementApi/api/Auth/Login`
2. Set Header: `Content-Type: application/json`
3. Set Body (raw JSON):
   ```json
   {
     "UserId": "your-user-id",
     "UserPassword": "your-password"
   }
   ```

## Next Steps

1. **Try logging in** and check the console
2. **Share the console error messages** with me
3. I can then:
   - Adjust the API call format
   - Fix the response handling
   - Add proxy configuration if needed
   - Modify the authentication flow

## Common Console Messages Explained

| Console Message | Meaning | Action |
|----------------|---------|--------|
| `Attempting login with: ...` | Login initiated | Normal |
| `Login response: ...` | API returned data | Check if token and user exist |
| `User stored, redirecting...` | Login successful | Should redirect now |
| `Login error details: ...` | API call failed | Check error message |
| `Error status: 401` | Invalid credentials | Check username/password |
| `Error status: 404` | API endpoint not found | Check API URL |
| `Error status: 500` | Server error | Backend issue |
| `Network Error` | Cannot reach API | Check internet/API status |

## File Locations

If we need to modify the authentication:
- Login Page: `app/page.js`
- Auth API: `api/auth.js`
- Axios Config: `lib/axiosClient.js`
- Auth Store: `store/slices/authSlice.js`

## Getting Help

After trying to login:
1. Copy the error messages from the console
2. Share them with me
3. I'll provide a specific fix

The detailed logging I added will help us identify exactly where the issue is.
