import admin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from "../../task-management-service-e2d86-firebase-adminsdk-7t6fp-6b9db9edee.json";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

const firestore = admin.firestore();
export { admin, firestore };
