#!/bin/bash

# Variables
# URL of the backend API
BASE_URL="http://localhost:3000/api"
REGISTER_URL="$BASE_URL/users/register"
LOGIN_URL="$BASE_URL/users/login"

# User 1
USERNAME1="testuser1"
EMAIL1="testuser_1@example.com"
PASSWORD1="password123"
TOKEN1=""
# User 2
USERNAME2="testuser2"
EMAIL2="testuser_2@example.com"
PASSWORD2="password123"
TOKEN2=""
# User 3
USERNAME3="testuser3"
EMAIL3="testuser_3@example.com"
PASSWORD3="password123"
TOKEN3=""

# Function to print test results
print_result() {
  if [ $1 -eq 200 ] || [ $1 -eq 201 ]; then
    echo "✅ $2: Success"
  else
    echo "❌ $2: Failed (HTTP $1)"
    echo "Response: $3"
  fi
}

# Test cases for user registration
echo "===================================================="
echo ""
echo "Test cases for user registration"
echo ""
echo "===================================================="
echo "Testing user registration for User 1..."
REGISTER_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$REGISTER_URL" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$USERNAME1\", \"email\": \"$EMAIL1\", \"password\": \"$PASSWORD1\"}")
REGISTER_BODY=$(echo "$REGISTER_RESPONSE" | head -n -1)
REGISTER_STATUS=$(echo "$REGISTER_RESPONSE" | tail -n 1)
print_result $REGISTER_STATUS "User Registration (User 1)" "$REGISTER_BODY"
echo "===================================================="

echo "Testing user registration for User 2..."
REGISTER_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$REGISTER_URL" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$USERNAME2\", \"email\": \"$EMAIL2\", \"password\": \"$PASSWORD2\"}")
REGISTER_BODY=$(echo "$REGISTER_RESPONSE" | head -n -1)
REGISTER_STATUS=$(echo "$REGISTER_RESPONSE" | tail -n 1)
print_result $REGISTER_STATUS "User Registration (User 2)" "$REGISTER_BODY"
echo "===================================================="

echo "Testing user registration for User 3..."
REGISTER_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$REGISTER_URL" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$USERNAME3\", \"email\": \"$EMAIL3\", \"password\": \"$PASSWORD3\"}")
REGISTER_BODY=$(echo "$REGISTER_RESPONSE" | head -n -1)
REGISTER_STATUS=$(echo "$REGISTER_RESPONSE" | tail -n 1)
print_result $REGISTER_STATUS "User Registration (User 3)" "$REGISTER_BODY"
echo "===================================================="

# Test cases for user registration errors
echo "Testing user registration for User 1 with existing username..."
REGISTER_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$REGISTER_URL" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$USERNAME1\", \"email\": \"$EMAIL1\", \"password\": \"$PASSWORD1\"}")
REGISTER_BODY=$(echo "$REGISTER_RESPONSE" | head -n -1)
REGISTER_STATUS=$(echo "$REGISTER_RESPONSE" | tail -n 1)
print_result $REGISTER_STATUS "User Registration (User 1 - Existing Username)" "$REGISTER_BODY"
echo "===================================================="

echo "Testing user registration for User 2 with existing email..."
REGISTER_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$REGISTER_URL" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"newuser\", \"email\": \"$EMAIL2\", \"password\": \"newpassword\"}")
REGISTER_BODY=$(echo "$REGISTER_RESPONSE" | head -n -1)
REGISTER_STATUS=$(echo "$REGISTER_RESPONSE" | tail -n 1)
print_result $REGISTER_STATUS "User Registration (User 2 - Existing Email)" "$REGISTER_BODY"
echo "===================================================="

echo "Testing user registration for User 3 with empty fields..."
REGISTER_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$REGISTER_URL" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"\", \"email\": \"\", \"password\": \"\"}")
REGISTER_BODY=$(echo "$REGISTER_RESPONSE" | head -n -1)
REGISTER_STATUS=$(echo "$REGISTER_RESPONSE" | tail -n 1)
print_result $REGISTER_STATUS "User Registration (User 3 - Empty Fields)" "$REGISTER_BODY"


# Test cases for user login
echo "===================================================="
echo ""
echo "Test cases for user login"
echo ""
echo "===================================================="
echo "Testing user login for User 1..."
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$LOGIN_URL" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$USERNAME1\", \"password\": \"$PASSWORD1\"}")
LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | head -n -1)
LOGIN_STATUS=$(echo "$LOGIN_RESPONSE" | tail -n 1)
TOKEN1=$(echo "$LOGIN_BODY" | jq -r ".token")
print_result $LOGIN_STATUS "User Login (User 1)" "$LOGIN_BODY"
echo "===================================================="

echo "Testing user login for User 2..."
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$LOGIN_URL" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$USERNAME2\", \"password\": \"$PASSWORD2\"}")
LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | head -n -1)
LOGIN_STATUS=$(echo "$LOGIN_RESPONSE" | tail -n 1)
TOKEN2=$(echo "$LOGIN_BODY" | jq -r ".token")
print_result $LOGIN_STATUS "User Login (User 2)" "$LOGIN_BODY"
echo "===================================================="

echo "Testing user login for User 3..."
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$LOGIN_URL" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$USERNAME3\", \"password\": \"$PASSWORD3\"}")
LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | head -n -1)
LOGIN_STATUS=$(echo "$LOGIN_RESPONSE" | tail -n 1)
TOKEN3=$(echo "$LOGIN_BODY" | jq -r ".token")
print_result $LOGIN_STATUS "User Login (User 3)" "$LOGIN_BODY"
echo "===================================================="

# Test cases for user login errors
echo "Testing user login for User 1 with incorrect password..."
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$LOGIN_URL" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$USERNAME1\", \"password\": \"wrongpassword\"}")
LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | head -n -1)
LOGIN_STATUS=$(echo "$LOGIN_RESPONSE" | tail -n 1)
print_result $LOGIN_STATUS "User Login (User 1 - Incorrect Password)" "$LOGIN_BODY"
echo "===================================================="

echo "Testing user login for User 2 with non-existent username..."
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$LOGIN_URL" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"nonexistentuser\", \"password\": \"$PASSWORD2\"}")
LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | head -n -1)
LOGIN_STATUS=$(echo "$LOGIN_RESPONSE" | tail -n 1)
print_result $LOGIN_STATUS "User Login (User 2 - Non-existent Username)" "$LOGIN_BODY"
echo "===================================================="

echo "Testing user login for User 3 with empty fields..."
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$LOGIN_URL" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"\", \"password\": \"\"}")
LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | head -n -1)
LOGIN_STATUS=$(echo "$LOGIN_RESPONSE" | tail -n 1)
print_result $LOGIN_STATUS "User Login (User 3 - Empty Fields)" "$LOGIN_BODY"
echo "===================================================="

echo "All tests completed."