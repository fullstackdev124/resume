import { NextRequest, NextResponse } from "next/server";

// Get account mapping from environment or use default
function getAccountMapping(): Record<string, string[]> {
  const mapping: Record<string, string[]> = {};
  
  // Default: "local" gets all accounts
  // mapping['local'] = ALL_ACCOUNTS;
  
  // Parse account mapping from environment variable
  // Format: USERNAME1=account1,account2;USERNAME2=account3
  const accountMapping = process.env.ACCOUNT_MAPPING || '';
  if (accountMapping) {
    accountMapping.split(';').forEach(mappingStr => {
      const [username, accountsStr] = mappingStr.split('=');
      if (username && accountsStr) {
        const accounts = accountsStr.split(',').map(a => a.trim()).filter(a => a);
        if (accounts.length > 0) {
          mapping[username.trim()] = accounts;
        }
      }
    });
  }
  
  return mapping;
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Get credentials from environment variables
    // Format: USERNAME1=PASSWORD1,USERNAME2=PASSWORD2,...
    const credentials = process.env.USER_CREDENTIALS || '';
    const credentialMap: Record<string, string> = {};
    
    if (credentials) {
      credentials.split(',').forEach(cred => {
        const [user, pass] = cred.split('=');
        if (user && pass) {
          credentialMap[user.trim()] = pass.trim();
        }
      });
    }

    // Check if username exists and password matches
    if (!credentialMap[username] || credentialMap[username] !== password) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Get accounts for this user
    const accountMapping = getAccountMapping();
    const accounts = accountMapping[username] || [];

    if (accounts.length === 0) {
      return NextResponse.json(
        { error: "No accounts mapped for this user" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      username,
      accounts,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred during login",
      },
      { status: 500 }
    );
  }
}
