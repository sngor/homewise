
import { collection, addDoc, getDocs, doc, getDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from './firebase';
import type { Appliance } from './types';

const getAppliancesCollection = () => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    return collection(db, 'users', user.uid, 'appliances');
}

export const getAppliances = async (): Promise<Appliance[]> => {
    const appliancesCol = getAppliancesCollection();
    const q = query(appliancesCol, orderBy('purchaseDate', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appliance));
}

export const getApplianceById = async (id: string): Promise<Appliance | null> => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const docRef = doc(db, 'users', user.uid, 'appliances', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Appliance : null;
}

export const addAppliance = async (applianceData: Omit<Appliance, 'id'>): Promise<Appliance> => {
    const appliancesCol = getAppliancesCollection();
    const docRef = await addDoc(appliancesCol, applianceData);
    return { id: docRef.id, ...applianceData };
}

export const deleteAppliance = async (id: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const docRef = doc(db, 'users', user.uid, 'appliances', id);
    await deleteDoc(docRef);
};
