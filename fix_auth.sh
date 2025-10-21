#!/bin/bash

# List of files to fix
files=(
    "deposits-2022.html"
    "deposits-2023.html" 
    "deposits-2024.html"
    "deposits-2025.html"
    "loans-2021.html"
    "loans-2022.html"
    "loans-2023.html"
    "loans-2024.html"
    "loans-2025.html"
)

# Function to fix authentication
fix_auth() {
    local file="$1"
    echo "Fixing authentication in $file"
    
    # Replace old authentication with new
    sed -i '' 's|<script>|    <script src="js/auth-utils.js"></script>\
    <script>|g' "$file"
    
    sed -i '' 's|if (!sessionStorage.getItem('\''isAuthenticated'\'')) {|        (function() {\
            // Use new AuthUtils for session validation\
            if (window.AuthUtils && window.AuthUtils.isSessionValid()) {\
                // Session is valid, continue\
                return;\
            } else {\
                // Clear all session data\
                sessionStorage.clear();\
                sessionStorage.setItem('\''returnUrl'\'', window.location.href);\
                window.location.href = '\''login.html'\'';\
            }\
        })();\
    </script>\
\
    <script>\
        // Logout function\
        function logout() {\
            if (confirm('\''Are you sure you want to logout?'\'')) {\
                // Clear all session data\
                sessionStorage.clear();\
                localStorage.clear();\
                \
                // Redirect to login page\
                window.location.href = '\''login.html'\'';\
            }\
        }\
\
        // Show user header if logged in\
        document.addEventListener('\''DOMContentLoaded'\'', function() {\
            const userDetails = JSON.parse(sessionStorage.getItem('\''userDetails'\'') || localStorage.getItem('\''userDetails'\'') || '\''{}'\'');\
            const userHeaderInfo = document.getElementById('\''userHeaderInfo'\'');\
            const headerUserName = document.getElementById('\''headerUserName'\'');\
            const headerUserRole = document.getElementById('\''headerUserRole'\'');\
            \
            if (userDetails && userDetails.name) {\
                userHeaderInfo.style.display = '\''flex'\'';\
                headerUserName.textContent = userDetails.name;\
                headerUserRole.textContent = userDetails.name === '\''President'\'' ? '\''President'\'' : '\''Member'\'';\
                console.log('\''User header displayed for:'\'', userDetails.name);\
            }\
        });|g' "$file"
    
    # Add logout button to navigation
    sed -i '' 's|</li>\
        </ul>|</li>\
                <li><a href="#" onclick="logout()" style="color: #e74c3c; font-weight: bold;"><i class="fas fa-sign-out-alt"></i> Logout</a></li>\
            </ul>|g' "$file"
}

# Fix all files
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        fix_auth "$file"
    else
        echo "File $file not found"
    fi
done

echo "Authentication fix completed for all files"


