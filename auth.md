# Authorization Overview

Bulky uses the Authorization Code Flow with PKCE. The server will store the refresh token, while the access token will be kept in memory in the client. Once the client receives the GGG token response, it should create a hash from it and then send this hash along with the refresh token to the server. This hash may be stored in local storage in the client. The server will use the hash as the key and only return the refresh token if this key is provided in the request.

Why not just take the access token? A request to retrieve the refresh token should only be made once the access token is invalid. Most of the time that should mean that it's expired. This means that this endpoint would not always receive a valid token. Skipping the expiration check means the token could be literally any expired token from that user. If a malicious actor could secure old tokens some way, they might use them to retrieve a current refresh token. Now why would a malicious actor have old tokens but not the current one? I don't know. I don't know if that is possible or feasible. It just sounds like another attack vector to me that could be removed.

## Authorization Flow

The flow is the standard Authorization Code Flow with PKCE, it can be inspected [here]('https://auth0.com/blog/oauth-2-best-practices-for-native-apps/'). After receiving the final response with the two tokens, the client will hash this entire response, save the hash in its local storage and upload the hash alongside the refresh token to the Bulky server for storage.
