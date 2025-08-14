import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import type { Appliance } from './types';

const APPLIANCES_COLLECTION = 'appliances';

export const getAppliances = async (): Promise<Appliance[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, APPLIANCES_COLLECTION));
        const appliances = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appliance));
        return appliances;
    } catch (error) {
        console.error("Error fetching appliances: ", error);
        return [];
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
        return undefined;
    }
}

export const addAppliance = async (applianceData: Omit<Appliance, 'id' | 'stickerImageUrl'>, stickerFile?: { name: string, dataUrl: string }): Promise<Appliance> => {
    let stickerImageUrl: string | undefined = undefined;

    if (stickerFile) {
        const storageRef = ref(storage, `stickers/${new Date().toISOString()}-${stickerFile.name}`);
        await uploadString(storageRef, stickerFile.dataUrl, 'data_url');
        stickerImageUrl = await getDownloadURL(storageRef);
    }
    
    const docRef = await addDoc(collection(db, APPLIANCES_COLLECTION), {
        ...applianceData,
        stickerImageUrl: stickerImageUrl || '',
    });

    return { id: docRef.id, ...applianceData, stickerImageUrl };
}

export const deleteAppliance = async (id: string, stickerImageUrl?: string) => {
    try {
        if (stickerImageUrl) {
            const imageRef = ref(storage, stickerImageUrl);
            await deleteObject(imageRef).catch(error => {
                // If the file doesn't exist, we can ignore the error
                if (error.code !== 'storage/object-not-found') {
                    console.error("Error deleting image from storage: ", error);
                    // We might still want to delete the firestore doc, so we don't rethrow
                }
            });
        }
        await deleteDoc(doc(db, APPLIANCES_COLLECTION, id));
    } catch (error) {
        console.error("Error deleting appliance: ", error);
        throw error; // Re-throw to be handled by the caller
    }
};

export const MOCK_APPLIANCES: Appliance[] = [];
