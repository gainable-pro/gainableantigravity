
const resendModule = require("resend");
console.log("Resend Module keys:", Object.keys(resendModule));
try {
    const { Resend } = require("resend");
    console.log("Destructured Resend:", Resend);
    new Resend("test");
    console.log("Resend instantiated successfully");
} catch (e) {
    console.error("Error instantiating:", e);
}
