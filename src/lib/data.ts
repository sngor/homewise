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

export const addAppliance = async (applianceData: Omit<Appliance, 'id'>, stickerFile?: { name: string, dataUrl: string }): Promise<Appliance> => {
    let stickerImageUrl: string | undefined = undefined;

    if (stickerFile) {
        const storageRef = ref(storage, `stickers/${new Date().toISOString()}-${stickerFile.name}`);
        await uploadString(storageRef, stickerFile.dataUrl, 'data_url');
        stickerImageUrl = await getDownloadURL(storageRef);
    }
    
    // We remove the temporary stickerImageUrl from the form before saving.
    const { stickerImageUrl: tempUrl, ...restOfApplianceData } = applianceData;
    
    const docRef = await addDoc(collection(db, APPLIANCES_COLLECTION), {
        ...restOfApplianceData,
        stickerImageUrl: stickerImageUrl || '',
    });

    return { id: docRef.id, ...applianceData, stickerImageUrl };
}

export const deleteAppliance = async (id: string, stickerImageUrl?: string) => {
    try {
        if (stickerImageUrl) {
            try {
                const imageRef = ref(storage, stickerImageUrl);
                await deleteObject(imageRef);
            } catch (error: any) {
                if (error.code !== 'storage/object-not-found') {
                    console.error("Error deleting image from storage: ", error);
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
