const crypto = require("crypto");
const b64url = require("base64url");

/// This class handles creation and validation of authentication tokens.
module.exports = class Token {
    /// Function for creating token.
    static createToken(payload, secret) {
        // This will be the header of our token.
        const header = {
            alg:"HS256",
            typ:"JWT"
        }

        // Create base64 header.
        const b64header = Buffer.from(JSON.stringify(header)).toString("base64");

        // Create base64 payload.
        const b64payload = Buffer.from(JSON.stringify(payload)).toString("base64");
        
        // Create base64 secret.
        const b64secret = Buffer.from(secret).toString("base64");

        // Create token signature.
        const signature = crypto
            .createHmac("sha256", b64secret)
            .update(b64header + "." + b64payload, "utf-8")
            .digest("base64");

        // Return header.payload.signature.
        return b64header + "." + b64payload + "." + b64url.fromBase64(signature);
    }

    /// Function for validating tokens.
    static isValidToken(token, secret) {
        // Split to header, payload, signature.
        const parts = token.split(".");
        
        // Check if it splits into 3 parts, if false, then invalid.
        if (parts.length !== 3) {
            return false;
        }

        // Create base64 secret.
        const b64secret = Buffer.from(secret).toString("base64");

        // Create signature from returns header and payload using secret.
        const signature = crypto
            .createHmac("sha256", b64secret)
            .update(parts[0] + "." + parts[1], "utf-8")
            .digest("base64");
        
        // Compare created signature to returned signature.
        return (b64url.fromBase64(signature) === parts[2]);
    }

    /// Function for getting payload from token.
    static getPayload(token) {
        // Split to header, payload, signature.
        const parts = token.split(".");
        
        // Check if it splits into 3 parts, if false, then invalid.
        if (parts.length !== 3) {
            return false;
        }

        const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("ascii"));

        return payload;
    }
}
