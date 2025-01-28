import cors from "cors";

const configureCors = () => {
  return cors({
    // origin -> which origin or users are allowed to access the apis
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://yourcustomdomain.com",
      ];

      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true); // giving permission so that the request can be allowed
      } else {
        callback(new Error("NOT ALLOWED BY CORS"));
      }
    },

    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept-Version"],
    exposedHeaders: ["X-Total-Count", "Content-Range"],
    credentials: true,
    preflightContinue: false,
    maxAge: 600, // cahce pre flight responses for 10 mins
    optionsSuccessStatus: 204,
  });
};

export default configureCors;
