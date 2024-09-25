
import admin from 'firebase-admin';
import * as dotenv from 'dotenv';


dotenv.config();


const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Replace \n with actual newlines
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
