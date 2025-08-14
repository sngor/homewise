import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, updateDoc, query, orderBy, limit } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import type { Appliance } from './types';

const APPLIANCES_COLLECTION = 'appliances';

export const getAppliances = async (): Promise<Appliance[]> => {
    try {
        const q = query(collection(db, APPLIANCES_COLLECTION), orderBy('purchaseDate', 'desc'));
        const querySnapshot = await getDocs(q);
        const appliances = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appliance));
        return appliances;
    } catch (error) {
        console.error("Error fetching appliances: ", error);
        throw error;
    }
}

export const getApplianceById = async (id: string): Promise<Appliance | undefined> => {
    try {
        const docRef = doc(db, APPLIANCES_COLLECTION, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Appliance;
        } else {
            console.log("No such document!");
            return undefined;
        }
    } catch (error) {
        console.error("Error fetching appliance by ID: ", error);
        throw error;
    }
}

export const addAppliance = async (applianceData: Omit<Appliance, 'id' | 'stickerImageUrl'>, stickerFile?: { name: string, dataUrl: string }): Promise<Appliance> => {
    let finalStickerImageUrl: string | undefined = undefined;

    // If a sticker file is provided, upload it to Firebase Storage
    if (stickerFile) {
        const storageRef = ref(storage, `stickers/${new Date().toISOString()}-${stickerFile.name}`);
        await uploadString(storageRef, stickerFile.dataUrl, 'data_url');
        finalStickerImageUrl = await getDownloadURL(storageRef);
    }
    
    const dataToSave = {
        ...applianceData,
        stickerImageUrl: finalStickerImageUrl || '', // Use the final URL or an empty string
    };

    // Add the new appliance document to Firestore
    const docRef = await addDoc(collection(db, APPLIANCES_COLLECTION), dataToSave);

    // Return the complete appliance object, including the new ID and correct image URL
    return { 
      id: docRef.id, 
      ...dataToSave 
    } as Appliance;
}

export const deleteAppliance = async (id: string, stickerImageUrl?: string) => {
    try {
        if (stickerImageUrl) {
            try {
                // Create a reference from the HTTPS URL
                const imageRef = ref(storage, stickerImageUrl);
                await deleteObject(imageRef);
            } catch (error: any) {
                // It's okay if the object doesn't exist (e.g., already deleted)
                if (error.code !== 'storage/object-not-found') {
                    console.error("Error deleting image from storage: ", error);
                    // Decide if you want to re-throw or just log the error
                }
            }
        }
        await deleteDoc(doc(db, APPLIANCES_COLLECTION, id));
    } catch (error) {
        console.error("Error deleting appliance: ", error);
        throw error;
    }
};

export const MOCK_APPLIANCES: Appliance[] = [];
